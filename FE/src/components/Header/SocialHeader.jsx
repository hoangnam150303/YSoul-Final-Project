import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BellOutlined, HomeOutlined, UserOutlined } from "@ant-design/icons";
import notificationApi from "../../hooks/notificationApi";
import { useSocket } from "../../context/SocketContext";
import { useSelector } from "react-redux";

export const SocialHeader = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notification, setNotification] = useState([]);
  const [newNotification, setNewNotification] = useState("");
  const userId = useSelector((state) => state.user.id);
  const socket = useSocket();

  const getNotification = async () => {
    try {
      const response = await notificationApi.getNotification("isNotRead");
      setNotification(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (socket) {
      socket.on("new-notification", (notification) => {
        setNewNotification(notification);
      });
    }
  }, [socket]);

  useEffect(() => {
    getNotification();
  }, [newNotification]);

  return (
    // ✨ BACKGROUND DARK THEME: Màu nền tối #0f0f0f + border dưới
    <nav className="bg-[#0f0f0f] border-b border-[#2a2a2a] sticky top-0 z-50 w-full backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-wrap justify-between items-center py-3">
          {/* --- LOGO --- */}
          <Link to="/" className="w-24 md:w-36 group">
            <div className="p-1 rounded-lg transition-all duration-300">
              <img
                className="h-10 md:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                src="https://res.cloudinary.com/dnv7bjvth/image/upload/v1736842897/fancyai_1736839648739_gfhqk9.png"
                alt="logo"
              />
            </div>
          </Link>

          {/* --- NAVIGATION ICONS --- */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-10 items-center text-gray-400 text-sm">
            {/* Home */}
            <Link
              to="/socialHomePage"
              className="flex flex-col items-center hover:text-white transition-colors duration-300 group"
            >
              <HomeOutlined
                style={{ fontSize: "22px" }}
                className="group-hover:scale-110 transition-transform duration-300"
              />
              <span className="hidden md:block text-[10px] mt-1 font-medium tracking-wide uppercase group-hover:text-red-500 transition-colors">
                Home
              </span>
            </Link>

            {/* Network */}
            <Link
              to="/network"
              className="flex flex-col items-center hover:text-white transition-colors duration-300 group"
            >
              <i className="bi bi-people text-xl group-hover:scale-110 transition-transform duration-300"></i>
              <span className="hidden md:block text-[10px] mt-1 font-medium tracking-wide uppercase group-hover:text-red-500 transition-colors">
                Network
              </span>
            </Link>

            {/* Chat */}
            <Link
              to="/chat"
              className="flex flex-col items-center hover:text-white transition-colors duration-300 group"
            >
              <i className="bi bi-chat-dots text-xl group-hover:scale-110 transition-transform duration-300"></i>
              <span className="hidden md:block text-[10px] mt-1 font-medium tracking-wide uppercase group-hover:text-red-500 transition-colors">
                Chat
              </span>
            </Link>

            {/* Notification Dropdown */}
            <div
              className="relative group cursor-pointer"
              onMouseEnter={() => setShowNotifications(true)}
              onMouseLeave={() => setShowNotifications(false)}
            >
              <Link
                to="/notification"
                className="flex flex-col items-center hover:text-white transition-colors duration-300"
              >
                <div className="relative group-hover:scale-110 transition-transform duration-300">
                  <BellOutlined style={{ fontSize: "22px" }} />
                  {notification.length > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-lg shadow-red-500/50">
                      {notification.length}
                    </span>
                  )}
                </div>
                <span className="hidden md:block text-[10px] mt-1 font-medium tracking-wide uppercase group-hover:text-red-500 transition-colors">
                  Activity
                </span>
              </Link>

              {/* ✨ DARK DROPDOWN */}
              {showNotifications && notification.length > 0 && (
                <div className="absolute right-0 mt-3 w-80 bg-[#1a1a1a] border border-[#333] shadow-2xl rounded-xl overflow-hidden z-50 animate-fade-in-up">
                  <div className="px-4 py-3 border-b border-[#333] bg-[#1f1f1f]">
                    <h3 className="text-sm font-semibold text-white m-0">
                      Notifications
                    </h3>
                  </div>
                  <ul className="text-gray-300 text-sm max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-[#333]">
                    {notification.slice(0, 5).map((item) => (
                      <li
                        key={item._id}
                        className="p-3 border-b border-[#2a2a2a] hover:bg-[#252525] cursor-pointer flex items-start gap-3 transition-colors"
                      >
                        <img
                          src={item.content.avatar}
                          alt="avatar"
                          className="w-10 h-10 rounded-full border border-[#333] object-cover"
                        />
                        <div className="flex-1">
                          <p className="text-xs text-gray-400 mb-0.5 leading-snug">
                            <span className="font-bold text-white mr-1">
                              {item.content.username}
                            </span>
                            {item.type === "follow" && "started following you."}
                            {item.type === "reply" &&
                              "replied to your comment."}
                            {item.type === "comment" &&
                              "commented on your post."}
                            {item.type === "like" && "liked your post."}
                          </p>
                          <span className="text-[10px] text-gray-500">
                            Just now
                          </span>
                        </div>
                        <div className="pt-1">
                          {item.type === "follow" ? (
                            <i className="bi bi-person-plus-fill text-blue-500"></i>
                          ) : (
                            <i className="bi bi-heart-fill text-red-500"></i>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="p-2 text-center bg-[#1f1f1f] border-t border-[#333]">
                    <Link
                      to="/notification"
                      className="text-xs text-gray-400 hover:text-white transition-colors font-medium"
                    >
                      View All Notifications
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Profile (Me) */}
            <Link
              to={`/profile/${userId}`}
              className="flex flex-col items-center hover:text-white transition-colors duration-300 group"
            >
              <UserOutlined
                style={{ fontSize: "22px" }}
                className="group-hover:scale-110 transition-transform duration-300"
              />
              <span className="hidden md:block text-[10px] mt-1 font-medium tracking-wide uppercase group-hover:text-red-500 transition-colors">
                Me
              </span>
            </Link>

            {/* Logout */}
            <button className="flex flex-col items-center hover:text-white transition-colors duration-300 group bg-transparent border-none cursor-pointer">
              <i className="bi bi-box-arrow-in-right text-xl group-hover:scale-110 transition-transform duration-300"></i>
              <span className="hidden md:block text-[10px] mt-1 font-medium tracking-wide uppercase group-hover:text-red-500 transition-colors">
                Logout
              </span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
