import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import userApi from "../../hooks/useUser";
import { message } from "antd";
import constants from "../../constants/contants";
export const SignUpPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setUsername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const onSuccess = async (data) => {
    try {
      console.log(data);
      if (data.success) {
        message.success("OTP sent to your email.");
        localStorage.setItem(constants.VERIFY_TOKEN, data.verifyToken);
        navigate("/approve");
      } else {
        message.error("login falied");
      }
    } catch (error) {
      message.error("Lỗi đăng nhập.");
      console.log(error, "error");
    }
  };

  const handleSignUp = async (event) => {
    event.preventDefault(); // Ngăn chặn hành vi tải lại trang mặc định
    const value = {
      email,
      name,
      password,
      confirmPassword,
    };

    try {
      const response = await userApi.postRegister(value);
      onSuccess(response.data);
    } catch (error) {
      console.error("Error during sign-up:", error);
    }
  };

  return (
    <div className="h-screen w-full hero-bg">
      <header className="max-w-6x1 max-auto flex items-center justify-between p-4">
        <Link to={"/"}>
          <img
            src="https://res.cloudinary.com/dnv7bjvth/image/upload/v1736842897/fancyai_1736839648739_gfhqk9.png"
            alt="Logo"
            className="h-20 w-auto mx-auto"
          ></img>
        </Link>
      </header>

      <div className="flex justify-center items-center mt-20 mx-3">
        <div className="w-full max-w-md p-8 space-y-6 bg-black/60 rounded-lg shadow-md">
          <h1 className="text-center text-white text-2xl font-bold mb-4 ">
            Sign Up
          </h1>
          <form className="space-y-4" onSubmit={handleSignUp}>
            <div>
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-300 block"
              >
                Email
              </label>
              <input
                type="email"
                className="w-full px-3 py-2 mt-1 border border-gray-700 rounded-md bg-transparent text-white focus:outline-none focus:ring"
                placeholder="you@examle.com"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="text"
                className="text-sm font-medium text-gray-300 block"
              >
                User Name
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 mt-1 border border-gray-700 rounded-md bg-transparent text-white focus:outline-none focus:ring"
                placeholder="johnDoe"
                id="name"
                value={name}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-300 block"
              >
                Password
              </label>
              <input
                type="password"
                className="w-full px-3 py-2 mt-1 border border-gray-700 rounded-md bg-transparent text-white focus:outline-none focus:ring"
                placeholder="******"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-300 block"
              >
                Confirm Password
              </label>
              <input
                type="password"
                className="w-full px-3 py-2 mt-1 border border-gray-700 rounded-md bg-transparent text-white focus:outline-none focus:ring"
                placeholder="******"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button className="w-full py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-800">
              Sign Up
            </button>
          </form>
          <div className="text-center text-gray-400">
            Already a member?{" "}
            <Link to="/login" className="text-red-600">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
