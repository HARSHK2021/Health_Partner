import User from "../models/User.js"
import { calculateBMI } from "../utils/bmiCalculator.js";
import MedicalRecord from "../models/MedicalRecord.js";


// Get User Profile
export const getUserProfile = async (req, res) => {
    console.log("user from ",req.user)
        res.status(200).json(req.user)
}

// Update Profile (Includes height & weight)
export const updateUserProfile = async (req, res) => {
    try {

        const userId = req.user._id;
        const { address, profileImage, height, weight, bloodGroup, dateOfBirth } = req.body;
        console.log("aagay ayaha")
        const user = req.user;

         // Create an empty object to store updates
    let updateFields = {};
    let updateOperations = {}; // For pushing historical data
    const currentDate = new Date();
    let BMI = null;

    // Add fields to update only if they are provided
    if (address) updateFields.address = address;
    if (profileImage) updateFields.profileImage = profileImage;
    if (bloodGroup) updateFields.bloodGroup = bloodGroup;
    if (dateOfBirth) updateFields.dateOfBirth = dateOfBirth;

    // If both height and weight are provided, calculate and store BMI
    if (weight && height) {
      BMI = calculateBMI(weight, height);
      console.log("BMI" , BMI)

      updateFields.height = height; // Update latest height
      updateFields.weight = weight; // Update latest weight

      updateOperations.$push = {
        ...updateOperations.$push,
        heightData: { date: currentDate, height },
        weightData: { date: currentDate, weight },
        bmiRecords: { date: currentDate, bmi: BMI },
      };
    }

    // Perform update with height, weight, and BMI history storage
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields, ...updateOperations },
      { new: true, runValidators: true }
    );
        

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


// ➤ **2️⃣ Retrieve All Medical History for a User**
export const getMedicalHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const records = await MedicalRecord.find({ user: userId }).populate("doctor hospital pharmacy");
        res.status(200).json(records);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving medical history", error: error.message });
    }
};




// Get Approved Doctors
export const getApprovedDoctors = async (req, res) => {
    try {
        const userId = req.user.id; // Patient's ID from authentication

        // Fetch user with populated doctor details
        const user = await User.findById(userId).populate("approvedDoctors", "name email phone");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ approvedDoctors: user.approvedDoctors });
    } catch (error) {
        res.status(500).json({ message: "Error fetching approved doctors", error: error.message });
    }
};



// Revoke Doctor Access
export const revokeDoctorAccess = async (req, res) => {
    try {
        const userId = req.user.id; // Patient's ID
        const { doctorId } = req.body; // Doctor ID to be removed

        // Find patient and update the approvedDoctors array
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $pull: { approvedDoctors: doctorId } }, // Remove doctor
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "Doctor access revoked successfully", approvedDoctors: updatedUser.approvedDoctors });
    } catch (error) {
        res.status(500).json({ message: "Error revoking doctor access", error: error.message });
    }
};





