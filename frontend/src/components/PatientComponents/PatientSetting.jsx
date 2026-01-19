import React, { useState } from "react";
import { CameraIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import { CMH_ROUTES } from "../../cmhRoutes/cmh.routes";
import { motion } from "framer-motion";
import { UserDataContext } from "../../context/UserContext";
import axios from "axios";
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, staggerChildren: 0.1 } 
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 120 }
  },
};

const PatientSetting = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const { user, setUser } = React.useContext(UserDataContext);
  const latestHeight = user.heightData && user.heightData.length > 0 
    ? user.heightData[user.heightData.length - 1].height 
    : "";
  const latestWeight = user.weightData && user.weightData.length > 0 
    ? user.weightData[user.weightData.length - 1].weight 
    : "";
  const [formData, setFormData] = useState({
    firstName: `${user.firstName}`,
    middleName: `${user.middleName}`,
    lastName: `${user.lastName}`,
    email: `${user.email}`,
    phone: `${user.phone}`,
    weight: latestWeight,
    height: latestHeight,
    bloodGroup: `${user.bloodGroup}`,
    address: `${user.address}`,
  });
  const token = localStorage.getItem("token"); 
  // console.log(token);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsEditing(false);
  
    try {
      console.log(formData);
      // For example, save data to server
      const response = await axios.post(
        CMH_ROUTES.EDIT_PROFILE, 
        formData, // Directly pass formData (no need for JSON.stringify)
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("response from profile update",response)
      setUser(response);
      if (response.status!=200) {
        throw new Error("Failed to save changes.");
      }
      console.log("Changes saved successfully.");
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-300">
      <div className="h-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 sm:p-8">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Profile Settings
              </h1>
              {isEditing ? (
                <button
                  onClick={handleSave}
                  className="bg-gray-200 hover:bg-green-300 text-black px-6 py-2.5 
                             rounded-lg transition-all font-medium cursor-pointer"
                >
                  Save Changes
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-white hover:bg-gray-50 text-gray-800 px-6 py-2.5 
                             rounded-lg border border-gray-300 transition-all font-medium
                             flex items-center gap-2
                             cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  Edit Profile
                </button>
              )}
            </div>

            {/* Profile Photo Section */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 shadow-lg bg-gray-100">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserCircleIcon className="text-gray-400 w-full h-full" />
                  )}
                </div>
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-green-400 hover:bg-green-500
                                 p-2 rounded-full cursor-pointer shadow-md transition-all">
                    <CameraIcon className="w-5 h-5 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Form Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <FormField
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                editable={isEditing}
                required
              />
              <FormField
                label="Middle Name"
                name="middleName"
                value={formData.middleName}
                onChange={handleInputChange}
                editable={isEditing}
              />
              <FormField
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                editable={isEditing}
                required
              />
            </div>
            <FormField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              editable={isEditing}
              required
            />
            <FormField
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              editable={isEditing}
            />
          </div>

          <div className="space-y-6">
            <FormField
              label="Weight (kg)"
              name="weight"
              value={formData.weight}
              onChange={handleInputChange}
              editable={isEditing}
              type="number"
            />
            <FormField
              label="Height (cm)"
              name="height"
              value={formData.height}
              onChange={handleInputChange}
              editable={isEditing}
              type="number"
            />
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Blood Group</label>
                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50 
                               disabled:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                               transition-all cursor-pointer"
                  >
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Address Section */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg h-32 resize-none 
                           disabled:bg-gray-50 disabled:text-gray-500 focus:ring-2 focus:ring-blue-500 
                           focus:border-blue-500 transition-all"
                placeholder="Enter your address"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FormField = ({ label, name, value, onChange, editable, type = "text", required }) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        disabled={!editable}
        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    transition-all ${
                      editable 
                        ? "border-gray-300" 
                        : "border-gray-300 bg-gray-50 text-gray-500"
                    }`}
      />
    </div>
  );
};

export default PatientSetting;
