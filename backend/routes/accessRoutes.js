import express from 'express';
import { 
  sendAccessRequest, 
  respondToAccessRequest, 
  revokeAccess,
  checkAccess,
  searchPatientByEmail,
  getDoctorsWithAccess,
  getPendingRequests,
  getPatientData,
  getMyPatients
} from '../controllers/accessController.js';
import protectUser from '../middlewares/protectUser.js';

const router = express.Router();

// Helper middleware for role checking
const isDoctor = (req, res, next) => {
  if (req.user && req.user.role === 'doctor') {
    return next();
  }
  return res.status(403).json({ message: 'Access denied, doctor role required' });
};

const isPatient = (req, res, next) => {
  if (req.user && req.user.role === 'patient') {
    return next();
  }
  return res.status(403).json({ message: 'Access denied, patient role required' });
};

// Doctor routes
router.post('/request', protectUser, isDoctor, sendAccessRequest);
router.get('/check/:patientId', protectUser, isDoctor, checkAccess);
router.get('/patient/:patientId', protectUser, isDoctor, getPatientData);
router.get('/search', protectUser, isDoctor, searchPatientByEmail);
router.get('/mypatients', protectUser, isDoctor, getMyPatients);

// Patient routes
router.post('/respond', protectUser, isPatient, respondToAccessRequest);
router.post('/revoke', protectUser, isPatient, revokeAccess);
router.get('/doctors', protectUser, isPatient, getDoctorsWithAccess);
router.get('/requests', protectUser, isPatient, getPendingRequests);

export default router;
