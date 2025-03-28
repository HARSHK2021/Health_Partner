import express from  'express';
import protectUser from "../middlewares/protectUser.js"
import { getUserProfile } from '../controllers/doctorController.js';
const router = express.Router();



router.get("/get-profile",protectUser,getUserProfile);



export default router;