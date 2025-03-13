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
} from "@mui/material";

import "./login.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate("/dashboard");
    }, 1500);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setShowForgotPassword(false);
    }, 1500);
  };

  const handleRegister = () => {
    navigate("/register"); // Redirect to register page
  };

  return (
    <div className="login-container">
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
                  <Box mb={2}>
                    <TextField
                      id="email"
                      label="Email"
                      variant="outlined"
                      type="email"
                      fullWidth
                      required
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
                      />
                      <Box textAlign="right">
                        <Link
                          href="#"
                          onClick={() => setShowForgotPassword(true)}
                          variant="body2"
                        >
                          Forgot password?
                        </Link>
                      </Box>
                    </div>
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
              <CardActions>
                <Divider />
                <Box width="100%" textAlign="center" mt={2}>
                  <Typography variant="body2" color="textSecondary">
                    Or continue with
                  </Typography>
                </Box>
                <Box width="100%" display="flex" justifyContent="center" mt={2}>
                  <Button
                    variant="outlined"
                    color="primary"
                    className="social-button"
                  >
                    Google
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    className="social-button"
                    style={{ marginLeft: 8 }}
                  >
                    GitHub
                  </Button>
                </Box>
              </CardActions>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
