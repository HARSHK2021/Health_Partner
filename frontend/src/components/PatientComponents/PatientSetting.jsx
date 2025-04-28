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
  const [formData, setFormData] = useState({
    firstName: `${user.firstName}`,
    middleName: `${user.middleName}`,
    lastName: `${user.lastName}`,
    email: `${user.email}`,
    phone: `${user.phone}`,
    weight: "",
    height: "",
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
    <div className="min-h-screen justify-center bg-gradient-to-br from-indigo-200 to-purple-100 flex">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="flex-grow max-w-3xl mx-8 my-8 bg-white rounded-3xl shadow-2xl p-8 
                   transition-all duration-300 hover:shadow-3xl relative
                   before:absolute before:inset-0 before:bg-gradient-to-br 
                   before:from-blue-100/20 before:to-purple-100/20 before:-z-10"
      >
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <motion.h1
            variants={itemVariants}
            className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 
                       bg-clip-text text-transparent tracking-tight drop-shadow-md"
          >
            Profile Settings
          </motion.h1>
          {isEditing ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 
                         rounded-xl shadow-lg hover:shadow-xl transition-all relative
                         overflow-hidden hover:bg-gradient-to-bl group"
            >
              <span className="relative z-10">Save Changes</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 
                            opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditing(true)}
              className="bg-white text-gray-700 px-6 py-3 rounded-xl shadow-sm hover:shadow-md 
                         transition-all border-2 border-blue-100 hover:border-blue-200
                         flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Edit Profile
            </motion.button>
          )}
        </div>

        {/* Profile Photo Section */}
        <motion.div variants={itemVariants} className="flex flex-col items-center mb-8">
          <div className="relative group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-2xl relative
                         ring-8 ring-blue-50/50 hover:ring-purple-50/60 transition-all duration-300"
            >
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover transition-all duration-300 hover:scale-105"
                />
              ) : (
                <UserCircleIcon className="text-gray-300 w-full h-full transition-all duration-300 hover:text-gray-400" />
              )}
              {isEditing && (
                <motion.label
                  whileHover={{ scale: 1.1, rotate: [0, -10, 10, -5, 0] }}
                  transition={{ duration: 0.5 }}
                  className="absolute bottom-2 right-2 bg-gradient-to-br from-blue-500 to-purple-600 
                             p-2.5 rounded-full cursor-pointer shadow-lg hover:shadow-xl ring-2 ring-white/50"
                >
                  <CameraIcon className="w-7 h-7 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </motion.label>
              )}
            </motion.div>
            {isEditing && (
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 
                            to-purple-500/20 animate-pulse blur-xl" />
            )}
          </div>
        </motion.div>

        {/* Form Section */}
        <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <motion.select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleInputChange}
                disabled={!isEditing}
                whileHover={{ scale: 1.02 }}
                className="w-full p-3 border rounded-xl disabled:bg-gray-100 focus:ring-2 focus:ring-blue-500 transition-all"
              >
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </motion.select>
            </div>
          </div>
        </motion.div>

        {/* Address Section */}
        <motion.div variants={itemVariants} className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
          <motion.textarea
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            disabled={!isEditing}
            whileFocus={{ scale: 1.01 }}
            className="w-full p-3 border rounded-xl h-32 resize-none disabled:bg-gray-100 focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

const FormField = ({ label, name, value, onChange, editable, type = "text", required }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-2"
    >
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <motion.input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        disabled={!editable}
        whileHover={{ scale: 1.02 }}
        whileFocus={{ scale: 1.02 }}
        className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 transition-all ${
          !editable ? "bg-gray-100" : "hover:shadow-md"
        }`}
      />
    </motion.div>
  );
};

export default PatientSetting;