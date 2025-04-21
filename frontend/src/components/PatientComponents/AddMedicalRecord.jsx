import { useState } from "react";
import { format } from "date-fns";
import axios from "axios";
import { Plus, Trash2, AlertCircle, CogIcon, UploadIcon } from "lucide-react";
import { CMH_ROUTES } from "../../cmhRoutes/cmh.routes";

const AddMedicalRecord = () => {
  // State for form fields.
  const [formData, setFormData] = useState({
    condition: "",
    dateDiagnosed: format(new Date(), "yyyy-MM-dd"),
    recoveryStatus: "ongoing",
    symptoms: "",
    medicines: [{ name: "", dosage: "", frequency: "", duration: "" }],
    additionalNotes: "",
  });

  // State for form errors.
  const [errors, setErrors] = useState({});

  //preview the uploaded image
  const [preview, setPreview] = useState("");

  // State for selected files (for prescription images and medical reports).
  const [selectedFiles, setSelectedFiles] = useState({
    prescriptionImages: [],
    medicalReports: [],
  });

  // Handle changes for text inputs.
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

  // Handle changes for dynamic medicine inputs.
  const handleMedicineChange = (index, field, value) => {
    const updatedMedicines = formData.medicines.map((medicine, i) =>
      i === index ? { ...medicine, [field]: value } : medicine
    );
    setFormData((prev) => ({
      ...prev,
      medicines: updatedMedicines,
    }));
  };

  // Add a new medicine row.
  const addMedicine = () => {
    setFormData((prev) => ({
      ...prev,
      medicines: [
        ...prev.medicines,
        { name: "", dosage: "", frequency: "", duration: "" },
      ],
    }));
  };

  // Remove a medicine row.
  const removeMedicine = (index) => {
    setFormData((prev) => ({
      ...prev,
      medicines: prev.medicines.filter((_, i) => i !== index),
    }));
  };

  // Handle file selection.
  const handleFileChange = (e, field) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setSelectedFiles((prev) => ({
      ...prev,
      [field]: [...prev[field], ...files],
    }));
    // For preview, use the first file
    if (files[0] && files[0].type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = function () {
        setPreview(reader.result);
      };
      reader.readAsDataURL(files[0]);
    }
    // const data = new FormData();
    // files.forEach((file) => {
    //   data.append("file", file);
    //   data.append("upload_preset", "newbie_cloudinary");
    //   console.log("Selected files:", files);
    // });
    var reader = new FileReader();
    reader.onloadend = function () {
      console.log("File content:", reader.result);
      setPreview(reader.result);
      files.forEach((file) => {
        console.log("File name:", file.name);
        console.log("File type:", file.type);
        console.log("File size:", file.size);
        console.log("File last modified:", file.lastModified);
        console.log("File last modified date:", file.lastModifiedDate);
      });
    };
  };

  // Remove a selected file.
  const removeFile = (field, index) => {
    setSelectedFiles((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  // Validate the form inputs.
  const validateForm = () => {
    const newErrors = {};
    if (!formData.condition.trim())
      newErrors.condition = "Condition is required";
    if (!formData.dateDiagnosed)
      newErrors.dateDiagnosed = "Date diagnosed is required";
    formData.medicines.forEach((medicine, index) => {
      if (!medicine.name.trim())
        newErrors[`medicine-${index}-name`] = "Medicine name is required";
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission.
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      // Format the form data.
      const formattedData = {
        ...formData,
        // Convert symptoms string to array of trimmed strings.
        symptoms: formData.symptoms.split(",").map((s) => s.trim()),
        // Ensure each medicine has a takenAt array.
        medicines: formData.medicines.map((medicine) => ({
          ...medicine,
          takenAt: [],
        })),
      };

      console.log("Submitting data:", formattedData);
      const formDataObj = new FormData();
      formDataObj.append("condition", formattedData.condition);
      formDataObj.append("dateDiagnosed", formattedData.dateDiagnosed);
      formDataObj.append("recoveryStatus", formattedData.recoveryStatus);
      formDataObj.append("additionalNotes", formattedData.additionalNotes);

       // Add symptoms as array
    formattedData.symptoms.forEach(symptom => {
      formDataObj.append("symptoms", symptom);
    });
    
    // Add medicines as a stringified array of objects
    formDataObj.append("medicines", JSON.stringify(formattedData.medicines));

      // Retrieve token and user ID from localStorage.
      const token = localStorage.getItem("token");
      const ID = localStorage.getItem("id");

      if (!token || !ID) {
        console.error("Authentication error");
        setErrors((prev) => ({
          ...prev,
          submit: "Authentication error. Please log in again.",
        }));
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        // "Content-Type": "application/json",
        "Content-Type": "multipart/form-data",
        "User-ID": ID,
      };
      console.log("Headers being sent:", headers);

      // Prepare FormData for sending files and data.
      const formDataWithFiles = new FormData();
      // Append non-file fields.
      Object.keys(formattedData).forEach((key) => {
        const value = formattedData[key];
        if (Array.isArray(value)) {
          // If it's an array, flatten it in case there are nested arrays.
          const flatValue = value.flat(Infinity);
          flatValue.forEach((item) =>
            formDataWithFiles.append(key, JSON.stringify(item))
          );
        } else {
          formDataWithFiles.append(key, value);
        }
      });
      // Append file fields.
      selectedFiles.prescriptionImages.forEach((file) => {
        formDataWithFiles.append("prescriptionImages", file);
        console.log("Appending prescription file:", file.name);
      });
      selectedFiles.medicalReports.forEach((file) => {
        formDataWithFiles.append("medicalReports", file);
        console.log("Appending medical report file:", file.name);
      });

      // Send the POST request to the backend.
      const response = await axios.post(
        CMH_ROUTES.ADD_MEDICAL_RECORD,
        formDataWithFiles,
        { headers }
      );
      console.log("Response:", response);

      // Reset form fields and file selections on success.
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
      setErrors((prev) => ({
        ...prev,
        submit:
          error.response && error.response.status === 401
            ? "Authentication failed. Please log in again."
            : "Failed to submit the form. Please try again.",
      }));
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
              {/* Basic Details */}
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

              {/* Medicines Section */}
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

              {/* Additional Information and File Uploads */}
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

                {/* Prescription Images Upload */}
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
                      <img
                        src={preview}
                        alt="Preview"
                        className="mt-2 w-32 h-32 object-cover"
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
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Medical Reports Upload */}
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
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
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
