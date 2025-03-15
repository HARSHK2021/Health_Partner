import User from "../models/User.js"
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import otpGenerator from "otp-generator"
// import HealthcareFacility from '../models/HealthcareFacility.js'


/// signup Controller 
export const signup = async(req , res ,next)=>{
    try {
        const { firstName, middleName, lastName,email, password, role , phone ,gender} = req.body;
        // validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return res.status(400).json({ message: "Invalid email address" });
        // validate the data
        if (!firstName ||!lastName ||!email ||!password ||!role ||!gender) return res.status(400).json({ message: "All fields are required" });
        // validate phone
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(phone)) return res.status(400).json({ message: "Invalid phone number" });

        // check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({  message: "User already exists" });

        // hash the password
        const hashedPassword = await bcrypt.hash(password,10);
        // create a new user
        const user = await User.create({
            firstName,
            middleName:middleName||"",
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
        
        const token = jwt.sign({ id: user._id ,role:user.role}, process.env.JWT_SECRET , { expiresIn: '1d' });
        res.status(201).json({ user, token, message: "Signup successful, please verify your email and phone." });

        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });

        
    }
}
 /// user Login 
 export const login = async(req, res, next)=>{
  try {
    const { email, password } = req.body;
    // validate the data
    if (!email ||!password) return res.status(400).json({ message: "All fields are required" });
    const user = await User.findOne({ email}).select("+password");
    
    if (!user) return res.status(400).json({ message: "USername not found Please Signup" });
    // validate password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) return res.status(400).json({ message: "Invalid Password" });
    // generate and send jwt token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  
    res.status(200).json({user,token, message: "Login Successful " });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
    
  }
 }

 // request  email OTP

export const requestEmailOTP = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: "Email is required" });
        const user = await User.findOne({ email: email});
        if (!user) return res.status(400).json({ message: "User not found" });
        //// generate otp 
        const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes
        //send otp to email function will come here ------------------->
        // save otp to user
        user.emailOTPExpiry = otpExpiry;
        user.emailOTP = otp;
        await user.save();
        res.status(200).json({ message: "OTP sent to your email" });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "request OTP failed" });
        
    }
  
};

/// Verify Email otp 

 export const verifyEmailOTP = async (req, res, next) => {
    try {
        const { email, otp } = req.body;
        if (!email ||!otp) return res.status(400).json({ message: "Email and OTP are required" });
        const user = await User.findOne({ email: email});
        if (!user) return res.status(400).json({ message: "User not found" });
        if (user.emailOTPExpiry < new Date()) return res.status(400).json({ message: "OTP expired, please request a new one" });
        if (user.emailOTP.toString() !== otp.toString()) return res.status(400).json({ message: "Invalid OTP" });
         /// set emailVerification in db to true
         user.isEmailVerified = true;
          await user.save();
        // if all is ok, allow user to login
        res.status(200).json({ message: "OTP verified successfully, you can now login" });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: " Email Verification failed" });
        
    }

 }


 /// request phone OTP 

export const requestPhoneOTP = async (req, res, next) => {
    try {
        const{ phone} = req.body;
        if (!phone) return res.status(400).json({ message: "Phone number is required" });
        const user = await User.findOne({ phone: phone});
        if (!user) return res.status(400).json({ message: "No User found with this number" });
        //// generate otp
        const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });
        console.log(" OTP FOR PHONE IS=", otp);
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes
        // send otp to phone function will come here ------------------->
        // save otp to user
        const hashedOTP = await bcrypt.hash(otp, 10);
        user.phoneOTPExpiry = otpExpiry;
        user.phoneOTP = hashedOTP;
        await user.save();
        res.status(200).json({ message: "OTP sent to your phone" });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "request OTP failed" });
        
    }
 }

 /// Verify Phone otp
export const verifyPhoneOTP = async (req, res, next) => {
    try {
        const { phone, otp } = req.body;
        if (!phone ||!otp) return res.status(400).json({ message: "Phone and OTP are required" });
        const user = await User.findOne({ phone: phone});
        if (!user) return res.status(400).json({ message: "User not found" });
        if (user.phoneOTPExpiry < new Date()) return res.status(400).json({ message: "OTP expired, please request a new one" });
        const isMatch = await bcrypt.compare(otp, user.phoneOTP);
        if (!isMatch) return res.status(400).json({ message: "Invalid OTP" });
        // if all is ok, allow user to login
        user.isPhoneVerified = true;
        await user.save();
        // generate and send jwt token
        res.status(200).json({ message: "OTP verified successfully, you can now login" });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Phone Verification failed" });
    }
 }

 ////  signout
export const signout = async (req, res, next) => {
    try {
        res.clearCookie("token");
       res.status(200).json({ message: "Signout successful" });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Signout failed" });
    }
   
 }
