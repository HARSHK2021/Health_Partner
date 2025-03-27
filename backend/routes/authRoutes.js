import express from  'express';
const router = express.Router();
import protectUser from "../middlewares/protectUser.js"
import protectFacility from "../middlewares/protectFacility.js"
import { 
    signup, 
    login, 
    registerMedicalFacility,
    loginFacility,
    requestEmailOTP, 
    verifyEmailOTP, 
    requestPhoneOTP, 
    verifyPhoneOTP, 
    signout, 
    forgotPassword,
    resetPassword,

} from "../controllers/authcontroller.js"
import { getUser } from '../controllers/userController.js';
import { getFacility } from '../controllers/medicalFacilityController.js';
/// user authentication routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/signout", signout);
router.post("/forgot-password",forgotPassword);
router.post("/reset-password",resetPassword);
router.post("/register-medical-facility",registerMedicalFacility);
router.post('/login-facility',loginFacility );
// email OTP verification routes
//get user with id for verification
router.get("/getuser/:userID",getUser);
router.get("/getfacility/:userID",getFacility);
router.post("/request-email-otp", requestEmailOTP);
router.post("/verify-email-otp", verifyEmailOTP);
// phone OTP verification routes
router.post("/request-phone-otp", requestPhoneOTP);
router.post("/verify-phone-otp",verifyPhoneOTP);



export default router;