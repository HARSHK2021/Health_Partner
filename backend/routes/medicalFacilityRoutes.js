import express from  'express';
import protect from "../middlewares/medicalFacilityMiddleware.js"


import {registerMedicalFacility,requestVerificationMedicalFacility,verifyMedicalFacility } from "../controllers/medicalFacalityController.js"

const router = express.Router();

//refgister
router.post('/register-medical-facility', registerMedicalFacility);

//request verification

router.post('/request-verification', protect, requestVerificationMedicalFacility);

//verify

router.post('/verify', protect, verifyMedicalFacility);

export default router;