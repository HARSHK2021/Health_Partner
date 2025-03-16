import express from  'express';
import protect from "../middlewares/medicalFacilityMiddleware.js"


import {loginFacility, registerMedicalFacility,requestVerificationMedicalFacility,verifyMedicalFacility } from "../controllers/medicalFacilityController.js"

const router = express.Router();

//register
router.post('/register-medical-facility', registerMedicalFacility);

//request verification

router.post('/request-verification', protect, requestVerificationMedicalFacility);

//verify

router.post('/verify', protect, verifyMedicalFacility);
router.post('/login-facility',loginFacility )

export default router;