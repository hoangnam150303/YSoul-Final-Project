import React, { useState } from "react";
import { Input, Button, message } from "antd";
import authApi from "../../hooks/authApi";
import { useNavigate } from "react-router-dom";
import constants from "../../constants/contants";
export const ForgotPasswordPage = () => {
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const handleSubmit = () => {
    if (!otp || !password || !confirmPassword) {
      message.error("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      message.error("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      message.error("Passwords do not match.");
      return;
    }
    const verifyToken = localStorage.getItem("verify_token");
    const value = {
      otp,
      password,
      confirmPassword,
      verifyToken,
    };
    const response = authApi.resetPassword(value);
    if (response.status === 200) {
      message.success("Password has been reset successfully.");
      navigate("/login");
      localStorage.removeItem(constants.VERIFY_TOKEN); // Clear the token after successful reset
    } else {
      message.error("Failed to reset password. Please try again.");
    }
    // Giả lập thành công
  };

  return (
    <div className="h-screen w-full hero-bg">
      <div className="flex items-center justify-center min-h-screen px-4 ">
        <div className=" p-6 rounded-xl shadow-md w-full max-w-md bg-black/60">
          <h2 className="text-2xl font-semibold mb-6 text-center text-white">
            Reset Password
          </h2>

          {/* OTP */}
          <div className="mb-4">
            <label className="block text-white font-medium mb-1">OTP</label>
            <Input
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>

          {/* New Password */}
          <div className="mb-4">
            <label className="block text-white font-medium mb-1">
              New Password
            </label>
            <Input.Password
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <label className="block text-white font-medium mb-1">
              Confirm Password
            </label>
            <Input.Password
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <Button type="primary" block onClick={handleSubmit}>
            Reset Password
          </Button>
        </div>
      </div>
    </div>
  );
};
