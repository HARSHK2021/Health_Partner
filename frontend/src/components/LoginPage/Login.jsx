import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Navbar from "../Navbar/Navbar";

import {
  Button,
  TextField,
  Typography,
  Card,
  Box,
  Link,
  MenuItem,
  CardContent,
} from "@mui/material";
import axios from "axios";
import { UserDataContext } from "../../context/UserContext";
const loginOptions = ["Patient", "Facility", "Doctor"];

export default function LoginPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [userType, setUserType] = useState("User");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {user , setUser} = React.useContext(UserDataContext)


  const handleLogin = async (e) => {
    e.preventDefault();

    const userData = {
      email,
      password,
      userType,
    };

    setIsLoading(true);
    const apiUrl =
      userType === "Facility"
        ? `${import.meta.env.VITE_BASE_URL}/auth/login-facility`
        : `${import.meta.env.VITE_BASE_URL}/auth/login`;

    try {
      const response = await axios.post(apiUrl, userData);
      if (response.status === 200) {
        console.log("responser from login " ,response);
        const data = response.data;
        console.log("data",data.user._id)
       
        localStorage.setItem("token", data.token);
        localStorage.setItem('type',data.user.role);
        localStorage.setItem('id',data.user._id)

        // localStorage.setItem("type",userType)
      
        if(userType == "Patient"){
          setUser(response.data.user);
          navigate("/patient-dashboard")
        } //// baki logo ka bheyaha aaayega
        if(userType== "Doctor"){
          navigate("/doctor-dashboard")
        }
        if(userType== "Facility"){
          navigate("/facility-dashboard")
        }
      } else {
      
        alert("Login failed Wrong Credentials");
      }
    } catch (error) {
      console.log(error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email) {
      alert("Please enter your email.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/auth/forgot-password`,
        {
          email,
        }
      );

      if (response.status === 200) {
        alert("Password reset link has been sent to your email.");
        setShowForgotPassword(false);
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to send reset link.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = () => {
    navigate("/register/user"); // Redirect to register page
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#312e81]">
      <Navbar />
      <div className="flex flex-1 justify-center items-center py-4 px-2 sm:px-6 md:px-12">
        <div className="w-full max-w-sm">
          {showForgotPassword ? (
            <Card elevation={3} sx={{ padding: 3, borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h5" align="center" gutterBottom>
                  Reset Password
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  paragraph
                  align="center"
                >
                  Enter your email address, and we'll send you a link to reset
                  your password.
                
                </Typography>
                <form onSubmit={handleForgotPassword}>
                  <Box mb={2}>
                    <TextField
                      label="Email"
                      variant="outlined"
                      type="email"
                      fullWidth
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Box>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    fullWidth
                    disabled={isLoading}
                  >
                    {isLoading ? "Sending..." : "Send Reset Link"}
                  </Button>
                  <Box mt={2} textAlign="center">
                    <Link
                      href="#"
                      onClick={() => setShowForgotPassword(false)}
                      variant="body2"
                    >
                      Back to login
                    </Link>
                  </Box>
                </form>
              </CardContent>
            </Card>
          ) : (
            <div>
              <div className="tabs-header flex justify-between">
                <Button variant="text" color="primary" disabled>
                  Login
                </Button>
                
              </div>

              <Card elevation={3} sx={{ padding: 3, borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="h5" align="center" gutterBottom>
                    Welcome back
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    paragraph
                    align="center"
                  >
                    Enter your credentials to sign in to your account
                  </Typography>
                  <form onSubmit={handleLogin}>
                    <TextField
                      onChange={(e) => setUserType(e.target.value)}
                      select
                      fullWidth
                      label="Login As"
                      margin="normal"
                      required
                      value={userType}
                    >
                      {loginOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </TextField>

                    <Box mb={2}>
                      <TextField
                        label="Email"
                        variant="outlined"
                        type="email"
                        fullWidth
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </Box>
                    <Box mb={2}>
                      <TextField
                        label="Password"
                        variant="outlined"
                        type="password"
                        fullWidth
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </Box>
                    <Box textAlign="center">
                      <Link
                        href="#"
                        onClick={() => setShowForgotPassword(true)}
                        variant="body2"
                      >
                        Forgot password?
                      </Link>
                    </Box>

                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      fullWidth
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        "Signing in..."
                      ) : (
                        <div className="flex items-center justify-center">
                          Sign in
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </div>
                      )}
                    </Button>
                  </form>
                  <div className=" w-full flex justify-center items-center">
                    New here! <Button variant="text" color="primary" onClick={handleRegister}>
                  Register
              </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
