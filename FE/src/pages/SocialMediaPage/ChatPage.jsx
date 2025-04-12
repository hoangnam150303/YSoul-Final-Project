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
      <div className="h-screen gradient-bg-hero">
        <div className="flex items-center justify-center pt-20 px-4">
          <div className="gradient-bg-hero rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
            <div className="flex h-full rounded-lg overflow-hidden">
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
