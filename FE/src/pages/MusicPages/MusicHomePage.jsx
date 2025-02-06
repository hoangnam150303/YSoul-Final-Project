import React, { useContext, useState } from "react";
import { Player } from "../../components/Player/Player";
import { MusicSideBar } from "../../components/SideBar/MusicSideBar";
import { NavbarMusic } from "../../components/Navbar/NavbarMusic";
import { MusicSlider } from "../../components/Slider/MusicSlider/MusicSlider";
import { PlayerContext } from "../../context/PlayerContext";

export const MusicHomePage = () => {
  const { audioRef, track } = useContext(PlayerContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const category = [
    { id: 1, name: "Newest" },
    { id: 2, name: "Top Rated" },
    { id: 3, name: "Popular" },
    { id: 4, name: "Trending" },
  ];
  const handleToggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev); // Đổi trạng thái open
  };
  return (
    <>
      <div className="relative min-h-screen bg-black text-white flex">
        {/* Sidebar */}
        <div className="z-50">
          <MusicSideBar onToggle={handleToggleSidebar} isOpen={isSidebarOpen} />
        </div>

        {/* Phần chính */}
        <div className="flex flex-col w-full px-10 overflow-auto">
          {/* Navbar */}
          <div className="w-full">
            <NavbarMusic />
          </div>

          {/* Slider */}
          <div className="mt-6">
            {category.map((item) => (
              <MusicSlider category={item.name} key={item.id} />
            ))}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 w-full">
        <Player />
        <audio preload="auto" ref={audioRef} src={track}></audio>
      </div>
    </>
  );
};
