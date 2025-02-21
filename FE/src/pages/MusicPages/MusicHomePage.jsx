import React, { useContext, useEffect, useState } from "react";
import { Player } from "../../components/Player/Player";
import { MusicSideBar } from "../../components/SideBar/MusicSideBar";
import { NavbarMusic } from "../../components/Navbar/NavbarMusic";
import { AlbumSlider } from "../../components/Slider/MusicSlider/AlbumSlider";
import { PlayerContext } from "../../context/PlayerContext";
import { SingleSlider } from "../../components/Slider/MusicSlider/SingleSlider";
import { ArtistSlider } from "../../components/Slider/MusicSlider/ArtistSlider";

export const MusicHomePage = () => {
  const { audioRef, track } = useContext(PlayerContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedType, setSelectedType] = useState("All"); // <-- State được quản lý ở đây
  useEffect(() => {
  }, [selectedType]);
  const category = [
    { id: 1, name: "Newest" },
    { id: 2, name: "Popular" },
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
          {/* Navbar - truyền state và setter xuống Navbar */}
          <div className="w-full">
            <NavbarMusic
              selectedType={selectedType}
              onTypeChange={setSelectedType}
            />
          </div>

          {/* Slider */}
          <div>
            {selectedType === "All" ? (
              <>
                <div className="mt-6">
                  <h4 className="w-full items-center font-semibold text-2xl pt-10 pl-60 pb-5">
                    Artist
                  </h4>
                  {category.map((item) => (
                    <ArtistSlider category={item.name} key={item.id} />
                  ))}
                </div>
                <div className="mt-6">
                  <h4 className="w-full items-center font-semibold text-2xl pt-10 pl-60 pb-5">
                    Album
                  </h4>
                  {category.map((item) => (
                    <AlbumSlider category={item.name} key={item.id} />
                  ))}
                </div>
                <div className="mt-6">
                  <h4 className="w-full items-center font-semibold text-2xl pt-10 pl-60 pb-5">
                    Single
                  </h4>
                  {category.map((item) => (
                    <SingleSlider category={item.name} key={item.id} />
                  ))}
                </div>
              </>
            ) : selectedType === "Single" ? (
              <div className="mt-6">
                <h4 className="w-full items-center font-semibold text-2xl pt-10 pl-60 pb-5">
                  Single
                </h4>
                {category.map((item) => (
                  <SingleSlider category={item.name} key={item.id} />
                ))}
              </div>
            ) : (
              <div className="mt-6">
                <h4 className="w-full items-center font-semibold text-2xl pt-10 pl-60 pb-5">
                  Artist
                </h4>
                {category.map((item) => (
                  <ArtistSlider category={item.name} key={item.id} />
                ))}
              </div>
            )}
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
