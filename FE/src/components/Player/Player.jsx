import {

  CaretRightOutlined,
  HeartFilled,
  PauseOutlined,
  RetweetOutlined,
  StepBackwardOutlined,
  StepForwardOutlined,
} from "@ant-design/icons";
import React, { useContext } from "react";
import { PlayerContext } from "../../context/PlayerContext";

export const Player = () => {
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

  // Xử lý kéo chuột để tua
  const handleSeekMouseDown = (e) => {
    const rect = seekBg.current.getBoundingClientRect();
    const onMouseMove = (eMove) => {
      const offsetX = eMove.clientX - rect.left;
      // Giới hạn giá trị từ 0 đến chiều rộng của thanh
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
    <div className="h-[10%] w-full bg-black flex justify-between items-center text-white px-96">
      <div className="hidden lg:flex items-center gap-4">
        <img className="w-12" src={information?.data?.image} alt="" />
        <div>
          <p>{information?.data?.title}</p>
          <p>{information?.artistName}</p>
        </div>
      </div>
      <div className="flex flex-col items-center gap-1 m-auto">
        <div className="flex gap-4">
          <i className="bi bi-shuffle text-white cursor-pointer"></i>
          <StepBackwardOutlined onClick={prevSong} className="w-4 cursor-pointer" />
          {playStatus ? (
            <PauseOutlined onClick={pause} className="w-4 cursor-pointer" />
          ) : (
            <CaretRightOutlined onClick={play} className="w-4 cursor-pointer" />
          )}
          <StepForwardOutlined onClick={nextSong} className="w-4 cursor-pointer" />
          {isLoop ? (
            <RetweetOutlined
              onClick={handleSongLoop}
              className="w-4 cursor-pointer text-green-600"
            />
          ) : (
            <RetweetOutlined
              onClick={handleSongLoop}
              className="w-4 cursor-pointer text-white"
            />
          )}
        </div>
        <div className="flex items-center gap-5">
          <p>
            {time.currentTime?.minute}:{time.currentTime?.seconds}
          </p>
          <div
            ref={seekBg}
            onMouseDown={handleSeekMouseDown}
            className="w-[60vw] max-w-[500px] bg-gray-300 rounded-full cursor-pointer"
          >
            <hr
              ref={seekBar}
              className="h-1 border-none w-0 bg-green-800 rounded-full"
            />
          </div>
          <p>
            {time.totalTime?.minute}:{time.totalTime?.seconds}
          </p>
        </div>
      </div>
      <div className="hidden lg:flex items-center gap-2 opacity-75">
      
        <HeartFilled style={{ fontSize: "24px", color: "red" }} />
      </div>
    </div>
  );
};
