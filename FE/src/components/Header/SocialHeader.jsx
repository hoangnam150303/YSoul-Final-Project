import React from "react";
import { Link } from "react-router-dom";
import { BellOutlined, HomeOutlined, UserOutlined } from "@ant-design/icons";

export const SocialHeader = () => {
  return (
    <nav className="gradient-bg-hero shadow-md sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          {/* Logo */}
          <Link to="/">
            <img
              className="h-8 rounded"
              src="https://res.cloudinary.com/dnv7bjvth/image/upload/v1736842897/fancyai_1736839648739_gfhqk9.png"
              alt="logo"
            />
          </Link>

          {/* Navigation Icons */}
          <div className="flex items-center gap-5 md:gap-6">
            {/* Home */}
            <Link to="/" className="flex flex-col items-center text-white">
              <HomeOutlined style={{ fontSize: "20px" }} />
              <span className="text-xs hidden md:block">Home</span>
            </Link>

            {/* My Network */}
            <Link
              to="/user"
              className="flex flex-col items-center text-white relative"
            >
              <i className="bi bi-people" style={{ fontSize: "20px" }}></i>
              <span className="text-xs hidden md:block">My Network</span>
              <span className="absolute -top-1 -right-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                12
              </span>
            </Link>

            {/* Notifications */}
            <Link
              to="/Notification"
              className="flex flex-col items-center text-white relative"
            >
              <BellOutlined style={{ fontSize: "20px" }} />
              <span className="text-xs hidden md:block">Notifications</span>
              <span className="absolute -top-1 -right-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                12
              </span>
            </Link>

            {/* Profile */}
            <Link
              to="/profile"
              className="flex flex-col items-center text-white"
            >
              <UserOutlined style={{ fontSize: "20px" }} />
              <span className="text-xs hidden md:block">Me</span>
            </Link>

            {/* Logout */}
            <button className="flex flex-col items-center text-white">
              <i
                className="bi bi-box-arrow-in-right"
                style={{ fontSize: "20px" }}
              ></i>
              <span className="text-xs hidden md:block">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
