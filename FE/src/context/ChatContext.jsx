import {
  Children,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

export const ChatContext = createContext();
export const ChatProvider = (props) => {
  const [userSeleted, setUserSelected] = useState({});
  const [messageSelected, setMessageSelected] = useState({});
  const sendMessage = async (message) => {};
  const getMessage = async () => {};
  const deleteMessage = async () => {};

  const contextValue = {
    userSeleted,
    setUserSelected,
  };
  return (
    <ChatContext.Provider value={contextValue}>
      {props.children}
    </ChatContext.Provider>
  );
  
};
