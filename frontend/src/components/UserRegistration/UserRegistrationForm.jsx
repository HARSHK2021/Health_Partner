// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Link, useNavigate } from "react-router-dom";
// import * as z from "zod";
// import "./userregistrationform.css";
// import axios from "axios";
// import { useState } from "react";
// import { CircularProgress, Typography } from "@mui/material";

// // ✅ Zod Validation Schema
// const registrationSchema = z.object({
//   firstName: z.string().min(2, "First Name must be at least 2 characters"),
//   middleName: z.string().optional(),
//   lastName: z.string().min(2, "Last Name must be at least 2 characters"),
//   email: z.string().email("Invalid email format"),
//   password: z.string().min(8, "Password must be at least 8 characters"),
//   role: z.enum(["patient", "doctor"]),
//   phone: z.string().min(10, "Phone number must be at least 10 digits"),
//   address: z.string().optional(),
//   gender: z.enum(["male", "female", "other"], { required_error: "Gender is required" }),
// });

// const RegistrationForm = () => {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm({
//     resolver: zodResolver(registrationSchema),
//   });

//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState(null);
//   const navigate = useNavigate();

//   // ✅ Submit Handler
//   const onSubmit = async (data) => {
//     setLoading(true);
    
//     try {
//       const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/signup`, data);
//       setMessage({ type: "success", text: response.data.message });
//       setTimeout(() => navigate("/"), 2000); // Redirect after 2 sec
//     } catch (error) {
//       setMessage({ type: "error", text: error.response?.data?.message || "Something went wrong" });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit(onSubmit)} className="registration-form">
//       <h2>User Registration</h2>

//       {/* ✅ Display Success/Error Message */}
//       {message && (
//         <Typography color={message.type === "error" ? "error" : "primary"}>
//           {message.text}
//         </Typography>
//       )}

//       <p className="required-legend">
//         <span>*</span> Required fields
//       </p>

//       {/* ✅ Name Fields */}
//       <div className="form-group-row">
//         <div className="form-group">
//           <label data-required="*">First Name</label>
//           <input type="text" {...register("firstName")} placeholder="e.g. John" />
//           {errors.firstName && <p className="error">{errors.firstName.message}</p>}
//         </div>

//         <div className="form-group">
//           <label>Middle Name</label>
//           <input type="text" {...register("middleName")} placeholder="e.g. Kumar" />
//         </div>

//         <div className="form-group">
//           <label data-required="*">Last Name</label>
//           <input type="text" {...register("lastName")} placeholder="e.g. Singh" />
//           {errors.lastName && <p className="error">{errors.lastName.message}</p>}
//         </div>
//       </div>

//       {/* ✅ Email Field */}
//       <div className="form-group">
//         <label data-required="*">Email ID</label>
//         <input type="email" {...register("email")} placeholder="john@example.com" />
//         {errors.email && <p className="error">{errors.email.message}</p>}
//       </div>

//       {/* ✅ Password Field */}
//       <div className="form-group">
//         <label data-required="*">Password</label>
//         <input type="password" {...register("password")} placeholder="Choose a strong password" />
//         {errors.password && <p className="error">{errors.password.message}</p>}
//       </div>

//       {/* ✅ Role & Gender Fields */}
//       <div className="form-group-row">
//         <div className="form-group">
//           <label data-required="*">Role</label>
//           <select {...register("role")}>
//             <option value="patient">Patient</option>
//             <option value="doctor">Doctor</option>
//           </select>
//         </div>

//         <div className="form-group">
//           <label data-required="*">Gender</label>
//           <select {...register("gender")}>
//             <option value="">Select Gender</option> {/* Prevents auto-selection */}
//             <option value="male">Male</option>
//             <option value="female">Female</option>
//             <option value="other">Other</option>
//           </select>
//           {errors.gender && <p className="error">{errors.gender.message}</p>}
//         </div>
//       </div>

//       {/* ✅ Phone Field */}
//       <div className="form-group">
//         <label data-required="*">Phone</label>
//         <input type="tel" {...register("phone")} placeholder="+91 XXXXX XXXXX" />
//         {errors.phone && <p className="error">{errors.phone.message}</p>}
//       </div>

//       {/* ✅ Register Button */}
//       <button type="submit" className="submit-btn">
//         {loading ? <CircularProgress size={24} color="inherit" /> : "Register"}
//       </button>

//       {/* ✅ Login Redirect */}
//       <p className="text-center mt-2 text-sm">
//         Already Registered?{" "}
//         <Link to="/verify" className="text-blue-600">Login here</Link>
//       </p>
//     </form>
//   );
// };

// export default RegistrationForm;

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import * as z from "zod";
import { CircularProgress, Typography } from "@mui/material";
import axios from "axios";
import { useState } from "react";

// ✅ Zod Validation Schema
const registrationSchema = z.object({
  firstName: z.string().min(2, "First Name must be at least 2 characters"),
  middleName: z.string().optional(),
  lastName: z.string().min(2, "Last Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["patient", "doctor"]),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().optional(),
  gender: z.enum(["male", "female", "other"], { required_error: "Gender is required" }),
});

const RegistrationForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registrationSchema),
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  // ✅ Submit Handler
  const onSubmit = async (data) => {
    setLoading(true);
    
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/signup`, data);
      setMessage({ type: "success", text: response.data.message });
      setTimeout(() => navigate("/"), 2000); // Redirect after 2 sec
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.message || "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#312e81]">
      <div className="flex flex-1 justify-center items-center py-4 px-2 sm:px-6 md:px-12">
        <div className="w-full max-w-lg">
          <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-3xl text-center font-semibold text-gray-800">User Registration</h2>

            {/* ✅ Display Success/Error Message */}
            {message && (
              <Typography color={message.type === "error" ? "error" : "primary"} className="mt-4 text-center">
                {message.text}
              </Typography>
            )}

            <p className="mt-2 text-sm text-center text-gray-500">
              <span className="text-red-600">*</span> Required fields
            </p>

            {/* ✅ Name Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700">First Name <span className="text-red-600">*</span></label>
                <input
                  type="text"
                  {...register("firstName")}
                  placeholder="e.g. John"
                  className="mt-1 p-2 w-full rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
              </div>

              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700">Middle Name</label>
                <input
                  type="text"
                  {...register("middleName")}
                  placeholder="e.g. Kumar"
                  className="mt-1 p-2 w-full rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700">Last Name <span className="text-red-600">*</span></label>
                <input
                  type="text"
                  {...register("lastName")}
                  placeholder="e.g. Singh"
                  className="mt-1 p-2 w-full rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
              </div>
            </div>

            {/* ✅ Email Field */}
            <div className="form-group mt-4">
              <label className="block text-sm font-medium text-gray-700">Email ID <span className="text-red-600">*</span></label>
              <input
                type="email"
                {...register("email")}
                placeholder="john@example.com"
                className="mt-1 p-2 w-full rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>

            {/* ✅ Password Field */}
            <div className="form-group mt-4">
              <label className="block text-sm font-medium text-gray-700">Password <span className="text-red-600">*</span></label>
              <input
                type="password"
                {...register("password")}
                placeholder="Choose a strong password"
                className="mt-1 p-2 w-full rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            </div>

            {/* ✅ Role & Gender Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700">Role <span className="text-red-600">*</span></label>
                <select
                  {...register("role")}
                  className="mt-1 p-2 w-full rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="patient">Patient</option>
                  <option value="doctor">Doctor</option>
                </select>
              </div>

              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700">Gender <span className="text-red-600">*</span></label>
                <select
                  {...register("gender")}
                  className="mt-1 p-2 w-full rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {errors.gender && <p className="text-red-500 text-sm">{errors.gender.message}</p>}
              </div>
            </div>

            {/* ✅ Phone Field */}
            <div className="form-group mt-4">
              <label className="block text-sm font-medium text-gray-700">Phone <span className="text-red-600">*</span></label>
              <input
                type="tel"
                {...register("phone")}
                placeholder="+91 XXXXX XXXXX"
                className="mt-1 p-2 w-full rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
            </div>

            {/* ✅ Register Button */}
            <button
              type="submit"
              className="mt-6 w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Register"}
            </button>

            {/* ✅ Login Redirect */}
            <p className="text-center mt-4 text-sm text-gray-600">
              Already Registered?{" "}
              <Link to="/verify" className="text-blue-600 hover:underline">
                Login here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;
