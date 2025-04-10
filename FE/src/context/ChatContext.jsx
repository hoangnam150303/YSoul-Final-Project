import { createContext, useEffect, useState } from "react";
import messageApi from "../hooks/messageApi";
import { useSocket } from "../context/SocketContext";
export const ChatContext = createContext();
export const ChatProvider = (props) => {
  const [userSelected, setUserSeclected] = useState();
  const [messageSelected, setMessageSelected] = useState();
  const [idMessage, setIdMessage] = useState();
  const socket = useSocket();
  const [newMessage, setNewMessage] = useState([]);
  const [messageTrigger, setMessageTrigger] = useState(0);
  const sendMessage = async (message, callbackAfterSend) => {
    try {
      const response = await messageApi.sendMessage(idMessage, message);
      setMessageTrigger((prev) => prev + 1);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (socket) {
      socket.on("new-message", (message) => {
        setNewMessage(message);
      });
    }
  }, [socket]);
  const getMessage = async () => {};
  const deleteMessage = async () => {};
  const fetchDetailConversation = async () => {
    try {
      const response = await messageApi.getDetailConversation(idMessage);
      setMessageSelected(response.data.data.conversation);
      setUserSeclected(response.data.data.receiver);
    } catch (error) {}
  };
  useEffect(() => {
    if (idMessage) {
      fetchDetailConversation();
    }
  }, [idMessage]);
  useEffect(() => {
    if (idMessage) {
      fetchDetailConversation();
    }
  }, [newMessage, messageTrigger]);
  const contextValue = {
    userSelected,
    setUserSeclected,
    setMessageSelected,
    setIdMessage,
    messageSelected,
    sendMessage,
    newMessage,
    messageTrigger,
  };
  return (
    <ChatContext.Provider value={contextValue}>
      {props.children}
    </ChatContext.Provider>
  );
};
