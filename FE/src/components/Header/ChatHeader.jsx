import React from "react";
import { ChatContext } from "../../context/ChatContext";

const ChatHeader = () => {
  const { userSelected, setUserSelected } = ChatContext(ChatContext);
  return (
    <div className="p-2.5 border-b">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="size-10 rounded-full relative">
              <img
                src={userSelected?.avatar || "https://via.placeholder.com/150"}
                alt={userSelected?.name}
              />
            </div>
          </div>

          <div>
            <h3 className="font-medium">{userSelected?.name}</h3>
            {userSelected?.online ? (
              <p className="text-sm text-clip">Online</p>
            ) : (
              <p className="text-sm text-clip">Offline</p>
            )}
          </div>
        </div>

        <button onClick={() => setUserSelected(null)}>X</button>
      </div>
    </div>
  );
};

export default ChatHeader;
