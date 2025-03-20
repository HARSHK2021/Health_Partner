// hospital || clinic Schema
import mongoose from "mongoose";
const healthcareFacilitySchema = new mongoose.Schema({
  facilityType: {
    type: String,
    enum: ["Hospital", "Clinic", "Multi-Specialty", "Pharmacy"], // Add all allowed values
    required: true
},
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Email validation
  },
  registration_certificate:{type: String},
  license:{type: String},
  password: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    zipCode: { type: String, required: true },
  },
  establishedYear: { type: Number }, // Year of establishment
  website: { type: String }, // Facility website URL
  profileImage: { type: String }, // Image (Appwrite storage)
  description: { type: String }, // About the hospital/clinic
  /// stuff info
  doctors: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Doctors

  // Patients Treated
  patientsTreated: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

  emergencyContact: {
    phone: { type: String },
    available24x7: { type: Boolean, default: false },
  },
  totalBeds:{ type: Number},
  ICUBeds:{ type: Number},

  occupiedBeds:{ type: Number, default: 0},
  availableBeds:{ type: Number, default: 0},
  ambulanceAvailability:{type:Number},
  opdTimings:{type:String},

  ratings: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      rating: { type: Number, min: 1, max: 5, required: true },
      comment: { type: String },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  averageRating: { type: Number, default: 0 },

  // Verification & Active Status
  phoneOTP:{ type: String},
  emailOTP:{ type: String},
  phoneOTPExpires:{ type:String},
  emailOTPExpires:{ type:String},
  isPhoneVerified: { type: Boolean, default: false },
  isEmailVerified: { type: Boolean, default: false },
  verificationStatus: { type: String, enum: ["pending", "verified", "rejected"], default: "pending" },
  activeStatus: { type: String, enum: ["pending", "active", "inactive"], default: "pending" },
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
},{timestamps:true});
const HealthcareFacility = mongoose.model("HealthcareFacility", healthcareFacilitySchema);
export default HealthcareFacility;