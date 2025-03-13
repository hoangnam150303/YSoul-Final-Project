import {
  CommentOutlined,
  LikeOutlined,
  ShareAltOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { SocialSideBar } from "../../components/SideBar/SocialSideBar";
import { formatDistanceToNow } from "date-fns";

export const NotificationPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState([1]);

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

  const renderNotificationContent = (notification) => {
    switch (notification.type) {
      case "like":
        return (
          <span>
            <strong>{notification?.user}</strong> liked your post
          </span>
        );
      case "comment":
        return (
          <span>
            <Link to={`/post/${notification?.postId}`} className="font-bold">
              {notification?.user}
            </Link>{" "}
            commented on your post
          </span>
        );
      case "share":
        return (
          <span>
            <Link to={`/post/${notification?.postId}`} className="font-bold">
              <strong>{notification?.user}</strong> shared your post
            </Link>
          </span>
        );
      case "follow":
        return (
          <span>
            <Link>
              <strong>{notification?.user}</strong> started following you
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
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="col-span-1 lg:col-span-1">
        <SocialSideBar />
      </div>
      <div className="col-span-1 lg:col-span-3">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-6">Notifications</h1>
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
                      <Link to={`/profile/${notification?.user}`}>
                        <img
                          src="https://res.cloudinary.com/dnv7bjvth/image/upload/v1736842897/fancyai_1736839648739_gfhqk9.png"
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
                          {formatDistanceToNow(new Date("03/12/2025"), {
                            addSuffix: true,
                          }).replace("about ", "")}
                        </p>
                        {renderRelatedPost(notification?.relatedPost)}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {!notification.read && (
                        <button
                          className="p-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
                          aria-label="Mark as read"
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
      </div>
    </div>
  );
};
