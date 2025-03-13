// user schema 
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        firstName: { type: String, required: true },
        middleName: { type: String },
        lastName: { type: String, required: true },
        email: { 
            type: String, 
            required: true, 
            unique: true, 
            lowercase: true,
            match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ // Email validation
        },
        password: { type: String, required: true,minlength:[6,'password must be at least 6 characters long'],select:false },
        role: { 
            type: String, 
            enum: ["patient", "doctor"], 
            required: true 
        },
        phone: { type: String, required: true, unique: true }, // Ensuring unique phone numbers
        address: { type: String },
        profileImage: { type: String }, // URL for profile image stored in cloud
        height:{ type:String},
        weight:{ type:String},
        bodyMassIndex:{type:String},
        bloodGroup:{ type:String},
        gender:{
            type: String, 
            enum: ["male", "female", "other"], 
            required: true 
        },
        dateOfBirth: { type: Date },
        // Timestamp of registration
       // Timestamp of last update
         createdAt: { type: Date, default: Date.now }, // Default timestamp
        updatedAt: { type: Date },

        // Doctor-specific fields
        doctorProfile: {
            specialization: { type: String },
            experience: { type: Number },
            hospital: { type: mongoose.Schema.Types.ObjectId, ref: "Hospital" }, // Reference to Hospital
            patientsTreated: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Patients treated by doctor
           
        },

        // all User-specific fields
        medicalHistory: [
            {
                condition: { type: String },
                dateDiagnosed: { type: Date, default: Date.now }, // Default timestamp
                doctor: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to doctor
                medicalReport: { type: String }, // URL to medical report   stored in Cloud
            },
        ],
        ratings: [
            {
                user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Who gave the rating
                rating: { type: Number, min: 1, max: 5, required: true }, // Rating value (1-5)
                comment: { type: String }, // Optional review comment
                createdAt: { type: Date, default: Date.now }, // Timestamp of rating
            },
        ],
        averageRating: { type: Number, default: 0 }, // store average rating
        emailOTP: { type: String},
        phoneOTP: { type: String},
        emailOTPExpiry:{type:String},
        phoneOTPExpiry:{type:String},
        
        isEmailVerified: { type: Boolean, default: false },
        isPhoneVerified: { type: Boolean, default: false },
        isVerified:{ type:Boolean, default:false}, // if email and phone verified then user is verified
        isAdmin: { type: Boolean, default: false },
        isActive: { type: Boolean, default: true }, // User is active by default
        socketId:{
            type: String,
        }
    },
    { timestamps: true }
);

const User = mongoose.model('User', userSchema);
export default User;