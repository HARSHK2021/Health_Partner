import React, { useState } from "react";
import { MenuItem, TextField, Button, Box, Typography } from "@mui/material";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { UserDataContext } from "../../context/UserContext";
const userTypes = ["Patient", "Doctor"];
const genderOptions = ["male", "female", "other"];

export default function GoogleAuthForm({ googleUserData, onClose }) {
  const navigate = useNavigate();
  const { setUser } = React.useContext(UserDataContext);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    userType: "Patient",
    weight: "",
    height: "",
    gender: "",
    phone: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.weight || !formData.height || !formData.gender || !formData.phone) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/auth/google-login`,
        {
          googleToken: googleUserData.credential,
          userType: formData.userType,
          weight: formData.weight,
          height: formData.height,
          gender: formData.gender,
          phone: formData.phone,
        }
      );

      if (response.status === 200 || response.status === 201) {
        const data = response.data;

        localStorage.setItem("token", data.token);
        localStorage.setItem("type", data.user.role);
        localStorage.setItem("id", data.user._id);

        toast.success("Login successful 🎉");

        if (formData.userType === "Patient") {
          setUser(data.user);
          navigate("/patient-dashboard");
        } else if (formData.userType === "Doctor") {
          setUser(data.user);
          navigate("/doctor-dashboard");
        }
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "Google login failed. Please try again.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl mx-4">
        <Typography variant="h5" align="center" gutterBottom>
          Complete Your Profile
        </Typography>
        <Typography variant="body2" color="textSecondary" paragraph align="center">
          Please provide additional information to complete your registration
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            select
            fullWidth
            label="Register As"
            margin="normal"
            required
            name="userType"
            value={formData.userType}
            onChange={handleChange}
          >
            {userTypes.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            fullWidth
            label="Gender"
            margin="normal"
            required
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          >
            {genderOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            label="Phone Number"
            type="tel"
            margin="normal"
            required
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="10 digit number"
          />

          <Box display="flex" gap={2}>
            <TextField
              fullWidth
              label="Weight (kg)"
              type="number"
              margin="normal"
              required
              name="weight"
              value={formData.weight}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label="Height (cm)"
              type="number"
              margin="normal"
              required
              name="height"
              value={formData.height}
              onChange={handleChange}
            />
          </Box>

          <Box display="flex" gap={2} mt={3}>
            <Button
              fullWidth
              variant="outlined"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Submitting..." : "Complete Registration"}
            </Button>
          </Box>
        </form>
      </div>
    </div>
  );
}