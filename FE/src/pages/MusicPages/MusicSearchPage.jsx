import React, { useContext, useEffect, useState } from "react";
import { MovieSideBar } from "../../components/SideBar/MovieSideBar";
import { Flex, Input, Pagination } from "antd";
import { Link } from "react-router-dom";
import singleApi from "../../hooks/singleApi";
import artistApi from "../../hooks/artistApi";
import albumApi from "../../hooks/albumApi";
import { Player } from "../../components/Player/Player";
import { PlayerContext } from "../../context/PlayerContext";

export const MusicSearchPage = () => {
  const [type, setType] = useState("All");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [artists, setArtists] = useState([]);
  const [singles, setSingles] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [filter, setFilter] = useState("");
  const { audioRef, track, updateSong } = useContext(PlayerContext);

  const fetchMusic = async () => {
    try {
      if (type === "All") {
        const [artistsResponse, albumsResponse, singlesResponse] =
          await Promise.all([
            artistApi.getAllArtist({
              filter,
              search: searchTerm,
              typeUser: "user",
            }),
            albumApi.getAllAlbum({
              filter,
              search: searchTerm,
              typeUser: "user",
            }),
            singleApi.getAllSingle({
              filter,
              search: searchTerm,
              typeUser: "user",
            }),
          ]);
        setArtists(artistsResponse.data.artists);
        setAlbums(albumsResponse.data.albums);
        setSingles(singlesResponse.data.singles);
      } else if (type === "Single") {
        const singlesResponse = await singleApi.getAllSingle({
          filter,
          search: searchTerm,
          typeUser: "user",
        });
        setSingles(singlesResponse.data.singles);
        setArtists([]);
        setAlbums([]);
      } else if (type === "Album") {
        const albumsResponse = await albumApi.getAllAlbum({
          filter,
          search: searchTerm,
          typeUser: "user",
        });
        setAlbums(albumsResponse.data.albums);
        setArtists([]);
        setSingles([]);
      } else if (type === "Artist") {
        const artistsResponse = await artistApi.getAllArtist({
          filter,
          search: searchTerm,
          typeUser: "user",
        });
        setArtists(artistsResponse.data.artists);
        setAlbums([]);
        setSingles([]);
      }
    } catch (err) {
      console.error("Fetch music error:", err);
    }
  };

  const handleTypeChange = (newType) => setType(newType);
  const handleSearch = (e) => setSearchTerm(e.target.value);
  const handleToggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  useEffect(() => {
    fetchMusic();
  }, [type, searchTerm, filter]);

  const renderGrid = (data, heading) => {
    if (!data || data.length === 0) return null;
    return (
      <div className="mb-8">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 text-center md:text-left">
          {heading}
        </h2>
        <div
          className="
          grid 
          grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 
          gap-2 sm:gap-3 md:gap-4
        "
        >
          {data.map((item, index) => (
            <div
              key={index}
              className="bg-[#1f1f1f] p-1 sm:p-2 md:p-3 rounded-lg hover:scale-105 transition-transform duration-200"
            >
              {heading === "Artist" ? (
                <Link to={`/artist/${item.id || item._id}`}>
                  <img
                    src={item.avatar}
                    alt={`${heading} cover`}
                    className="
                    w-full object-cover rounded-lg 
                    max-h-[130px] sm:max-h-[160px] md:max-h-[200px] lg:max-h-[230px]
                  "
                  />
                  <h2 className="mt-1 text-[12px] sm:text-sm md:text-base font-semibold text-center truncate">
                    {item.name}
                  </h2>
                </Link>
              ) : heading === "Album" ? (
                <Link to={`/album/${item.id || item._id}`}>
                  <img
                    src={item.image}
                    alt={`${heading} cover`}
                    className="
                    w-full object-cover rounded-lg 
                    max-h-[130px] sm:max-h-[160px] md:max-h-[200px] lg:max-h-[230px]
                  "
                  />
                  <h2 className="mt-1 text-[12px] sm:text-sm md:text-base font-semibold text-center truncate">
                    {item.title}
                  </h2>
                </Link>
              ) : heading === "Single" ? (
                <div
                  onClick={() => updateSong(item.id || item._id)}
                  className="cursor-pointer"
                >
                  <img
                    src={item.image}
                    alt={`${heading} cover`}
                    className="
                    w-full object-cover rounded-lg 
                    max-h-[130px] sm:max-h-[160px] md:max-h-[200px] lg:max-h-[230px]
                  "
                  />
                  <h2 className="mt-1 text-[12px] sm:text-sm md:text-base font-semibold text-center truncate">
                    {item.title}
                  </h2>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-black min-h-screen text-white">
      <div className="z-50">
        <MovieSideBar onToggle={handleToggleSidebar} isOpen={isSidebarOpen} />
      </div>
      <div className="container mx-auto px-2 sm:px-4 py-6 md:py-8">
        {/* Filter buttons */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-4">
          {["Single", "Album", "Artist", "All"].map((item) => (
            <button
              key={item}
              className={`py-2 px-3 sm:px-4 rounded text-sm sm:text-base ${
                type === item ? "bg-red-600" : "bg-gray-800"
              } hover:bg-red-700 transition`}
              onClick={() => handleTypeChange(item)}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="flex justify-center mb-8">
          <div className="w-full max-w-md px-2 sm:px-4">
            <Flex vertical gap={12} className="w-full p-2 rounded bg-gray-600">
              <Input
                placeholder="Search..."
                variant="borderless"
                onChange={handleSearch}
                style={{ color: "white" }}
                className="bg-gray-600 text-sm sm:text-base"
              />
            </Flex>
          </div>
        </div>

        {/* Render results */}
        {type === "All" ? (
          <>
            {renderGrid(artists, "Artist")}
            {renderGrid(albums, "Album")}
            {renderGrid(singles, "Single")}
          </>
        ) : type === "Artist" ? (
          renderGrid(artists, "Artist")
        ) : type === "Album" ? (
          renderGrid(albums, "Album")
        ) : type === "Single" ? (
          renderGrid(singles, "Single")
        ) : null}
      </div>

      {/* Player */}
      <div className="fixed bottom-0 w-full">
        <Player />
        <audio preload="auto" ref={audioRef} src={track}></audio>
      </div>

      <div className="px-4 py-2">
        <Pagination align="end" />
      </div>
    </div>
  );
};
