import { useState, useEffect } from "react";
import { ChevronsRightLeft, HeartPulse } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function VerifyPage() {
  const [emailSent, setEmailSent] = useState(false);
  const [phoneSent, setPhoneSent] = useState(false);
  const [emailTimer, setEmailTimer] = useState(0);
  const [phoneTimer, setPhoneTimer] = useState(0);
  const [emailOTP, setEmailOTP] = useState("");
  const [phoneOTP, setPhoneOTP] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [userType, setUserType] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const navigate = useNavigate();
  const { userID } = useParams();

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

  // Fetch user info
  useEffect(() => {
    const getInfo = async () => {
      const type = localStorage.getItem("type");
      if (type) {
        setUserType(type);
      }
      try {
        console.log("Fetching user info for userID:", userID);
        console.log("User type:", type);
        if (!userID || !type) {
          console.error("Missing userID or userType");
          return;
        }

        let endpoint = "";
        if (type === "user") {
          endpoint = `${import.meta.env.VITE_BASE_URL}/auth/getuser/${userID}`;
        } else if (type === "facility") {
          endpoint = `${import.meta.env.VITE_BASE_URL}/auth/getfacility/${userID}`;
        }

        if (endpoint) {
          const response = await axios.get(endpoint);
          const data = response.data;
          console.log("User data fetched:", data);

          if (type === "user") {
            setEmail(data.user?.email || "");
            setPhone(data.user?.phone || "");
            if (data.user.isEmailVerified) {
              setEmailVerified(true);
              setEmailSent(true); // Disable button if already verified
            }
            if (data.user.isPhoneVerified) {
              setPhoneVerified(true);
              setPhoneSent(true); // Disable button if already verified
            }
          } else if (type === "facility") {
            setEmail(data.facility?.email || "");
            setPhone(data.facility?.phone || "");
            if (data.facility.isEmailVerified) {
              setEmailVerified(true);
              setEmailSent(true); // Disable button if already verified
            }
            if (data.facility.isPhoneVerified) {
              setPhoneVerified(true);
              setPhoneSent(true); // Disable button if already verified
            }
          }
        }
      } catch (error) {
        console.error("Unable to get user info:", error.response?.data || error.message);
      }
    };

    getInfo();
  }, [userID]);

  const requestEmailOtp = async () => {
    try {
      console.log("Requesting email OTP for:", email);
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/auth/request-email-otp`,
        { email, userType },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("Email OTP request response:", response);
      setEmailSent(true);
      setEmailTimer(30);
    } catch (error) {
      console.error("Error requesting email OTP:", error);
    }
  };

  const requestPhoneOtp = async () => {
    try {
      console.log("Requesting phone OTP for:", phone);
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/auth/request-phone-otp`,
        { phone, userType },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log("Phone OTP request response:", response);
      setPhoneSent(true);
      setPhoneTimer(30);
    } catch (error) {
      console.error("Error requesting phone OTP:", error);
    }
  };

  const verifyEmailOtp = async () => {
    try {
      if (!email || !emailOTP) {
        setEmailError("Email and OTP are required.");
        return;
      }

      console.log("Verifying email OTP for:", email);
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/auth/verify-email-otp`,
        { email, emailOTP, userType }
      );

      if (response.status === 200) {
        setEmailVerified(true);
        setEmailError("");
        console.log("Email verified successfully.");
      } else {
        setEmailError("Invalid email OTP. Please try again.");
      }
    } catch (error) {
      setEmailError(error.response?.data?.message || "Error verifying email OTP.");
    }
  };

  const verifyPhoneOtp = async () => {
    try {
      if (!phone || !phoneOTP) {
        setPhoneError("Phone number and OTP are required.");
        return;
      }

      console.log("Verifying phone OTP for:", phone);
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/auth/verify-phone-otp`,
        { phone, phoneOTP, userType }
      );

      if (response.status === 200) {
        setPhoneVerified(true);
        setPhoneError("");
        console.log("Phone verified successfully.");
      } else {
        setPhoneError("Invalid phone OTP. Please try again.");
      }
    } catch (error) {
      setPhoneError(error.response?.data?.message || "Error verifying phone OTP.");
    }
  };

  useEffect(() => {
    if (emailVerified && phoneVerified) {
      setTimeout(() => {
        console.log("Redirecting to dashboard...");
        window.location.href = "/dashboard";
      }, 1500);
    }
  }, [emailVerified, phoneVerified]);

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#312e81] px-4">
      <div className="flex items-center mb-6">
        <HeartPulse className="h-16 w-16 text-blue-400" />
        <span className="ml-2 text-3xl font-bold text-white">Health Partner</span>
      </div>

      <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-xl">
        <h2 className="text-center text-2xl font-bold text-gray-800 mb-6">
          Verify Yourself for Secure Access
        </h2>

        <div className="space-y-6">
          <div className="flex flex-col md:flex-row items-center space-x-0 md:space-x-3">
            <input
              type="email"
              placeholder="Enter Email"
              className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              onClick={requestEmailOtp}
              disabled={emailTimer > 0 || emailVerified}
              className={`mt-3 md:mt-0 px-4 py-2 text-white rounded-lg ${
                emailTimer > 0 || emailVerified
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {emailTimer > 0 ? `Resend (${emailTimer}s)` : emailSent ? "Resend" : "Send"}
            </button>
          </div>

          <div className="flex flex-col md:flex-row items-center space-x-0 md:space-x-3">
            <input
              type="text"
              placeholder="Enter Email OTP"
              value={emailOTP}
              onChange={(e) => setEmailOTP(e.target.value)}
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

          <div className="flex flex-col md:flex-row items-center space-x-0 md:space-x-3">
            <input
              type="tel"
              placeholder="Enter Phone Number"
              className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <button
              onClick={requestPhoneOtp}
              disabled={phoneTimer > 0 || phoneVerified}
              className={`mt-3 md:mt-0 px-4 py-2 text-white rounded-lg ${
                phoneTimer > 0 || phoneVerified
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {phoneTimer > 0 ? `Resend (${phoneTimer}s)` : phoneSent ? "Resend" : "Send"}
            </button>
          </div>

          <div className="flex flex-col md:flex-row items-center space-x-0 md:space-x-3">
            <input
              type="text"
              placeholder="Enter Phone OTP"
              value={phoneOTP}
              onChange={(e) => setPhoneOTP(e.target.value)}
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

        <button
          className={`mt-8 w-full py-3 text-white font-semibold rounded-lg transition-all ${
            emailVerified && phoneVerified
              ? "bg-green-500"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          disabled={!emailVerified || !phoneVerified}
        >
          Verified ✔
        </button>
      </div>
    </div>
  );
}
