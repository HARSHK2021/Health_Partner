import mongoose from "mongoose";

const medicineReminderSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Patient who set the reminder
        medicineName: { type: String, required: true }, // Name of the medicine
        dosage: { type: String, required: true }, // Dosage (e.g., 500mg)
        quantity: { type: Number, required: true }, // How many tablets/ml per dose
        frequency: { type: Number, required: true, min: 1, max: 5 }, // How many times per day (1-5)
        times: [{ type: String, required: true }], // Specific times (e.g., "08:00 AM", "02:00 PM")
        startDate: { type: Date, required: true }, // When to start the medication
        endDate: { type: Date, required: true }, // When to stop the medication
        instructions: { type: String }, // Any additional instructions (e.g., "Take after meal")
        isCompleted: { type: Boolean, default: false }, // Mark as completed when course is done
        createdAt: { type: Date, default: Date.now }, // Timestamp of reminder creation
        updatedAt: { type: Date },
    },
    { timestamps: true }
);

const MedicineReminder = mongoose.model("MedicineReminder", medicineReminderSchema);
export default MedicineReminder;
