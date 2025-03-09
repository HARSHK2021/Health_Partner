// hospital || clinic Schema
import mongoose from "mongoose";
const healthcareFacilitySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["hospital", "clinic"],
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
  phone: { type: String, required: true, unique: true },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    zipCode: { type: String, required: true },
  },
  establishedYear: { type: Number, required: true }, // Year of establishment
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
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
});
const HealthcareFacility = mongoose.model("HealthcareFacility", healthcareFacilitySchema);
export default HealthcareFacility;