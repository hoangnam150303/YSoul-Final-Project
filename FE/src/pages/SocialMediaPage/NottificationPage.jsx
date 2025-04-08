import {
  CommentOutlined,
  LikeOutlined,
  ShareAltOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { message, Pagination, Select } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { SocialSideBar } from "../../components/SideBar/SocialSideBar";
import { formatDistanceToNow } from "date-fns";
import notificationApi from "../../hooks/notificationApi";
import { useSocket } from "../../context/SocketContext";
import { SocialHeader } from "../../components/Header/SocialHeader";
export const NotificationPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [fiter, setFilter] = useState("");
  const [newNotification, setNewNotification] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); // Mặc định 10 item/trang
  const [totalItems, setTotalItems] = useState(0);
  const navigate = useNavigate(); // Thêm dòng này
  const socket = useSocket();
  const { Option } = Select;
  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const response = await notificationApi.getNotification(
        fiter,
        currentPage,
        pageSize
      );
      setNotifications(response.data.data);
      setTotalItems(response.data.total || 0);
    } catch (error) {
      message.error("Error fetching notifications.");
    } finally {
      setIsLoading(false);
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
    fetchNotifications();
  }, [fiter, newNotification, currentPage, pageSize]);
  const handleReadNotification = async (notificationId) => {
    try {
      await notificationApi.readNotification(notificationId);
    } catch (error) {
      message.error("Error reading notification.");
    }
  };
  const renderNotificationIcon = (type) => {
    switch (type) {
      case "like":
        return <LikeOutlined className="text-blue-500" />;
      case "comment":
        return <CommentOutlined className="text-blue-500" />;
      case "share":
        return <ShareAltOutlined className="text-blue-500" />;
      case "follow":
        return <UserAddOutlined className="text-blue-500" />;
      default:
        return null;
    }
  };
  const handleViewNotification = (notification) => {
    if (
      notification.type === "like" ||
      notification.type === "comment" ||
      notification.type === "reply"
    ) {
      navigate(`/post/${notification?.content?.post_id}`);

      if (notification?.isRead === false) {
        handleReadNotification(notification._id);
      }
    } else if (notification.type === "follow") {
      if (notification.content?.isRead === false) {
        handleReadNotification(notification._id);
      }
      navigate(`/profile/${notification.content?.user_id}`);
    }
  };

  const renderNotificationContent = (notification) => {
    switch (notification.type) {
      case "like":
        return (
          <Link to={`/profile/${notification?.content?.user_id}`}>
            <span>
              <strong>{notification.content?.username}</strong> liked your post
            </span>
          </Link>
        );
      case "comment":
        return (
          <span>
            <Link
              to={`/profile/${notification?.content?.user_id}`}
              className="font-bold"
            >
              {notification.content?.username}
            </Link>{" "}
            commented on your post
          </span>
        );
      case "share":
        return (
          <span>
            <Link
              to={`/profile/${notification?.content?.user_id}`}
              className="font-bold"
            >
              <strong>{notification.content?.username}</strong> shared your post
            </Link>
          </span>
        );
      case "follow":
        return (
          <span>
            <Link to={`/profile/${notification?.content?.user_id}`}>
              <strong>{notification?.content.username}</strong> started
              following you
            </Link>
          </span>
        );
      default:
        return null;
    }
  };

  const renderRelatedPost = (relatedPost) => {
    if (!relatedPost) return null;
    return (
      <Link
        to={`/post/${relatedPost?._id}`}
        className="mt-2 p-2 bg-gray-50 rounded-md flex items-center space-x-2 hover:bg-gray-100 transition-colors"
      >
        {relatedPost?.image && (
          <img
            src={relatedPost?.image}
            alt="related post"
            className="w-12 h-12 object-cover rounded-md"
          />
        )}
        <div className="flex-1 overflow-hidden">
          <p className="text-sm text-gray-600 truncate">
            {relatedPost?.content}
          </p>
        </div>
        <i className="bi bi-box-arrow-up-right text-gray-400"></i>
      </Link>
    );
  };

  return (
    <>
      <SocialHeader />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="col-span-1 lg:col-span-1">
          <SocialSideBar />
        </div>
        <div className="col-span-1 lg:col-span-3">
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-2xl font-bold mb-6">Notifications</h1>
            <div className="flex justify-between items-center mb-4">
              <Select
                value={fiter}
                onChange={(value) => {
                  setFilter(value);
                  setCurrentPage(1); // Reset về trang 1 khi lọc
                }}
                style={{ width: 200 }}
                placeholder="Filter by status"
              >
                <Option value="">All</Option>
                <Option value="isRead">Read</Option>
                <Option value="isNotRead">Unread</Option>
              </Select>
            </div>

            {isLoading ? (
              <p>Loading...</p>
            ) : notifications && notifications.length > 0 ? (
              <ul>
                {notifications.map((notification) => (
                  <li
                    key={notification?._id}
                    className={`bg-white border rounded-lg p-4 transition-all hover:shadow-md ${
                      !notification.read ? "border-blue-500" : "border-gray-200"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-4">
                        <Link to={`/profile/${notification?.content.user_id}`}>
                          <img
                            src={notification.content.avatar}
                            alt="hoangnam"
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        </Link>
                        <div>
                          <div className="flex items-center gap-2">
                            <div className="p-1 bg-gray-100 rounded-full">
                              {renderNotificationIcon(notification?.type)}
                            </div>
                            <p className="text-sm">
                              {renderNotificationContent(notification)}
                            </p>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDistanceToNow(
                              new Date(notification?.createdAt),
                              {
                                addSuffix: true,
                              }
                            ).replace("about ", "")}
                          </p>
                          {renderRelatedPost(notification?.relatedPost)}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {!notification.read && (
                          <button
                            className="p-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
                            aria-label="Mark as read"
                            onClick={() => handleViewNotification(notification)}
                          >
                            <i className="bi bi-eye"></i>
                          </button>
                        )}
                        <button
                          className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                          aria-label="Delete notification"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div>No notifications found</div>
            )}
          </div>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={totalItems}
            onChange={(page, size) => {
              setCurrentPage(page);
              setPageSize(size); // nếu muốn giữ 10 cố định, có thể bỏ dòng này
            }}
          />
        </div>
      </div>
    </>
  );
};
