import User from "../models/User.js";
import mongoose from "mongoose";
import { calculateBMI } from "../utils/bmiCalculator.js";
import MedicalRecord from "../models/MedicalRecord.js";
import cloudinary from "../config/cloudinary.config.js";

export const uploadMedicalRecord = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    console.log("Starting uploadMedicalRecord function...");
    console.log("Request files:", req.files);
    console.log("Request body:", req.body);

    if (!req.user || !req.user._id) {
      await session.abortTransaction();
      session.endSession();
      return res.status(401).json({ message: "User not authenticated" });
    }

    const userId = req.user._id;
    const { condition, recoveryStatus, dateDiagnosed, additionalNotes } = req.body;
    
    // Handle symptoms and medicines with safer parsing
    let symptomsInput = req.body.symptoms || "[]";
    let medicinesInput = req.body.medicines || "[]";
    
    let prescriptionImages = [];
    let medicalReports = [];
    
    // Validate recoveryStatus
    const validRecoveryStatuses = ["ongoing", "recovered", "critical"];
    if (!validRecoveryStatuses.includes(recoveryStatus)) {
      return res.status(400).json({
        message: `Invalid recoveryStatus value. Allowed values: ${validRecoveryStatuses.join(", ")}`
      });
    }

    // Parse symptoms - ensure it's an array of strings
    let parsedSymptoms;
    try {
      // If symptoms is already an array, use it; otherwise parse it
      parsedSymptoms = Array.isArray(symptomsInput) 
        ? symptomsInput 
        : JSON.parse(symptomsInput);
      
      // Make sure all symptoms are strings
      parsedSymptoms = parsedSymptoms.map(s => String(s));
    } catch (error) {
      console.error("Error parsing symptoms:", error);
      return res.status(400).json({ 
        message: "Invalid format for symptoms. Expected an array of strings.",
        error: error.message
      });
    }

    // Parse medicines - ensure it's an array of objects
    let parsedMedicines;
    try {
      if (Array.isArray(medicinesInput)) {
        parsedMedicines = medicinesInput;
      } else {
        // Parse the JSON string
        const parsed = JSON.parse(medicinesInput);
        
        // If the result is an object, wrap it in an array
        parsedMedicines = Array.isArray(parsed) ? parsed : [parsed];
      }
      
      // Ensure each medicine has the required fields
      parsedMedicines = parsedMedicines.map(med => {
        if (typeof med === 'string') {
          med = JSON.parse(med);
        }
        
        if (!med.name || !med.dosage || !med.frequency || !med.duration) {
          throw new Error("Each medicine must have name, dosage, frequency, and duration");
        }
        
        return {
          name: med.name,
          dosage: med.dosage,
          frequency: med.frequency,
          duration: med.duration,
          takenAt: med.takenAt || []
        };
      });
    } catch (error) {
      console.error("Error parsing medicines:", error);
      return res.status(400).json({ 
        message: "Invalid format for medicines. Each medicine must have name, dosage, frequency, and duration.",
        error: error.message
      });
    }
    // Fixed Cloudinary upload function
    const uploadToCloudinary = (file, resourceType) => {
      return new Promise((resolve, reject) => {
        console.log(`Uploading ${file.originalname} (${file.size} bytes) to Cloudinary...`);
        // Create upload stream
        const uploadStream = cloudinary.uploader.upload_stream(
          { 
            resource_type: resourceType || "auto", 
            folder: "medical_records",
            public_id: `${Date.now()}_${file.originalname.replace(/\s+/g, '_')}`,
            overwrite: true
          },
          (error, result) => {
            if (error) {
              console.error("Cloudinary Upload Error:", error);
              reject(error);
            } else {
              console.log("File uploaded successfully:", result.secure_url);
              resolve(result.secure_url);
            }
          }
        ); 
        // Check if file has buffer before sending
        if (file && file.buffer) {
          uploadStream.end(file.buffer);
        } else {
          reject(new Error("Invalid file or missing buffer"));
        }
      });
    };

    // Upload prescription images (if provided)
    if (req.files?.prescriptionImages) {
      const images = Array.isArray(req.files.prescriptionImages) 
        ? req.files.prescriptionImages 
        : [req.files.prescriptionImages];
        
      if (images.length > 0) {
        console.log(`Uploading ${images.length} prescription images...`);
        
        const uploadPromises = images.map(file => 
          uploadToCloudinary(file, "image")
        );
        
        prescriptionImages = await Promise.all(uploadPromises);
        console.log("All prescription images uploaded:", prescriptionImages);
      }
    }

    // Upload medical reports (if provided)
    if (req.files?.medicalReports) {
      const reports = Array.isArray(req.files.medicalReports) 
        ? req.files.medicalReports 
        : [req.files.medicalReports];
      if (reports.length > 0) {
        console.log(`Uploading ${reports.length} medical reports...`);
        const uploadPromises = reports.map(file => 
          uploadToCloudinary(file, file.mimetype.includes("pdf") ? "raw" : "image")
        );
        medicalReports = await Promise.all(uploadPromises);
        console.log("All medical reports uploaded:", medicalReports);
      }
    }
    const newRecord = new MedicalRecord({
      user: userId,
      condition,
      recoveryStatus,
      dateDiagnosed,
      symptoms: parsedSymptoms,
      medicines: parsedMedicines,
      additionalNotes,
      prescriptionImages,
      medicalReports,
      createdAt: new Date()
    });

    await newRecord.save({ session });
    console.log("Medical record saved successfully:", newRecord._id);
    await session.commitTransaction();
    session.endSession();

    res.status(201).json(newRecord);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error creating medical record:", error);
    res.status(500).json({ message: "Error creating medical record", error: error.message });
  }
};
// Retrieve All Medical Records
export const getAllMedicalRecords = async (req, res) => {
  try {
    const records = await MedicalRecord.find();
    res.status(200).json(records);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error fetching medical records",
        error: error.message,
      });
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
    res
      .status(500)
      .json({ message: "Error fetching medical record", error: error.message });
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

    const updatedRecord = await MedicalRecord.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedRecord)
      return res.status(404).json({ message: "Record not found" });
    res.status(200).json(updatedRecord);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating medical record", error: error.message });
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
    if (!deletedRecord)
      return res.status(404).json({ message: "Record not found" });
    res.status(200).json({ message: "Record deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting medical record", error: error.message });
  }
};

// Get User Profile
export const getUserProfile = async (req, res) => {
  console.log("user from ", req.user);
  res.status(200).json(req.user);
};

// Update Profile (Includes height & weight)
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { address, profileImage, height, weight, bloodGroup, dateOfBirth } =
      req.body;
    console.log("aagay ayaha");
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
      console.log("BMI", BMI);

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

    return res
      .status(200)
      .json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ➤ **2️⃣ Retrieve All Medical History for a User**
export const getMedicalHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const records = await MedicalRecord.find({ user: userId }).populate(
      "doctor hospital pharmacy"
    );
    res.status(200).json(records);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error retrieving medical history",
        error: error.message,
      });
  }
};

// Get Approved Doctors
export const getApprovedDoctors = async (req, res) => {
  try {
    const userId = req.user.id; // Patient's ID from authentication

    // Fetch user with populated doctor details
    const user = await User.findById(userId).populate(
      "approvedDoctors",
      "name email phone"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ approvedDoctors: user.approvedDoctors });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error fetching approved doctors",
        error: error.message,
      });
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

    res
      .status(200)
      .json({
        message: "Doctor access revoked successfully",
        approvedDoctors: updatedUser.approvedDoctors,
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error revoking doctor access", error: error.message });
  }
};
