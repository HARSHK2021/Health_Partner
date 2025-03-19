import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import * as z from "zod";
import "./userregistrationform.css";
import axios from "axios";
import { useState } from "react";
import { CircularProgress, Typography } from "@mui/material";

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
    <form onSubmit={handleSubmit(onSubmit)} className="registration-form">
      <h2>User Registration</h2>

      {/* ✅ Display Success/Error Message */}
      {message && (
        <Typography color={message.type === "error" ? "error" : "primary"}>
          {message.text}
        </Typography>
      )}

      <p className="required-legend">
        <span>*</span> Required fields
      </p>

      {/* ✅ Name Fields */}
      <div className="form-group-row">
        <div className="form-group">
          <label data-required="*">First Name</label>
          <input type="text" {...register("firstName")} placeholder="e.g. John" />
          {errors.firstName && <p className="error">{errors.firstName.message}</p>}
        </div>

        <div className="form-group">
          <label>Middle Name</label>
          <input type="text" {...register("middleName")} placeholder="e.g. Kumar" />
        </div>

        <div className="form-group">
          <label data-required="*">Last Name</label>
          <input type="text" {...register("lastName")} placeholder="e.g. Singh" />
          {errors.lastName && <p className="error">{errors.lastName.message}</p>}
        </div>
      </div>

      {/* ✅ Email Field */}
      <div className="form-group">
        <label data-required="*">Email ID</label>
        <input type="email" {...register("email")} placeholder="john@example.com" />
        {errors.email && <p className="error">{errors.email.message}</p>}
      </div>

      {/* ✅ Password Field */}
      <div className="form-group">
        <label data-required="*">Password</label>
        <input type="password" {...register("password")} placeholder="Choose a strong password" />
        {errors.password && <p className="error">{errors.password.message}</p>}
      </div>

      {/* ✅ Role & Gender Fields */}
      <div className="form-group-row">
        <div className="form-group">
          <label data-required="*">Role</label>
          <select {...register("role")}>
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
          </select>
        </div>

        <div className="form-group">
          <label data-required="*">Gender</label>
          <select {...register("gender")}>
            <option value="">Select Gender</option> {/* Prevents auto-selection */}
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {errors.gender && <p className="error">{errors.gender.message}</p>}
        </div>
      </div>

      {/* ✅ Phone Field */}
      <div className="form-group">
        <label data-required="*">Phone</label>
        <input type="tel" {...register("phone")} placeholder="+91 XXXXX XXXXX" />
        {errors.phone && <p className="error">{errors.phone.message}</p>}
      </div>

      {/* ✅ Register Button */}
      <button type="submit" className="submit-btn">
        {loading ? <CircularProgress size={24} color="inherit" /> : "Register"}
      </button>

      {/* ✅ Login Redirect */}
      <p className="text-center mt-2 text-sm">
        Already Registered?{" "}
        <Link to="/verify" className="text-blue-600">Login here</Link>
      </p>
    </form>
  );
};

export default RegistrationForm;
