import mongoose from "mongoose";
const cycleSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    cycleLength: { type: Number }, // Days between start of this period and next
    periodLength: { type: Number }, // Days of bleeding
    symptoms: [{
      name: String,
      intensity: { type: Number, min: 1, max: 5 }
    }],
    flow: [{
      date: Date,
      level: { type: String, enum: ['light', 'medium', 'heavy', 'spotting'] }
    }],
    ovulationDate: { type: Date },
    fertileWindow: {
      start: Date,
      end: Date
    },
    notes: String,
    isPredicted: { type: Boolean, default: false },
    predictionAccuracy: { type: Number } // Null for user-provided, 0-100 for predicted
  }, { timestamps: true });
  
  export default mongoose.model('Cycle', cycleSchema);