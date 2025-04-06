import React, { useContext, useState } from "react";
import { ChatContext } from "../../context/ChatContext";

const ChatSideBar = () => {
  const [users, setUsers] = useState([]);
  const { userSelected, setUserSelected } = useContext(ChatContext);
  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <i className="bi bi-people" style={{ fontSize: "2rem" }}></i>
          <span className="font-medium hidden lg:bloc">Chat</span>
        </div>
      </div>
      <div className="overflow-y-auto w-full py-3">
        {users.map((user) => {
          <button
            key={user.id}
            onclick={() => setUserSelected(user)}
            className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-color 
                ${
                  userSelected?.id === user.id ? "bg-slate-400 text-black" : ""
                }`}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.avatar || "https://via.placeholder.com/150"}
                alt={user.name}
                className="size-12 object-cover rounded-full"
              />
              <div className="font-medium truncate">{user.name}</div>
              {user.online ? (
                <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ">
                  Online
                </span>
              ) : (
                <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ">
                  Offline
                </span>
              )}
            </div>
          </button>;
        })}
      </div>
    </aside>
  );
};

export default ChatSideBar;
