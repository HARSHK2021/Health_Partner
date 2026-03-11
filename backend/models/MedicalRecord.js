import mongoose from "mongoose";

const secureFileSchema = new mongoose.Schema({
    url: { type: String, required: true },
    originalName: { type: String },
    mimeType: { type: String },
    fileId: { type: String, required: true },
    isEncrypted: { type: Boolean, default: true }
}, { _id: false });

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
        // Using Mixed type to support both legacy string URLs and new encrypted file objects
        prescriptionImages: [{ type: mongoose.Schema.Types.Mixed }],
        medicalReports: [{ type: mongoose.Schema.Types.Mixed }],
        additionalNotes: { type: String }, // Extra notes about condition/treatment

        createdAt: { type: Date, default: Date.now }, // Record creation date
        updatedAt: { type: Date },
    },
    { timestamps: true }
);
const normalizeFileData = (files) => {
    if (!files || !Array.isArray(files)) return [];
    
    return files.map(file => {
        // If it's already a proper object with url and fileId, return as-is
        if (file && typeof file === 'object' && file.url && file.fileId) {
            return file;
        }
        if (typeof file === 'string') {
            return file;
        }
        if (file && typeof file === 'object' && file['0'] !== undefined) {
            const chars = [];
            let i = 0;
            while (file[i] !== undefined) {
                chars.push(file[i]);
                i++;
            }
            return chars.join('');
        }
        return file;
    });
};

medicalRecordSchema.set('toJSON', {
    transform: function(doc, ret) {
        ret.prescriptionImages = normalizeFileData(ret.prescriptionImages);
        ret.medicalReports = normalizeFileData(ret.medicalReports);
        return ret;
    }
});

medicalRecordSchema.set('toObject', {
    transform: function(doc, ret) {
        ret.prescriptionImages = normalizeFileData(ret.prescriptionImages);
        ret.medicalReports = normalizeFileData(ret.medicalReports);
        return ret;
    }
});

const MedicalRecord = mongoose.model("MedicalRecord", medicalRecordSchema);
export default MedicalRecord;
