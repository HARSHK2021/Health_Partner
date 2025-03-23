import User from "../models/User.js"
/**
 * @desc   Send an access request (Doctor → Patient)
 * @route  POST /api/v1/access/request
 * @access Private (Only Doctors)
 */
export const sendAccessRequest = async (req, res) => {
    try {
        const { doctorId, patientId } = req.body;

        // Validate doctor and patient existence
        const doctor = await User.findById(doctorId);
        const patient = await User.findById(patientId);

        if (!doctor || !patient) return res.status(404).json({ message: "Doctor or Patient not found" });

        if (doctor.role !== "doctor") return res.status(403).json({ message: "Only doctors can request access" });

        // Check if a request already exists
        const existingRequest = patient.accessRequests.find(req => req.doctor.toString() === doctorId);
        if (existingRequest) return res.status(400).json({ message: "Access request already sent" });

        // Add request to patient's accessRequests array
        patient.accessRequests.push({ doctor: doctorId, status: "pending" });
        await patient.save();

        // Emit event via Socket.IO (Patient receives real-time notification)
        req.io.to(patientId).emit("receiveAccessRequest", { doctorId, patientId });

        res.status(200).json({ message: "Access request sent successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
};



/**
 * @desc   Respond to an access request (Patient Approves/Denies)
 * @route  POST /api/v1/access/respond
 * @access Private (Only Patients)
 */
export const respondToAccessRequest = async (req, res) => {
    try {
        const { patientId, doctorId, granted } = req.body;

        const patient = await User.findById(patientId);
        const doctor = await User.findById(doctorId);

        if (!patient || !doctor) return res.status(404).json({ message: "Doctor or Patient not found" });

        // Find the request in the patient's accessRequests array
        const requestIndex = patient.accessRequests.findIndex(req => req.doctor.toString() === doctorId);
        if (requestIndex === -1) return res.status(404).json({ message: "Access request not found" });

        // Update request status
        patient.accessRequests[requestIndex].status = granted ? "approved" : "denied";

        // If approved, add the doctor to `approvedDoctors`
        if (granted) {
            patient.approvedDoctors.push(doctorId);
        }

        await patient.save();

        // Emit event via Socket.IO (Doctor gets notified of response)
        req.io.to(doctorId).emit("accessRequestResponse", { patientId, granted });

        res.status(200).json({ message: `Access ${granted ? "granted" : "denied"} successfully` });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
};



/**
 * @desc   Fetch patient data (Only for approved doctors)
 * @route  GET /api/v1/access/patient/:patientId
 * @access Private (Only Approved Doctors)
 */
export const getPatientData = async (req, res) => {
    try {
        const { doctorId } = req.user;
        const { patientId } = req.params;

        const patient = await User.findById(patientId).populate("medicalHistory.doctor", "name specialization");
        if (!patient) return res.status(404).json({ message: "Patient not found" });

        // Check if doctor has access
        if (!patient.approvedDoctors.includes(doctorId)) {
            return res.status(403).json({ message: "Access denied. You are not approved to view this patient's data" });
        }

        res.status(200).json(patient.medicalHistory);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
};


/**
 * @desc   Search for a patient by tag number or phone
 * @route  GET /api/v1/access/search
 * @access Private (Doctors)
 */
export const searchPatient = async (req, res) => {
    try {
        const { query } = req.query;

        // Search by tagNumber or phone
        const patient = await User.findOne({
            $or: [{ tagNumber: query }, { phone: query }],
        });

        if (!patient) return res.status(404).json({ message: "Patient not found" });

        res.status(200).json(patient);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
};