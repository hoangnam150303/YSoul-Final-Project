import React, { useContext, useEffect } from "react";
import { ChatContext } from "../../context/ChatContext";
import ChatInput from "../Input/ChatInput";
import ChatHeader from "../Header/ChatHeader";
import { formatMessageTime } from "../../util/FormatTime";
import { useSelector } from "react-redux";
const ChatContainer = () => {
  const { messageSelected, userSelected } = useContext(ChatContext);
  const userId = useSelector((state) => state.user.id);
  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />
      {userSelected && (
        <>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messageSelected.messages?.map((message) => (
              <div
                key={message._id}
                className={`w-full flex ${
                  message.user_id === userId.toString()
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`flex items-end gap-2 max-w-[80%] ${
                    message.user_id === userId.toString()
                      ? "flex-row-reverse"
                      : ""
                  }`}
                >
                  {/* Avatar */}
                  <img
                    src={message.avatar || "https://via.placeholder.com/150"}
                    alt="avatar"
                    className="w-8 h-8 rounded-full border"
                  />

                  {/* Content + Time */}
                  <div className="flex flex-col items-start">
                    <div className="bg-white text-black p-3 rounded-xl shadow max-w-full">
                      {message.image && (
                        <img
                          src={message.image}
                          alt="chat img"
                          className="rounded-md mb-2 max-w-full"
                        />
                      )}
                      {message.content && (
                        <p className="break-words">{message.content}</p>
                      )}
                    </div>
                    <time className="text-xs opacity-50 mt-1 text-white">
                      {formatMessageTime(message.createdAt)}
                    </time>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <ChatInput />
        </>
      )}
    </div>
  );
};

export default ChatContainer;
