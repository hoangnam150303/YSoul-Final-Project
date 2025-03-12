import { UserAddOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import { Link } from "react-router-dom";

export const RecommendedSideBar = ({ user }) => {
  const [connectionStatus, setConnectionStatus] = useState("connect");
  const handleConnect = () => {
    setConnectionStatus("connected");
  };
  const handleDisconnect = () => {
    setConnectionStatus("connect");
  };
  const renderButton = () => {
    switch (connectionStatus) {
      case "connected":
        return (
          <button
            className="px-3 py-1 rounded-full text-sm bg-green-600 text-white flex items-center"
            onClick={handleDisconnect}
          >
            Followed
            <i className="bi bi-check-circle ml-1"></i>
          </button>
        );
      case "connect":
        return (
          <button
            className="px-3 py-1 rounded-full text-sm bg-blue-600 text-white"
            onClick={handleConnect}
          >
            Follow
            <UserAddOutlined className="ml-1" />
          </button>
        );
    }
  };
  return (
    <div className="flex items-center justify-between mb-4">
      <Link className="flex items-center flex-grow" to="/profile">
        <img
          src="https://media.licdn.com/dms/image/v2/D5603AQHqFkGID_VAfQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1704300367200?e=1747267200&v=beta&t=m74QfO9g0462KKxTjXu5EBsy__Vu_9oa62u4eBYyPTs"
          alt="hoangnam"
          className="w-12 h-12 rounded-full mr-3"
        />
        <div>
          <h3 className="font-semibold text-sm">Hoang Nam</h3>
          <h3 className="text-xs text-gray-500">Top Reviewer</h3>
        </div>
      </Link>
      {renderButton()}
    </div>
  );
};
