import React from "react";

export const NavbarMusic = () => {
  return (
    <div className="w-full items-center font-semibold  pt-10 pl-60">
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
