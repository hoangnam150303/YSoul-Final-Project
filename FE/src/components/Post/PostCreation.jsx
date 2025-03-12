import { LoadingOutlined, ShareAltOutlined } from "@ant-design/icons";
import React, { useState } from "react";

export const PostCreation = ({ file }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [contentType, setContentType] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const films = ["Inception", "Interstellar", "The Dark Knight"];
  const musics = ["Blinding Lights", "Shape of You", "Levitating"];

  return (
    <div className="gradient-bg-hero rounded-lg shadow mb-4 p-4">
      <div className="flex space-x-3">
        <img
          className="size-12 rounded-full"
          src="https://media.licdn.com/dms/image/v2/D5603AQHqFkGID_VAfQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1704300367200?e=1747267200&v=beta&t=m74QfO9g0462KKxTjXu5EBsy__Vu_9oa62u4eBYyPTs"
          alt="avatar"
        />
        <textarea
          name="content"
          id="content"
          placeholder="What's on your mind?"
          className="w-full p-3 rounded-lg bg-base-100 hover:bg-base-200 focus:outline-none resize-none transition-colors duration-200 min-h-[100px]"
        />
      </div>
      {file && (
        <div className="mt-4">
          <img src={file} alt="Uploaded file" className="w-full rounded-lg" />
        </div>
      )}
      <div className="flex justify-between items-center mt-4">
        <label className="flex items-center  transition-colors duration-200 cursor-pointer text-white">
          <i className="bi bi-card-image mr-2" style={{ fontSize: "20px" }}></i>
          <span>Photo</span>
          <input type="file" accept="image/*" className="hidden" />
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
              Share <ShareAltOutlined />
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
                <ul className="mt-2">
                  {(contentType === "films" ? films : musics).map(
                    (item, index) => (
                      <li
                        key={index}
                        className="cursor-pointer hover:bg-gray-200 p-2 rounded-md"
                      >
                        {item}
                      </li>
                    )
                  )}
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
