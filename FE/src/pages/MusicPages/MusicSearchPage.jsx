import React, { useContext, useEffect, useState } from "react";
import { MovieSideBar } from "../../components/SideBar/MovieSideBar";
import { Input, Pagination, ConfigProvider, theme } from "antd";
import { Link } from "react-router-dom";
import { SearchOutlined, PlayCircleFilled } from "@ant-design/icons"; // Thêm icon
import singleApi from "../../hooks/singleApi";
import artistApi from "../../hooks/artistApi";
import albumApi from "../../hooks/albumApi";
import { Player } from "../../components/Player/Player";
import { PlayerContext } from "../../context/PlayerContext";

// Cấu hình Dark Mode cho Ant Design
const darkThemeConfig = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: "#dc2626",
    colorBgContainer: "#1f2937",
    colorBorder: "#374151",
    colorText: "#ffffff",
  },
};

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
        const [artistsRes, albumsRes, singlesRes] = await Promise.all([
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
        setArtists(artistsRes.data.artists);
        setAlbums(albumsRes.data.albums);
        setSingles(singlesRes.data.singles);
      } else if (type === "Single") {
        const res = await singleApi.getAllSingle({
          filter,
          search: searchTerm,
          typeUser: "user",
        });
        setSingles(res.data.singles);
        setArtists([]);
        setAlbums([]);
      } else if (type === "Album") {
        const res = await albumApi.getAllAlbum({
          filter,
          search: searchTerm,
          typeUser: "user",
        });
        setAlbums(res.data.albums);
        setArtists([]);
        setSingles([]);
      } else if (type === "Artist") {
        const res = await artistApi.getAllArtist({
          filter,
          search: searchTerm,
          typeUser: "user",
        });
        setArtists(res.data.artists);
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

  // Hàm render card dùng chung để code gọn hơn
  const renderGrid = (data, heading) => {
    if (!data || data.length === 0) return null;

    return (
      <div className="mb-10 animate-fade-in">
        <div className="flex items-center gap-3 mb-5 border-b border-gray-800 pb-2">
          <h2 className="text-2xl font-bold text-white tracking-wide">
            {heading}
          </h2>
          <span className="text-gray-500 text-sm font-normal">
            ({data.length} results)
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {data.map((item, index) => {
            // Xác định thông tin hiển thị dựa trên loại (Artist/Album/Single)
            const id = item.id || item._id;
            const image = item.avatar || item.image; // Artist dùng avatar, còn lại dùng image
            const title = item.name || item.title;

            // Logic click: Single thì play nhạc, còn lại chuyển trang
            const isSingle = heading === "Single";
            const Wrapper = isSingle ? "div" : Link;
            const wrapperProps = isSingle
              ? { onClick: () => updateSong(id), className: "cursor-pointer" }
              : { to: heading === "Artist" ? `/artist/${id}` : `/album/${id}` };

            return (
              <div
                key={index}
                className="group relative bg-[#181818] p-4 rounded-lg hover:bg-[#282828] transition-all duration-300 shadow-lg hover:shadow-black/50"
              >
                <Wrapper {...wrapperProps} className="block relative">
                  {/* Image Container - Dùng aspect-square cho ảnh vuông */}
                  <div
                    className={`relative w-full aspect-square mb-4 overflow-hidden shadow-lg ${
                      heading === "Artist" ? "rounded-full" : "rounded-md"
                    }`}
                  >
                    <img
                      src={image}
                      alt={heading}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Play Button Overlay (Hiện khi hover) */}
                    <div
                      className={`absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center ${
                        heading === "Artist" ? "rounded-full" : "rounded-md"
                      }`}
                    >
                      {isSingle ? (
                        <PlayCircleFilled className="text-5xl text-red-600 drop-shadow-lg transform scale-90 group-hover:scale-100 transition-transform" />
                      ) : null}
                    </div>
                  </div>

                  <h3 className="font-bold text-white text-base truncate group-hover:text-red-500 transition-colors">
                    {title}
                  </h3>
                  <p className="text-gray-400 text-xs mt-1 uppercase tracking-wider">
                    {heading}
                  </p>
                </Wrapper>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <ConfigProvider theme={darkThemeConfig}>
      <div className="bg-black min-h-screen text-white flex">
        {/* Sidebar Fixed */}
        <div
          className={`fixed inset-y-0 left-0 z-50 transition-all duration-300 ${
            isSidebarOpen ? "w-64" : "w-20"
          }`}
        >
          <MovieSideBar onToggle={handleToggleSidebar} isOpen={isSidebarOpen} />
        </div>

        {/* Main Content */}
        {/* Thêm pb-28 để chừa chỗ cho Player ở dưới đáy */}
        <div
          className={`flex-1 p-8 pb-32 transition-all duration-300 ${
            isSidebarOpen ? "ml-64" : "ml-20"
          }`}
        >
          {/* Header Filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {["Single", "Album", "Artist", "All"].map((item) => (
              <button
                key={item}
                className={`py-2 px-6 rounded-full font-medium transition-all duration-200 transform hover:scale-105 ${
                  type === item
                    ? "bg-red-600 text-white shadow-lg shadow-red-900/50"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
                onClick={() => handleTypeChange(item)}
              >
                {item}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="flex justify-center mb-10">
            <div className="w-full max-w-2xl">
              <Input
                size="large"
                placeholder="Search for songs, artists, albums..."
                prefix={<SearchOutlined className="text-gray-400 mr-2" />}
                onChange={handleSearch}
                className="rounded-full bg-gray-900 border-gray-700 hover:border-red-500 focus:border-red-500 text-white placeholder-gray-500"
                style={{
                  backgroundColor: "#1f2937",
                  color: "white",
                  padding: "10px 20px",
                }}
              />
            </div>
          </div>

          {/* Results Area */}
          <div className="min-h-[400px]">
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

          {/* Pagination */}
          <div className="mt-8 flex justify-center border-t border-gray-800 pt-6">
            <Pagination defaultCurrent={1} total={50} showSizeChanger={false} />
          </div>
        </div>

        {/* Player Fixed Bottom */}
        {/* z-index cao để đè lên mọi thứ */}
        <div className="fixed bottom-0 left-0 right-0 z-[100] bg-black border-t border-gray-800">
          <Player />
          <audio preload="auto" ref={audioRef} src={track}></audio>
        </div>
      </div>
    </ConfigProvider>
  );
};
