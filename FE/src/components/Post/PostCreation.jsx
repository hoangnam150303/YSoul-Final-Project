import { LoadingOutlined, ShareAltOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import filmApi from "../../hooks/filmApi";
import singleApi from "../../hooks/singleApi";
import postApi from "../../hooks/postApi";
import { message } from "antd";
import { useSelector } from "react-redux";

export const PostCreation = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [contentType, setContentType] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [films, setFilms] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [musics, setMusics] = useState([]);
  const [file, setFile] = useState(null);
  const userAvatar = useSelector((state) => state.user.avatar);

  const fetchFilms = async () => {
    try {
      const response = await filmApi.getAllFilm({
        typeUser: "user",
      });
      setFilms(response.data.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchMusics = async () => {
    try {
      const response = await singleApi.getAllSingle({
        filter: "",
        search: "",
        typeUser: "user",
      });
      setMusics(response.data.singles);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFileChange = (e) => {
    try {
      const file = e.target.files[0];
      setFile(file); // Lưu file thật
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsPending(true);
      const formData = new FormData();
      formData.append(
        "content",
        document.getElementById("content").value || ""
      );
      if (contentType === "films" && selectedItem)
        formData.append("film_id", selectedItem);
      if (contentType === "musics" && selectedItem)
        formData.append("single_id", selectedItem);
      if (file) formData.append("image", file);

      console.log("[createPost] sending...");
      const res = await postApi.postCreatePost(formData);
      if (res?.status === 200) {
        message.success("Post created successfully!");
        document.getElementById("content").value = "";
        setFile(null);
        setSelectedItem(null);
        setContentType(null); // Reset content type
      }
    } catch (err) {
      console.error("Error creating post", err);
      message.error(err?.response?.data?.message || "Create post failed");
    } finally {
      setIsPending(false);
    }
  };

  useEffect(() => {
    fetchFilms();
    fetchMusics();
  }, []);

  return (
    // ✨ Container Dark Theme
    <div className="bg-[#1f1f1f] rounded-xl shadow-lg border border-[#2a2a2a] mb-6 p-4">
      <div className="flex space-x-3">
        {/* Avatar với viền gradient nhẹ */}
        <div className="p-[2px] rounded-full bg-gradient-to-tr from-gray-700 to-gray-900 h-fit">
          <img
            className="size-10 rounded-full border border-[#1f1f1f]"
            src={userAvatar}
            alt="avatar"
          />
        </div>

        {/* Input Area */}
        <textarea
          name="content"
          id="content"
          placeholder="What's on your mind?"
          className="w-full p-3 rounded-lg bg-[#141414] text-white placeholder-gray-500 border border-[#333] focus:border-gray-500 focus:outline-none resize-none transition-all duration-200 min-h-[100px]"
        />
      </div>

      {/* Preview Image */}
      {file && (
        <div className="mt-4 relative group">
          <img
            src={URL.createObjectURL(file)}
            alt="Uploaded file"
            className="w-full h-64 object-cover rounded-lg border border-[#333]"
          />
          <button
            onClick={() => setFile(null)}
            className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 hover:bg-red-500 transition-colors"
          >
            <i className="bi bi-x text-xl"></i>
          </button>
        </div>
      )}

      {/* Selected Item Preview (Film/Music) */}
      {selectedItem && (
        <div className="mt-4 flex items-center p-3 border border-[#333] rounded-lg bg-[#141414] relative">
          {(() => {
            const isFilm = contentType === "films";
            const selectedContent = (isFilm ? films : musics).find(
              (item) => item._id === selectedItem || item.id === selectedItem
            );

            return (
              <>
                <span className="font-bold text-gray-400 mr-3 text-xs uppercase tracking-wider">
                  {isFilm ? "Watching:" : "Listening to:"}
                </span>
                <img
                  src={
                    selectedContent?.small_image || selectedContent?.image || ""
                  }
                  alt="Selected"
                  className="w-10 h-10 rounded object-cover mr-3 border border-[#333]"
                />
                <span className="text-white font-medium text-sm">
                  {selectedContent?.name || selectedContent?.title || "Unknown"}
                </span>
                <button
                  onClick={() => {
                    setSelectedItem(null);
                    setContentType(null);
                  }}
                  className="absolute top-2 right-2 text-gray-500 hover:text-red-500 transition-colors"
                >
                  <i className="bi bi-x-circle-fill"></i>
                </button>
              </>
            );
          })()}
        </div>
      )}

      {/* Action Bar */}
      <div className="flex justify-between items-center mt-4 pt-3 border-t border-[#2a2a2a]">
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer text-gray-400 hover:text-green-400 transition-colors duration-200 group">
            <div className="bg-[#2a2a2a] p-2 rounded-full group-hover:bg-[#1a1a1a] transition-colors">
              <i className="bi bi-card-image text-green-500"></i>
            </div>
            <span className="text-sm font-medium">Photo</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileChange(e)}
            />
          </label>

          <button
            className="flex items-center gap-2 cursor-pointer text-gray-400 hover:text-blue-400 transition-colors duration-200 group"
            onClick={() => setShowPopup(true)}
          >
            <div className="bg-[#2a2a2a] p-2 rounded-full group-hover:bg-[#1a1a1a] transition-colors">
              <i className="bi bi-film text-blue-500"></i>
            </div>
            <span className="text-sm font-medium">Film/Music</span>
          </button>
        </div>

        <button
          type="button"
          className="bg-blue-600 text-white rounded-full px-6 py-2 hover:bg-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg shadow-blue-900/30 flex items-center gap-2"
          onClick={handleSubmit}
          disabled={isPending}
        >
          {isPending ? (
            <LoadingOutlined className="text-lg" />
          ) : (
            <>
              Post <ShareAltOutlined />
            </>
          )}
        </button>
      </div>

      {/* ✨ Dark Modal Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-[9999]">
          <div className="bg-[#1f1f1f] rounded-xl w-96 shadow-2xl border border-[#333] relative z-[10000] overflow-hidden animate-fade-in-up">
            <div className="p-4 border-b border-[#333] flex justify-between items-center bg-[#1a1a1a]">
              <h2 className="text-white font-semibold m-0">Add to your post</h2>
              <button
                onClick={() => setShowPopup(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <div className="p-4">
              <div className="flex gap-2 mb-4 bg-[#141414] p-1 rounded-lg">
                <button
                  className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
                    contentType === "films"
                      ? "bg-[#2a2a2a] text-white shadow"
                      : "text-gray-400 hover:text-white"
                  }`}
                  onClick={() => setContentType("films")}
                >
                  <i className="bi bi-film mr-2"></i> Film
                </button>
                <button
                  className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
                    contentType === "musics"
                      ? "bg-[#2a2a2a] text-white shadow"
                      : "text-gray-400 hover:text-white"
                  }`}
                  onClick={() => setContentType("musics")}
                >
                  <i className="bi bi-music-note-beamed mr-2"></i> Music
                </button>
              </div>

              {contentType && (
                <div className="animate-fade-in">
                  <h3 className="text-gray-400 text-xs uppercase tracking-wider mb-2 font-bold">
                    Select {contentType === "films" ? "Movie" : "Song"}
                  </h3>
                  <ul className="overflow-y-auto max-h-60 scrollbar-thin scrollbar-thumb-[#333] space-y-1">
                    {(contentType === "films" ? films : musics).map((item) => (
                      <li
                        key={item._id || item.id}
                        className="cursor-pointer hover:bg-[#2a2a2a] p-2 rounded-lg flex items-center gap-3 transition-colors group"
                        onClick={() => {
                          setSelectedItem(item._id || item.id);
                          setShowPopup(false);
                        }}
                      >
                        <img
                          src={item.small_image || item.image}
                          alt=""
                          className="w-10 h-10 rounded object-cover group-hover:scale-105 transition-transform"
                        />
                        <span className="text-gray-300 group-hover:text-white text-sm font-medium truncate">
                          {item.name || item.title}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {!contentType && (
                <div className="text-center py-8 text-gray-500">
                  <i className="bi bi-collection-play text-4xl mb-2 block opacity-50"></i>
                  Select a category above
                </div>
              )}
            </div>

            <div className="p-4 border-t border-[#333] bg-[#1a1a1a] flex justify-end">
              <button
                className="px-4 py-2 text-gray-300 hover:text-white hover:bg-[#2a2a2a] rounded-lg transition-colors text-sm font-medium"
                onClick={() => setShowPopup(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
