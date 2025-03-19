import axios from "axios";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, TextField, Typography, Card, CardContent, Box } from "@mui/material";
const ResetPasswordPage = () => {
  const { token } = useParams(); // Get token from URL
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/reset-password`, {
        token,
        password,
      });

      if (response.status === 200) {
        setMessage("Password reset successful. Redirecting to login...");
        setTimeout(() => navigate("/login"), 3000);
      } else {
        setMessage("Error resetting password");
      }
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4">
    <Card className="w-full max-w-md shadow-xl rounded-2xl">
      <CardContent className="p-6">
        <Typography variant="h5" className="text-center font-bold text-gray-800 mb-2">
          Reset Your Password
        </Typography>
        <Typography variant="body2" className="text-center text-gray-500 mb-4">
          Enter a new password for your account.
        </Typography>
        <form onSubmit={handleResetPassword}>
          <TextField
            label="New Password"
            type="password"
            fullWidth
            required
            variant="outlined"
            className="mb-3"
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            label="Confirm Password"
            type="password"
            fullWidth
            required
            variant="outlined"
            className="mb-3"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {message && <Typography className="text-red-500 text-sm mb-3 text-center">{message}</Typography>}
          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            className="bg-blue-600 hover:bg-blue-700 py-3 text-lg"
            disabled={isLoading}
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  </div>
  );
};

export default ResetPasswordPage;
