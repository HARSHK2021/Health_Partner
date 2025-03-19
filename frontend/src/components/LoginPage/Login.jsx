import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight } from "lucide-react";


import {
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  CardActions,
  Divider,
  Box,
  Link,
  MenuItem,
} from "@mui/material";

import "./login.css";
import axios from "axios";


const loginOptions = ["User", "Facility"];
export default function LoginPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [userType, setUserType] = useState("User");  /// store user by default
  const [email , setEmail]= useState("");
  const[password ,setPassword] =useState("");

  const handleLogin = async (e) => {
    
    e.preventDefault();
    
    const userData = {
      email,password,userType
    }
    
    setIsLoading(true);
    const apiUrl = userType === "User" ? (`${import.meta.env.VITE_BASE_URL}/auth/login`) : (`${import.meta.env.VITE_BASE_URL}/auth/login-facility`);

    try {
      const response = await axios.post(apiUrl,userData )
      
      if(response.status==200){
        const data = response.data
        localStorage.setItem('token',data.token)
        
        navigate(userType ==="User"? "/user-dashboard " : "/facility-dashboard");
      }else{
        alert("Login failed");
      }
      
    } catch (error) {
      console.log(error);
      alert("An error occurred . Please try again.")
      
    } finally{
      setIsLoading(false);
    }

   
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
   
   
    // Simulate API call
    if (!email) {
      alert("Please enter your email.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/forgot-password`, {
        email,
      });
  
      if (response.status === 200) {
        alert("Password reset link has been sent to your email.");
        setShowForgotPassword(false);
      }
    }catch(error){
      console.error(error);
      alert(error.response?.data?.message || "Failed to send reset link.");
    }finally {
      setIsLoading(false);
    };

    setTimeout(() => {
      setIsLoading(false);
      setShowForgotPassword(false);
    }, 1500);
  };

  const handleRegister = () => {
    navigate("/register"); // Redirect to register page
  };

  return (
    
    <div className="login-container bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#312e81] ">
       
      <div className="login-wrapper">
        {showForgotPassword ? (
          <Card className="forgot-password-card">
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Reset Password
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                Enter your email address and we'll send you a link to reset your
                password
              </Typography>
              <form onSubmit={handleForgotPassword}>
                <Box mb={2}>
                  <TextField
                   id="reset-email"
                   label="Email"
                   variant="outlined"
                   type="email"
                   fullWidth
                   required
                   value={email}  // Ensure state is used
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
                  {isLoading ? (
                    <div className="loading-wrapper">
                      <div className="loading-spinner"></div>
                      Sending...
                    </div>
                  ) : (
                    "Send Reset Link"
                  )}
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
          <div className="tabs-container">
            <div className="tabs-header">
              <Button
                variant="text"
                color="primary"
                onClick={() => {}}
                disabled
              >
                Login
              </Button>
              <Button variant="text" color="primary" onClick={handleRegister}>
                Register
              </Button>
            </div>

            <Card className="login-card">
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Welcome back
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  Enter your credentials to sign in to your account
                </Typography>
                <form onSubmit={handleLogin}>
                  <TextField 
                  onChange={(e)=> setUserType(e.target.value)}
                  select fullWidth label="Login As" margin="normal">
                    {loginOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>

                  <Box mb={2}>
                    <TextField
                      id="email"
                      label="Email"
                      variant="outlined"
                      type="email"
                      fullWidth
                      required
                      onChange={(e)=>setEmail(e.target.value)}
                    />
                  </Box>
                  <Box mb={2}>
                    <div className="password-header">
                      <TextField
                        id="password"
                        label="Password"
                        variant="outlined"
                        type="password"
                        fullWidth
                        required
                        onChange={(e)=>setPassword(e.target.value)}
                      />
                    </div>
                    <Box textAlign="center">
                      <Link
                        href="#"
                        onClick={() => setShowForgotPassword(true)}
                        variant="body2"
                      >
                        Forgot password?
                      </Link>
                    </Box>
                  </Box>

                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    fullWidth
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="loading-wrapper">
                        <div className="loading-spinner"></div>
                        Signing in...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        Sign in
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
