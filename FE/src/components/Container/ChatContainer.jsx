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

  // Cuộn xuống cuối tin nhắn mỗi khi tin nhắn thay đổi (messageSelected thay đổi)
  const messagesEndRef = React.useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messageSelected]);

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

  const getMenu = (message) => (
    <Menu className="bg-[#2a2a2a] border border-[#333] rounded-lg">
      {/* Edit Item */}
      <Menu.Item
        key="edit"
        icon={<EditOutlined className="text-blue-400" />}
        onClick={() => handleEditMessage(message)}
        className="text-gray-300 hover:bg-[#333] hover:text-white"
      >
        Chỉnh sửa
      </Menu.Item>
      {/* Delete Item */}
      <Menu.Item
        key="delete"
        icon={<DeleteOutlined className="text-red-500" />}
        onClick={() => handleDeleteMessage(message._id)}
        className="text-gray-300 hover:bg-[#333] hover:text-white"
      >
        Xóa
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#1f1f1f]">
      <ChatHeader />
      {userSelected && (
        <>
          {/* Message List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-[#333]">
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
                    className="w-8 h-8 rounded-full border border-[#333] object-cover"
                  />

                  {/* Bubble + Time + Menu */}
                  <div
                    className={`flex flex-col items-start group relative ${
                      message.user_id === userId.toString()
                        ? "items-end"
                        : "items-start"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {/* Dấu 3 chấm - chỉ hiển thị cho tin nhắn của mình */}
                      {message.user_id === userId.toString() && (
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <Dropdown
                            overlay={getMenu(message)}
                            trigger={["click"]}
                            placement="bottomRight"
                          >
                            <MoreOutlined
                              className="transform rotate-90 text-gray-400 hover:text-white cursor-pointer p-1 text-lg"
                              onClick={(e) => e.stopPropagation()}
                            />
                          </Dropdown>
                        </div>
                      )}

                      {/* Message Bubble */}
                      <div
                        className={`p-3 rounded-2xl shadow-md max-w-full ${
                          message.user_id === userId.toString()
                            ? "bg-red-600 text-white rounded-br-none" // Tin nhắn của tôi
                            : "bg-[#2a2a2a] text-gray-200 rounded-bl-none" // Tin nhắn của người khác
                        }`}
                      >
                        {message.image && (
                          <img
                            src={message.image}
                            alt="chat img"
                            className="rounded-lg mb-2 max-w-full h-auto max-h-40 object-cover border border-[#333]"
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
                            onBlur={() => {}}
                            className="bg-[#1f1f1f] text-white border border-gray-600 p-1 rounded w-full focus:outline-none"
                            autoFocus
                          />
                        ) : (
                          <p className="break-words m-0 text-sm">
                            {message.content}
                          </p>
                        )}
                      </div>

                      {/* Dấu 3 chấm - chỉ hiển thị cho tin nhắn của người khác */}
                      {message.user_id !== userId.toString() && (
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <Dropdown
                            overlay={getMenu(message)}
                            trigger={["click"]}
                            placement="bottomLeft"
                          >
                            <MoreOutlined
                              className="transform rotate-90 text-gray-400 hover:text-white cursor-pointer p-1 text-lg"
                              onClick={(e) => e.stopPropagation()}
                            />
                          </Dropdown>
                        </div>
                      )}
                    </div>

                    {/* Thời gian */}
                    <time className="text-[10px] text-gray-500 mt-1">
                      {formatMessageTime(message.createdAt)}
                    </time>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <ChatInput />
        </>
      )}
    </div>
  );
};

export default ChatContainer;
