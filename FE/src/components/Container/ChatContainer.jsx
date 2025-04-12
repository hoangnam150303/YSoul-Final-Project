import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "../../context/ChatContext";
import ChatInput from "../Input/ChatInput";
import ChatHeader from "../Header/ChatHeader";
import { formatMessageTime } from "../../util/FormatTime";
import { useSelector } from "react-redux";
import { MoreOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Dropdown, Menu } from "antd";
const ChatContainer = () => {
  const { messageSelected, userSelected, deleteMessage, updateMessage } =
    useContext(ChatContext);
  const userId = useSelector((state) => state.user.id);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const handleDeleteMessage = (id) => {
    deleteMessage(id);
  };
  const handleUpdateMessage = () => {
    if (editContent.trim() === "") return;
    updateMessage(editingMessageId, editContent);
    setEditingMessageId(null);
    setEditContent("");
  };
  const handleEditMessage = (message) => {
    setEditingMessageId(message._id);
    setEditContent(message.content);
  };
  
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

                  {/* Bubble + Time + Menu */}
                  <div className="flex flex-col items-start group">
                    <div className="flex items-center gap-2">
                      {/* Message Bubble */}
                      <div className="bg-white text-black p-3 rounded-xl shadow max-w-full">
                        {message.image && (
                          <img
                            src={message.image}
                            alt="chat img"
                            className="rounded-md mb-2 max-w-full"
                          />
                        )}
                        {editingMessageId === message._id ? (
                          <input
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleUpdateMessage();
                              if (e.key === "Escape") {
                                setEditingMessageId(null);
                                setEditContent("");
                              }
                            }}
                            onBlur={handleUpdateMessage}
                            className="border rounded px-2 py-1 w-full"
                            autoFocus
                          />
                        ) : (
                          <p className="break-words">{message.content}</p>
                        )}
                      </div>

                      {/* Dấu 3 chấm - chỉ hiển thị khi hover */}
                      {message.user_id === userId.toString() && (
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <Dropdown
                            overlay={
                              <Menu>
                                <Menu.Item
                                  key="edit"
                                  icon={<EditOutlined />}
                                  onClick={() => handleEditMessage(message)}
                                >
                                  Chỉnh sửa
                                </Menu.Item>
                                <Menu.Item
                                  key="delete"
                                  icon={<DeleteOutlined />}
                                  onClick={() =>
                                    handleDeleteMessage(message._id)
                                  }
                                >
                                  Xóa
                                </Menu.Item>
                              </Menu>
                            }
                            trigger={["click"]}
                          >
                            <MoreOutlined
                              className="transform rotate-90 text-white cursor-pointer p-2 text-lg"
                              onClick={(e) => e.stopPropagation()}
                            />
                          </Dropdown>
                        </div>
                      )}
                    </div>

                    {/* Thời gian */}
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
