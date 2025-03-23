import User from "../models/User.js"
import { calculateBMI } from "../utils/bmiCalculator.js";
import MedicalRecord from "../models/MedicalRecord.js";
// import upload from "../config/multer.js";
// import cloudinary from "../config/cloudinary.js"

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
////////////////////////////////////////////////////////////////////////////////////
/// medical record controllers 

// Upload Middleware
// export const uploadFiles = upload.fields([
//     { name: "prescriptionImages", maxCount: 5 },
//     { name: "medicalReports", maxCount: 5 },
// ]);

// Upload Image to Cloudinary
// const uploadToCloudinary = async (file) => {
//     try {
//         const result = await cloudinary.uploader.upload(file.path, { folder: "medical_reports" });
//         return result.secure_url; // Return uploaded file URL
//     } catch (error) {
//         console.error("Cloudinary Upload Error:", error.message);
//         return null; // Return null instead of throwing an error
//     }
// };

// ➤ **1️⃣ Add Medical History Entry**
export const addMedicalHistory = async (req, res) => {
    try {
        const { condition, symptoms, medicines, doctor, hospital, pharmacy, additionalNotes } = req.body;
        const userId = req.user.id; // Assuming user ID is available from authentication middleware

        // Upload Images to Cloudinary
        const prescriptionImageUrls = [];
        if (req.files["prescriptionImages"]) {
            for (const file of req.files["prescriptionImages"]) {
                const url = await uploadToCloudinary(file);
                if (url) prescriptionImageUrls.push(url); // Only add if upload was successful
            }
        }

        const medicalReportUrls = [];
        if (req.files["medicalReports"]) {
            for (const file of req.files["medicalReports"]) {
                const url = await uploadToCloudinary(file);
                if (url) medicalReportUrls.push(url); // Only add if upload was successful
            }
        }

        // Convert medicines safely (avoid parsing errors)
        let parsedMedicines = [];
        try {
            parsedMedicines = typeof medicines === "string" ? JSON.parse(medicines) : medicines;
        } catch (err) {
            return res.status(400).json({ message: "Invalid medicines format" });
        }

        // Create new medical record
        const newRecord = new MedicalRecord({
            user: userId,
            condition,
            symptoms,
            medicines: parsedMedicines,
            doctor,
            hospital,
            pharmacy,
            prescriptionImages: prescriptionImageUrls,
            medicalReports: medicalReportUrls,
            additionalNotes,
        });

        await newRecord.save();
        res.status(201).json({ message: "Medical history added successfully", record: newRecord });
    } catch (error) {
        res.status(500).json({ message: "Error adding medical history", error: error.message });
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

// ➤ **3️⃣ Delete Medical History Entry**
export const deleteMedicalRecord = async (req, res) => {
    try {
        const { recordId } = req.params;
        const userId = req.user.id;

        const record = await MedicalRecord.findOne({ _id: recordId, user: userId });
        if (!record) {
            return res.status(404).json({ message: "Medical record not found" });
        }

        // Delete Images from Cloudinary
        for (const url of record.prescriptionImages) {
            try {
                const publicId = new URL(url).pathname.split("/").slice(-2).join("/").split(".")[0]; // More robust extraction
                await cloudinary.uploader.destroy(publicId);
            } catch (err) {
                console.error("Error deleting image:", err.message);
            }
        }
        for (const url of record.medicalReports) {
            try {
                const publicId = new URL(url).pathname.split("/").slice(-2).join("/").split(".")[0]; // More robust extraction
                await cloudinary.uploader.destroy(publicId);
            } catch (err) {
                console.error("Error deleting image:", err.message);
            }
        }

        await MedicalRecord.deleteOne({ _id: recordId });
        res.status(200).json({ message: "Medical record deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting medical record", error: error.message });
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
``