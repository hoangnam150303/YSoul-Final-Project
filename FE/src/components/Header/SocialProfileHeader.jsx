import React from "react";

export const SocialProfileHeader = ({ data }) => {
  // Kiểm tra data có tồn tại và có phần tử không
  return data && data.length > 0 ? (
    <div className="bg-[#0f0f0f] shadow-2xl rounded-xl mb-6 border border-[#2a2a2a] overflow-hidden relative group">
      {/* --- Cover Image --- */}
      <div
        className="relative h-64 w-full bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://res.cloudinary.com/dnv7bjvth/image/upload/v1743841353/b208f2cd-26a6-45b7-9834-2ae7be7b43f1.png')",
        }}
      >
        {/* Overlay gradient để làm mượt phần chuyển tiếp */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-transparent to-transparent opacity-90"></div>
      </div>

      {/* --- Profile Content --- */}
      <div className="px-6 pb-8 relative">
        {/* Avatar Section */}
        <div className="flex flex-col items-center -mt-24 mb-6">
          {/* Gradient Ring bao quanh Avatar */}
          <div className="p-[3px] rounded-full bg-gradient-to-tr from-red-600 to-purple-600 shadow-2xl relative z-10 transition-transform duration-300 hover:scale-105">
            <img
              className="w-36 h-36 rounded-full object-cover border-4 border-[#0f0f0f]"
              src={
                data[0]?.avatar ||
                "https://res.cloudinary.com/dnv7bjvth/image/upload/v1737045316/8f4828ec-f6fa-4ba5-aa51-67a4da3b2cfd.png"
              }
              alt="avatar"
            />
          </div>
        </div>

        {/* Info Section */}
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-1 text-white tracking-wide">
            {data[0]?.name}
          </h1>
          {/* Giả sử có username, nếu không có thể ẩn hoặc để placeholder */}
          <p className="text-gray-500 text-sm mb-8">
            Personal Blog • Music Lover
          </p>

          {/* Stats Grid - Box chỉ số đẹp hơn */}
          <div className="inline-flex justify-center items-center gap-6 bg-[#1a1a1a] py-4 px-10 rounded-2xl border border-[#333] shadow-inner">
            {/* Followers */}
            <div className="flex flex-col items-center group/stat cursor-pointer hover:text-red-500 transition-colors">
              <span className="text-2xl font-bold text-white group-hover/stat:text-red-500 transition-colors">
                {data[0]?.user_followed?.length || 0}
              </span>
              <span className="text-xs text-gray-400 uppercase tracking-wider flex items-center gap-1 font-semibold mt-1">
                <i className="bi bi-people text-sm"></i> Followers
              </span>
            </div>

            {/* Divider */}
            <div className="w-px h-10 bg-[#333]"></div>

            {/* Following */}
            <div className="flex flex-col items-center group/stat cursor-pointer hover:text-red-500 transition-colors">
              <span className="text-2xl font-bold text-white group-hover/stat:text-red-500 transition-colors">
                {data[0]?.user_follow?.length || 0}
              </span>
              <span className="text-xs text-gray-400 uppercase tracking-wider flex items-center gap-1 font-semibold mt-1">
                <i className="bi bi-person text-sm"></i> Following
              </span>
            </div>

            {/* Divider */}
            <div className="w-px h-10 bg-[#333]"></div>

            {/* Posts */}
            <div className="flex flex-col items-center group/stat cursor-pointer hover:text-red-500 transition-colors">
              <span className="text-2xl font-bold text-white group-hover/stat:text-red-500 transition-colors">
                {data[1] || 0}
              </span>
              <span className="text-xs text-gray-400 uppercase tracking-wider flex items-center gap-1 font-semibold mt-1">
                <i className="bi bi-file-post text-sm"></i> Posts
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};
