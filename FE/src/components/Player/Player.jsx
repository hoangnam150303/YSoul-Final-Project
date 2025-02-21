import {
  ArrowsAltOutlined,
  CaretRightOutlined,
  PauseOutlined,
  RetweetOutlined,
  StepBackwardOutlined,
  StepForwardOutlined,
} from "@ant-design/icons";
import React, { useContext } from "react";
import { PlayerContext } from "../../context/PlayerContext";

export const Player = () => {
  const {
    seekBar,
    seekBg,
    playStatus,
    play,
    pause,
    time,
    information,
    nextSong,
    prevSong,
  } = useContext(PlayerContext);
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
          <StepBackwardOutlined
            onClick={prevSong}
            className="w-4 cursor-pointer"
          />
          {playStatus ? (
            <PauseOutlined onClick={pause} className="w-4 cursor-pointer" />
          ) : (
            <CaretRightOutlined onClick={play} className="w-4 cursor-pointer" />
          )}

          <StepForwardOutlined
            onClick={nextSong}
            className="w-4 cursor-pointer"
          />
          <RetweetOutlined className="w-4 cursor-pointer" />
        </div>
        <div className="flex items-center gap-5">
          <p>
            {time.currentTime?.minute}:{time.currentTime?.seconds}
          </p>
          <div
            ref={seekBg}
            className="w-[60vw] max-w-[500px] bg-gray-300 rounded-full cursor-pointer"
          >
            <hr
              ref={seekBar}
              className="h-1 border-none w-20 bg-green-800 rounded-full"
            />
          </div>
          <p>
            {time.totalTime?.minute}:{time.totalTime?.seconds}
          </p>
        </div>
      </div>
      <div className="hidden lg:flex items-center gap-2 opacity-75">
        <i class="bi bi-file-play"></i>
        <i className="bi bi-mic"></i>
        <i class="bi bi-speaker"></i>
        <i class="bi bi-volume-down"></i>
        <div className="w-20 bg-slate-50 h-1 rounded"></div>
        <i class="bi bi-pip"></i>
        <ArrowsAltOutlined className="w-4" />
      </div>
    </div>
  );
};
