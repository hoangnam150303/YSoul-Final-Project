import React, { useContext, useEffect } from "react";
import { ChatContext } from "../../context/ChatContext";

const ChatHeader = () => {
  const {
    userSelected,
    setUserSeclected,
    setMessageSelected,
    messageSelected,
    setIdMessage,
  } = useContext(ChatContext);
  const handleCancle = () => {
    setMessageSelected(null);
    setUserSeclected(null);
    setIdMessage(null);
  };
   useEffect(() => {
     console.log(userSelected);
     
     
    }, [userSelected]);
  return (
    <>
      {userSelected && messageSelected && (
        <div className="p-2.5 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="relative">
                  <img
                    src={
                      userSelected?.avatar || "https://via.placeholder.com/150"
                    }
                    alt={userSelected?.name}
                    className="w-10 h-10 object-cover rounded-full border"
                  />
                </div>
              </div>

              <div>
                <h3 className="font-medium text-white">{userSelected?.name}</h3>
                {userSelected?.is_online ? (
                  <p className="text-sm text-clip text-green-500">Online</p>
                ) : (
                  <p className="text-sm text-clip">Offline</p>
                )}
              </div>
            </div>

            <button onClick={() => handleCancle()}>X</button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatHeader;
