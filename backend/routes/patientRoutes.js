import express from  'express';
const router = express.Router();
import {addMedicalHistory, deleteMedicalRecord, getMedicalHistory, getUserProfile, updateUserProfile} from "../controllers/patientController.js"
import protectUser from "../middlewares/protectUser.js"
router.get("/get-profile",protectUser,getUserProfile);
router.post("/update-profile",protectUser,updateUserProfile);
router.post("/add-medical-record",protectUser,addMedicalHistory);
router.get("/get-medical-history",protectUser,getMedicalHistory);
router.post("/delete-medical-record",protectUser,deleteMedicalRecord);

export default router;