import User from "../models/User.js";
import mongoose from "mongoose";
import { calculateBMI } from "../utils/bmiCalculator.js";
import MedicalRecord from "../models/MedicalRecord.js";
import cloudinary from "../config/cloudinary.config.js";
import Appointment from "../models/Appointment.js";
import DoctorProfile from "../models/DoctorProfile.js";

export const uploadMedicalRecord = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    console.log("Starting uploadMedicalRecord function...");
    console.log("Request files:", req.files);
    console.log("Request body:", req.body);

    if (!req.user || !req.user._id) {
      await session.abortTransaction();
      session.endSession();
      return res.status(401).json({ message: "User not authenticated" });
    }

    const userId = req.user._id;
    const { condition, recoveryStatus, dateDiagnosed, additionalNotes } =
      req.body;

    // Handle symptoms and medicines with safer parsing
    let symptomsInput = req.body.symptoms || "[]";
    let medicinesInput = req.body.medicines || "[]";

    let prescriptionImages = [];
    let medicalReports = [];

    // Validate recoveryStatus
    const validRecoveryStatuses = ["ongoing", "recovered", "critical"];
    if (!validRecoveryStatuses.includes(recoveryStatus)) {
      return res.status(400).json({
        message: `Invalid recoveryStatus value. Allowed values: ${validRecoveryStatuses.join(
          ", "
        )}`,
      });
    }

    // Parse symptoms - ensure it's an array of strings
    let parsedSymptoms;
    try {
      // If symptoms is already an array, use it; otherwise parse it
      parsedSymptoms = Array.isArray(symptomsInput)
        ? symptomsInput
        : JSON.parse(symptomsInput);

      // Make sure all symptoms are strings
      parsedSymptoms = parsedSymptoms.map((s) => String(s));
    } catch (error) {
      console.error("Error parsing symptoms:", error);
      return res.status(400).json({
        message: "Invalid format for symptoms. Expected an array of strings.",
        error: error.message,
      });
    }

    // Parse medicines - ensure it's an array of objects
    let parsedMedicines;
    try {
      if (Array.isArray(medicinesInput)) {
        parsedMedicines = medicinesInput;
      } else {
        // Parse the JSON string
        const parsed = JSON.parse(medicinesInput);

        // If the result is an object, wrap it in an array
        parsedMedicines = Array.isArray(parsed) ? parsed : [parsed];
      }

      // Ensure each medicine has the required fields
      parsedMedicines = parsedMedicines.map((med) => {
        if (typeof med === "string") {
          med = JSON.parse(med);
        }

        if (!med.name || !med.dosage || !med.frequency || !med.duration) {
          throw new Error(
            "Each medicine must have name, dosage, frequency, and duration"
          );
        }

        return {
          name: med.name,
          dosage: med.dosage,
          frequency: med.frequency,
          duration: med.duration,
          takenAt: med.takenAt || [],
        };
      });
    } catch (error) {
      console.error("Error parsing medicines:", error);
      return res.status(400).json({
        message:
          "Invalid format for medicines. Each medicine must have name, dosage, frequency, and duration.",
        error: error.message,
      });
    }
    // Fixed Cloudinary upload function
    const uploadToCloudinary = (file, resourceType) => {
      return new Promise((resolve, reject) => {
        console.log(
          `Uploading ${file.originalname} (${file.size} bytes) to Cloudinary...`
        );
        // Create upload stream
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: resourceType || "auto",
            folder: "medical_records",
            public_id: `${Date.now()}_${file.originalname.replace(
              /\s+/g,
              "_"
            )}`,
            overwrite: true,
          },
          (error, result) => {
            if (error) {
              console.error("Cloudinary Upload Error:", error);
              reject(error);
            } else {
              console.log("File uploaded successfully:", result.secure_url);
              resolve(result.secure_url);
            }
          }
        );
        // Check if file has buffer before sending
        if (file && file.buffer) {
          uploadStream.end(file.buffer);
        } else {
          reject(new Error("Invalid file or missing buffer"));
        }
      });
    };

    // Upload prescription images (if provided)
    if (req.files?.prescriptionImages) {
      const images = Array.isArray(req.files.prescriptionImages)
        ? req.files.prescriptionImages
        : [req.files.prescriptionImages];

      if (images.length > 0) {
        console.log(`Uploading ${images.length} prescription images...`);

        const uploadPromises = images.map((file) =>
          uploadToCloudinary(file, "image")
        );

        prescriptionImages = await Promise.all(uploadPromises);
        console.log("All prescription images uploaded:", prescriptionImages);
      }
    }

    // Upload medical reports (if provided)
    if (req.files?.medicalReports) {
      const reports = Array.isArray(req.files.medicalReports)
        ? req.files.medicalReports
        : [req.files.medicalReports];
      if (reports.length > 0) {
        console.log(`Uploading ${reports.length} medical reports...`);
        const uploadPromises = reports.map((file) =>
          uploadToCloudinary(
            file,
            file.mimetype.includes("pdf") ? "raw" : "image"
          )
        );
        medicalReports = await Promise.all(uploadPromises);
        console.log("All medical reports uploaded:", medicalReports);
      }
    }
    const newRecord = new MedicalRecord({
      user: userId,
      condition,
      recoveryStatus,
      dateDiagnosed,
      symptoms: parsedSymptoms,
      medicines: parsedMedicines,
      additionalNotes,
      prescriptionImages,
      medicalReports,
      createdAt: new Date(),
    });

    await newRecord.save({ session });
    console.log("Medical record saved successfully:", newRecord._id);
    await session.commitTransaction();
    session.endSession();

    res.status(201).json(newRecord);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error creating medical record:", error);
    res
      .status(500)
      .json({ message: "Error creating medical record", error: error.message });
  }
};
// Retrieve All Medical Records
export const getAllMedicalRecords = async (req, res) => {
  try {
    const records = await MedicalRecord.find();
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching medical records",
      error: error.message,
    });
  }
};

// Retrieve a Medical Record by ID
export const getMedicalRecordById = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate user ID format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Find all records for this user
    const records = await MedicalRecord.find({ user: userId });

    if (!records.length) {
      return res
        .status(404)
        .json({ message: "No records found for this user" });
    }

    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching medical records",
      error: error.message,
    });
  }
};


// get codition from medical record
export const getConditionFromMedicalRecord = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate user ID format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Find all records for this user
    const records = await MedicalRecord.find({ user: userId });

    if (!records.length) {
      return res
        .status(404)
        .json({ message: "No records found for this user" });
    }

    const conditions = records.map((record) => record.condition);
    res.status(200).json(conditions);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching medical records",
      error: error.message,
    });
  }
};
// Update Medical Record
export const updateMedicalRecord = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid medical record ID" });
    }

    const updatedRecord = await MedicalRecord.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedRecord)
      return res.status(404).json({ message: "Record not found" });
    res.status(200).json(updatedRecord);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating medical record", error: error.message });
  }
};


// Get User Profile
export const getUserProfile = async (req, res) => {
  // console.log("user from ", req.user);
  res.status(200).json(req.user);
};

// Update Profile (Includes height & weight)
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { address, profileImage, height, weight, bloodGroup, dateOfBirth } =
      req.body;

    const user = req.user;

    let updateFields = {};
    let updateOperations = {};
    const currentDate = new Date();
    let BMI = null;

    if (address) updateFields.address = address;
    if (profileImage) updateFields.profileImage = profileImage;
    if (bloodGroup) updateFields.bloodGroup = bloodGroup;
    if (dateOfBirth) updateFields.dateOfBirth = dateOfBirth;

    if (weight && height) {
      BMI = calculateBMI(weight, height);
      console.log("BMI", BMI);

      updateFields.height = height;
      updateFields.weight = weight;
      updateFields.bodyMassIndex = BMI; // ✅ Add BMI to main profile

      updateOperations.$push = {
        ...updateOperations.$push,
        heightData: { date: currentDate, height },
        weightData: { date: currentDate, weight },
        bmiRecords: { date: currentDate, bmi: BMI },
      };
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields, ...updateOperations },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res
      .status(200)
      .json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ➤ **2️⃣ Retrieve All Medical History for a User**
export const getMedicalHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const records = await MedicalRecord.find({ user: userId }).populate(
      "doctor hospital pharmacy"
    );
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving medical history",
      error: error.message,
    });
  }
};

// Get Approved Doctors
export const getApprovedDoctors = async (req, res) => {
  try {
    const userId = req.user.id; // Patient's ID from authentication

    // Fetch user with populated doctor details
    const user = await User.findById(userId).populate(
      "approvedDoctors",
      "name email phone"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ approvedDoctors: user.approvedDoctors });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching approved doctors",
      error: error.message,
    });
  }
};

// Revoke Doctor Access
export const revokeDoctorAccess = async (req, res) => {
  try {
    const userId = req.user.id; // Patient's ID
    const { doctorId } = req.body; // Doctor ID to be removed

    // Find patient and update the approvedDoctors array
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { approvedDoctors: doctorId } }, // Remove doctor
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Doctor access revoked successfully",
      approvedDoctors: updatedUser.approvedDoctors,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error revoking doctor access", error: error.message });
  }
};


// Get Active Medicines

export const updateActiveMedicationCount = async (req,res) => {
  try {
    // Ensure userId is a valid ObjectId

    const {userId} = req.params;

    // Step 1: Find all ongoing medical records of the user
    const ongoingRecords = await MedicalRecord.find({
      user: userId,
      recoveryStatus: "ongoing",
    });

    // Step 2: Count all medicines in those records
    let totalMedicines = 0;
    ongoingRecords.forEach((record) => {
      totalMedicines += record.medicines.length;
    });

    // Step 3: Update the User document
    await User.findByIdAndUpdate(userId, {
      activeMedication: totalMedicines,
    });

    console.log(`Updated activeMedication to ${totalMedicines}`);
    return res.status(200).json({
      message: "Active medication count updated successfully",
      activeMedication: totalMedicines,
    });
  } catch (err) {
    console.error("Error updating active medication count:", err.message);
    throw err;
  }
};

export const bookAppointment = async (req, res) => {
  try {
    const patientId = req.user._id;
    const { doctorId, appointmentDate, appointmentTime, reason, notes, consultationMode, location, meetingLink } = req.body;
    
    if (!doctorId || !appointmentDate || !appointmentTime || !reason) {
      return res.status(400).json({
        message: "Missing required fields: doctorId, appointmentDate, appointmentTime, reason",
      });
    }
    
    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json({ message: "Invalid doctor ID" });
    }

    // Find doctor in User collection
    const doctor = await User.findById(doctorId);
    
    if (!doctor || doctor.role !== "doctor") {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Use doctor's User ID as reference
    const doctorId_ref = doctor._id;
    
    const appointmentDateTime = new Date(appointmentDate);
    if (appointmentDateTime < new Date()) {
      return res.status(400).json({ message: "Appointment date must be in the future" });
    }

    const existingAppointment = await Appointment.findOne({
      doctor: doctorId_ref,
      appointmentDate: appointmentDate,
      appointmentTime: appointmentTime,
      status: { $ne: "cancelled" },
    });

    if (existingAppointment) {
      return res.status(409).json({ message: "Time slot already booked. Please choose another time." });
    }

    const patientConflict = await Appointment.findOne({
      patient: patientId,
      appointmentDate: appointmentDate,
      appointmentTime: appointmentTime,
      status: { $ne: "cancelled" },
    });

    if (patientConflict) {
      return res.status(409).json({ message: "You already have an appointment at this time." });
    }

    const newAppointment = new Appointment({
      patient: patientId,
      doctor: doctorId_ref,
      appointmentDate,
      appointmentTime,
      reason,
      notes: notes || "",
      consultationMode: consultationMode || "both",
      location: location || null,
      meetingLink: meetingLink || null,
      status: "scheduled",
    });

    await newAppointment.save();

    const appointment = await Appointment.findById(newAppointment._id)
      .populate("patient", "firstName lastName email phone")
      .populate("doctor", "firstName lastName email phone");

    res.status(201).json({
      message: "Appointment booked successfully",
      appointment,
    });
  } catch (error) {
    console.error("Error booking appointment:", error);
    res.status(500).json({ message: "Error booking appointment", error: error.message });
  }
};

export const getMyAppointments = async (req, res) => {
  try {
    const patientId = req.user._id;
    const { status, startDate, endDate } = req.query;

    let query = { patient: patientId };

    if (status) {
      query.status = status;
    }
    if (startDate && endDate) {
      query.appointmentDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const appointments = await Appointment.find(query)
      .populate("patient", "firstName lastName email phone")
      .populate("doctor", "firstName lastName email phone")
      .sort({ appointmentDate: 1 });

    res.status(200).json({
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ message: "Error fetching appointments", error: error.message });
  }
};

export const cancelAppointment = async (req, res) => {
  try {
    const patientId = req.user._id;
    const { appointmentId } = req.params;
    const { cancellationReason } = req.body;

    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
      return res.status(400).json({ message: "Invalid appointment ID" });
    }

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (appointment.patient.toString() !== patientId.toString()) {
      return res.status(403).json({ message: "Unauthorized: This appointment does not belong to you" });
    }

    if (appointment.status === "cancelled") {
      return res.status(400).json({ message: "Appointment is already cancelled" });
    }

    if (appointment.status === "completed") {
      return res.status(400).json({ message: "Cannot cancel a completed appointment" });
    }

    appointment.status = "cancelled";
    appointment.cancellationReason = cancellationReason || "Patient requested cancellation";
    appointment.cancelledAt = new Date();
    await appointment.save();

    res.status(200).json({
      message: "Appointment cancelled successfully",
      appointment,
    });
  } catch (error) {
    console.error("Error cancelling appointment:", error);
    res.status(500).json({ message: "Error cancelling appointment", error: error.message });
  }
};

export const rescheduleAppointment = async (req, res) => {
  try {
    const patientId = req.user._id;
    const { appointmentId } = req.params;
    const { newDate, newTime, reason } = req.body;

    if (!newDate || !newTime) {
      return res.status(400).json({ message: "Missing required fields: newDate, newTime" });
    }

    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
      return res.status(400).json({ message: "Invalid appointment ID" });
    }

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (appointment.patient.toString() !== patientId.toString()) {
      return res.status(403).json({ message: "Unauthorized: This appointment does not belong to you" });
    }

    if (appointment.status === "cancelled" || appointment.status === "completed") {
      return res.status(400).json({ message: "Cannot reschedule a cancelled or completed appointment" });
    }

    const newDateTime = new Date(newDate);
    if (newDateTime < new Date()) {
      return res.status(400).json({ message: "New appointment date must be in the future" });
    }

    const conflict = await Appointment.findOne({
      doctor: appointment.doctor,
      appointmentDate: newDate,
      appointmentTime: newTime,
      _id: { $ne: appointmentId },
      status: { $ne: "cancelled" },
    });

    if (conflict) {
      return res.status(409).json({ message: "Time slot already booked. Please choose another time." });
    }

    appointment.appointmentDate = newDate;
    appointment.appointmentTime = newTime;
    appointment.status = "scheduled";
    if (reason) {
      appointment.reason = reason;
    }
    await appointment.save();

    const updatedAppointment = await Appointment.findById(appointmentId)
      .populate("patient", "firstName lastName email phone")
      .populate("doctor", "firstName lastName email phone");

    res.status(200).json({
      message: "Appointment rescheduled successfully",
      appointment: updatedAppointment,
    });
  } catch (error) {
    console.error("Error rescheduling appointment:", error);
    res.status(500).json({ message: "Error rescheduling appointment", error: error.message });
  }
};

export const getAvailableSlots = async (req, res) => {
  try {
    const { doctorId, date } = req.query;

    if (!doctorId || !date) {
      return res.status(400).json({ message: "Missing required parameters: doctorId, date" });
    }

    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json({ message: "Invalid doctor ID" });
    }

    // Find doctor in User collection
    const doctor = await User.findById(doctorId);
    
    if (!doctor || doctor.role !== "doctor") {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const doctorId_ref = doctor._id;

    const allSlots = [];
    for (let hour = 9; hour < 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        allSlots.push(`${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`);
      }
    }

    const bookedAppointments = await Appointment.find({
      doctor: doctorId_ref,
      appointmentDate: { $gte: new Date(date), $lt: new Date(new Date(date).getTime() + 86400000) },
      status: { $ne: "cancelled" },
    });

    const bookedSlots = bookedAppointments.map((apt) => apt.appointmentTime);
    const availableSlots = allSlots.filter((slot) => !bookedSlots.includes(slot));

    res.status(200).json({
      date,
      doctorName: doctor.firstName + " " + doctor.lastName,
      totalSlots: allSlots.length,
      bookedSlots: bookedSlots.length,
      availableSlots: availableSlots,
      availableSlotsCount: availableSlots.length,
    });
  } catch (error) {
    console.error("Error fetching available slots:", error);
    res.status(500).json({ message: "Error fetching available slots", error: error.message });
  }
};

export const getAppointmentDetails = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
      return res.status(400).json({ message: "Invalid appointment ID" });
    }

    const appointment = await Appointment.findById(appointmentId)
      .populate("patient", "firstName lastName email phone")
      .populate("doctor", "firstName lastName email phone")
      .populate("prescription");

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json(appointment);
  } catch (error) {
    console.error("Error fetching appointment details:", error);
    res.status(500).json({ message: "Error fetching appointment details", error: error.message });
  }
};

export const rateAppointment = async (req, res) => {
  try {
    const patientId = req.user._id;
    const { appointmentId } = req.params;
    const { rating, feedback } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
      return res.status(400).json({ message: "Invalid appointment ID" });
    }

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (appointment.patient.toString() !== patientId.toString()) {
      return res.status(403).json({ message: "Unauthorized: This appointment does not belong to you" });
    }

    if (appointment.status !== "completed") {
      return res.status(400).json({ message: "Can only rate completed appointments" });
    }

    appointment.rating = rating;
    appointment.feedback = feedback || "";
    await appointment.save();

    res.status(200).json({
      message: "Appointment rated successfully",
      appointment,
    });
  } catch (error) {
    console.error("Error rating appointment:", error);
    res.status(500).json({ message: "Error rating appointment", error: error.message });
  }
};
