import React from "react";

const NoChatSelected = () => {
  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-16 gradient-bg-hero">
      <div className="max-w-md text-center space-y-6">
        <div className="flex justify-center gap-4 mb-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl gradient-bg-hero flex items-center justify-center animate-bounce">
              <i className="bi bi-chat-left-dots"></i>
            </div>
          </div>
        </div>
        <h2 className="text-2xl font-bold">Welcome to chat</h2>
        <p className="text-gray-400">
          {" "}
          Select a conversation from the sidebar to start chatting
        </p>
      </div>
    </div>
  );
};

export default NoChatSelected;
