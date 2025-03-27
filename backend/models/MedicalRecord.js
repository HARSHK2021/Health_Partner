import mongoose from "mongoose";

const medicalRecordSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Patient ID
        condition: { type: String, required: true }, // Illness or medical issue
        symptoms: [{ type: String }], // List of symptoms (e.g., fever, headache)
        dateDiagnosed: { type: Date, default: Date.now }, // When the condition was diagnosed
        recoveryStatus: { type: String, enum: ["ongoing", "recovered"], default: "ongoing" }, // Status of recovery
        
        medicines: [
            {
                name: { type: String, required: true }, // Medicine Name
                dosage: { type: String }, // Dosage details (e.g., 500mg)
                frequency: { type: String }, // How often (e.g., "Twice a day")
                duration: { type: String }, // Duration (e.g., "5 days")
                takenAt: { type: [Date] }, // Track when the medicine was taken
            },
        ],

        doctor: { type: String }, // Doctor who diagnosed
        hospital: { type: String }, // If patient visited a hospital
        pharmacy: { type: String }, // If patient got medicines from a pharmacy
        prescriptionImages: [{ type: String }], // URLs for prescription images (stored in cloud)
        medicalReports: [{ type: String }], // URLs for medical reports
        additionalNotes: { type: String }, // Extra notes about condition/treatment

        createdAt: { type: Date, default: Date.now }, // Record creation date
        updatedAt: { type: Date },
    },
    { timestamps: true }
);

const MedicalRecord = mongoose.model("MedicalRecord", medicalRecordSchema);
export default MedicalRecord;
