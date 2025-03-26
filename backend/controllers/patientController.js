import User from "../models/User.js";
import express from "express";
import multer from "multer";
import mongoose from "mongoose";
import { calculateBMI } from "../utils/bmiCalculator.js";
import MedicalRecord from "../models/MedicalRecord.js";
import cloudinary, { config_cloudinary } from "../config/cloudinary.config.js";

// Initialize Cloudinary configuration
config_cloudinary();

// Multer storage configuration
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload Medical Record
export const uploadMedicalRecord = async (req, res) => {
  try {
    const { condition, recoveryStatus, dateDiagnosed, symptoms, doctor, hospital, medicines, additionalNotes } = req.body;
    let prescriptionImages = [];

    let parsedSymptoms = [];
    let parsedMedicines = [];
    try {
      parsedSymptoms = JSON.parse(symptoms);
      parsedMedicines = JSON.parse(medicines);
    } catch (jsonError) {
      return res.status(400).json({ message: "Invalid JSON format for symptoms or medicines", error: jsonError.message });
    }

    // Upload files to Cloudinary if provided
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { resource_type: "image" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result.secure_url);
            }
          );
          stream.end(file.buffer);
        })
      );
      prescriptionImages = await Promise.all(uploadPromises);
    }

    // Create and save new medical record
    const newRecord = new MedicalRecord({
      condition,
      recoveryStatus,
      dateDiagnosed,
      symptoms: parsedSymptoms,
      doctor,
      hospital,
      medicines: parsedMedicines,
      additionalNotes,
      prescriptionImages,
      createdAt: new Date(),
    });

    await newRecord.save();
    res.status(201).json(newRecord);
  } catch (error) {
    res.status(500).json({ message: "Error creating medical record", error: error.message });
  }
};

// Retrieve All Medical Records
export const getAllMedicalRecords = async (req, res) => {
  try {
    const records = await MedicalRecord.find();
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: "Error fetching medical records", error: error.message });
  }
};

// Retrieve a Medical Record by ID
export const getMedicalRecordById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid medical record ID" });
    }
    
    const record = await MedicalRecord.findById(id);
    if (!record) return res.status(404).json({ message: "Record not found" });
    res.status(200).json(record);
  } catch (error) {
    res.status(500).json({ message: "Error fetching medical record", error: error.message });
  }
};

// Update Medical Record
export const updateMedicalRecord = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid medical record ID" });
    }

    const updatedRecord = await MedicalRecord.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedRecord) return res.status(404).json({ message: "Record not found" });
    res.status(200).json(updatedRecord);
  } catch (error) {
    res.status(500).json({ message: "Error updating medical record", error: error.message });
  }
};

// Delete Medical Record
export const deleteMedicalRecord = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid medical record ID" });
    }
    
    const deletedRecord = await MedicalRecord.findByIdAndDelete(id);
    if (!deletedRecord) return res.status(404).json({ message: "Record not found" });
    res.status(200).json({ message: "Record deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting medical record", error: error.message });
  }
};



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





