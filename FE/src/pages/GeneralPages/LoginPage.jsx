import { GoogleOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import { Link } from "react-router-dom";
export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
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

            <button className="w-full py-2 bg-cyan-600 text-white font-semibold rounded-md hover:bg-cyan-800">
              Login
            </button>

            <button className="w-full py-2 bg-cyan-600 text-white font-semibold rounded-md hover:bg-cyan-800">
              <GoogleOutlined /> Login With Google
            </button>
          </form>
          <div className="text-center text-gray-400">
            Don't have any account?{" "}
            <Link to="/signup" className="text-cyan-600">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
