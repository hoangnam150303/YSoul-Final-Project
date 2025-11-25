import {
  BellOutlined,
  HomeOutlined,
  UserAddOutlined,
  UserOutlined,
} from "@ant-design/icons";
import React from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";

export const SocialSideBar = () => {
  const userId = useSelector((state) => state.user.id);
  const userAvatar = useSelector((state) => state.user.avatar);
  const userName = useSelector((state) => state.user.name);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="bg-[#1f1f1f] rounded-xl shadow-lg overflow-hidden border border-[#2a2a2a] sticky top-24">

      <div
        className="h-24 bg-cover bg-center relative"
        style={{
          backgroundImage:
            "url('https://media.licdn.com/dms/image/v2/C4E12AQF51qP2jFMNiA/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1520078098318?e=2147483647&v=beta&t=etEBOP85NV8OtCZZKXp4ohz1qjax-9ssW0IjuLBCmfw')",
        }}
      >
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Profile Section */}
      <div className="flex flex-col items-center px-4 pb-4 relative">
        <Link to={`/profile/${userId}`}>
          <div className="p-[3px] rounded-full bg-gradient-to-tr from-gray-700 to-gray-900 -mt-10 relative z-10 hover:scale-105 transition-transform">
            <img
              src={userAvatar}
              alt="avatar"
              className="w-16 h-16 rounded-full border-4 border-[#1f1f1f] object-cover"
            />
          </div>
        </Link>
        <Link to={`/profile/${userId}`} className="mt-2 text-center group">
          <h2 className="text-lg font-bold text-white group-hover:underline decoration-white underline-offset-2 transition-all">
            {userName}
          </h2>
        </Link>
      </div>

      {/* Stats Divider */}
      <div className="flex justify-around border-t border-[#2a2a2a] py-3 px-2">
        <div className="text-center cursor-pointer hover:bg-[#2a2a2a] p-1 rounded-lg flex-1 transition-colors">
          <span className="block text-white font-bold text-sm">245</span>
          <span className="text-[10px] text-gray-500 uppercase font-semibold">
            Following
          </span>
        </div>
        <div className="w-[1px] bg-[#2a2a2a]"></div>
        <div className="text-center cursor-pointer hover:bg-[#2a2a2a] p-1 rounded-lg flex-1 transition-colors">
          <span className="block text-white font-bold text-sm">1.2k</span>
          <span className="text-[10px] text-gray-500 uppercase font-semibold">
            Followers
          </span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="border-t border-[#2a2a2a] py-2">
        <ul className="space-y-1">
          <li>
            <Link
              to="/socialHomePage"
              className={`flex items-center py-3 px-6 transition-all duration-200 border-l-4 ${
                isActive("/socialHomePage")
                  ? "bg-[#2a2a2a] text-white border-red-500"
                  : "text-gray-400 hover:bg-[#2a2a2a] hover:text-gray-200 border-transparent"
              }`}
            >
              <HomeOutlined className="mr-4 text-lg" />
              <span className="text-sm font-medium">Home</span>
            </Link>
          </li>
          <li>
            <Link
              to="/network"
              className={`flex items-center py-3 px-6 transition-all duration-200 border-l-4 ${
                isActive("/network")
                  ? "bg-[#2a2a2a] text-white border-red-500"
                  : "text-gray-400 hover:bg-[#2a2a2a] hover:text-gray-200 border-transparent"
              }`}
            >
              <UserAddOutlined className="mr-4 text-lg" />
              <span className="text-sm font-medium">My Network</span>
            </Link>
          </li>
          <li>
            <Link
              to={`/profile/${userId}`}
              className={`flex items-center py-3 px-6 transition-all duration-200 border-l-4 ${
                isActive(`/profile/${userId}`)
                  ? "bg-[#2a2a2a] text-white border-red-500"
                  : "text-gray-400 hover:bg-[#2a2a2a] hover:text-gray-200 border-transparent"
              }`}
            >
              <UserOutlined className="mr-4 text-lg" />
              <span className="text-sm font-medium">My Profile</span>
            </Link>
          </li>
        </ul>
      </nav>

      {/* Profile Link Footer */}
      <div className="border-t border-[#2a2a2a] p-4 text-center bg-[#1a1a1a]">
        <Link
          to={`/profile/${userId}`}
          className="text-xs text-blue-400 font-semibold hover:text-blue-300 hover:underline uppercase tracking-wider flex items-center justify-center gap-1"
        >
          View full profile <i className="bi bi-arrow-right"></i>
        </Link>
      </div>
    </div>
  );
};
