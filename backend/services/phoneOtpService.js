import twilio from "twilio";
import otpGenerator from "otp-generator";
import User from "../models/userModel.js";

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

export const sendPhoneOTP = async (phone) => {
    const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

    const user = await User.findOneAndUpdate(
        { phone },
        { phoneOTP: otp, otpExpiry },
        { new: true }
    );

    if (!user) throw new Error("User not found");

    await client.messages.create({
        body: `Your OTP for verification is ${otp}. It is valid for 10 minutes.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone,
    });
};
