import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import otpGenerator from "otp-generator";
import dotenv from "dotenv";
import mailSender from "../services/sendGrid.js";
import resetPasswordTemplate from "../templates/resetPasswordTemplate.js";
import HealthcareFacility from "../models/HealthcareFacility.js";
import otpEmailTemplate from "../templates/otpTemplate.js"
dotenv.config();

/// signup Controller
export const signup = async (req, res, next) => {
  try {
    const {
      firstName,
      middleName,
      lastName,
      email,
      password,
      role,
      phone,
      gender,
    } = req.body;
    // validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
      return res.status(400).json({ message: "Invalid email address" });
    // validate the data
    if (!firstName || !lastName || !email || !password || !role || !gender)
      return res.status(400).json({ message: "All fields are required" });
    // validate phone
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone))
      return res.status(400).json({ message: "Invalid phone number" });

    // check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      // if (!userExists.isVerified) {
      //   return res
      //     .status(501)
      //     .json({ message: "User already exists, Go to verify page" });
      // }
      return res.status(400).json({ message: "User already exists" });
    }
    // hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // create a new user
    const user = await User.create({
      firstName,
      middleName: middleName || "",
      lastName,
      email,
      password: hashedPassword,
      role,
      phone,
      gender,
    });
    // save the user
    await user.save();

    // generate and send jwt token

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.status(201).json({
      user,
      token,
      message: "Signup successful, please verify your email and phone.",
      type: "user", 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
/// user Login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // validate the data
    if (!email || !password)
      return res.status(400).json({ message: "All fields are required" });
    const user = await User.findOne({ email }).select("+password");
    console.log(user);

    if (!user)
      return res
        .status(400)
        .json({ message: "USername not found Please Signup" });
    // validate password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword)
      return res.status(400).json({ message: "Invalid Password" });
    // generate and send jwt token
    if(!user.isVerified){
      return res.status(404).json({ message: "User not verified" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "2d",
    });

    res.status(200).json({ user, token, message: "Login Successful " });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

/// register a medical facility
export const registerMedicalFacility = async (req, res, next) => {
  try {
    const { name, address, email, phone, facilityType, password } = req.body;
    //validate data
    if (!name || !address || !email || !phone || !facilityType)
      return res.status(400).json({ message: "All fields are required" });
    const facilityExists = await HealthcareFacility.findOne({ email });
    if (facilityExists)
      return res.status(400).json({ message: "Facility already exists" });
    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // create a new facility
    const facility = new HealthcareFacility({
      name,
      address,
      email,
      phone,
      facilityType,
      password: hashedPassword,
    });
    await facility.save();
    // generate and send jwt token
    const token = jwt.sign({ id: facility._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
    console.log(token);
   return res
      .status(201)
      .json({ facility, token, message: "Facility registered successfully",
        type:"facility"
       });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        message: "Server Error Can't Register Facility Try Again Later",
      });
  }
};

export const loginFacility = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // Check if facility exists
    const facility = await HealthcareFacility.findOne({ email });
    if (!facility) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, facility.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }
    if(!facility.isVerified){
      return res.status(404).json({
        success: false,
        message: "Not Verified ",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: facility._id, role: "facility" },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.status(200).json({
      success: true,
      token,
      facility,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const signout = async (req, res, next) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Signout successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Signout failed" });
  }
};

// request  email OTP

// Request Email OTP
export const requestEmailOTP = async (req, res) => {
  try {
    const { email, userType } = req.body;
    console.log(userType);

    if (!email || !userType) {
      return res.status(400).json({ message: "Email and userType are required" });
    }

    // Select correct model based on userType
    const Model = userType === "user" ? User : HealthcareFacility;
    const user = await Model.findOne({ email });

    if (!user) return res.status(400).json({ message: "User not found" });

    // Generate OTP
    const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });
    console.log("Generated OTP:", otp);

    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // Expires in 10 minutes
    const response = mailSender(email, "Email Verification Code", otpEmailTemplate(otp), "Verify your email with this OTP");

    console.log("Email send response:", response);
    user.emailOTP = otp;
    user.emailOTPExpiry = otpExpiry;
    await user.save();

    res.status(200).json({ message: "OTP sent to your email" , otp });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Request OTP failed" });
  }
};

// Verify Email OTP
export const verifyEmailOTP = async (req, res) => {
  console.log(req.body);
  try {
    const { email, emailOTP, userType } = req.body;

    if (!email || !emailOTP || !userType) {
      return res.status(400).json({ message: "Email, OTP, and userType are required" });
    }

    const Model = userType === "user" ? User : HealthcareFacility;
    const user = await Model.findOne({ email });

    if (!user) return res.status(400).json({ message: "User not found" });

    if (user.emailOTPExpiry < new Date()) {
      return res.status(400).json({ message: "OTP expired, please request a new one" });
    }

    if (user.emailOTP.toString() !== emailOTP.toString()) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
  


 /// check if both verification are done 
    user.isEmailVerified = true;
    if (user.isEmailVerified && user.isPhoneVerified) {
      user.isVerified = true;
    }

    await user.save();

    res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Email verification failed" });
  }
};

// Request Phone OTP
export const requestPhoneOTP = async (req, res) => {
  try {
    const { phone, userType } = req.body;

    if (!phone || !userType) {
      return res.status(400).json({ message: "Phone number and userType are required" });
    }

    const Model = userType === "user" ? User : HealthcareFacility;
    const user = await Model.findOne({ phone });

    if (!user) return res.status(400).json({ message: "No user found with this number" });

    const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });
    console.log("OTP for phone:", otp);

    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    const hashedOTP = await bcrypt.hash(otp, 10);

    user.phoneOTP = hashedOTP;
    user.phoneOTPExpiry = otpExpiry;
      // Check if both verifications are done
     
    await user.save();

    res.status(200).json({ message: "OTP sent to your phone", otp });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Request OTP failed" });
  }
};

// Verify Phone OTP
export const verifyPhoneOTP = async (req, res) => {
  try {
    const { phone, phoneOTP, userType } = req.body;
    console.log(req.body);

    if (!phone || !phoneOTP|| !userType) {
      return res.status(400).json({ message: "Phone, OTP, and userType are required" });
    }

    const Model = userType === "user" ? User : HealthcareFacility;
    const user = await Model.findOne({ phone });

    if (!user) return res.status(400).json({ message: "User not found" });

    if (user.phoneOTPExpiry < new Date()) {
      return res.status(400).json({ message: "OTP expired, please request a new one" });
    }

    const isMatch = await bcrypt.compare(phoneOTP, user.phoneOTP);
    if (!isMatch) return res.status(400).json({ message: "Invalid OTP" });

    user.isPhoneVerified = true;
    if (user.isEmailVerified && user.isPhoneVerified) {
      user.isVerified = true;
    }
    await user.save();

    res.status(200).json({ message: "OTP verified successfully, you can now log in" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Phone verification failed" });
  }
};


////  final verify to to update both email verfication and  phone verfication


//// forgot password

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(200).json({ message: "enter email" });
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a secure reset token
    const resetToken = crypto.randomUUID(); // Secure random token

    // Hash the token before storing it in DB
    const hashedToken = await bcrypt.hash(resetToken, 10);

    // Set token & expiry in user document
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 mins expiry
    await user.save();

    // Create Reset Link
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // Send email
    const response = await mailSender(
      email,
      "Password Reset Request",
      `Click the link to reset your password: ${resetLink}`,
      resetPasswordTemplate(resetLink)
    );
    console.log(response);

    res.status(200).json({ message: "Password reset link sent to email." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

export const resetPassword = async (req, res) => {
  const { token } = req.body;
  const { password } = req.body;
  if (!token) {
    return res.status(400).json({ message: "Invalid request" });
  }
  if (!password) {
    return res.status(400).json({ message: "Please enter a new password" });
  }
  try {
    const user = await User.findOne({
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Compare the provided token with stored hashed token
    const isTokenValid = await bcrypt.compare(token, user.resetPasswordToken);
    if (!isTokenValid) {
      return res.status(400).json({ message: "Invalid reset token" });
    }

    // Hash the new password
    user.password = await bcrypt.hash(password, 10);

    // Clear reset token fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res
      .status(500)
      .json({ message: "Something went wrong ", error: error.message });
  }
};
