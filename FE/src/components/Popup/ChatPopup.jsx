import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  MessageOutlined,
  CloseOutlined,
  SendOutlined,
  RobotOutlined,
  LoadingOutlined,
  PlayCircleOutlined,
  SoundOutlined,
} from "@ant-design/icons";
import ReactMarkdown from "react-markdown";


import agentApi from "../../hooks/agentApi";

const ChatPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I am YSoul AI. What movies or music are you looking for today?",
      sender: "bot",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const sessionIdRef = useRef("user-session-" + Date.now());

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {

      const response = await agentApi.postMessage({
        message: userMessage.text,
        session_id: sessionIdRef.current,
      });
      const data = response.data; // Lấy data từ axios response

      const botMessage = {
        id: Date.now() + 1,
        text: data.reply || "Sorry, the server is not responding.",
        sender: "bot",
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "⚠️ Connection error to YSoul Agent. Please check the server.",
        sender: "bot",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  // 👇 Logic Regex xử lý link (đã bao gồm fix dấu gạch ngang UUID)
  const renderWithLink = (children) => {
    return React.Children.map(children, (child) => {
      if (typeof child === "string") {
        // Regex split: Tìm pattern (ID:...) hoặc (MusicID:...)
        const parts = child.split(/(\((?:ID|MusicID):\s*[a-zA-Z0-9-]+\))/g);

        return parts.map((part, index) => {
          // 🎬 Case 1: Phim
          const movieMatch = part.match(/\(ID:\s*([a-zA-Z0-9-]+)\)/);
          if (movieMatch) {
            const id = movieMatch[1];
            return (
              <Link
                key={index}
                to={`/watchPage/${id}`}
                onClick={() => setIsOpen(false)}
                className="ml-2 inline-flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded-full transition-all duration-200 no-underline shadow-sm transform hover:scale-105"
              >
                <PlayCircleOutlined style={{ fontSize: "10px" }} />
                Watch Now
              </Link>
            );
          }

          // 🎵 Case 2: Nhạc
          const musicMatch = part.match(/\(MusicID:\s*([a-zA-Z0-9-]+)\)/);
          if (musicMatch) {
            const id = musicMatch[1];
            return (
              <Link
                key={index}
                to={`/singlePage/${id}`}
                onClick={() => setIsOpen(false)}
                className="ml-2 inline-flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-3 py-1 rounded-full transition-all duration-200 no-underline shadow-sm transform hover:scale-105"
              >
                <SoundOutlined style={{ fontSize: "10px" }} />
                Listen Now
              </Link>
            );
          }

          return part;
        });
      }
      return child;
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      {isOpen && (
        <div className="mb-4 w-[350px] h-[500px] bg-[#1f1f1f] rounded-xl shadow-2xl border border-gray-700 flex flex-col overflow-hidden animate-fade-in-up">
          {/* Header */}
          <div className="bg-[#1f1f1f] border-b border-gray-700 p-4 flex justify-between items-center text-white shadow-sm">
            <div className="flex items-center gap-3">
              <div className="bg-gray-800 p-2 rounded-full flex items-center justify-center border border-gray-600">
                <RobotOutlined style={{ fontSize: "20px", color: "#fff" }} />
              </div>
              <div>
                <h3 className="font-bold text-base m-0 leading-none text-white">
                  YSoul AI
                </h3>
                <p className="text-xs text-gray-400 m-0 mt-1 flex items-center gap-1 opacity-90">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                  Active
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-gray-800 p-2 rounded-full transition flex items-center justify-center cursor-pointer border-none bg-transparent text-gray-400 hover:text-white"
            >
              <CloseOutlined style={{ fontSize: "16px" }} />
            </button>
          </div>

          {/* Body Chat */}
          <div className="flex-1 overflow-y-auto p-4 bg-[#141414] space-y-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[90%] p-3 rounded-xl text-sm shadow-md leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-red-600 text-white rounded-br-none"
                      : "bg-[#2a2a2a] text-gray-200 border border-gray-700 rounded-bl-none"
                  }`}
                >
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => (
                        <p className="m-0 flex flex-wrap items-center">
                          {renderWithLink(children)}
                        </p>
                      ),
                      li: ({ children }) => (
                        <li className="mb-2 list-none">
                          <span className="flex flex-wrap items-center">
                            {renderWithLink(children)}
                          </span>
                        </li>
                      ),
                      ul: ({ children }) => (
                        <ul className="pl-0 m-0">{children}</ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="pl-0 m-0">{children}</ol>
                      ),
                      strong: ({ children }) => (
                        <strong className="text-red-400 font-bold">
                          {children}
                        </strong>
                      ),
                    }}
                  >
                    {msg.text}
                  </ReactMarkdown>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-[#2a2a2a] p-3 rounded-xl rounded-bl-none border border-gray-700 shadow-sm flex items-center gap-2 text-gray-400 text-sm">
                  <LoadingOutlined spin />
                  <span>Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input */}
          <div className="p-3 bg-[#1f1f1f] border-t border-gray-700 flex gap-2 items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about movies or music..."
              className="flex-1 bg-[#2a2a2a] text-white text-sm rounded-full px-4 py-2 focus:outline-none focus:ring-1 focus:ring-red-600 transition border border-gray-700 placeholder-gray-500"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
              className={`w-10 h-10 rounded-full text-white flex items-center justify-center transition shadow-sm border-none cursor-pointer ${
                isLoading || !input.trim()
                  ? "bg-gray-700 cursor-not-allowed text-gray-500"
                  : "bg-red-600 hover:bg-red-500"
              }`}
            >
              <SendOutlined style={{ fontSize: "18px", marginLeft: "2px" }} />
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-lg border-none cursor-pointer flex items-center justify-center text-white transition-all duration-300 transform hover:scale-110 ${
          isOpen ? "bg-gray-700" : "bg-red-600 hover:bg-red-500"
        }`}
      >
        {isOpen ? (
          <CloseOutlined style={{ fontSize: "24px" }} />
        ) : (
          <MessageOutlined style={{ fontSize: "24px" }} />
        )}
      </button>
    </div>
  );
};

export default ChatPopup;
