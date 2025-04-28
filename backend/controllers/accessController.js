import User from "../models/User.js";
import MedicalRecord from "../models/MedicalRecord.js";

// Doctor sends request to patient
export const sendAccessRequest = async (req, res) => {
  try {
    const doctorId = req.user._id;
    const { patientEmail } = req.body;
    // Searching the patient by their email
    const patient = await User.findOne({ email: patientEmail });
    if (!patient) return res.status(404).json({ message: "Patient not found" });
    // verify if the user is a patient
    if (patient.role !== "patient") 
      return res.status(400).json({ message: "This email does not belong to a patient" });
    // check if req already sent
    const existingRequest = patient.accessRequests.find(
      (req) => req.doctor.toString() === doctorId.toString()
    );
    
    if (existingRequest) {
      // if requested, but denied allow to send again
      if (existingRequest.status === "denied") {
        existingRequest.status = "pending";
        existingRequest.requestedAt = new Date();
      } else {
        return res.status(400).json({ 
          message: existingRequest.status === "approved" 
            ? "You already have access to this patient's data" 
            : "Request already sent and pending"
        });
      }
    } else {
      // Add request to patient's accessRequests array
      patient.accessRequests.push({ 
        doctor: doctorId, 
        status: "pending",
        requestedAt: new Date()
      });
    }
    
    await patient.save();

    // Emit socket event if available
    if (req.io) {
      const patientSocketId = req.app.locals.activeUsers?.get(patient._id.toString());
      if (patientSocketId) {
        req.io.to(patientSocketId).emit("accessRequest", { 
          doctorId, 
          doctorName: req.user.firstName + " " + req.user.lastName,
          specialization: req.user.doctorProfile?.specialization || "",
          message: "A doctor has requested access to your medical records" 
        });
      }
    }

    res.status(200).json({ message: "Access request sent successfully" });
  } catch (error) {
    console.error("Error sending access request:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// patient respond to access request
export const respondToAccessRequest = async (req, res) => {
  try {
    const patientId = req.user._id;
    const { doctorId, granted } = req.body;

    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== "doctor") 
      return res.status(404).json({ message: "Doctor not found" });

    const patient = await User.findById(patientId);

    // find req in patient accessRequests
    const requestIndex = patient.accessRequests.findIndex(
      req => req.doctor.toString() === doctorId.toString()
    );
    
    if (requestIndex === -1) 
      return res.status(404).json({ message: "Access request not found" });

    // Update status
    patient.accessRequests[requestIndex].status = granted ? "approved" : "denied";

    // If approved, add doctor to approvedDoctors array if not already there
    if (granted) {
      if (!patient.approvedDoctors.includes(doctorId)) {
        patient.approvedDoctors.push(doctorId);
      }
    } else {
      // If denied, remove from approvedDoctors if present
      patient.approvedDoctors = patient.approvedDoctors.filter(
        id => id.toString() !== doctorId.toString()
      );
    }

    await patient.save();

    // Emit socket event if available
    if (req.io) {
      const doctorSocketId = req.app.locals.activeUsers?.get(doctorId.toString());
      if (doctorSocketId) {
        req.io.to(doctorSocketId).emit("accessRequestResponse", { 
          patientId,
          patientName: patient.firstName + " " + patient.lastName, 
          granted,
          message: `Patient has ${granted ? 'approved' : 'denied'} your access request` 
        });
      }
    }

    res.status(200).json({ 
      message: `Access request ${granted ? 'approved' : 'denied'} successfully` 
    });
  } catch (error) {
    console.error("Error responding to access request:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Patient revokes doctor's access
export const revokeAccess = async (req, res) => {
  try {
    const patientId = req.user._id;
    const { doctorId } = req.body;

    // Update the patient document to remove doctor from approvedDoctors
    const patient = await User.findByIdAndUpdate(patientId, 
      { 
        $pull: { approvedDoctors: doctorId },
        $set: { 
          "accessRequests.$[elem].status": "revoked" 
        }
      },
      { 
        arrayFilters: [{ "elem.doctor": doctorId }],
        new: true 
      }
    );

    if (!patient) return res.status(404).json({ message: "Patient not found" });

    // Emit socket event if available
    if (req.io) {
      const doctorSocketId = req.app.locals.activeUsers?.get(doctorId.toString());
      if (doctorSocketId) {
        req.io.to(doctorSocketId).emit("accessRevoked", { 
          patientId,
          patientName: patient.firstName + " " + patient.lastName,
          message: "A patient has revoked your access to their records" 
        });
      }
    }

    res.status(200).json({ message: "Doctor access revoked successfully" });
  } catch (error) {
    console.error("Error revoking access:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Doctor checks if they have access to a specific patient
export const checkAccess = async (req, res) => {
  try {
    const doctorId = req.user._id;
    const { patientId } = req.params;

    const patient = await User.findById(patientId);
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    const hasAccess = patient.approvedDoctors.includes(doctorId);
    const requestStatus = patient.accessRequests.find(
      req => req.doctor.toString() === doctorId.toString()
    )?.status || "none";

    res.status(200).json({ hasAccess, requestStatus });
  } catch (error) {
    console.error("Error checking access:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Search patient by email (for doctors)
export const searchPatientByEmail = async (req, res) => {
  try {
    const { email } = req.query;
    
    if (!email) {
      return res.status(400).json({ message: "Please provide an email to search" });
    }
    
    const patient = await User.findOne({
      email: email,
      role: "patient"
    }).select("_id firstName lastName email");
    
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    
    res.status(200).json({ patient });
  } catch (error) {
    console.error("Error searching patient:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Get list of doctors with access to patient data (for patient)
export const getDoctorsWithAccess = async (req, res) => {
  try {
    const patientId = req.user._id;
    
    const patient = await User.findById(patientId)
      .populate('approvedDoctors', 'firstName lastName email doctorProfile profileImage');
    
    if (!patient) return res.status(404).json({ message: "Patient not found" });
    
    res.status(200).json({ doctors: patient.approvedDoctors });
  } catch (error) {
    console.error("Error getting doctors with access:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Get pending access requests (for patient)
export const getPendingRequests = async (req, res) => {
  try {
    const patientId = req.user._id;
    
    const patient = await User.findById(patientId)
      .populate({
        path: 'accessRequests.doctor',
        select: 'firstName lastName email doctorProfile profileImage'
      });
    
    if (!patient) return res.status(404).json({ message: "Patient not found" });
    
    res.status(200).json({ requests: patient.accessRequests });
  } catch (error) {
    console.error("Error getting access requests:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Get patient's data (for doctors with access)
export const getPatientData = async (req, res) => {
  try {
    const doctorId = req.user._id;
    const { patientId } = req.params;
    
    // Find patient and check if doctor has access
    const patient = await User.findById(patientId);
    if (!patient) return res.status(404).json({ message: "Patient not found" });
    
    if (!patient.approvedDoctors.includes(doctorId)) {
      return res.status(403).json({ message: "You don't have access to this patient's data" });
    }
    
    // Get patient's medical records
    const medicalRecords = await MedicalRecord.find({ user: patientId });
    
    // Return limited patient info + medical records
    const patientData = {
      _id: patient._id,
      name: `${patient.firstName} ${patient.middleName || ''} ${patient.lastName}`.trim(),
      email: patient.email,
      phone: patient.phone,
      gender: patient.gender,
      age: patient.dateOfBirth ? Math.floor((new Date() - new Date(patient.dateOfBirth)) / (365.25 * 24 * 60 * 60 * 1000)) : null,
      bloodGroup: patient.bloodGroup,
      height: patient.height,
      weight: patient.weight,
      bodyMassIndex: patient.bodyMassIndex,
      medicalRecords
    };
    
    res.status(200).json(patientData);
  } catch (error) {
    console.error("Error getting patient data:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Get my patients (doctors only)
export const getMyPatients = async (req, res) => {
  try {
    const doctorId = req.user._id;
    
    // Find all patients who have approved this doctor
    const patients = await User.find({
      approvedDoctors: doctorId,
      role: "patient"
    }).select("_id firstName lastName email phone gender dateOfBirth");
    
    res.status(200).json({ patients });
  } catch (error) {
    console.error("Error getting doctor's patients:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};