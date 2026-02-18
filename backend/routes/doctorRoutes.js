import express from  'express';
import protectUser from "../middlewares/protectUser.js"
import { getUserProfile, getAllDoctors, getAllDoctorsSimple, debugDoctorProfiles } from '../controllers/doctorController.js';
const router = express.Router();

// Get authenticated doctor's profile
router.get("/get-profile", protectUser, getUserProfile);

// Get all doctors (with role check)
router.get("/all-doctors", getAllDoctors);

// Get all doctors (simple version - no role check)
router.get("/all-doctors-simple", getAllDoctorsSimple);

// Debug endpoint
router.get("/debug-profiles", debugDoctorProfiles);

export default router;