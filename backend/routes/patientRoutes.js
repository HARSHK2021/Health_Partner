import express from  'express';
const router = express.Router();
import { getUserProfile, updateUserProfile} from "../controllers/patientController.js"
import protectUser from "../middlewares/protectUser.js"

router.get("/get-profile",protectUser,getUserProfile);
router.post("/update-profile",protectUser,updateUserProfile);


export default router;