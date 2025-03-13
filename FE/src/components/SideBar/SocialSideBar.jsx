import { BellOutlined, HomeOutlined, UserAddOutlined } from "@ant-design/icons";
import React from "react";
import { Link } from "react-router-dom";

export const SocialSideBar = ({ User }) => {
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
            src="https://media.licdn.com/dms/image/v2/D5603AQHqFkGID_VAfQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1704300367200?e=1747267200&v=beta&t=m74QfO9g0462KKxTjXu5EBsy__Vu_9oa62u4eBYyPTs"
            alt="avatar"
            className="w-20 h-20 rounded-full border-4 border-white -mt-10 shadow-md"
          />
        </Link>
        <h2 className="text-lg font-semibold mt-2">Hoang Nam</h2>
        <p className="text-gray-500 text-sm">Hello, I'm a Software Engineer</p>
        <p className="text-gray-500 text-xs">12 connections</p>
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
              to="/user"
              className="flex items-center py-3 px-6 hover:bg-gray-100 transition"
            >
              <UserAddOutlined className="text-gray-600 mr-3 text-lg" /> My
              Network
            </Link>
          </li>
          <li>
            <Link
              to="/notificationPage"
              className="flex items-center py-3 px-6 hover:bg-gray-100 transition relative"
            >
              <BellOutlined className="text-gray-600 mr-3 text-lg" />{" "}
              Notifications
              <span className="absolute right-6 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                12
              </span>
            </Link>
          </li>
        </ul>
      </nav>

      {/* Profile Link */}
      <div className="border-t border-gray-200 p-4 text-center">
        <Link
          to="/profile"
          className="text-blue-600 font-semibold hover:underline"
        >
          Visit your profile
        </Link>
      </div>
    </div>
  );
};
