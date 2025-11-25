import React, { useContext, useRef, useState } from "react";
import { message } from "antd";
import { ChatContext } from "../../context/ChatContext";
import { SendOutlined } from "@ant-design/icons";

const ChatInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage } = useContext(ChatContext);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && !file.type.startsWith("image/")) {
      message.error("Please select an image file.");
      return;
    }
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;
    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });
      setText("");
      removeImage();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="p-4 w-full bg-[#1f1f1f] border-t border-[#2a2a2a]">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-3">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-[#333]"
            />

            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center text-xs font-bold transition-colors"
              type="button"
            >
              X
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-3">
        <div className="flex-1 flex items-center gap-2 bg-[#2a2a2a] rounded-full border border-[#333] pr-2">
          {/* Input Text */}
          <input
            type="text"
            className="flex-1 px-4 py-2 bg-transparent text-white placeholder-gray-500 rounded-full focus:outline-none"
            placeholder="Type your message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          {/* Input File */}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />
          {/* Image Button */}
          <button
            type="button"
            className={`hidden sm:flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
              imagePreview ? "text-red-500" : "text-gray-500 hover:text-white"
            }`}
            onClick={() => fileInputRef.current.click()}
          >
            <i className="bi bi-card-image text-lg"></i>
          </button>
        </div>
        {/* Send Button */}
        <button
          type="submit"
          className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
            !text.trim() && !imagePreview
              ? "bg-gray-700 text-gray-500 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-500 text-white"
          }`}
        >
          <SendOutlined style={{ fontSize: "1.2rem" }} />
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
