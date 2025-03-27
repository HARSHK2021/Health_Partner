// import { useState } from 'react';
// import { format } from 'date-fns';
// import { Plus, Trash2,  AlertCircle, CogIcon, UploadIcon } from "lucide-react"

// const AddMedicalRecord = () => {
//   const [formData, setFormData] = useState({
//     condition: '',
//     dateDiagnosed: format(new Date(), 'yyyy-MM-dd'),
//     recoveryStatus: 'ongoing',
//     symptoms: '',
//     medicines: [{
//       name: '',
//       dosage: '',
//       frequency: '',
//       duration: ''
//     }],
//     doctor: '',
//     hospital: '',
//     additionalNotes: '',
//     prescriptionImages: [],
//     medicalReports: []
//   });
//   const [errors, setErrors] = useState({});
//   const [selectedFiles, setSelectedFiles] = useState({
//     prescriptionImages: [],
//     medicalReports: []
//   });

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//     if (errors[name]) {
//       setErrors(prev => ({
//         ...prev,
//         [name]: ''
//       }));
//     }
//   };

//   const handleMedicineChange = (index, field, value) => {
//     const updatedMedicines = formData.medicines.map((medicine, i) => {
//       if (i === index) {
//         return { ...medicine, [field]: value };
//       }
//       return medicine;
//     });

//     setFormData(prev => ({
//       ...prev,
//       medicines: updatedMedicines
//     }));
//   };

//   const addMedicine = () => {
//     setFormData(prev => ({
//       ...prev,
//       medicines: [...prev.medicines, { name: '', dosage: '', frequency: '', duration: '' }]
//     }));
//   };

//   const removeMedicine = (index) => {
//     setFormData(prev => ({
//       ...prev,
//       medicines: prev.medicines.filter((_, i) => i !== index)
//     }));
//   };

//   const handleFileChange = (e, field) => {
//     const files = Array.from(e.target.files);
//     setSelectedFiles(prev => ({
//       ...prev,
//       [field]: [...prev[field], ...files]
//     }));
//   };

//   const removeFile = (field, index) => {
//     setSelectedFiles(prev => ({
//       ...prev,
//       [field]: prev[field].filter((_, i) => i !== index)
//     }));
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.condition.trim()) {
//       newErrors.condition = 'Condition is required';
//     }

//     if (!formData.dateDiagnosed) {
//       newErrors.dateDiagnosed = 'Date diagnosed is required';
//     }

//     formData.medicines.forEach((medicine, index) => {
//       if (!medicine.name.trim()) {
//         newErrors[`medicine-${index}-name`] = 'Medicine name is required';
//       }
//     });

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) {
//       return;
//     }

//     try {
//       const formattedData = {
//         ...formData,
//         symptoms: formData.symptoms.split(',').map(s => s.trim()),
//         medicines: formData.medicines.map(medicine => ({
//           ...medicine,
//           takenAt: []
//         }))
//       };

//       console.log('Submitting data:', formattedData);
//       // Add your API call here

//       setFormData({
//         condition: '',
//         dateDiagnosed: format(new Date(), 'yyyy-MM-dd'),
//         recoveryStatus: 'ongoing',
//         symptoms: '',
//         medicines: [{ name: '', dosage: '', frequency: '', duration: '' }],
//         doctor: '',
//         hospital: '',
//         additionalNotes: '',
//         prescriptionImages: [],
//         medicalReports: []
//       });
//       setSelectedFiles({
//         prescriptionImages: [],
//         medicalReports: []
//       });
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       setErrors(prev => ({
//         ...prev,
//         submit: 'Failed to submit the form. Please try again.'
//       }));
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-300">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
//           <div className="p-6 sm:p-8">
//             <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
//               Add Medical Record
//             </h1>

//             {errors.submit && (
//               <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
//                 <div className="flex items-center">
//                   <AlertCircle className="mr-2" />
//                   {errors.submit}
//                 </div>
//               </div>
//             )}

//             <form onSubmit={handleSubmit} className="space-y-8">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Condition <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     name="condition"
//                     value={formData.condition}
//                     onChange={handleInputChange}
//                     className={`w-full px-4 py-2 rounded-lg border ${
//                       errors.condition ? 'border-red-500' : 'border-gray-300'
//                     } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
//                     placeholder="Enter medical condition"
//                   />
//                   {errors.condition && (
//                     <p className="mt-1 text-sm text-red-500">{errors.condition}</p>
//                   )}
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Date Diagnosed <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="date"
//                     name="dateDiagnosed"
//                     value={formData.dateDiagnosed}
//                     onChange={handleInputChange}
//                     className={`w-full px-4 py-2 rounded-lg border ${
//                       errors.dateDiagnosed ? 'border-red-500' : 'border-gray-300'
//                     } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
//                   />
//                   {errors.dateDiagnosed && (
//                     <p className="mt-1 text-sm text-red-500">{errors.dateDiagnosed}</p>
//                   )}
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Recovery Status
//                   </label>
//                   <select
//                     name="recoveryStatus"
//                     value={formData.recoveryStatus}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   >
//                     <option value="ongoing">Ongoing</option>
//                     <option value="recovered">Recovered</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Symptoms
//                   </label>
//                   <input
//                     type="text"
//                     name="symptoms"
//                     value={formData.symptoms}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     placeholder="Enter symptoms (comma separated)"
//                   />
//                 </div>
//               </div>

//               <div className="border-t border-gray-200 pt-8">
//                 <h2 className="text-xl font-semibold text-gray-900 mb-6">Medicines</h2>
//                 {formData.medicines.map((medicine, index) => (
//                   <div key={index} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
//                     <div>
//                       <input
//                         type="text"
//                         value={medicine.name}
//                         onChange={(e) => handleMedicineChange(index, 'name', e.target.value)}
//                         className={`w-full px-4 py-2 rounded-lg border ${
//                           errors[`medicine-${index}-name`] ? 'border-red-500' : 'border-gray-300'
//                         } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
//                         placeholder="Medicine name"
//                       />
//                       {errors[`medicine-${index}-name`] && (
//                         <p className="mt-1 text-sm text-red-500">{errors[`medicine-${index}-name`]}</p>
//                       )}
//                     </div>
//                     <input
//                       type="text"
//                       value={medicine.dosage}
//                       onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)}
//                       className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                       placeholder="Dosage"
//                     />
//                     <input
//                       type="text"
//                       value={medicine.frequency}
//                       onChange={(e) => handleMedicineChange(index, 'frequency', e.target.value)}
//                       className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                       placeholder="Frequency"
//                     />
//                     <div className="flex gap-2">
//                       <input
//                         type="text"
//                         value={medicine.duration}
//                         onChange={(e) => handleMedicineChange(index, 'duration', e.target.value)}
//                         className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                         placeholder="Duration"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => removeMedicine(index)}
//                         className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
//                         disabled={formData.medicines.length === 1}
//                       >
//                         <Trash2 size={20} />
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//                 <button
//                   type="button"
//                   onClick={addMedicine}
//                   className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
//                 >
//                   <Plus /> Add Medicine
//                 </button>
//               </div>

//               <div className="border-t border-gray-200 pt-8">
//                 <h2 className="text-xl font-semibold text-gray-900 mb-6">Additional Information</h2>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Doctor</label>
//                     <input
//                       type="text"
//                       name="doctor"
//                       value={formData.doctor}
//                       onChange={handleInputChange}
//                       className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                       placeholder="Doctor's name"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Hospital</label>
//                     <input
//                       type="text"
//                       name="hospital"
//                       value={formData.hospital}
//                       onChange={handleInputChange}
//                       className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                       placeholder="Hospital name"
//                     />
//                   </div>

//                   <div className="md:col-span-2">
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
//                     <textarea
//                       name="additionalNotes"
//                       value={formData.additionalNotes}
//                       onChange={handleInputChange}
//                       className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                       rows="4"
//                       placeholder="Any additional notes..."
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Upload Prescription</label>
//                     <div className="space-y-4">
//                       <label className="flex flex-col items-center px-4 py-6 bg-white border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
//                         <UploadIcon className="w-8 h-8 text-gray-400" />
//                         <span className="mt-2 text-sm text-gray-500">Select prescription images</span>
//                         <input
//                           type="file"
//                           className="hidden"
//                           multiple
//                           accept="image/*"
//                           onChange={(e) => handleFileChange(e, 'prescriptionImages')}
//                         />
//                       </label>
//                       {selectedFiles.prescriptionImages.length > 0 && (
//                         <div className="space-y-2">
//                           {selectedFiles.prescriptionImages.map((file, index) => (
//                             <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
//                               <span className="text-sm text-gray-600 truncate">{file.name}</span>
//                               <button
//                                 type="button"
//                                 onClick={() => removeFile('prescriptionImages', index)}
//                                 className="p-1 text-gray-500 hover:text-red-500"
//                               >
//                                 <CogIcon size={16} />
//                               </button>
//                             </div>
//                           ))}
//                         </div>
//                       )}
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Upload Medical Reports</label>
//                     <div className="space-y-4">
//                       <label className="flex flex-col items-center px-4 py-6 bg-white border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
//                         <UploadIcon className="w-8 h-8 text-gray-400" />
//                         <span className="mt-2 text-sm text-gray-500">Select medical reports</span>
//                         <input
//                           type="file"
//                           className="hidden"
//                           multiple
//                           onChange={(e) => handleFileChange(e, 'medicalReports')}
//                         />
//                       </label>
//                       {selectedFiles.medicalReports.length > 0 && (
//                         <div className="space-y-2">
//                           {selectedFiles.medicalReports.map((file, index) => (
//                             <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
//                               <span className="text-sm text-gray-600 truncate">{file.name}</span>
//                               <button
//                                 type="button"
//                                 onClick={() => removeFile('medicalReports', index)}
//                                 className="p-1 text-gray-500 hover:text-red-500"
//                               >
//                                 <CogIcon size={16} />
//                               </button>
//                             </div>
//                           ))}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="border-t border-gray-200 pt-8">
//                 <div className="flex justify-end">
//                   <button
//                     type="submit"
//                     className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
//                   >
//                     Save Medical Record
//                   </button>
//                 </div>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddMedicalRecord;

import { useState } from "react";
import { format } from "date-fns";
import axios from "axios";
import { Plus, Trash2, AlertCircle, CogIcon, UploadIcon } from "lucide-react";
import { CMH_ROUTES } from "../../cmhRoutes/cmh.routes";

const AddMedicalRecord = () => {
  const [formData, setFormData] = useState({
    condition: "",
    dateDiagnosed: format(new Date(), "yyyy-MM-dd"),
    recoveryStatus: "ongoing",
    symptoms: "",
    medicines: [
      {
        name: "",
        dosage: "",
        frequency: "",
        duration: "",
      },
    ],
    additionalNotes: "",
  });
  const [errors, setErrors] = useState({});
  const [selectedFiles, setSelectedFiles] = useState({
    prescriptionImages: [],
    medicalReports: [],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleMedicineChange = (index, field, value) => {
    const updatedMedicines = formData.medicines.map((medicine, i) => {
      if (i === index) {
        return { ...medicine, [field]: value };
      }
      return medicine;
    });

    setFormData((prev) => ({
      ...prev,
      medicines: updatedMedicines,
    }));
  };

  const addMedicine = () => {
    setFormData((prev) => ({
      ...prev,
      medicines: [
        ...prev.medicines,
        { name: "", dosage: "", frequency: "", duration: "" },
      ],
    }));
  };

  const removeMedicine = (index) => {
    setFormData((prev) => ({
      ...prev,
      medicines: prev.medicines.filter((_, i) => i !== index),
    }));
  };

  const handleFileChange = (e, field) => {
    const files = Array.from(e.target.files);
    setSelectedFiles((prev) => ({
      ...prev,
      [field]: [...prev[field], ...files],
    }));
  };

  const removeFile = (field, index) => {
    setSelectedFiles((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.condition.trim()) {
      newErrors.condition = "Condition is required";
    }

    if (!formData.dateDiagnosed) {
      newErrors.dateDiagnosed = "Date diagnosed is required";
    }

    formData.medicines.forEach((medicine, index) => {
      if (!medicine.name.trim()) {
        newErrors[`medicine-${index}-name`] = "Medicine name is required";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const formattedData = {
        ...formData,
        symptoms: formData.symptoms.split(",").map((s) => s.trim()),
        medicines: formData.medicines.map((medicine) => ({
          ...medicine,
          takenAt: [],
        })),
      };

      console.log("Submitting data:", formattedData);

      // Retrieve token and user ID from localStorage
      const token = localStorage.getItem("token");
      const ID = localStorage.getItem("id");

      if (!token) {
        console.error("Token is missing. Please log in again.");
        setErrors((prev) => ({
          ...prev,
          submit: "Authentication failed. Please log in again.",
        }));
        return;
      }

      if (!ID) {
        console.error("User ID is missing. Please log in again.");
        setErrors((prev) => ({
          ...prev,
          submit: "User ID is missing. Please log in again.",
        }));
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "User-ID": ID, // Custom header for user ID if required by the backend
      };

      console.log("Headers being sent:", headers);

      // Prepare form data for file uploads
      const formDataWithFiles = new FormData();
      Object.keys(formattedData).forEach((key) => {
        if (Array.isArray(formattedData[key])) {
          formattedData[key].forEach((item) =>
            formDataWithFiles.append(key, JSON.stringify(item))
          );
        } else {
          formDataWithFiles.append(key, formattedData[key]);
        }
      });

      selectedFiles.prescriptionImages.forEach((file) =>
        formDataWithFiles.append("prescriptionImages", file)
      );
      selectedFiles.medicalReports.forEach((file) =>
        formDataWithFiles.append("medicalReports", file)
      );

      // Make the API call
      const response = await axios.post(
        CMH_ROUTES.ADD_MEDICAL_RECORD,
        formDataWithFiles,
        { headers }
      );

      console.log("Response:", response);

      // Reset form data on successful submission
      setFormData({
        condition: "",
        dateDiagnosed: format(new Date(), "yyyy-MM-dd"),
        recoveryStatus: "ongoing",
        symptoms: "",
        medicines: [{ name: "", dosage: "", frequency: "", duration: "" }],
        additionalNotes: "",
      });
      setSelectedFiles({
        prescriptionImages: [],
        medicalReports: [],
      });
    } catch (error) {
      console.error("Error submitting form:", error);

      if (error.response && error.response.status === 401) {
        setErrors((prev) => ({
          ...prev,
          submit: "Authentication failed. Please log in again.",
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          submit: "Failed to submit the form. Please try again.",
        }));
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 sm:p-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
              Add Medical Record
            </h1>

            {errors.submit && (
              <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                <div className="flex items-center">
                  <AlertCircle className="mr-2" />
                  {errors.submit}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Condition <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="condition"
                    value={formData.condition}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      errors.condition ? "border-red-500" : "border-gray-300"
                    } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="Enter medical condition"
                  />
                  {errors.condition && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.condition}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date Diagnosed <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="dateDiagnosed"
                    value={formData.dateDiagnosed}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      errors.dateDiagnosed
                        ? "border-red-500"
                        : "border-gray-300"
                    } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  />
                  {errors.dateDiagnosed && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.dateDiagnosed}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recovery Status
                  </label>
                  <select
                    name="recoveryStatus"
                    value={formData.recoveryStatus}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="ongoing">Ongoing</option>
                    <option value="recovered">Recovered</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Symptoms
                  </label>
                  <input
                    type="text"
                    name="symptoms"
                    value={formData.symptoms}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter symptoms (comma separated)"
                  />
                </div>
              </div>

              <div className="border-t border-gray-200 pt-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Medicines
                </h2>
                {formData.medicines.map((medicine, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4"
                  >
                    <div>
                      <input
                        type="text"
                        value={medicine.name}
                        onChange={(e) =>
                          handleMedicineChange(index, "name", e.target.value)
                        }
                        className={`w-full px-4 py-2 rounded-lg border ${
                          errors[`medicine-${index}-name`]
                            ? "border-red-500"
                            : "border-gray-300"
                        } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                        placeholder="Medicine name"
                      />
                      {errors[`medicine-${index}-name`] && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors[`medicine-${index}-name`]}
                        </p>
                      )}
                    </div>
                    <input
                      type="text"
                      value={medicine.dosage}
                      onChange={(e) =>
                        handleMedicineChange(index, "dosage", e.target.value)
                      }
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Dosage"
                    />
                    <input
                      type="text"
                      value={medicine.frequency}
                      onChange={(e) =>
                        handleMedicineChange(index, "frequency", e.target.value)
                      }
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Frequency"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={medicine.duration}
                        onChange={(e) =>
                          handleMedicineChange(
                            index,
                            "duration",
                            e.target.value
                          )
                        }
                        className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Duration"
                      />
                      <button
                        type="button"
                        onClick={() => removeMedicine(index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                        disabled={formData.medicines.length === 1}
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addMedicine}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Plus /> Add Medicine
                </button>
              </div>

              <div className="border-t border-gray-200 pt-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Additional Information
                </h2>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    name="additionalNotes"
                    value={formData.additionalNotes}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="4"
                    placeholder="Any additional notes..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Prescription
                  </label>
                  <div className="space-y-4">
                    <label className="flex flex-col items-center px-4 py-6 bg-white border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                      <UploadIcon className="w-8 h-8 text-gray-400" />
                      <span className="mt-2 text-sm text-gray-500">
                        Select prescription images
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        multiple
                        accept="image/*"
                        onChange={(e) =>
                          handleFileChange(e, "prescriptionImages")
                        }
                      />
                    </label>
                    {selectedFiles.prescriptionImages.length > 0 && (
                      <div className="space-y-2">
                        {selectedFiles.prescriptionImages.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                          >
                            <span className="text-sm text-gray-600 truncate">
                              {file.name}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                removeFile("prescriptionImages", index)
                              }
                              className="p-1 text-gray-500 hover:text-red-500"
                            >
                              <CogIcon size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Medical Reports
                  </label>
                  <div className="space-y-4">
                    <label className="flex flex-col items-center px-4 py-6 bg-white border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                      <UploadIcon className="w-8 h-8 text-gray-400" />
                      <span className="mt-2 text-sm text-gray-500">
                        Select medical reports
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        multiple
                        onChange={(e) => handleFileChange(e, "medicalReports")}
                      />
                    </label>
                    {selectedFiles.medicalReports.length > 0 && (
                      <div className="space-y-2">
                        {selectedFiles.medicalReports.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                          >
                            <span className="text-sm text-gray-600 truncate">
                              {file.name}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                removeFile("medicalReports", index)
                              }
                              className="p-1 text-gray-500 hover:text-red-500"
                            >
                              <CogIcon size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-8">
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Save Medical Record
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMedicalRecord;
