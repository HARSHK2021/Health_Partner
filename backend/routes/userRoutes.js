import express from  'express';
import protectUser from "../middlewares/protectUser.js"
import { findNearbyHospitals } from '../controllers/userController.js';

const router = express.Router();


router.get("/nearByHospital",findNearbyHospitals)


export default router;