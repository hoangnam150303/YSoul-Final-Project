import React, { useContext } from 'react'
import ChatSideBar from '../../components/SideBar/ChatSideBar'
import { ChatContext } from '../../context/ChatContext';
import ChatContainer from '../../components/Container/ChatContainer';
import NotChatSelected from '../../components/Container/NoChatSelected';
const ChatPage = () => {
  const { userSelected } = useContext(ChatContext);
  return (
    <div className='h-screen gradient-bg-hero'>
        <div className='flex items-center justify-center pt-20 px-4'>
            <div className='gradient-bg-hero rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]'>
                <div className='flex h-full rounded-lg overflow-hidden'>
                    <ChatSideBar />
                    {!userSelected ? <NotChatSelected /> : <ChatContainer />}
                </div>
            </div>
        </div>
    </div>
  )
}

export default ChatPage