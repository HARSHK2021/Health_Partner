import express from  'express';
const router = express.Router();
import {protect} from "../middlewares/authMiddleware.js"

import { 
    signup, 
    login, 
    requestEmailOTP, 
    verifyEmailOTP, 
    requestPhoneOTP, 
    verifyPhoneOTP, 
    signout ,

} from "../controllers/authcontroller.js"
/// user authentication routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/signout", signout);


// email OTP verification routes
router.post("/request-email-otp",protect, requestEmailOTP);
router.post("/verify-email-otp",protect, verifyEmailOTP);

// phone OTP verification routes

router.post("/request-phone-otp",protect, requestPhoneOTP);
router.post("/verify-phone-otp", protect,verifyPhoneOTP);

export default router;