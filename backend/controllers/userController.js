import User from "../models/User.js"

import { calculateBMI } from "../utlis/bmiCalculator.js";

/// get profile information

export const getUserProfile = async (req, res) => {
  
  try {
    const {userId} = req.params;
    const user = await User.findById(userId).select("-password")// exclude password
    if (!user) return res.status(404).json({ message: "User not found" })
    res.json(user)
  } catch (error) {
    console.error(error.message)
    res.status(500).json({ message: "Server error" })
  }
}

/// update profile fr normal person

import User from "../models/User.js";
import { calculateBMI } from "../utils/bmiUtils.js"; // Import BMI function

export const updateUserProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        const { address, profileImage, height, weight, bloodGroup, dateOfBirth } = req.body;

        // Fetch user first to keep existing values if any field is missing
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Calculate BMI if height and weight are provided
        let BMI = user.bmi;
        if (weight && height) {
            BMI = calculateBMI(weight, height);
        }

        // Update user profile
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
                updatedAt: new Date(),
            },
            { new: true} //  returns updated data
        );

        res.status(200).json({
            message: "Profile updated successfully",
            user: updatedUser
        });
    } catch (error) {
        console.error("Error updating profile:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};

/// update proflle for doctor
export const updateDoctorProfile = async(req, res) => {
  try {
    const {userId} = req.param;
    const { address, profileImage, height, weight, bloodGroup,
       specialization, experience, education, dateOfBirth,hospital} = req.body;

       // Fetch user first to keep existing values if any field is missing
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    //// ensure that the user is actually a doctor
    if(user.role!== 'doctor') return res.status(403).json({ message: "Unauthorized Access" });

    // Calculate BMI if height and weight are provided
    let BMI = user.bmi;
    if (weight && height) {
      BMI = calculateBMI(weight, height);
    }
    // Update user profile 
    user.address = address ?? user.address ;
    user.profileImage = profileImage?? user.profileImage;
    user.height = height?? user.height;
    user.weight = weight?? user.weight;
    user.bloodGroup = bloodGroup?? user.bloodGroup;
    user.dateOfBirth = dateOfBirth?? user.dateOfBirth;
    user.doctorProfile.specialization = specialization ?? user.doctorProfile.specialization;
    user.doctorProfile.experience = experience ?? user.doctorProfile.experience;
    user.doctorProfile.hospital = hospital ?? user.doctorProfile.hospital;
    user.updatedAt = new Date();
    user.bmi = BMI;
    /// more will come later
    

    await user.save();
    res.status(200).json({ message: "Doctor profile updated successfully", user });

    
    
  } catch (error) {
    console.error(error.message)
    res.status(500).json({ message: "Server error Cant UpdateDoctorProfile" });
    
  }
}