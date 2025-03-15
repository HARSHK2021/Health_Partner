
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import otpGenerator from "otp-generator"
import HealthcareFacility from "../models/HealthcareFacility.js"

 /// register a medical facility
 export const registerMedicalFacility = async (req, res, next) => {
    try {
        const { name, address, email, phone, facilityType,password } = req.body;
        //validate data
        if (!name ||!address ||!email ||!phone ||!facilityType) return res.status(400).json({ message: "All fields are required" });
        const facilityExists = await HealthcareFacility.findOne({ email });
        if (facilityExists) return res.status(400).json({ message: "Facility already exists" });
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
        const token = jwt.sign({ id: facility._id }, process.env.JWT_SECRET, { expiresIn: "30d" });
        console.log(token);
        res.status(200).json({ facility, token, message: "Facility registered successfully" });

        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error Can't Register Facility Try Again Later" });
        
    }
 }

//verify medical facility 


export const requestVerificationMedicalFacility = async (req, res) => {
    try {
        const { email, phone } = req.body;

        if (!email || !phone) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const facility = await HealthcareFacility.findOne({ email });

        if (!facility) {
            return res.status(400).json({ message: "Facility not found" });
        }

        // Generate OTPs
        const phoneOTP = otpGenerator.generate(6, { 
            digits: true, 
            alphabets: false, 
            upperCase: false, 
            lowerCase: false, 
            specialChars: false 
        });
        
        const emailOTP = otpGenerator.generate(6, { 
            digits: true, 
            alphabets: false, 
            upperCase: false, 
            lowerCase: false, 
            specialChars: false 
        });

        // Save OTPs with expiration times
        facility.phoneOTP = phoneOTP;
        facility.emailOTP = emailOTP;
        facility.phoneOTPExpires = Date.now() + 10 * 60 * 1000; // 10 minutes expiry
        facility.emailOTPExpires = Date.now() + 10 * 60 * 1000; // 10 minutes expiry

        await facility.save();

        // TODO: Send OTPs via Email & SMS here
        console.log("Phone OTP:", phoneOTP);
        console.log("Email OTP:", emailOTP);

        res.status(200).json({ message: "OTP sent successfully, verify your account." });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error. Try again later." });
    }
};

 
/// verify the facility
 export const verifyMedicalFacility = async (req, res, next) => {
  try {
    const {email,emailOTP,phoneOTP} = req.body;
    if(!email||!emailOTP || !phoneOTP) return res.status(400).json({ message: "Email and OTP are required" });

    //find facility
    const facility = await HealthcareFacility.findOne({ email });
    if (!facility) return res.status(400).json({ message: "Facility not found" });
    // verify email OTP
    if(facility.emailOTP!== emailOTP) return res.status(400).json({ message: "Invalid email OTP" });
    // verify phone OTP
    if(facility.phoneOTP!== phoneOTP) return res.status(400).json({ message: "Invalid phone OTP" });
    // if OTP is valid, generate jwt token
    facility.phoneOTP = null;
    facility.emailOTP = null;
    facility.isPhoneVerified= true;
    facility.isEmailVerified = true;
    facility.verificationStatus= "verified";
    await facility.save();

    const token = jwt.sign({ id: facility._id }, process.env.JWT_SECRET, { expiresIn: "30d" });
    res.status(200).json({ facility, token, message: "Facility verified successfully, you can now login" });
    // remove OTP from database
   
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error Can't Verify Facility Try Again Later" });
    
  }

 }
