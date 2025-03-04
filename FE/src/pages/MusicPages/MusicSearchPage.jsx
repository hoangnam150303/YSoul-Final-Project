import React, { useContext, useEffect, useState } from "react";
import { MovieSideBar } from "../../components/SideBar/MovieSideBar";
import { Flex, Input, Pagination, Select } from "antd";
import { Link } from "react-router-dom";
import singleApi from "../../hooks/singleApi";
import artistApi from "../../hooks/artistApi";
import albumApi from "../../hooks/albumApi";
import { Player } from "../../components/Player/Player";
import { PlayerContext } from "../../context/PlayerContext";

const { Option } = Select;

export const MusicSearchPage = () => {
  const [type, setType] = useState("All");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [artists, setArtists] = useState([]);
  const [singles, setSingles] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [filter, setFilter] = useState("");
  const [totalFilm, setTotalFilm] = useState(0);
  const { audioRef, track, updateSong } = useContext(PlayerContext);

  const fetchMusic = async () => {
    if (type === "All") {
      const artistsResponse = await artistApi.getAllArtist({
        filter,
        search: searchTerm,
        typeUser: "user",
      });
      const albumsResponse = await albumApi.getAllAlbum({
        filter,
        search: searchTerm,
        typeUser: "user",
      });
      const singlesResponse = await singleApi.getAllSingle({
        filter,
        search: searchTerm,
        typeUser: "user",
      });
      setArtists(artistsResponse.data.artists);
      setAlbums(albumsResponse.data.albums);
      setSingles(singlesResponse.data.singles);
    } else if (type === "Single") {
      const singlesResponse = await singleApi.getAllSingles({
        filter,
        search: searchTerm,
        typeUser: "user",
      });
      setSingles(singlesResponse.data.singles);
      setArtists([]);
      setAlbums([]);
    } else if (type === "Album") {
      const albumsResponse = await albumApi.getAllAlbums({
        filter,
        search: searchTerm,
        typeUser: "user",
      });
      setAlbums(albumsResponse.data.albums);
      setArtists([]);
      setSingles([]);
    } else if (type === "Artist") {
      const artistsResponse = await artistApi.getAllArtists({
        filter,
        search: searchTerm,
        typeUser: "user",
      });
      setArtists(artistsResponse.data.artists);
      setAlbums([]);
      setSingles([]);
    }
  };

  const handleTypeChange = (newType) => {
    setType(newType);
  };

  const handleSearch = (e) => {
    if (e && e.target) {
      setSearchTerm(e.target.value);
    }
  };

  const handleToggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    fetchMusic();
  }, [type, searchTerm, filter]);

  // Hàm render cho grid card, tùy thuộc vào heading sẽ hiển thị khác nhau
  const renderGrid = (data, heading) => {
    if (!data || data.length === 0) return null;
    return (
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">{heading}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {data.map((item, index) => (
            <div key={index} className="bg-gray-800 p-2 rounded">
              {heading === "Artist" ? (
                <Link to={`/artist/${item.id || item._id}`}>
                  <img
                    src={item.avatar}
                    alt={`${heading} cover`}
                    className="max-h-60 rounded mx-auto"
                  />
                  <h2 className="mt-1 text-lg font-bold text-center">
                    {item.name}
                  </h2>
                </Link>
              ) : heading === "Album" ? (
                <Link to={`/album/${item.id || item._id}`}>
                  <img
                    src={item.image}
                    alt={`${heading} cover`}
                    className="max-h-60 rounded mx-auto"
                  />
                  <h2 className="mt-1 text-lg font-bold text-center">
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
                    className="max-h-60 rounded mx-auto"
                  />
                  <h2 className="mt-1 text-lg font-bold text-center">
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
      <div className="container mx-auto px-4 py-8">
        {/* Các nút lọc loại */}
        <div className="flex justify-center gap-3 mb-4">
          <button
            className={`py-2 px-4 rounded ${
              type === "Single" ? "bg-red-600" : "bg-gray-800"
            } hover:bg-red-700`}
            onClick={() => handleTypeChange("Single")}
          >
            Single
          </button>
          <button
            className={`py-2 px-4 rounded ${
              type === "Album" ? "bg-red-600" : "bg-gray-800"
            } hover:bg-red-700`}
            onClick={() => handleTypeChange("Album")}
          >
            Album
          </button>
          <button
            className={`py-2 px-4 rounded ${
              type === "Artist" ? "bg-red-600" : "bg-gray-800"
            } hover:bg-red-700`}
            onClick={() => handleTypeChange("Artist")}
          >
            Artist
          </button>
          <button
            className={`py-2 px-4 rounded ${
              type === "All" ? "bg-red-600" : "bg-gray-800"
            } hover:bg-red-700`}
            onClick={() => handleTypeChange("All")}
          >
            All
          </button>
        </div>

        {/* Input Search */}
        <div className="flex gap-2 items-stretch mb-8 max-w-2xl mx-auto">
          <Flex vertical gap={12} className="w-full p-2 rounded bg-gray-600">
            <Input
              placeholder="Search..."
              variant="borderless"
              onChange={handleSearch}
              style={{ color: "white" }}
              className="bg-gray-600"
            />
          </Flex>
        </div>

        {/* Render nội dung theo type */}
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
      <div className="fixed bottom-0 w-full">
        <Player />
        <audio preload="auto" ref={audioRef} src={track}></audio>
      </div>
      <Pagination align="end" />
    </div>
  );
};
