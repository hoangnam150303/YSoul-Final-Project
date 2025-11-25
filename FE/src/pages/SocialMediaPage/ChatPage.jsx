import React, { useContext } from "react";
import ChatSideBar from "../../components/SideBar/ChatSideBar";
import { ChatContext } from "../../context/ChatContext";
import ChatContainer from "../../components/Container/ChatContainer";
import NotChatSelected from "../../components/Container/NoChatSelected";
import { SocialHeader } from "../../components/Header/SocialHeader";

const ChatPage = () => {
  const { messageSelected } = useContext(ChatContext);
  return (
    <>
      <SocialHeader />
      <div className="h-screen bg-gray-600 pt-24">
        <div className="flex items-center justify-center px-4">
          <div className="bg-[#1f1f1f] rounded-xl shadow-2xl border border-[#2a2a2a] w-full max-w-6xl h-[calc(100vh-8rem)]">
            <div className="flex h-full rounded-xl overflow-hidden">
              <ChatSideBar />
              {!messageSelected ? <NotChatSelected /> : <ChatContainer />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatPage;
