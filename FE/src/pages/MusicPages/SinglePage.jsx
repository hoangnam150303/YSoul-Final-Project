import React, { useContext } from "react";
import { Button } from "antd";
import {
  PlayCircleOutlined,
  PauseCircleOutlined,
  StepBackwardOutlined,
  StepForwardOutlined,
  HeartOutlined,
  MenuOutlined,
  MinusOutlined,
  CopyOutlined,
} from "@ant-design/icons";
import { PlayerContext } from "../../context/PlayerContext";

const SinglePage = () => {
  const {
    audioRef,
    seekBar,
    seekBg,
    playStatus,
    play,
    pause,
    time,
    information,
    nextSong,
    prevSong,
    handleSongLoop,
    isLoop,
  } = useContext(PlayerContext);

  // Xử lý kéo seekBar
  const handleSeekMouseDown = (e) => {
    const rect = seekBg.current.getBoundingClientRect();
    const onMouseMove = (eMove) => {
      const offsetX = eMove.clientX - rect.left;
      const percent = Math.max(0, Math.min(1, offsetX / rect.width));
      seekBar.current.style.width = percent * 100 + "%";
    };
    const onMouseUp = (eUp) => {
      const offsetX = eUp.clientX - rect.left;
      const percent = Math.max(0, Math.min(1, offsetX / rect.width));
      if (audioRef.current && audioRef.current.duration) {
        const newTime = percent * audioRef.current.duration;
        audioRef.current.currentTime = newTime;
      }
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  return (
    <div className="min-h-screen bg-gray-800 flex flex-col items-center justify-center p-4">
      {/* Image */}
      <div className="w-64 h-64 bg-gray-300 mb-6 flex items-center justify-center overflow-hidden">
        {information?.data?.image ? (
          <img
            src={information.data.image}
            alt="Song"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-gray-500">No Image</div>
        )}
      </div>

      {/* Song Info */}
      <div className="text-center mb-6">
        <h2 className="text-2xl text-white font-bold">
          {information?.data?.title || "Song Title"}
        </h2>
        <p className="text-gray-300">
          {information?.artistName || "Artist Name"}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-md flex flex-col items-center mb-4">
        <div className="w-full flex items-center justify-between text-gray-400 text-sm mb-1">
          <span>
            {time.currentTime?.minute || "0"}:
            {time.currentTime?.seconds || "00"}
          </span>
          <span>
            {time.totalTime?.minute || "0"}:{time.totalTime?.seconds || "00"}
          </span>
        </div>

        {/* Seek Bar */}
        <div
          ref={seekBg}
          onMouseDown={handleSeekMouseDown}
          className="w-full bg-gray-300 h-2 rounded-full cursor-pointer relative"
        >
          <div
            ref={seekBar}
            className="bg-white h-2 rounded-full"
            style={{ width: "0%" }}
          ></div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between w-full max-w-md text-white mt-4">
        <HeartOutlined className="text-2xl" />
        <StepBackwardOutlined
          onClick={prevSong}
          className="text-2xl cursor-pointer"
        />
        <Button
          shape="circle"
          icon={
            playStatus ? (
              <PauseCircleOutlined className="text-4xl" />
            ) : (
              <PlayCircleOutlined className="text-4xl" />
            )
          }
          size="large"
          onClick={playStatus ? pause : play}
          className="bg-white text-black"
        />
        <StepForwardOutlined
          onClick={nextSong}
          className="text-2xl cursor-pointer"
        />
        <MinusOutlined className="text-2xl" />
      </div>

      {/* Bottom Icons */}
      <div className="flex items-center justify-between w-full max-w-md text-gray-400 text-xl mt-6">
        <CopyOutlined />
        <MenuOutlined />
      </div>
    </div>
  );
};

export default SinglePage;
