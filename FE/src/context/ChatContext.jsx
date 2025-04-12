import { createContext, useEffect, useState } from "react";
import messageApi from "../hooks/messageApi";
import { useSocket } from "../context/SocketContext";
import { message } from "antd";
export const ChatContext = createContext();
export const ChatProvider = (props) => {
  const [userSelected, setUserSeclected] = useState();
  const [messageSelected, setMessageSelected] = useState();
  const [idConversation, setIdConversation] = useState();
  const socket = useSocket();
  const [newMessage, setNewMessage] = useState([]);
  const [messageTrigger, setMessageTrigger] = useState(0);
  const sendMessage = async (message) => {
    try {
      await messageApi.sendMessage(idConversation, message);
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
  const deleteMessage = async (messageId) => {
    try {
      const response = await messageApi.deleteMessage(
        idConversation,
        messageId
      );
      if (response.status === 200) {
        fetchDetailConversation();
        setMessageTrigger((prev) => prev + 1);
        message.success("Delete message sucess!");
      }
    } catch (error) {
      message.error("Delete fail");
    }
  };
  const updateMessage = async (messageId, content) => {
    try {
      const response = await messageApi.updateMessage(
        idConversation,
        messageId,
        content
      );
      if (response.status === 200) {
        setMessageTrigger((prev) => prev + 1);
        message.success("Update message success!");
      }
    } catch (error) {
      message.error("Update fail");
    }
  };
  const deleteConversation = async (id) => {
    try {
      const response = await messageApi.deleteConversation(id);
      if (response) {
        if (id === idConversation) {
          setMessageSelected(null);
        }
        setMessageTrigger((prev) => prev + 1);
        message.success("Delete conversation success!");
      }
    } catch (error) {
      message.error("Fail");
    }
  };
  const fetchDetailConversation = async () => {
    try {
      const response = await messageApi.getDetailConversation(idConversation);
      setMessageSelected(response.data.data.conversation);
      setUserSeclected(response.data.data.receiver);
    } catch (error) {}
  };
  useEffect(() => {
    if (idConversation) {
      fetchDetailConversation();
    }
  }, [idConversation]);
  useEffect(() => {
    if (idConversation) {
      fetchDetailConversation();
    }
  }, [newMessage, messageTrigger]);
  const contextValue = {
    userSelected,
    setUserSeclected,
    setMessageSelected,
    setIdConversation,
    messageSelected,
    sendMessage,
    newMessage,
    messageTrigger,
    deleteConversation,
    idConversation,
    deleteMessage,
    fetchDetailConversation,
    updateMessage
  };
  return (
    <ChatContext.Provider value={contextValue}>
      {props.children}
    </ChatContext.Provider>
  );
};
