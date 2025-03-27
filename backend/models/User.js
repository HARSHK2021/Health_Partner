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
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Email validation
    },
    tagNumber: { type: String, unique: true, sparse: true }, // Assigned on registration,

    password: {
      type: String,
      required: true,
      minlength: [6, "password must be at least 6 characters long"],
      select: false,
    },
    role: { type: String, enum: ["patient", "doctor"], required: true },
    phone: { type: String, required: true, unique: true },
    address: { type: String },
    profileImage: { type: String }, // URL for profile image stored in cloud
    height: { type: String },
    heightData: [
      {
        date: { type: Date, required: true },
        height: { type: Number, required: true },
      },
    ],
    weight: { type: String },
    weightData: [
      {
        date: { type: Date, required: true },
        weight: { type: Number, required: true },
      },
    ],
    bodyMassIndex: { type: String },
    bmiRecords: [
      {
        date: { type: Date, required: true },
        bmi: { type: Number, required: true },
      },
    ],
    bloodGroup: { type: String },
    gender: { type: String, enum: ["male", "female", "other"], required: true },
    dateOfBirth: { type: Date },

    // Doctor-specific profile (Separate Schema)
    doctorProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DoctorProfile",
    },

    // Medical history (Separate Schema)
    medicalHistory: [
      { type: mongoose.Schema.Types.ObjectId, ref: "MedicalRecord" },
    ],

    // Medicine reminders (Separate Schema)
    medicineReminders: [
      { type: mongoose.Schema.Types.ObjectId, ref: "MedicineReminder" },
    ],
    /// access request
    accessRequests: [
      {
        doctor: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Requesting doctor
        status: {
          type: String,
          enum: ["pending", "approved", "denied"],
          default: "pending",
        },
        requestedAt: { type: Date, default: Date.now },
      },
    ],

    // Approved Doctors (Doctors who can access this patient's data)
    approvedDoctors: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    pastVisits: [
      {
        doctor: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Doctor who treated the patient
        facility: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "HealthcareFacility",
        }, // Hospital/clinic visited
        date: { type: Date, default: Date.now },
        notes: { type: String }, // Treatment summary
      },
    ],
    //menstruation part 
    averageCycleLength: { type: Number, default: 28 },
    averagePeriodLength: { type: Number, default: 5 },
    lastPeriodDate: { type: Date },
    nextPredictedPeriod: { type: Date },
    cycleHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Cycle' }],
    healthMetrics: {
      typicalSymptoms: [String],
      flowLevel: { type: String, enum: ['light', 'medium', 'heavy'] }
    },
    ////////////////////
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

    emailOTP: { type: String },
    phoneOTP: { type: String },
    emailOTPExpiry: { type: String },
    phoneOTPExpiry: { type: String },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: String },
    isEmailVerified: { type: Boolean, default: false },
    isPhoneVerified: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },

    isActive: { type: Boolean, default: true },
    socketId: { type: String },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;

// user schema
// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema(
//     {
//         firstName: { type: String, required: true },
//         middleName: { type: String },
//         lastName: { type: String, required: true },
//         email: {
//             type: String,
//             required: true,
//             unique: true,
//             lowercase: true,
//             match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ // Email validation
//         },
//         password: { type: String, required: true,minlength:[6,'password must be at least 6 characters long'],select:false },
//         role: {
//             type: String,
//             enum: ["patient", "doctor"],
//             required: true
//         },
//         phone: { type: String, required: true, unique: true }, // Ensuring unique phone numbers
//         address: { type: String },
//         profileImage: { type: String }, // URL for profile image stored in cloud
//         height:{ type:String},
//         weight:{ type:String},
//         bodyMassIndex:{type:String},
//         bloodGroup:{ type:String},
//         gender:{
//             type: String,
//             enum: ["male", "female", "other"],
//             required: true
//         },
//         dateOfBirth: { type: Date },
//         // Timestamp of registration
//        // Timestamp of last update
//          createdAt: { type: Date, default: Date.now }, // Default timestamp
//         updatedAt: { type: Date },

//         // Doctor-specific fields
//         doctorProfile: { type: mongoose.Schema.Types.ObjectId, ref: "DoctorProfile" }, // Reference doctor profile

//         // all User-specific fields
//         medicalHistory: [
//             {
//                 condition: { type: String },
//                 dateDiagnosed: { type: Date, default: Date.now }, // Default timestamp
//                 doctor: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to doctor
//                 medicalReport: { type: String }, // URL to medical report   stored in Cloud
//             },
//         ],
//         ratings: [
//             {
//                 user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Who gave the rating
//                 rating: { type: Number, min: 1, max: 5, required: true }, // Rating value (1-5)
//                 comment: { type: String }, // Optional review comment
//                 createdAt: { type: Date, default: Date.now }, // Timestamp of rating
//             },
//         ],
//         averageRating: { type: Number, default: 0 }, // store average rating
//         emailOTP: { type: String},
//         phoneOTP: { type: String},
//         emailOTPExpiry:{type:String},
//         phoneOTPExpiry:{type:String},
//         resetPasswordToken:{type:String},
//         resetPasswordExpires:{type:String},

//         isEmailVerified: { type: Boolean, default: false },
//         isPhoneVerified: { type: Boolean, default: false },
//         isVerified:{ type:Boolean, default:false}, // if email and phone verified then user is verified
//         isAdmin: { type: Boolean, default: false },
//         isActive: { type: Boolean, default: true }, // User is active by default
//         socketId:{
//             type: String,
//         }
//     },
//     { timestamps: true }
// );

// const User = mongoose.model('User', userSchema);
// export default User;
