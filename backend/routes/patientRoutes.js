import express from  'express';
const router = express.Router();
import { getUserProfile, updateUserProfile, uploadMedicalRecord} from "../controllers/patientController.js"
import protectUser from "../middlewares/protectUser.js"
import { 

  getAllMedicalRecords, 
  getMedicalRecordById, 
  updateMedicalRecord, 
  deleteMedicalRecord 
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
router.get("/medical-records/:id", protectUser, getMedicalRecordById);
router.patch("/medical-records/:id", protectUser, updateMedicalRecord);
router.delete("/medical-records/:id", protectUser, deleteMedicalRecord);

router.post("/addmen",protectUser,recordPeriodStart);
router.get("/tam",protectUser,getCurrentPhase);
router.get("/cycle",protectUser,getCycleHistory)
export default router;