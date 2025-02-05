import {
  ArrowsAltOutlined,
  CaretRightOutlined,
  RetweetOutlined,
  StepBackwardOutlined,
  StepForwardOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import React from "react";

export const Player = () => {
  return (
    <div className="h-[10%] w-full bg-black flex justify-between items-center text-white px-96">
      <div className="hidden lg:flex items-center gap-4">
        <img
          className="w-12"
          src="https://res.cloudinary.com/dnv7bjvth/image/upload/v1738655275/71Q82A9HWBL_mtuanu.jpg"
          alt=""
        />
        <div>
          <p>Confidnet</p>
          <p>This is description</p>
        </div>
      </div>
      <div className="flex flex-col items-center gap-1 m-auto">
        <div className="flex gap-4">
          <i className="bi bi-shuffle text-white cursor-pointer"></i>
          <StepBackwardOutlined className="w-4 cursor-pointer" />
          <CaretRightOutlined className="w-4 cursor-pointer" />
          <StepForwardOutlined className="w-4 cursor-pointer" />
          <RetweetOutlined className="w-4 cursor-pointer" />
        </div>
        <div className="flex items-center gap-5">
          <p>1:06</p>
          <div className="w-[60vw] max-w-[500px] bg-gray-300 rounded-full cursor-pointer">
            <hr className="h-1 border-none w-20 bg-green-800 rounded-full" />
          </div>
          <p>3:20</p>
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
