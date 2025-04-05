import { BellOutlined, HomeOutlined, UserAddOutlined } from "@ant-design/icons";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export const SocialSideBar = () => {
  const userId = useSelector((state) => state.user.id);
  const userAvatar = useSelector((state) => state.user.avatar);
  const userName = useSelector((state) => state.user.name);
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Cover Image */}
      <div
        className="h-20 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://media.licdn.com/dms/image/v2/C4E12AQF51qP2jFMNiA/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1520078098318?e=2147483647&v=beta&t=etEBOP85NV8OtCZZKXp4ohz1qjax-9ssW0IjuLBCmfw')",
        }}
      />

      {/* Profile Section */}
      <div className="flex flex-col items-center p-4">
        <Link to="/profile">
          <img
            src={userAvatar}
            alt="avatar"
            className="w-20 h-20 rounded-full border-4 border-white -mt-10 shadow-md"
          />
        </Link>
        <h2 className="text-lg font-semibold mt-2">{userName}</h2>
      </div>

      {/* Navigation Menu */}
      <nav className="mt-4 border-t border-gray-200">
        <ul className="space-y-1">
          <li>
            <Link
              to="/socialHomePage"
              className="flex items-center py-3 px-6 hover:bg-gray-100 transition"
            >
              <HomeOutlined className="text-gray-600 mr-3 text-lg" /> Home
            </Link>
          </li>
          <li>
            <Link
              to="/network"
              className="flex items-center py-3 px-6 hover:bg-gray-100 transition"
            >
              <UserAddOutlined className="text-gray-600 mr-3 text-lg" /> My
              Network
            </Link>
          </li>
        </ul>
      </nav>

      {/* Profile Link */}
      <div className="border-t border-gray-200 p-4 text-center">
        <Link
          to={`/profile/${userId}`}
          className="text-blue-600 font-semibold hover:underline"
        >
          Visit your profile
        </Link>
      </div>
    </div>
  );
};
