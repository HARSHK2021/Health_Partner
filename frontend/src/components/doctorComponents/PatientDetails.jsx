import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  User,
  Clipboard,
  Activity,
  Calendar,
  Weight,
  Ruler,
  Heart,
  ArrowLeft,
  Clock,
  AlertCircle,
} from "lucide-react";
import axios from "axios";
import { CMH_ROUTES } from "../../cmhRoutes/cmh.routes";
import { format } from "date-fns";

const PatientDetails = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        setLoading(true);
        console.log("=== PATIENT DETAILS DEBUG ===");
        console.log("Patient ID from URL params:", patientId);
        console.log("Token exists:", !!token);
        console.log("VITE_BASE_URL:", import.meta.env.VITE_BASE_URL);
        console.log("CMH_ROUTES.GET_PATIENT_DATA:", CMH_ROUTES.GET_PATIENT_DATA);
        console.log("Full API URL:", `${CMH_ROUTES.GET_PATIENT_DATA}/${patientId}`);

        if (!patientId) {
          console.error("Invalid patient ID format:", patientId);
          setError("Invalid patient ID format");
          return;
        }

        const response = await axios.get(
          `${CMH_ROUTES.GET_PATIENT_DATA}/${patientId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPatient(response.data);
        console.log("Patient data fetched successfully:", response.data);
      } catch (err) {
        console.error("=== FETCH PATIENT ERROR ===");
        console.error("Status Code:", err.response?.status);
        console.error("Status Text:", err.response?.statusText);
        console.error("Response Data:", err.response?.data);
        console.error("Request URL:", err.config?.url);
        console.error("Request Method:", err.config?.method);
        console.error("Request Headers:", err.config?.headers);
        console.error("Full Error Object:", err);
        setError(err.response?.data?.message || "Failed to load patient data");
        if (err.response?.status === 404) {
          setError(
            "Patient not found or you may not have access to view this patient"
          );
        } else if (err.response?.status === 401) {
          setError("Unauthorized access. Please login again.");
        } else if (err.response?.status === 403) {
          setError("You do not have permission to view this patient");
        } else {
          setError(
            err.response?.data?.message || "Failed to load patient data"
          );
        }
      } finally {
        setLoading(false);
      }
    };

    if (patientId && token) {
      fetchPatientData();
    } else {
      console.log("Missing requirements for API call:", {
        patientId: !!patientId,
        token: !!token,
        patientIdValue: patientId,
      });
      setLoading(false);
      setError("Missing patient ID or authentication token");
    }
  }, [patientId, token]);
  const handleBack = () => {
    navigate("/doctor-dashboard/managepatients");
  };

  const handleRecordClick = (record) => {
    setSelectedRecord(record);
  };

  const handleBackToRecords = () => {
    setSelectedRecord(null);
  };

  const getStatusColor = (status) => {
    return status === "recovered"
      ? "bg-green-100 text-green-800"
      : status === "critical"
      ? "bg-red-100 text-red-800"
      : "bg-yellow-100 text-yellow-800";
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 p-4 rounded-lg text-red-700 flex items-center gap-3">
          <AlertCircle />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="p-8">
        <div className="bg-yellow-50 p-4 rounded-lg text-yellow-700 flex items-center gap-3">
          <AlertCircle />
          <span>No patient data found</span>
        </div>
      </div>
    );
  }

  // Detailed view of a specific medical record
  if (selectedRecord) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <button
          onClick={handleBackToRecords}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Records
        </button>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                {selectedRecord.condition}
              </h2>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  selectedRecord.recoveryStatus
                )}`}
              >
                {selectedRecord.recoveryStatus.charAt(0).toUpperCase() +
                  selectedRecord.recoveryStatus.slice(1)}
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center text-gray-600">
                <Calendar className="w-5 h-5 mr-2" />
                <span>
                  Diagnosed:{" "}
                  {format(
                    new Date(selectedRecord.dateDiagnosed),
                    "MMM dd, yyyy"
                  )}
                </span>
              </div>

              {selectedRecord.symptoms?.length > 0 && (
                <div className="flex items-start text-gray-600">
                  <Activity className="w-5 h-5 mr-2 mt-1" />
                  <div className="flex flex-wrap gap-2">
                    {selectedRecord.symptoms.map((symptom, idx) => (
                      <span
                        key={idx}
                        className="bg-gray-100 px-3 py-1.5 rounded-md text-sm"
                      >
                        {symptom}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {selectedRecord.medicines?.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-medium text-gray-900 mb-4">
                  Medicines
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedRecord.medicines.map((medicine, idx) => (
                    <div key={idx} className="bg-gray-50 p-4 rounded-lg">
                      <div className="font-medium text-gray-900">
                        {medicine.name}
                      </div>
                      <div className="text-sm text-gray-600 mt-2">
                        {medicine.dosage && (
                          <div>Dosage: {medicine.dosage}</div>
                        )}
                        {medicine.frequency && (
                          <div>Frequency: {medicine.frequency}</div>
                        )}
                        {medicine.duration && (
                          <div>Duration: {medicine.duration}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedRecord.additionalNotes && (
              <div className="mt-8">
                <h3 className="text-xl font-medium text-gray-900 mb-4">
                  Additional Notes
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">
                    {selectedRecord.additionalNotes}
                  </p>
                </div>
              </div>
            )}

            {(selectedRecord.prescriptionImages?.length > 0 ||
              selectedRecord.medicalReports?.length > 0) && (
              <div className="mt-8">
                <h3 className="text-xl font-medium text-gray-900 mb-4">
                  Documents
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {selectedRecord.prescriptionImages?.map((image, idx) => (
                    <a
                      key={idx}
                      href={image}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-100 text-blue-700 px-4 py-3 rounded-lg text-center hover:bg-blue-200 transition-colors"
                    >
                      View Prescription {idx + 1}
                    </a>
                  ))}
                  {selectedRecord.medicalReports?.map((report, idx) => (
                    <a
                      key={idx}
                      href={report}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-purple-100 text-purple-700 px-4 py-3 rounded-lg text-center hover:bg-purple-200 transition-colors"
                    >
                      View Report {idx + 1}
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="w-4 h-4 mr-1" />
                <span>
                  Created{" "}
                  {format(new Date(selectedRecord.createdAt), "MMM dd, yyyy")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <button
        onClick={handleBack}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Patients
      </button>

      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="flex items-start gap-6">
          <div className="h-20 w-20 bg-blue-100 rounded-full flex items-center justify-center">
            <User size={32} className="text-blue-600" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">{patient.name}</h1>
            <p className="text-gray-600">
              {patient.email} • {patient.phone}
            </p>

            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <Weight className="w-5 h-5 text-gray-500" />
                <span>{patient.weight || "N/A"} kg</span>
              </div>

              <div className="flex items-center gap-2">
                <Ruler className="w-5 h-5 text-gray-500" />
                <span>{patient.height || "N/A"} cm</span>
              </div>

              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-gray-500" />
                <span>BMI: {patient.bodyMassIndex || "N/A"}</span>
              </div>

              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-gray-500" />
                <span>Blood: {patient.bloodGroup || "N/A"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center gap-3 mb-6">
          <Clipboard className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold">Medical Records</h2>
        </div>

        {patient.medicalRecords?.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-7xl mb-4">📋</div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              No records yet
            </h3>
            <p className="text-gray-500">
              This patient hasn't added any medical records yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {patient.medicalRecords?.map((record) => (
              <div
                key={record._id}
                className="bg-gray-50 rounded-xl shadow-lg border border-gray-200 overflow-hidden cursor-pointer transition-transform hover:scale-105"
                onClick={() => handleRecordClick(record)}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-semibold text-lg text-gray-900">
                      {record.condition}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        record.recoveryStatus
                      )}`}
                    >
                      {record.recoveryStatus.charAt(0).toUpperCase() +
                        record.recoveryStatus.slice(1)}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>
                        {format(new Date(record.dateDiagnosed), "MMM dd, yyyy")}
                      </span>
                    </div>

                    {record.symptoms?.length > 0 && (
                      <div className="flex items-start text-gray-600">
                        <Activity className="w-4 h-4 mr-2 mt-1" />
                        <div className="flex flex-wrap gap-1">
                          {record.symptoms.slice(0, 2).map((symptom, idx) => (
                            <span
                              key={idx}
                              className="bg-gray-100 px-2 py-1 rounded-md text-xs"
                            >
                              {symptom}
                            </span>
                          ))}
                          {record.symptoms.length > 2 && (
                            <span className="bg-gray-100 px-2 py-1 rounded-md text-xs">
                              +{record.symptoms.length - 2} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDetails;
