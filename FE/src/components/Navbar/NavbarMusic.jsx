import { CaretLeftOutlined, CaretRightOutlined } from "@ant-design/icons";
import React from "react";

export const NavbarMusic = () => {
  return (
    <div className="w-full items-center font-semibold  pt-10 pl-60">
      <div className="flex gap-2 ">
        <CaretLeftOutlined className="w-8 p-2 bg-gray-700 rounded-2xl cursor-pointer hover:bg-gray-600" />
        <CaretRightOutlined className="w-8 p-2 bg-gray-700 rounded-2xl cursor-pointer hover:bg-gray-600" />
      </div>

      <div className="flex items-center gap-2 mt-4 ">
        <p className="bg-white text-black px-4 py-1 rounded-2xl cursor-pointer">
          All
        </p>
        <p className=" px-4 py-1 rounded-2xl cursor-pointer">Music</p>
        <p className=" px-4 py-1 rounded-2xl cursor-pointer">Podcasts</p>
      </div>
    </div>
  );
};
