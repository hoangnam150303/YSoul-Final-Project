import React, { useState } from "react";
import { Input, Button, message } from "antd";
import authApi from "../../hooks/authApi";
import constants from "../../constants/contants";
import { useNavigate } from "react-router-dom";
const SendCodePage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsEmailValid(emailRegex.test(value));
  };

  const handleSendOtp = async () => {
    try {
      const response = await authApi.postForgotPassword(email);
      if (response.status === 200) {
        message.success(`OTP sent to ${email}`);
        const token = response.data.verifyToken;
        localStorage.setItem(constants.VERIFY_TOKEN, token);
        navigate("/forgotPassword");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      message.error("Failed to send OTP. Please try again.");
    }
  };

  return (
    <div className="h-screen w-full hero-bg">
      <div className="flex flex-col items-center justify-center min-h-screen  px-4">
        <div className=" p-6 rounded-xl shadow-md w-full max-w-md bg-black/60">
          <h2 className="text-2xl font-semibold mb-6 text-center text-white">
            Send OTP
          </h2>

          {/* Email Input */}
          <div className="mb-4 ">
            <label className="block text-white font-medium mb-1">Email</label>
            <Input
              placeholder="Enter your email"
              value={email}
              onChange={handleEmailChange}
            />
          </div>

          {/* OTP Input + Send Button */}

          {isEmailValid && (
            <Button type="primary" onClick={handleSendOtp}>
              Send OTP
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SendCodePage;
