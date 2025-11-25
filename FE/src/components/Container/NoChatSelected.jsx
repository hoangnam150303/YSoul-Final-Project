import React from "react";

const NoChatSelected = () => {
  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-16 bg-[#1f1f1f] text-white">
      <div className="max-w-md text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-3xl bg-red-600 flex items-center justify-center text-white shadow-2xl shadow-red-900/50 animate-bounce-slow">
            <i className="bi bi-chat-left-dots text-3xl"></i>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white">Welcome to chat</h2>

        <p className="text-gray-400">
          Select a conversation from the sidebar to start chatting
        </p>
      </div>
    </div>
  );
};

export default NoChatSelected;
