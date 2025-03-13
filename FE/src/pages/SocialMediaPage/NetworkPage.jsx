import React, { useState } from "react";
import { SocialSidebar } from "../../components/SocialMedia/SocialSidebar";
import { UserAddOutlined } from "@ant-design/icons";
export const NetworkPage = () => {
  const [connections, setConnections] = useState([]);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="col-span-1 lg:col-span-1">
        <SocialSidebar />
      </div>
      <div className="col-span-1 lg:col-span-3">
        <div className="bg-secondary rounded-lg shadow p-6 mb-6">
          <h1 className="text-2xl font-bold mb-6">My Network</h1>
          {connections.length > 0 ? (
            <div></div>
          ) : (
            <div className="bg-white rounded-lg shadow p-6 text-center mb-6">
              <UserAddOutlined
                size={48}
                className="mx-auto text-gray-400 mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">
                No Connection Reques
              </h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
