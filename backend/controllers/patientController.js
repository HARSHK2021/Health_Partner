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
        const userId = req.user.id;
        const user = req.user;
        const {address, profileImage, height, weight, bloodGroup, dateOfBirth } = req.body;
          // Calculate BMI if height and weight are provided
          let BMI = user.bmi;
          if (weight && height) {
              BMI = calculateBMI(weight, height);
          }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { 
                address: address ?? user.address,
                profileImage: profileImage ?? user.profileImage,
                height: height ?? user.height,
                weight: weight ?? user.weight,
                bloodGroup: bloodGroup ?? user.bloodGroup,
                dateOfBirth: dateOfBirth ?? user.dateOfBirth,
                bmi: BMI,
            },
            { new: true }
        ).select("-password -emailOTP -phoneOTP -resetPasswordToken");

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
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





