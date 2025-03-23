import mongoose from "mongoose";

const MenstruationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    periodDates: [
        {
            startDate: { type: Date, required: true }, // Stores each period's start date
            month: { type: Number, required: true }, // Stores month separately
            year: { type: Number, required: true } // Stores year separately
        }
    ],
    averageCycleLength: { type: Number, default: 28 }, // Default to 28 days, updated dynamically
    predictedNextPeriod: { type: Date }, // Next expected period
    currentPhase: { type: String } // Current phase of the cycle
});

export default mongoose.model("Menstruation", MenstruationSchema);
