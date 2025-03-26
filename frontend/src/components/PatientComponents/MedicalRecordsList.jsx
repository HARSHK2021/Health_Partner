import React, { useState } from "react";
import { format } from "date-fns";
import {
  Clock,
  Calendar,
  User,
  Home,
  FileText,
  Activity,
  ArrowLeft,
  ScanHeart,
  Stethoscope,
} from "lucide-react";

const MedicalRecordsList = ({ records = [] }) => {
  const [selectedRecord, setSelectedRecord] = useState(null);

  const getStatusColor = (status) => {
    return status === "recovered"
      ? "bg-green-100 text-green-800"
      : "bg-yellow-100 text-yellow-800";
  };

  const handleCardClick = (record) => {
    setSelectedRecord(record);
  };

  const handleBack = () => {
    setSelectedRecord(null);
  };
 
  if (selectedRecord) {
    return (
      <div className=" mt-5 rounded-2xl shadow-2xl border-gray-200 min-h-screen  bg-gradient-to-br from-indigo-200 to-purple-100 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={handleBack}
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

                {selectedRecord.symptoms.length > 0 && (
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

                {selectedRecord.doctor && (
                  <div className="flex items-center text-gray-600">
                    <User className="w-5 h-5 mr-2" />
                    <span>Dr. {selectedRecord.doctor}</span>
                  </div>
                )}

                {selectedRecord.hospital && (
                  <div className="flex items-center text-gray-600">
                    <Home className="w-5 h-5 mr-2" />
                    <span>{selectedRecord.hospital}</span>
                  </div>
                )}
              </div>

              {selectedRecord.medicines.length > 0 && (
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
                    <div className="flex items-start text-gray-600">
                      <FileText className="w-5 h-5 mr-2 mt-1" />
                      <p>{selectedRecord.additionalNotes}</p>
                    </div>
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
      </div>
    );
  }

  return (
    <div className=" mt-5 rounded-2xl shadow-2xl border-gray-200 min-h-screen bg-gray-300 py-8">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-5 flex items-center justify-center gap-4 p-6 bg-white border border-gray-200 shadow-md rounded-lg">
          <Stethoscope className="w-10 h-10 text-blue-800" />
          <h1 className="text-3xl font-bold text-gray-900">Medical Records</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {records.map((record, index) => (
            <div
              key={index}
              className="bg-gray-100 rounded-xl shadow-2xl border border-gray-300 overflow-hidden cursor-pointer transform transition-transform hover:scale-105"
              onClick={() => handleCardClick(record)}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {record.condition}
                  </h2>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      record.recoveryStatus
                    )}`}
                  >
                    {record.recoveryStatus.charAt(0).toUpperCase() +
                      record.recoveryStatus.slice(1)}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-5 h-5 mr-2" />
                    <span>
                      Diagnosed:{" "}
                      {format(new Date(record.dateDiagnosed), "MMM dd, yyyy")}
                    </span>
                  </div>

                  {record.symptoms.length > 0 && (
                    <div className="flex items-start text-gray-600">
                      <Activity className="w-5 h-5 mr-2 mt-1" />
                      <div className="flex flex-wrap gap-2">
                        {record.symptoms.slice(0, 2).map((symptom, idx) => (
                          <span
                            key={idx}
                            className="bg-gray-100 px-2 py-1 rounded-md text-sm"
                          >
                            {symptom}
                          </span>
                        ))}
                        {record.symptoms.length > 2 && (
                          <span className="bg-gray-100 px-2 py-1 rounded-md text-sm">
                            +{record.symptoms.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {record.doctor && (
                    <div className="flex items-center text-gray-600">
                      <User className="w-5 h-5 mr-2" />
                      <span>Dr. {record.doctor}</span>
                    </div>
                  )}

                  {record.hospital && (
                    <div className="flex items-center text-gray-600">
                      <Home className="w-5 h-5 mr-2" />
                      <span>{record.hospital}</span>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-300">
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>
                      Created{" "}
                      {format(new Date(record.createdAt), "MMM dd, yyyy")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {records.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No medical records found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalRecordsList;
