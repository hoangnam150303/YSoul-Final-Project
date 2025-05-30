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
    <nav className="gradient-bg-hero shadow-md sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-wrap justify-between items-center py-3">
          {/* Logo */}
          <Link to="/" className="w-24 md:w-36">
            <img
              className="h-12 md:h-16 w-auto object-contain rounded"
              src="https://res.cloudinary.com/dnv7bjvth/image/upload/v1736842897/fancyai_1736839648739_gfhqk9.png"
              alt="logo"
            />
          </Link>

          {/* Navigation Icons */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 items-center text-white text-sm">
            <Link to="/socialHomePage" className="flex flex-col items-center">
              <HomeOutlined style={{ fontSize: "20px" }} />
              <span className="hidden md:block text-xs">Home</span>
            </Link>

            <Link to="/network" className="flex flex-col items-center relative">
              <i className="bi bi-people text-lg"></i>
              <span className="hidden md:block text-xs">Network</span>
            </Link>

            <Link to="/chat" className="flex flex-col items-center relative">
              <i className="bi bi-chat-dots text-lg"></i>
              <span className="hidden md:block text-xs">Chat</span>
            </Link>

            {/* Notification */}
            <div
              className="relative"
              onMouseEnter={() => setShowNotifications(true)}
              onMouseLeave={() => setShowNotifications(false)}
            >
              <Link to="/notification" className="flex flex-col items-center relative">
                <BellOutlined style={{ fontSize: "20px" }} />
                <span className="hidden md:block text-xs">Notification</span>
                {notification.length > 0 && (
                  <span className="absolute -top-1 -right-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notification.length}
                  </span>
                )}
              </Link>

              {/* Dropdown */}
              {showNotifications && notification.length > 0 && (
                <div className="absolute right-0 mt-2 w-72 bg-white shadow-lg rounded-lg p-2 z-50 max-h-96 overflow-y-auto">
                  <ul className="text-gray-700 text-sm">
                    {notification.slice(0, 5).map((item) => (
                      <li
                        key={item._id}
                        className="p-2 border-b hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                      >
                        <img
                          src={item.content.avatar}
                          alt="avatar"
                          className="w-8 h-8 rounded-full"
                        />
                        <span className="text-sm">
                          {item.type === "follow" &&
                            `${item.content.username} is now following you.`}
                          {item.type === "reply" &&
                            `${item.content.username} replied to your comment.`}
                          {item.type === "comment" &&
                            `${item.content.username} commented on your post.`}
                          {item.type === "like" &&
                            `${item.content.username} liked your post.`}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <Link to={`/profile/${userId}`} className="flex flex-col items-center">
              <UserOutlined style={{ fontSize: "20px" }} />
              <span className="hidden md:block text-xs">Me</span>
            </Link>

            <button className="flex flex-col items-center">
              <i className="bi bi-box-arrow-in-right text-lg"></i>
              <span className="hidden md:block text-xs">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
