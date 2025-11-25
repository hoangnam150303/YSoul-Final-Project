import React, { useContext, useEffect } from "react";
import { ChatContext } from "../../context/ChatContext";
import { CloseOutlined } from "@ant-design/icons";

const ChatHeader = () => {
  const {
    userSelected,
    setUserSeclected,
    setMessageSelected,
    setIdConversation,
  } = useContext(ChatContext);
  const handleCancle = () => {
    setMessageSelected(null);
    setUserSeclected(null);
    setIdConversation(null);
  };

  return (
    <>
      {userSelected && (
        <div className="p-3 border-b border-[#2a2a2a] bg-[#1a1a1a]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={
                    userSelected?.avatar || "https://via.placeholder.com/150"
                  }
                  alt={userSelected?.name}
                  className="w-10 h-10 object-cover rounded-full border border-[#333]"
                />

                {userSelected?.is_online !== undefined && (
                  <span
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#1a1a1a] ${
                      userSelected.is_online ? "bg-green-500" : "bg-gray-500"
                    }`}
                  ></span>
                )}
              </div>

              <div>
                <h3 className="font-medium text-white">{userSelected?.name}</h3>

                {userSelected?.is_online !== undefined && (
                  <p
                    className={`text-xs text-clip ${
                      userSelected.is_online
                        ? "text-green-500"
                        : "text-gray-400"
                    }`}
                  >
                    {userSelected.is_online ? "Online" : "Offline"}
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={handleCancle}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <CloseOutlined />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatHeader;
