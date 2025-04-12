import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "../../context/ChatContext";
import messageApi from "../../hooks/messageApi";
import reviewerApi from "../../hooks/reviewerApi";
import { message } from "antd";
import { useSelector } from "react-redux";
import { Dropdown, Menu } from "antd";
import { DeleteOutlined, EllipsisOutlined } from "@ant-design/icons";
import { useSocket } from "../../context/SocketContext";
const ChatSideBar = () => {
  const socket = useSocket();
  const [users, setUsers] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const {
    userSelected,
    setIdConversation,
    newMessage,
    messageTrigger,
    deleteConversation,
    idConversation,
    setMessageSelected,
    fetchDetailConversation,
  } = useContext(ChatContext);
  const userId = useSelector((state) => state.user.id);
  const fetchConversations = async () => {
    try {
      const response = await messageApi.getAllConversation();
      setConversations(response.data.data);
    } catch (error) {
      message.error(error.message || "Đã xảy ra lỗi khi tải dữ liệu");
    }
  };
  const handleCreateConversation = async (id) => {
    try {
      const response = await messageApi.createConvesation(id);
      if (response.status === 200) {
        setIdConversation(response.data.data._id);
      }
    } catch (error) {
      message.error(error.message || "Đã xảy ra lỗi khi tải dữ liệu");
    }
  };
  const fetchReviewers = async () => {
    try {
      const response = await reviewerApi.getAllReviewer(
        "popular",
        searchTerm,
        10,
        1
      );
      setUsers(response.data.reviewers);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if (socket) {
      socket.on("delete-conversation", (conversation) => {
        // Nếu cuộc trò chuyện bị xóa, gọi lại fetch
        fetchConversations();
        console.log(conversation._id, idConversation);

        if (conversation._id === idConversation) {
          setMessageSelected(null);
          message.error("This conversation was deleted by another user!");
        }
      });
      socket.on("delete-message", (conversation) => {
        fetchConversations();
        if (conversation._id === idConversation) {
          fetchDetailConversation();
        }
      });
      console.log(1111);
      socket.on("update-message", (conversation) => {
        fetchConversations();
        if (conversation._id === idConversation) {
          fetchDetailConversation();
        }
      });
    }

    // Cleanup để tránh double event khi component unmount
    return () => {
      if (socket) {
        socket.off("delete-conversation");
        socket.off("delete-message");
        socket.off("update-message");
      }
    };
  }, [socket, idConversation]);

  const handleDeleteConversation = (id) => {
    deleteConversation(id);
    fetchConversations();
  };
  useEffect(() => {
    fetchConversations();
  }, [newMessage, messageTrigger]);

  useEffect(() => {
    fetchReviewers();
  }, []);
  // Khi searchTerm thay đổi thì gọi API phù hợp
  useEffect(() => {
    if (searchTerm.trim()) {
      fetchReviewers();
    } else {
      fetchConversations(); // Gọi lại API conversation thay vì dùng dữ liệu cũ
    }
  }, [searchTerm]);

  // Chạy lần đầu lấy danh sách conversation

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2 mb-4">
          <i
            className="bi bi-people"
            style={{ fontSize: "2rem", color: "white" }}
          ></i>
          <span className="font-bold text-2xl hidden lg:inline text-white">
            Chat
          </span>
        </div>
        {/* Search Input */}
        <div className="relative w-full">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <i className="bi bi-search"></i>
          </span>
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full rounded-xl bg-base-200 text-black placeholder-gray-400 border border-base-300 focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-150"
          />
        </div>
      </div>

      {searchTerm ? (
        <div className="overflow-y-auto w-full py-3">
          {users
            .filter((user) => user.id !== userId)
            .map((user) => (
              <button
                key={user.id}
                onClick={() => handleCreateConversation(user.id)}
                className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-color 
             ${userSelected?.id === user.id ? "bg-slate-400 text-black" : ""}`}
              >
                {/* Avatar + online status */}
                <div className="relative">
                  <img
                    src={user.avatar || "https://via.placeholder.com/150"}
                    alt={user.name}
                    className="w-12 h-12 object-cover rounded-full"
                  />
                  <span
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white 
          ${user.is_online ? "bg-green-500" : "bg-gray-400"}`}
                  ></span>
                </div>

                {/* Name */}
                <div className="flex-1 text-left text-white">
                  <div className="font-medium truncate">{user.name}</div>
                </div>
              </button>
            ))}
        </div>
      ) : (
        <div className="overflow-y-auto w-full py-3">
          {conversations.map((conversation) => {
            const lastMessage = conversation.messages.at(-1);

            let otherUserName, otherUserAvatar, otherUserId;
            if (conversation.participant1 === userId.toString()) {
              otherUserId = conversation.participant2;
              otherUserName = conversation.participant2Name;
              otherUserAvatar = conversation.participant2Avatar;
            } else {
              otherUserId = conversation.participant1;
              otherUserName = conversation.participant1Name;
              otherUserAvatar = conversation.participant1Avatar;
            }
            const isOnline = users.find(
              (u) => u.id.toString() === otherUserId
            )?.is_online;

            return (
              <div key={conversation._id} className="relative group">
                <button
                  onClick={() => setIdConversation(conversation._id)}
                  className="w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors"
                >
                  {/* Avatar */}
                  <div className="relative">
                    <img
                      src={otherUserAvatar || "https://via.placeholder.com/150"}
                      alt={otherUserName}
                      className="w-12 h-12 object-cover rounded-full"
                    />
                    {isOnline && (
                      <span
                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white 
                      bg-green-500`}
                      ></span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 text-left">
                    <div className="text-white font-semibold truncate">
                      {otherUserName}
                    </div>
                    <div className="text-sm text-gray-300 truncate max-w-[180px]">
                      {lastMessage ? (
                        lastMessage.user_id === userId.toString() ? (
                          <>you: {lastMessage.content}</>
                        ) : (
                          <>
                            {otherUserName?.split(" ").slice(-1)[0]}:{" "}
                            {lastMessage.content}
                          </>
                        )
                      ) : (
                        <>Chưa có tin nhắn</>
                      )}
                    </div>
                  </div>
                </button>

                {/* Dropdown menu - Hiện khi hover */}
                <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Dropdown
                    overlay={
                      <Menu>
                        <Menu.Item
                          key="delete"
                          icon={<DeleteOutlined />}
                          onClick={() =>
                            handleDeleteConversation(conversation._id)
                          }
                        >
                          Xóa cuộc trò chuyện
                        </Menu.Item>
                      </Menu>
                    }
                    trigger={["click"]}
                  >
                    <EllipsisOutlined
                      className="text-white cursor-pointer text-xl"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </Dropdown>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </aside>
  );
};

export default ChatSideBar;
