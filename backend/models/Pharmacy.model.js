import mongoose from "mongoose";

// Pharmacy Schema
const pharmacySchema = new mongoose.Schema({
  facilityType: {
    type: String,
    enum: ["Pharmacy"], // Restrict this to 'Pharmacy' as it's a separate entity
    required: true,
  },
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Email validation
  },
  registration_certificate: { type: String }, // Registration number or certificate
  license: { type: String, required: true }, // Pharmacy-specific license number
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
  website: { type: String }, // Optional: Pharmacy's website, if available
  profileImage: { type: String }, // Optional: Image (for profile display)
  description: { type: String }, // Short description about the pharmacy
  
  // Stock Information: Medications available
  medications: [{ 
    medicationName: { type: String, required: true }, // Name of the medication
    stockCount: { type: Number, required: true }, // How many are available
    price: { type: Number, required: true }, // Price for each unit
  }], 

  // Working Hours (pharmacy's operating schedule)
  workingHours: { 
    mondayToFriday: { type: String, required: true }, // E.g., "9:00 AM - 6:00 PM"
    saturday: { type: String }, // Optional, e.g., "9:00 AM - 1:00 PM"
    sunday: { type: String }, // Optional, e.g., "Closed"
  },

  // Ratings (for user reviews)
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

  // Verification & Active Status (simplified version)
  phoneOTP: { type: String },
  emailOTP: { type: String },
  phoneOTPExpires: { type: String },
  emailOTPExpires: { type: String },
  isPhoneVerified: { type: Boolean, default: false },
  isEmailVerified: { type: Boolean, default: false },
  verificationStatus: { type: String, enum: ["pending", "verified", "rejected"], default: "pending" },
  activeStatus: { type: String, enum: ["pending", "active", "inactive"], default: "pending" },
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const Pharmacy = mongoose.model("Pharmacy", pharmacySchema);
export default Pharmacy;
