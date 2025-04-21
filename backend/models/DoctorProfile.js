import mongoose from "mongoose";

const doctorProfileSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true }, // Linked User (Doctor)
        specialization: { type: String, required: true },
        experience: { type: Number, required: true }, // Years of Experience
        hospital: { type: mongoose.Schema.Types.ObjectId, ref: "HealthcareFacility" }, // Associated Hospital/Clinic
        patientsTreated: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Patients treated by doctor
        consultationFee: { type: Number, default: 0 }, // Doctor’s fee
        availability: {
            days: [{ type: String, enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] }],
            timings: { type: String } // Example: "9 AM - 5 PM"
        },
        certifications: [{ type: String }], // Degrees and Certifications
        medicalLicense: { type: String }, // License number
        consultationMode: { type: String, enum: ["online", "offline", "both"], default: "both" }, // Mode of Consultation
        patientsTreated: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        reviews: [
            {
                patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
                rating: { type: Number, min: 1, max: 5, required: true },
                comment: { type: String },
                createdAt: { type: Date, default: Date.now },
            },
        ],
        averageRating: { type: Number, default: 0 },
        myPatients:[{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
    },
    { timestamps: true }
);

const DoctorProfile = mongoose.model("DoctorProfile", doctorProfileSchema);
export default DoctorProfile;
