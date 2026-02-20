import express from "express";
import mongoose from "mongoose";
import User from "../models/User.js";
import DoctorProfile from "../models/DoctorProfile.js";
import { calculateBMI } from "../utils/bmiCalculator.js";

// Get User Profile
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId)
      .populate({
        path: "doctorProfile",
        model: DoctorProfile,
      })
      .select("-password");

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
};

// Update profile for doctor
export const updateDoctorProfile = async (req, res) => {
  // console.log("aagaya yah")
  try {
    const userId = req.user._id;
    const {
      specialization,
      experience,
      hospital,
      address,
      profileImage,
      height,
      weight,
      bloodGroup,
      dateOfBirth,
    } = req.body;

    // First, update the user document
    let updateFields = {};
    let updateOperations = {};
    const currentDate = new Date();
    let BMI = null;

    if (address) updateFields.address = address;
    if (profileImage) updateFields.profileImage = profileImage;
    if (bloodGroup) updateFields.bloodGroup = bloodGroup;
    if (dateOfBirth) updateFields.dateOfBirth = dateOfBirth;

    // If both height and weight are provided, calculate and store BMI
    if (weight && height) {
      const BMI = calculateBMI(weight, height);
      // console.log("BMI:", BMI);

      updateFields.height = height;
      updateFields.weight = weight;
      updateFields.bodyMassIndex = BMI;

      updateOperations.$push = {
        heightData: { date: currentDate, height: height },
        weightData: { date: currentDate, weight: weight },
        bmiRecords: { date: currentDate, bmi: BMI },
      };
    }

    // Update user fields
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields, ...updateOperations },
      { new: true, runValidators: true }
    ).populate("doctorProfile");
   
    

    if (!updatedUser) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    // Check if user is a doctor
    if (updatedUser.role !== "doctor") {
      return res.status(403).json({ 
        success: false,
        message: "User is not a doctor" 
      });
    }

    // Handle doctor-specific fields
    if (specialization || experience || hospital) {
      let doctorProfile;

      if (updatedUser.doctorProfile) {
        // Update existing doctor profile
        doctorProfile = await DoctorProfile.findByIdAndUpdate(
          updatedUser.doctorProfile._id,
          {
            specialization,
            experience,
            hospital,
          },
          { new: true }
        );
      } else {
        // Create new doctor profile
        doctorProfile = new DoctorProfile({
          user: userId,
          specialization,
          experience,
          hospital,
        });
        await doctorProfile.save();
        updatedUser.doctorProfile = doctorProfile._id;
        await updatedUser.save();
      }
    }

    // Return the updated user with populated doctor profile
    const result = await User.findById(userId)
      .populate("doctorProfile")
      .select("-password");

    res.status(200).json({ 
      success: true,
      message: "Doctor profile updated successfully", 
      user: result 
    });
  } catch (error) {
    console.error("Error updating doctor profile:", error);
    res.status(500).json({ 
      success: false,
      message: "Internal server error",
      error: error.message 
    });
  }
};


/// search patient by phonenumber or name ;

export const searchPatient= async (req,res)=>{
  try {
    const {phone} = req.body;
    const doctorId = req.user._id;

    if (!phone) {
      return res.status(400).json({ message: "Please provide a phone number to search" });
  }
  const patients = await User.find({
    phone: { $regex: new RegExp(`^${phone}`, "i") }, // Matches from the start
    // approvedDoctors: doctorId // Ensure doctor has access
}).select("name phone age gender"); // Select necessary fields
res.status(200).json({ patients });
    
    
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

// Fetch all doctors
export const getAllDoctors = async (req, res) => {
  try {
    const { specialization, search, page = 1, limit = 10 } = req.query;

    let query = { role: "doctor" };

    // Search by doctor name or email
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Fetch doctors directly from User collection where role === "doctor"
    const doctors = await User.find(query)
      .select("firstName lastName email phone profileImage address role")
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    console.log("Doctors found:", doctors.length);

    // Get total count for pagination
    const total = await User.countDocuments(query);

    if (doctors.length === 0) {
      return res.status(200).json({
        message: "No doctors found",
        doctors: [],
        total: 0,
        page: parseInt(page),
        pages: 0,
      });
    }

    res.status(200).json({
      message: "Doctors fetched successfully",
      doctors: doctors,
      total: total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({
      message: "Error fetching doctors",
      error: error.message,
    });
  }
};

// Fetch all doctors (simple version - without role check)
export const getAllDoctorsSimple = async (req, res) => {
  try {
    const { specialization, search, page = 1, limit = 10 } = req.query;

    let query = {};

    // Filter by specialization if provided
    if (specialization) {
      query.specialization = specialization;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Fetch all DoctorProfiles with pagination (no role check)
    const doctors = await DoctorProfile.find(query)
      .populate("user", "firstName lastName email phone profileImage address role")
      .populate("hospital", "name address city")
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    console.log("All DoctorProfiles found:", doctors.length);

    // Get total count for pagination
    const total = await DoctorProfile.countDocuments(query);

    if (doctors.length === 0) {
      return res.status(200).json({
        message: "No doctor profiles found",
        doctors: [],
        total: 0,
        page: parseInt(page),
        pages: 0,
      });
    }

    res.status(200).json({
      message: "Doctors fetched successfully",
      doctors: doctors,
      total: total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({
      message: "Error fetching doctors",
      error: error.message,
    });
  }
};

// Debug endpoint - check DoctorProfile user field
export const debugDoctorProfiles = async (req, res) => {
  try {
    const allProfiles = await DoctorProfile.find().select("user specialization");
    
    console.log("All DoctorProfiles:");
    allProfiles.forEach((profile) => {
      console.log(`ID: ${profile._id}, User: ${profile.user}, Specialization: ${profile.specialization}`);
    });

    res.status(200).json({
      message: "Debug info",
      totalProfiles: allProfiles.length,
      profiles: allProfiles,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Error",
      error: error.message,
    });
  }
}