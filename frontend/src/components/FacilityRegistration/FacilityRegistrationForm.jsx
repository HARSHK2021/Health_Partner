import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom";
import {
  TextField,
  Button,
  MenuItem,
  Stack,
  CircularProgress,
  Box,
  Container,
  Paper,
  Typography,
} from "@mui/material";
import "@fontsource/poppins";
import { Hospital } from "lucide-react";
import Navbar from "../Navbar/Navbar";


const schema = z.object({
  name: z.string().min(3, "Name is required"),
  address: z.object({
    street: z.string().min(3, "Street is required"),
    city: z.string().min(2, "City is required"),
    state: z.string().min(2, "State is required"),
    country: z.string().min(2, "Country is required"),
    zipCode: z.string().min(4, "Zip Code is required"),
  }),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Invalid phone number"),
  facilityType: z.string().min(3, "Facility type is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const facilityOptions = ["Hospital", "Clinic", "Pharmacy", "Laboratory"];
const FacilityRegistrationForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:4000/api/v1/auth/register-medical-facility", data);
      console.log(response);
      if(response.status==201){
       const data = response.data;
       const userID= data.facility._id;
       console.log("userID",userID);
       localStorage.setItem('token',data.token );
       localStorage.setItem('type',data.type);
       localStorage.setItem('id',userID)
       setTimeout(() => navigate(`/verify/${userID}`), 2000);
       setMessage(data.message);
      }
      
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
    {/* Navbar */}
    <Navbar />

    {/* Centered Box */}
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        pt: "80px", // Adds space so the form doesn't overlap with Navbar
        backgroundImage: "linear-gradient(to bottom right, #1a1a2e, #16213e, #312e81)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={10}
          sx={{
            padding: 4,
            borderRadius: 5,
            textAlign: "center",
            boxShadow: "0px 10px 30px rgba(0,0,0,0.3)",
            background: "rgba(255, 255, 255, 0.9)",
            fontFamily: "Poppins, sans-serif",
          }}
        >
          {/* Title */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, justifyContent: "center", mb: 2 }}>
            <Hospital sx={{ width: 50, height: 50, color: "blue" }} />
            <Typography variant="h5" fontWeight="bold">
              Register Medical Facility
            </Typography>
          </Box>

          {/* Error Message */}
          {message && <Typography color="error">{message}</Typography>}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} style={{ marginTop: "1rem" }}>
            <TextField
              fullWidth
              label="Name"
              {...register("name")}
              error={!!errors.name}
              helperText={errors.name?.message}
              margin="normal"
            />

            {/* Address Fields */}
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
              <TextField
                sx={{ flex: 1 }}
                label="Street"
                {...register("address.street")}
                error={!!errors.address?.street}
                helperText={errors.address?.street?.message}
              />
              <TextField
                sx={{ flex: 1 }}
                label="City"
                {...register("address.city")}
                error={!!errors.address?.city}
                helperText={errors.address?.city?.message}
              />
            </Box>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              <TextField
                sx={{ flex: 1 }}
                label="State"
                {...register("address.state")}
                error={!!errors.address?.state}
                helperText={errors.address?.state?.message}
              />
              <TextField
                sx={{ flex: 1 }}
                label="Country"
                {...register("address.country")}
                error={!!errors.address?.country}
                helperText={errors.address?.country?.message}
              />
              <TextField
                sx={{ flex: 1 }}
                label="Zip Code"
                {...register("address.zipCode")}
                error={!!errors.address?.zipCode}
                helperText={errors.address?.zipCode?.message}
              />
            </Box>

            <TextField
              fullWidth
              label="Email"
              type="email"
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Phone"
              {...register("phone")}
              error={!!errors.phone}
              helperText={errors.phone?.message}
              margin="normal"
            />
            <TextField
              select
              fullWidth
              label="Facility Type"
              {...register("facilityType")}
              error={!!errors.facilityType}
              helperText={errors.facilityType?.message}
              margin="normal"
            >
              {facilityOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              label="Password"
              type="password"
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
              margin="normal"
            />

            {/* Register Button */}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              color="primary"
              sx={{
                mt: 2,
                padding: "10px",
                borderRadius: "8px",
                fontWeight: "bold",
              }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Register"}
            </Button>

            {/* Login Redirect */}
            <Typography variant="body2" sx={{ textAlign: "center", mt: 2 }}>
              Already Registered?{" "}
              <Link to="/login" style={{ color: "#1976d2", textDecoration: "none", fontWeight: "bold" }}>
                Login here
              </Link>
            </Typography>
          </form>
        </Paper>
      </Container>
    </Box>
  </div>
  );
};

export default FacilityRegistrationForm;
