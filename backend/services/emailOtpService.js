import nodemailer from 'nodemailer';
import User from '../models/User';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

export const sendEmailOTP = async (email) => {
    const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });
    console.log(`Generated OTP: ${otp}`);
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    // Save OTP to the database
    const user = await User.findOneAndUpdate(
        { email },
        { emailOTP: otp, otpExpiry },
        { new: true }
    );
    if (!user) {
        throw new Error('User not found');
    }

    

    // Send OTP via email
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP for verification is ${otp}. It is valid for 10 minutes.`,
    };

    await transporter.sendMail(mailOptions);
};


