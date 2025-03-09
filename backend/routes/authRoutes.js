import express from  'express';
const router = express.Router();

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
router.post("/request-email-otp", requestEmailOTP);
router.post("/verify-email-otp", verifyEmailOTP);

// phone OTP verification routes

router.post("/request-phone-otp", requestPhoneOTP);
router.post("/verify-phone-otp", verifyPhoneOTP);

export default router;