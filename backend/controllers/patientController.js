// import User from "../models/User.js";
// import express from "express";
// import multer from "multer";
// import mongoose from "mongoose";
// import { calculateBMI } from "../utils/bmiCalculator.js";
// import MedicalRecord from "../models/MedicalRecord.js";
// import cloudinary, { config_cloudinary } from "../config/cloudinary.config.js";

// // Initialize Cloudinary configuration
// config_cloudinary();

// // Multer storage configuration
// const storage = multer.memoryStorage();
// const upload = multer({ storage });

// // Upload Medical Record
// export const uploadMedicalRecord = async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//      if(!req.user || !req.user._id){
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(401).json({ message: "User not authenticated" });
//      }
//      const userId = req.user._id;
//     const {
//       condition,
//       recoveryStatus,
//       dateDiagnosed,
//       symptoms,
//       doctor,
//       hospital,
//       medicines,
//       additionalNotes
//     } = req.body;

//     // Initialize arrays for files
//     let prescriptionImages = [];
//     let medicalReports = [];

//     // Parse symptoms and medicines (they come as JSON strings from the frontend)
//     let parsedSymptoms = [];
//     let parsedMedicines = [];

//     try {
//       parsedSymptoms = typeof symptoms === 'string' ? JSON.parse(symptoms) : symptoms;
//       parsedMedicines = typeof medicines === 'string' ? JSON.parse(medicines) : medicines;
//     } catch (jsonError) {
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(400).json({
//         message: "Invalid format for symptoms or medicines",
//         error: jsonError.message
//       });
//     }

//     // Helper function to upload files to Cloudinary
//     const uploadToCloudinary = async (files) => {
//       if (!files || files.length === 0) return [];

//       const uploadPromises = files.map((file) =>
//         new Promise((resolve, reject) => {
//           const stream = cloudinary.uploader.upload_stream(
//             { resource_type: file.mimetype.startsWith('image') ? 'image' : 'raw' },
//             (error, result) => {
//               if (error) reject(error);
//               else resolve(result.secure_url);
//             }
//           );
//           stream.end(file.buffer);
//         })
//       );

//       return await Promise.all(uploadPromises);
//     };

//     // Handle file uploads if files are present
//     if (req.files) {
//       // Separate prescription images from medical reports
//       const prescriptionFiles = req.files.filter(file =>
//         file.fieldname === 'prescriptionImages'
//       );
//       const medicalReportFiles = req.files.filter(file =>
//         file.fieldname === 'medicalReports'
//       );

//       // Upload files in parallel
//       [prescriptionImages, medicalReports] = await Promise.all([
//         uploadToCloudinary(prescriptionFiles),
//         uploadToCloudinary(medicalReportFiles)
//       ]);
//     }

//     // Create and save new medical record
//     const newRecord = new MedicalRecord({
//       user: userId,
//       condition,
//       recoveryStatus:recoveryStatus || 'ongoing',
//       dateDiagnosed: dateDiagnosed || new Date(),
//       symptoms: parsedSymptoms,
//       doctor: doctor || undefined, // Store as undefined if empty
//       hospital: hospital || undefined,
//       medicines: parsedMedicines,
//       additionalNotes: additionalNotes || undefined,
//       prescriptionImages: prescriptionImages.length > 0 ? prescriptionImages : undefined,
//       medicalReports: medicalReports.length > 0 ? medicalReports : undefined,
//       createdAt: new Date(),
//     });
//     const savedRecord = await newRecord.save({ session });
//     await User.findByIdAndUpdate(
//       userId,
//       { $push: { medicalHistory: savedRecord._id } },
//       { new: true, session }
//     );
//     await session.commitTransaction();
//     session.endSession();
//     res.status(200).json({
//       success: true,
//       message: "Medical record created successfully",
//       record: savedRecord
//     });
//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();
//     console.error("Error creating medical record:", error);
//     res.status(500).json({
//       message: "Error creating medical record",
//       error: error.message
//     });
//   }
// };

// // Retrieve All Medical Records
// export const getAllMedicalRecords = async (req, res) => {
//   try {
//     const records = await MedicalRecord.find();
//     res.status(200).json(records);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching medical records", error: error.message });
//   }
// };

// // Retrieve a Medical Record by ID
// export const getMedicalRecordById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     // Validate MongoDB ObjectId
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ message: "Invalid medical record ID" });
//     }

//     const record = await MedicalRecord.findById(id);
//     if (!record) return res.status(404).json({ message: "Record not found" });
//     res.status(200).json(record);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching medical record", error: error.message });
//   }
// };

// // Update Medical Record
// export const updateMedicalRecord = async (req, res) => {
//   try {
//     const { id } = req.params;

//     // Validate MongoDB ObjectId
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ message: "Invalid medical record ID" });
//     }

//     const updatedRecord = await MedicalRecord.findByIdAndUpdate(id, req.body, { new: true });
//     if (!updatedRecord) return res.status(404).json({ message: "Record not found" });
//     res.status(200).json(updatedRecord);
//   } catch (error) {
//     res.status(500).json({ message: "Error updating medical record", error: error.message });
//   }
// };

// // Delete Medical Record
// export const deleteMedicalRecord = async (req, res) => {
//   try {
//     const { id } = req.params;

//     // Validate MongoDB ObjectId
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ message: "Invalid medical record ID" });
//     }

//     const deletedRecord = await MedicalRecord.findByIdAndDelete(id);
//     if (!deletedRecord) return res.status(404).json({ message: "Record not found" });
//     res.status(200).json({ message: "Record deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Error deleting medical record", error: error.message });
//   }
// };

// // Get User Profile
// export const getUserProfile = async (req, res) => {
//     console.log("user from ",req.user)
//         res.status(200).json(req.user)
// }

// // Update Profile (Includes height & weight)
// export const updateUserProfile = async (req, res) => {
//     try {

//         const userId = req.user._id;
//         const { address, profileImage, height, weight, bloodGroup, dateOfBirth } = req.body;
//         console.log("aagay ayaha")
//         const user = req.user;

//          // Create an empty object to store updates
//     let updateFields = {};
//     let updateOperations = {}; // For pushing historical data
//     const currentDate = new Date();
//     let BMI = null;

//     // Add fields to update only if they are provided
//     if (address) updateFields.address = address;
//     if (profileImage) updateFields.profileImage = profileImage;
//     if (bloodGroup) updateFields.bloodGroup = bloodGroup;
//     if (dateOfBirth) updateFields.dateOfBirth = dateOfBirth;

//     // If both height and weight are provided, calculate and store BMI
//     if (weight && height) {
//       BMI = calculateBMI(weight, height);
//       console.log("BMI" , BMI)

//       updateFields.height = height; // Update latest height
//       updateFields.weight = weight; // Update latest weight

//       updateOperations.$push = {
//         ...updateOperations.$push,
//         heightData: { date: currentDate, height },
//         weightData: { date: currentDate, weight },
//         bmiRecords: { date: currentDate, bmi: BMI },
//       };
//     }

//     // Perform update with height, weight, and BMI history storage
//     const updatedUser = await User.findByIdAndUpdate(
//       userId,
//       { $set: updateFields, ...updateOperations },
//       { new: true, runValidators: true }
//     );

//         if (!updatedUser) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         return res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
//     } catch (error) {
//         res.status(500).json({ message: "Server error", error: error.message });
//     }
// };

// // ➤ **2️⃣ Retrieve All Medical History for a User**
// export const getMedicalHistory = async (req, res) => {
//     try {
//         const userId = req.user.id;
//         const records = await MedicalRecord.find({ user: userId }).populate("doctor hospital pharmacy");
//         res.status(200).json(records);
//     } catch (error) {
//         res.status(500).json({ message: "Error retrieving medical history", error: error.message });
//     }
// };

// // Get Approved Doctors
// export const getApprovedDoctors = async (req, res) => {
//     try {
//         const userId = req.user.id; // Patient's ID from authentication

//         // Fetch user with populated doctor details
//         const user = await User.findById(userId).populate("approvedDoctors", "name email phone");

//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         res.status(200).json({ approvedDoctors: user.approvedDoctors });
//     } catch (error) {
//         res.status(500).json({ message: "Error fetching approved doctors", error: error.message });
//     }
// };

// // Revoke Doctor Access
// export const revokeDoctorAccess = async (req, res) => {
//     try {
//         const userId = req.user.id; // Patient's ID
//         const { doctorId } = req.body; // Doctor ID to be removed

//         // Find patient and update the approvedDoctors array
//         const updatedUser = await User.findByIdAndUpdate(
//             userId,
//             { $pull: { approvedDoctors: doctorId } }, // Remove doctor
//             { new: true }
//         );

//         if (!updatedUser) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         res.status(200).json({ message: "Doctor access revoked successfully", approvedDoctors: updatedUser.approvedDoctors });
//     } catch (error) {
//         res.status(500).json({ message: "Error revoking doctor access", error: error.message });
//     }
// };

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

// export const uploadMedicalRecord = async (req, res) => {
//   try {
//     const { condition, recoveryStatus, dateDiagnosed, symptoms, medicines, additionalNotes } = req.body;
//     let prescriptionImages = [];
//     let medicalReports = [];

//     // Validate recoveryStatus based on form values (lowercase)
//     const validRecoveryStatuses = ["ongoing", "recovered", "critical"];
//     if (!validRecoveryStatuses.includes(recoveryStatus)) {
//       return res.status(400).json({
//         message: `Invalid recoveryStatus value. Allowed values are: ${validRecoveryStatuses.join(", ")}`
//       });
//     }

//     let parsedSymptoms = [];
//     let parsedMedicines = [];
//     try {
//       parsedSymptoms = Array.isArray(symptoms) ? symptoms : JSON.parse(symptoms);
//       parsedMedicines = Array.isArray(medicines) ? medicines : JSON.parse(medicines);
//     } catch (jsonError) {
//       return res.status(400).json({
//         message: "Invalid JSON format for symptoms or medicines",
//         error: jsonError.message
//       });
//     }

//     // Upload prescription images if provided
//     if (req.files && req.files.prescriptionImages) {
//       const uploadPrescriptions = req.files.prescriptionImages.map(file =>
//         new Promise((resolve, reject) => {
//           const stream = cloudinary.uploader.upload_stream(
//             { resource_type: "image" },
//             (error, result) => {
//               if (error) reject(error);
//               else resolve(result.secure_url);
//             }
//           );
//           stream.end(file.buffer);
//         })
//       );
//       prescriptionImages = await Promise.all(uploadPrescriptions);
//     }

//     // Upload medical reports if provided
//     if (req.files && req.files.medicalReports) {
//       const uploadReports = req.files.medicalReports.map(file =>
//         new Promise((resolve, reject) => {
//           // Use "raw" for non-image files (e.g., PDFs), otherwise image
//           const options = file.mimetype === 'application/pdf' ? { resource_type: "raw" } : { resource_type: "image" };
//           const stream = cloudinary.uploader.upload_stream(
//             options,
//             (error, result) => {
//               if (error) reject(error);
//               else resolve(result.secure_url);
//             }
//           );
//           stream.end(file.buffer);
//         })
//       );
//       medicalReports = await Promise.all(uploadReports);
//     }

//     // Create and save new medical record without doctor and hospital
//     const newRecord = new MedicalRecord({
//       user: req.user._id,
//       condition,
//       recoveryStatus,
//       dateDiagnosed,
//       symptoms: parsedSymptoms,
//       medicines: parsedMedicines,
//       additionalNotes,
//       prescriptionImages,
//       medicalReports,
//       createdAt: new Date(),
//     });

//     await newRecord.save();
//     res.status(201).json(newRecord);
//   } catch (error) {
//     res.status(500).json({ message: "Error creating medical record", error: error.message });
//   }
// };
export const uploadMedicalRecord = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    if (!req.user || !req.user._id) {
      await session.abortTransaction();
      session.endSession();
      return res.status(401).json({ message: "User not authenticated" });
    }
    const userId = req.user._id;
    const {
      condition,
      recoveryStatus,
      dateDiagnosed,
      symptoms,
      medicines,
      additionalNotes,
    } = req.body;
    let prescriptionImages = [];
    let medicalReports = [];

    // Validate recoveryStatus based on form values (lowercase)
    const validRecoveryStatuses = ["ongoing", "recovered", "critical"];
    if (!validRecoveryStatuses.includes(recoveryStatus)) {
      return res.status(400).json({
        message: `Invalid recoveryStatus value. Allowed values are: ${validRecoveryStatuses.join(
          ", "
        )}`,
      });
    }

    let parsedSymptoms = [];
    let parsedMedicines = [];
    try {
      parsedSymptoms = Array.isArray(symptoms)
        ? symptoms
        : JSON.parse(symptoms);
      parsedMedicines = Array.isArray(medicines)
        ? medicines
        : JSON.parse(medicines);
    } catch (jsonError) {
      return res.status(400).json({
        message: "Invalid JSON format for symptoms or medicines",
        error: jsonError.message,
      });
    }

    // Helper function to upload files to Cloudinary
    const uploadToCloudinary = (file, options) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          options,
          (error, result) => {
            if (error) {
              console.error("Cloudinary Upload Error:", error);
              reject(error);
            } else {
              resolve(result.secure_url);
            }
          }
        );
        stream.end(file.buffer);
      });
    };

    // Upload prescription images if provided
    if (req.files && req.files.prescriptionImages) {
      const uploadPrescriptions = req.files.prescriptionImages.map((file) =>
        uploadToCloudinary(file, { resource_type: "image" })
      );
      prescriptionImages = await Promise.all(uploadPrescriptions);
    }

    // Upload medical reports if provided
    if (req.files && req.files.medicalReports) {
      const uploadReports = req.files.medicalReports.map((file) =>
        uploadToCloudinary(file, {
          resource_type: file.mimetype === "application/pdf" ? "raw" : "image",
        })
      );
      medicalReports = await Promise.all(uploadReports);
    }

    // Create and save new medical record without doctor and hospital
    const newRecord = new MedicalRecord({
      user: req.user._id,
      condition,
      recoveryStatus,
      dateDiagnosed,
      symptoms: parsedSymptoms,
      medicines: parsedMedicines,
      additionalNotes,
      prescriptionImages,
      medicalReports,
      createdAt: new Date(),
    });

    await newRecord.save();
    res.status(201).json(newRecord);
  } catch (error) {
    console.error("Error creating medical record:", error);
    res
      .status(500)
      .json({ message: "Error creating medical record", error: error.message });
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
