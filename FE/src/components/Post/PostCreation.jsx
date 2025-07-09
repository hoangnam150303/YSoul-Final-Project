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
      console.log(11111);
      const formData = new FormData();

      formData.append("content", document.getElementById("content").value);
      if (contentType === "films") {
        formData.append("film_id", selectedItem);
      } else if (contentType === "musics") {
        formData.append("single_id", selectedItem);
      }
      if (file) {
        formData.append("image", file);
      }

      const response = await postApi.postCreatePost(formData);
      if (response.status === 200) {
        message.success("Post created successfully!");
        setIsPending(false);
        document.getElementById("content").value = "";
        setFile(null);
        setSelectedItem(null);
      }
    } catch (error) {
      console.error("Error creating post", error);
    }
  };

  useEffect(() => {
    fetchFilms();
    fetchMusics();
  }, []);

  return (
    <div className="gradient-bg-hero rounded-lg shadow mb-4 p-4">
      <div className="flex space-x-3">
        <img className="size-12 rounded-full" src={userAvatar} alt="avatar" />
        <textarea
          name="content"
          id="content"
          placeholder="What's on your mind?"
          className="w-full p-3 rounded-lg bg-base-100 hover:bg-base-200 focus:outline-none resize-none transition-colors duration-200 min-h-[100px]"
        />
      </div>
      {file && (
        <div className="mt-4">
          <img
            src={URL.createObjectURL(file)}
            alt="Uploaded file"
            className="w-full rounded-lg"
          />
        </div>
      )}
      {selectedItem && (
        <div className="mt-4 flex items-center p-3 border rounded-lg bg-gray-100">
          {(() => {
            const isFilm = contentType === "films";
            const selectedContent = (isFilm ? films : musics).find(
              (item) => item._id === selectedItem || item.id === selectedItem
            );

            return (
              <>
                <span className="font-semibold mr-2">
                  {isFilm ? "Film:" : "Music:"}
                </span>
                <img
                  src={
                    selectedContent?.small_image || selectedContent?.image || ""
                  }
                  alt="Selected"
                  className="w-12 h-12 rounded-full object-cover mx-3"
                />
                <span>
                  {selectedContent?.name || selectedContent?.title || "Unknown"}
                </span>
              </>
            );
          })()}
        </div>
      )}

      <div className="flex justify-between items-center mt-4">
        <label className="flex items-center  transition-colors duration-200 cursor-pointer text-white">
          <i className="bi bi-card-image mr-2" style={{ fontSize: "20px" }}></i>
          <span>Photo</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileChange(e)}
          />
        </label>

        <button
          className="flex items-center  transition-colors duration-200 cursor-pointer text-white"
          onClick={() => setShowPopup(true)}
        >
          <i className="bi bi-film mr-2" style={{ fontSize: "20px" }}></i>
          <span>Film/Music</span>
        </button>

        <button
          className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition-colors duration-200"
          onClick={() => setIsPending(true)}
        >
          {isPending ? (
            <LoadingOutlined className="size-5" />
          ) : (
            <>
              Share <ShareAltOutlined onClick={handleSubmit} />
            </>
          )}
        </button>
      </div>

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg w-96 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Share Film or Music</h2>
            <div className="flex justify-around">
              <button
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                onClick={() => setContentType("films")}
              >
                Share Film
              </button>
              <button
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                onClick={() => setContentType("musics")}
              >
                Share Music
              </button>
            </div>
            {contentType && (
              <div className="mt-4">
                <h3 className="text-md font-semibold">
                  Select {contentType === "films" ? "a Film" : "a Music"}
                </h3>
                <ul className="mt-2 overflow-y-scroll max-h-48">
                  {(contentType === "films" ? films : musics).map((item) => (
                    <li
                      key={item._id || item.id}
                      className="cursor-pointer hover:bg-gray-200 p-2 rounded-md flex items-center gap-3"
                      onClick={() => setSelectedItem(item._id || item.id)}
                    >
                      <img
                        src={item.small_image || item.image}
                        alt=""
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <span>{item.name || item.title}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <button
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              onClick={() => setShowPopup(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
