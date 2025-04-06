import React, { useContext, useRef, useState } from "react";
import { message } from "antd";
import { ChatContext } from "../../context/ChatContext";
const ChatInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage } = useContext(ChatContext);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      message.error("Please select an image file.");
      return;
    }
    // const reader = new FileReader();
    // reader.onloadend = () => {
    //   setImagePreview(reader.result);
    // };
    // reader.readAsDataURL(file);
    setImagePreview(URL.createObjectURL(file));
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
    <div className="p-4 w-full">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-gray-300"
            />
            <button
              onClick={removeImage}
              className=" font-boldabsolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-slate-400 flex items-center justify-center"
              type="button"
            >
              X
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full sm:px-4 py-2 rounded-lg border border-gray-300 focus:outline-none"
            placeholder="Type your message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />
          <button
            type="button"
            className={`hidden sm:flex ${
              imagePreview ? "text-emerald-500" : "text-gray-500"
            }`}
            onClick={() => fileInputRef.current.click()}
          >
            <i className="bi bi-card-image" style={{ fontSize: "1.5rem" }}></i>
          </button>
        </div>
        <button
          type="submit"
          className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-400"
          disabled={!text.trim() && !imagePreview}
        >
          <i className="bi bi-send" style={{ fontSize: "1.5rem" }}></i>
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
