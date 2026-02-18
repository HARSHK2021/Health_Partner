import express from  'express';
const router = express.Router();
import { 
  bookAppointment, 
  getUserProfile, 
  updateActiveMedicationCount, 
  updateUserProfile, 
  uploadMedicalRecord,
  getMyAppointments,
  cancelAppointment,
  rescheduleAppointment,
  getAvailableSlots,
  getAppointmentDetails,
  rateAppointment
} from "../controllers/patientController.js"
import protectUser from "../middlewares/protectUser.js"
import { 

  getAllMedicalRecords, 
  getMedicalRecordById, 
  updateMedicalRecord, 
 
} from "../controllers/patientController.js";

import multer from 'multer';
import { getCurrentPhase, getCycleHistory, recordPeriodStart } from '../controllers/menstruationController.js';
const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadFields = upload.fields([
  { name: "prescriptionImages", maxCount: 5 },
  { name: "medicalReports", maxCount: 5 }
]);

//Profile
router.get("/get-profile",protectUser,getUserProfile);
router.post("/update-profile",protectUser,updateUserProfile);

//Medical Records
router.post("/upload-medical-records",protectUser,uploadFields, uploadMedicalRecord);
router.get("/medical-records", protectUser, getAllMedicalRecords);
// router.get("/medical-records-by/:id", protectUser, getMedicalRecordById);
router.get('/medical-records/user/:userId', protectUser, getMedicalRecordById);
router.patch("/medical-records/:id", protectUser, updateMedicalRecord);

router.get('/activeMedicine/:userId', updateActiveMedicationCount);

// Book a new appointment
router.post("/appointments/book", protectUser, bookAppointment);

// Get all appointments for the patient
router.get("/appointments", protectUser, getMyAppointments);

// Get available slots for a doctor on a specific date
router.get("/appointments/slots", protectUser, getAvailableSlots);

// Get appointment details
router.get("/appointments/:appointmentId", protectUser, getAppointmentDetails);

// Cancel appointment
router.delete("/appointments/:appointmentId", protectUser, cancelAppointment);

// Reschedule appointment
router.put("/appointments/:appointmentId/reschedule", protectUser, rescheduleAppointment);

// Rate and review appointment
router.post("/appointments/:appointmentId/rate", protectUser, rateAppointment);

export default router;