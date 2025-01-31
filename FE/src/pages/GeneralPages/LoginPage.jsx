import { GoogleOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { message } from "antd";
import { useGoogleLogin } from "@react-oauth/google";
import userApi from "../../hooks/useUser";
import constants from "../../constants/contants";
import { useDispatch, useSelector } from "react-redux";
import { getUserRequest } from "../../reducers/user";
export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const role = useSelector((state) => state.user.role);
  
  const navigate = useNavigate();

  const onLoginSuccess = async (data) => {
    try {
      if (data.success) {
        message.success("Đăng nhập thành công");
        localStorage.setItem(constants.ACCESS_TOKEN, data.access_token);
        await dispatch(getUserRequest());
      } else {
        message.error("login falied");
      }
    } catch (error) {
      message.error("Lỗi đăng nhập.");
      console.log(error, "error");
    }
  };
  useEffect(() => {
    if (role) {
      if (role === "user") {
        navigate("/");
      } else {
        navigate("/homePageAdmin");
      }
    }
  }, [role, navigate]);
  const handleLogin = async (e) => {
    e.preventDefault();
    const value = {
      email,
      password,
    };
    try {
      const respone = await userApi.postLoginLocal(value);
      onLoginSuccess(respone.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLoginGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const response = await userApi.postLoginWithGoogle({
          access_token: tokenResponse.access_token,
        });
        const { status, data } = response;

        if (status === 200) {
          await onLoginSuccess(data);
        } else {
          message.error("Đăng nhập thất bại, thử lại");
        }
      } catch (error) {
        if (error.response) {
          message.error(error.response.data.message);
        } else {
          message.error("Đăng nhập thất bại, thử lại");
        }
      }
    },
    onError: (error) => {
      message.error("Đăng nhập thất bại. Vui lòng thử lại.");
      console.error(error);
    },
  });

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
            Login
          </h1>
          <form className="space-y-4" onSubmit={handleLogin}>
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

            <button className="w-full py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-800">
              Login
            </button>

            <button
              className="w-full py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-800"
              onClick={(e) => {
                e.preventDefault(); // Ngăn form submit khi click vào Google login
                handleLoginGoogle();
              }}
            >
              <GoogleOutlined /> Login With Google
            </button>
          </form>
          <div className="text-center text-gray-400">
            Don't have any account?{" "}
            <Link to="/signup" className="text-red-600">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
