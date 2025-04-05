import React from "react";

export const SocialProfileHeader = ({ data }) => {
  return data.length > 0 ? (
    <div className="bg-white shadow rounded-lg mb-6">
      <div
        className="relative h-48 rounded-t-lg bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://res.cloudinary.com/dnv7bjvth/image/upload/v1743841353/b208f2cd-26a6-45b7-9834-2ae7be7b43f1.png')",
        }}
      ></div>
      <div className="p-4">
        <div className="relative -mt-20 mb-4 ">
          <img
            className="w-32 h-32 rounded-full mx-auto object-cover"
            src={
              data[0]?.avatar ||
              "https://res.cloudinary.com/dnv7bjvth/image/upload/v1737045316/8f4828ec-f6fa-4ba5-aa51-67a4da3b2cfd.png"
            }
            alt="avtar"
          />
        </div>
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold mb-2">{data[0]?.name}</h1>
          <div className="flex justify-center items-center mt-2">
            <span className="text-gray-600">
              <i className="bi bi-people"></i> {data[0]?.user_followed.length}{" "}
              followers
            </span>
            <span className="text-gray-600 ml-4">
              <i className="bi bi-person"></i> {data[0]?.user_follow.length}{" "}
              following
            </span>
            <span className="text-gray-600 ml-4">
              <i className="bi bi-file-post"> {data[1]} posts</i>
            </span>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};
