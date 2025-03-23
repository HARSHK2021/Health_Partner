import express from "express";
import { getPatientData, respondToAccessRequest, searchPatient, sendAccessRequest } from "../controllers/accessController.js";


const router = express.Router();

router.post("/request", sendAccessRequest);
router.post("/respond", respondToAccessRequest);
router.get("/patient/:patientId", getPatientData);
router.get("/search", searchPatient);

export default router;
