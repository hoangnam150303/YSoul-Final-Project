import React, { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import ChatInput from "../Input/ChatInput";
import ChatHeader from "../Header/ChatHeader";
import { formatMessageTime } from "../../util/FormatTime";

const ChatContainer = () => {
  const { messageSelected } = useContext(ChatContext);
  const usreId = "1";
  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messageSelected?.chat.map((message) => (
          <div
            key={message.id}
            className={` ${
              message.senderId === usreId ? "justify-end" : "justify-start"
            }`}
          >
            <div className="flex items-end">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === usreId
                      ? message.avatar
                      : "https://via.placeholder.com/150"
                  }
                  alt="user"
                />
              </div>
            </div>
            <div className="mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div className="p-3 rounded-lg flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="image"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>
      <ChatInput />
    </div>
  );
};

export default ChatContainer;
