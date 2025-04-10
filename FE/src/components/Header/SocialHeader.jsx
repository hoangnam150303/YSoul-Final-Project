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
      console.log(socket);
      
      socket.on("new-notification", (notification) => {
        setNewNotification(notification);
      });
    }
  }, [socket]);

  useEffect(() => {
    getNotification();
  }, [newNotification]);

  return (
    <nav className="gradient-bg-hero shadow-md sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          {/* Logo */}
          <Link to="/">
            <img
              className="h-16 w-full rounded"
              src="https://res.cloudinary.com/dnv7bjvth/image/upload/v1736842897/fancyai_1736839648739_gfhqk9.png"
              alt="logo"
            />
          </Link>

          {/* Navigation Icons */}
          <div className="flex items-center gap-5 md:gap-6">
            {/* Home */}
            <Link
              to="/socialHomePage"
              className="flex flex-col items-center text-white"
            >
              <HomeOutlined style={{ fontSize: "20px" }} />
              <span className="text-xs hidden md:block">Home</span>
            </Link>

            {/* My Network */}
            <Link
              to="/network"
              className="flex flex-col items-center text-white relative"
            >
              <i className="bi bi-people" style={{ fontSize: "20px" }}></i>
              <span className="text-xs hidden md:block">My Network</span>
            </Link>
            {/* My Chat */}
            <Link
              to="/chat"
              className="flex flex-col items-center text-white relative"
            >
              <i className="bi bi-chat-dots" style={{ fontSize: "20px" }}></i>
              <span className="text-xs hidden md:block">My Chat</span>
            </Link>
            {/* Notifications */}
            <div
              className="relative"
              onMouseEnter={() => setShowNotifications(true)}
              onMouseLeave={() => setShowNotifications(false)}
            >
              <Link
                to="/notification"
                className="flex flex-col items-center text-white relative"
              >
                <BellOutlined style={{ fontSize: "20px" }} />
                <span className="text-xs hidden md:block">Notifications</span>
                <span className="absolute -top-1 -right-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notification.length}
                </span>
              </Link>

              {/* Submenu hiển thị khi hover */}
              {showNotifications && notification.length > 0 && (
                <div className="absolute right-0 mt-2 w-72 bg-white shadow-lg rounded-lg p-2 z-20">
                  <ul className="text-gray-700">
                    {notification.slice(0, 5).map((item) => (
                      <li
                        key={item._id}
                        className="p-2 border-b hover:bg-gray-200 cursor-pointer flex items-center gap-2"
                      >
                        <img
                          src={item.content.avatar}
                          alt="avatar"
                          className="w-8 h-8 rounded-full"
                        />
                        <span className="text-sm font-semibold">
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

            {/* Profile */}
            <Link
              to={`/profile/${userId}`}
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
