import {
  CaretRightOutlined,
  HeartFilled,
  PauseOutlined,
  RetweetOutlined,
  StepBackwardOutlined,
  StepForwardOutlined,
} from "@ant-design/icons";
import React, { useContext, useEffect, useState } from "react";
import { PlayerContext } from "../../context/PlayerContext";
import wishListApi from "../../hooks/wishListApi";
import { message } from "antd";
export const Player = ({invisible}) => {
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
  const [isFavorite, setIsFavorite] = useState(false);
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

  const formatTime = (minute, second) => {
    const mm = minute?.toString().padStart(2, "0") || "00";
    const ss = second?.toString().padStart(2, "0") || "00";
    return `${mm}:${ss}`;
  };
  const addToWishList = async () => {
    try {
      console.log(information.data.id);

      const response = await wishListApi.addToWishList(
        "single",
        information.data.id
      );
      if (response.status === 200) {
        message.success("Added to wishlist");
        setIsFavorite(true);
      }
    } catch (error) {
      message.error("Failed to add to wishlist");
    }
  };
  const checkIsFavorite = async () => {
    try {
      const response = await wishListApi.checkIsFavourite(
        "single",
        information.data.id
      );
      if (response.status === 200) {
        console.log(response.data);
        setIsFavorite(response.data.isFavorite);
      }
    } catch (error) {
      message.error("Failed to check wishlist status");
    }
  };
  useEffect(() => {
    if (information?.data?.id) {
      checkIsFavorite();
    }
  }, [information]);
  return (
    <div className="h-[90px] w-full bg-black text-white flex items-center justify-between px-10 lg:px-20 shadow-lg">
      {/* Left: Song Info */}
      <div className="flex items-center gap-4 w-[20%] min-w-[150px]">
        <img
          className="w-14 h-14 rounded object-cover"
          src={information?.data?.image}
          alt=""
        />
        <div className="flex flex-col">
          <p className="text-sm font-semibold truncate w-[120px]">
            {information?.data?.title}
          </p>
          <p className="text-xs text-gray-400 truncate w-[120px]">
            {information?.artistName}
          </p>
        </div>
      </div>

      {/* Center: Controls & Seekbar */}
      <div className="flex flex-col items-center w-[60%] max-w-[600px]">
        {/* Controls */}
        <div className="flex gap-4 items-center justify-center mb-2">
          <i className="bi bi-shuffle text-white cursor-pointer"></i>
          <StepBackwardOutlined onClick={prevSong} className="cursor-pointer" />
          {playStatus ? (
            <PauseOutlined onClick={pause} className="cursor-pointer text-xl" />
          ) : (
            <CaretRightOutlined
              onClick={play}
              className="cursor-pointer text-xl"
            />
          )}
          <StepForwardOutlined onClick={nextSong} className="cursor-pointer" />
          <RetweetOutlined
            onClick={handleSongLoop}
            className={`cursor-pointer ${
              isLoop ? "text-green-500" : "text-white"
            }`}
          />
        </div>

        {/* Seek bar */}
        <div className="flex items-center gap-3 w-full">
          <p className="text-xs w-[40px] text-right">
            {formatTime(time.currentTime?.minute, time.currentTime?.seconds)}
          </p>
          <div
            ref={seekBg}
            onMouseDown={handleSeekMouseDown}
            className="flex-grow h-1 bg-gray-400 rounded-full cursor-pointer relative"
          >
            <div
              ref={seekBar}
              className="h-full bg-green-600 rounded-full w-0"
            />
          </div>
          <p className="text-xs w-[40px] text-left">
            {formatTime(time.totalTime?.minute, time.totalTime?.seconds)}
          </p>
        </div>
      </div>

      {/* Right: Like / Options */}
      <div className="flex items-center justify-end gap-2 w-[20%] min-w-[100px]">
        <HeartFilled
          style={{ fontSize: "22px", color: isFavorite ? "red" : "white" }}
          onClick={() => addToWishList()}
        />
      </div>
    </div>
  );
};
