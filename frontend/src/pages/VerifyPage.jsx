import { useState, useEffect } from "react";
import { HeartPulse } from "lucide-react";

export default function VerifyPage() {
  const [emailSent, setEmailSent] = useState(false);
  const [phoneSent, setPhoneSent] = useState(false);
  const [emailTimer, setEmailTimer] = useState(0);
  const [phoneTimer, setPhoneTimer] = useState(0);
  const [emailOtp, setEmailOtp] = useState("");
  const [phoneOtp, setPhoneOtp] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  useEffect(() => {
    if (emailTimer > 0) {
      const interval = setInterval(() => setEmailTimer(emailTimer - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [emailTimer]);

  useEffect(() => {
    if (phoneTimer > 0) {
      const interval = setInterval(() => setPhoneTimer(phoneTimer - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [phoneTimer]);

  const requestEmailOtp = async () => {
    try {
      // Call backend API to request email OTP
      await fetch("/api/request-email-otp", { method: "POST" });
      setEmailSent(true);
      setEmailTimer(30);
    } catch (error) {
      console.error("Error requesting email OTP:", error);
    }
  };

  const requestPhoneOtp = async () => {
    try {
      // Call backend API to request phone OTP
      await fetch("/api/request-phone-otp", { method: "POST" });
      setPhoneSent(true);
      setPhoneTimer(30);
    } catch (error) {
      console.error("Error requesting phone OTP:", error);
    }
  };

  const verifyEmailOtp = async () => {
    try {
      // Call backend API to verify email OTP
      const response = await fetch("/api/verify-email-otp", {
        method: "POST",
        body: JSON.stringify({ otp: emailOtp }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      if (data.success) {
        setEmailVerified(true);
        setEmailError("");
      } else {
        setEmailError("Invalid email OTP. Please try again.");
      }
    } catch (error) {
      setEmailError("Error verifying email OTP.");
    }
  };

  const verifyPhoneOtp = async () => {
    try {
      // Call backend API to verify phone OTP
      const response = await fetch("/api/verify-phone-otp", {
        method: "POST",
        body: JSON.stringify({ otp: phoneOtp }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      if (data.success) {
        setPhoneVerified(true);
        setPhoneError("");
      } else {
        setPhoneError("Invalid phone OTP. Please try again.");
      }
    } catch (error) {
      setPhoneError("Error verifying phone OTP.");
    }
  };

  useEffect(() => {
    if (emailVerified && phoneVerified) {
      setTimeout(() => {
        window.location.href = "/dashboard"; // Redirect after both verifications
      }, 1500);
    }
  }, [emailVerified, phoneVerified]);

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#312e81] px-4">
      {/* Logo */}
      <div className="flex items-center mb-6">
        <HeartPulse className="h-16 w-16 text-blue-400" />
        <span className="ml-2 text-3xl font-bold text-white">Health Partner</span>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-xl">
        {/* Centered Slogan */}
        <h2 className="text-center text-2xl font-bold text-gray-800 mb-6">
          Verify Yourself for Secure Access
        </h2>

        {/* Input Fields */}
        <div className="space-y-6">
          {/* Email */}
          <div className="flex flex-col md:flex-row items-center space-x-0 md:space-x-3">
            <input
              type="email"
              placeholder="Enter Email"
              className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={requestEmailOtp}
              disabled={emailTimer > 0}
              className={`mt-3 md:mt-0 px-4 py-2 text-white rounded-lg ${
                emailTimer > 0 ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {emailTimer > 0 ? `Resend (${emailTimer}s)` : emailSent ? "Resend" : "Send"}
            </button>
          </div>

          {/* Email Code */}
          <div className="flex flex-col md:flex-row items-center space-x-0 md:space-x-3">
            <input
              type="text"
              placeholder="Enter Email OTP"
              value={emailOtp}
              onChange={(e) => setEmailOtp(e.target.value)}
              className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={verifyEmailOtp}
              disabled={emailVerified}
              className={`mt-3 md:mt-0 px-4 py-2 text-white rounded-lg ${
                emailVerified ? "bg-green-500" : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {emailVerified ? "Verified ✔" : "Verify"}
            </button>
          </div>
          {emailError && <p className="text-red-500 text-sm">{emailError}</p>}

          {/* Phone */}
          <div className="flex flex-col md:flex-row items-center space-x-0 md:space-x-3">
            <input
              type="tel"
              placeholder="Enter Phone Number"
              className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={requestPhoneOtp}
              disabled={phoneTimer > 0}
              className={`mt-3 md:mt-0 px-4 py-2 text-white rounded-lg ${
                phoneTimer > 0 ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {phoneTimer > 0 ? `Resend (${phoneTimer}s)` : phoneSent ? "Resend" : "Send"}
            </button>
          </div>

          {/* Phone Code */}
          <div className="flex flex-col md:flex-row items-center space-x-0 md:space-x-3">
            <input
              type="text"
              placeholder="Enter Phone OTP"
              value={phoneOtp}
              onChange={(e) => setPhoneOtp(e.target.value)}
              className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={verifyPhoneOtp}
              disabled={phoneVerified}
              className={`mt-3 md:mt-0 px-4 py-2 text-white rounded-lg ${
                phoneVerified ? "bg-green-500" : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {phoneVerified ? "Verified ✔" : "Verify"}
            </button>
          </div>
          {phoneError && <p className="text-red-500 text-sm">{phoneError}</p>}
        </div>

        {/* Final Verify Button */}
        <button
          className={`mt-8 w-full py-3 text-white font-semibold rounded-lg transition-all ${
            emailVerified && phoneVerified ? "bg-green-500" : "bg-gray-400 cursor-not-allowed"
          }`}
          disabled={!emailVerified || !phoneVerified}
        >
          Verified ✔
        </button>
      </div>
    </div>
  );
}
