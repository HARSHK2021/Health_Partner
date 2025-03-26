import express from  'express';
const router = express.Router();
import { getUserProfile, updateUserProfile} from "../controllers/patientController.js"
import protectUser from "../middlewares/protectUser.js"
import { 
  uploadMedicalRecord, 
  getAllMedicalRecords, 
  getMedicalRecordById, 
  updateMedicalRecord, 
  deleteMedicalRecord 
} from "../controllers/patientController.js";

import multer from 'multer';
const storage = multer.memoryStorage();
const load = multer({ storage });

//Profile
router.get("/get-profile",protectUser,getUserProfile);
router.post("/update-profile",protectUser,updateUserProfile);

//Medical Records
router.post("/medical-records", protectUser, load.array("images", 5), uploadMedicalRecord);
router.get("/medical-records", protectUser, getAllMedicalRecords);
router.get("/medical-records/:id", protectUser, getMedicalRecordById);
router.patch("/medical-records/:id", protectUser, updateMedicalRecord);
router.delete("/medical-records/:id", protectUser, deleteMedicalRecord);



export default router;