import React, { useState, useEffect } from "react";
import { MovieSideBar } from "../../components/SideBar/MovieSideBar";
import {
  CaretRightOutlined,
  CommentOutlined,
  HeartFilled,
  HeartOutlined,
  ShareAltOutlined,
  CloseOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";
import { Link, useNavigate, useParams } from "react-router-dom";
import ReactPlayer from "react-player";
import { message, Rate, ConfigProvider, theme, Tooltip } from "antd";
import filmApi from "../../hooks/filmApi";
import { useSelector } from "react-redux";
import wishListApi from "../../hooks/wishListApi";

const darkThemeConfig = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: "#dc2626",
    colorBgContainer: "#1f2937",
    colorText: "#ffffff",
  },
};

export const WatchPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const navigate = useNavigate();
  const [film, setFilm] = useState({});
  const [isMovie, setIsMovie] = useState(true);
  const [video, setVideo] = useState([]);
  const { movieId } = useParams();
  const [page, setPage] = useState(1);
  const [relatedFilm, setRelatedFilm] = useState([]);
  const [category, setCategory] = useState("");
  const isVip = useSelector((state) => state.user.vip);
  const userId = useSelector((state) => state.user.id);
  const [showTrailer, setShowTrailer] = useState(true);

  const handleToggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const fetchFilm = async (id) => {
    try {
      const response = await filmApi.getFilmById(id);
      if (response.data && response.data.data) {
        setVideo(response.data.data.video || []);
        setFilm(response.data.data);
        setCategory(response.data.data.genre);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAllFilm = async () => {
    try {
      const response = await filmApi.getAllFilm({ category: category });
      setRelatedFilm(response.data.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateStatus = async (id, type, data) => {
    try {
      await filmApi.postUpdateStatusFilm(id, type, data, userId);
      message.success("Thanks for rating!");
      fetchFilm(id);
    } catch (error) {
      console.log(error);
    }
  };

  const handleWishList = async () => {
    try {
      if (favorite) {
        await wishListApi.deleteItemFromWishList("film", movieId);
        setFavorite(false);
        message.success("Removed from wishlist");
      } else {
        await wishListApi.addToWishList("film", movieId);
        setFavorite(true);
        message.success("Added to wishlist");
      }
    } catch (error) {
      message.error("Action failed");
    }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/watchPage/${movieId}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      message.success("Link copied to clipboard!");
    } catch (err) {
      message.error("Failed to copy link.");
    }
  };

  const checkIsFavorite = async (id) => {
    try {
      const response = await wishListApi.checkIsFavourite("film", id);
      if (response.status === 200) {
        setFavorite(response.data.isFavorite);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (movieId) {
      fetchFilm(movieId);
      checkIsFavorite(movieId);
      setShowTrailer(true);
    }
  }, [movieId]);

  useEffect(() => {
    if (category) fetchAllFilm();
  }, [category]);

  useEffect(() => {
    if (video.length > 1) setIsMovie(false);
    if (film && isVip === false && film.isForAllUsers === false) {
      navigate("/payment");
    }
  }, [video, isVip, film]);

  return (
    <ConfigProvider theme={darkThemeConfig}>
      {/* FIX LAYOUT: 
        - w-full min-h-screen: Đảm bảo nền đen phủ kín 100%
        - overflow-x-hidden: Chặn thanh cuộn ngang nếu có phần tử tràn
      */}
      <div className="bg-black w-full min-h-screen text-white overflow-x-hidden relative">
        {/* Sidebar Fixed: Luôn nằm trên cùng bên trái */}
        <div
          className={`fixed inset-y-0 left-0 z-50 transition-all duration-300 ${
            isSidebarOpen ? "w-64" : "w-20"
          }`}
        >
          <MovieSideBar onToggle={handleToggleSidebar} isOpen={isSidebarOpen} />
        </div>

        {/* Main Content: Dùng padding-left (pl) thay vì margin để tránh vỡ layout */}
        <div
          className={`relative z-0 min-h-screen transition-all duration-300 ${
            isSidebarOpen ? "pl-64" : "pl-20"
          }`}
        >
          {/* Trailer Modal */}
          {showTrailer && film?.trailer && (
            <div className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-md flex justify-center items-center p-4">
              <div className="relative w-full max-w-5xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-gray-800">
                <ReactPlayer
                  url={film.trailer}
                  controls
                  playing
                  width="100%"
                  height="100%"
                />
                <button
                  onClick={() => setShowTrailer(false)}
                  className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-lg"
                >
                  <CloseOutlined />
                </button>
              </div>
            </div>
          )}

          {/* Container nội dung chính */}
          <div className="container mx-auto px-4 py-8">
            {/* 1. Video Player Area (ĐÃ FIX KÍCH THƯỚC) */}
            {/* max-w-5xl: Giới hạn chiều rộng video khoảng 1024px để không bị quá to */}
            <div className="w-full max-w-5xl mx-auto bg-[#111] rounded-xl overflow-hidden shadow-2xl border border-gray-800 mb-10">
              <div className="relative aspect-video w-full bg-black">
                {video.length > 0 ? (
                  <ReactPlayer
                    controls={true}
                    width="100%"
                    height="100%"
                    url={video[page - 1]?.urlVideo}
                    playing={!showTrailer}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-[#0a0a0a] text-gray-500 gap-2">
                    <PlayCircleOutlined className="text-4xl opacity-50" />
                    <p>Video is loading or not available...</p>
                  </div>
                )}
              </div>

              {/* Action Bar */}
              <div className="p-5 bg-[#181818] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex-1">
                  <h1 className="text-xl md:text-2xl font-bold text-white leading-tight">
                    {film?.name}
                    {!isMovie && (
                      <span className="text-red-500 ml-2 text-lg">
                        Episode {page}
                      </span>
                    )}
                  </h1>
                  <div className="flex items-center gap-3 text-sm text-gray-400 mt-2">
                    <span>{film?.releaseYear}</span>
                    <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                    <span className="border border-gray-600 px-1.5 py-0.5 rounded text-[10px] uppercase">
                      {film?.genre}
                    </span>
                    <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                    <span>{film?.age}+</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Rating Block */}
                  <div className="flex flex-col items-end mr-2">
                    <Rate
                      allowHalf
                      value={film.totalRating}
                      onChange={(val) =>
                        handleUpdateStatus(film?._id, "rating", val)
                      }
                      className="text-yellow-500 text-base"
                    />
                    <span className="text-xs text-gray-500">
                      {film?.feedback?.length || 0} votes
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <Tooltip title={favorite ? "Unfavorite" : "Favorite"}>
                    <button
                      onClick={handleWishList}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        favorite
                          ? "bg-red-600/20 text-red-500 border border-red-600"
                          : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                      }`}
                    >
                      {favorite ? <HeartFilled /> : <HeartOutlined />}
                    </button>
                  </Tooltip>

                  <Tooltip title="Share">
                    <button
                      onClick={handleShare}
                      className="w-10 h-10 rounded-full bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white flex items-center justify-center transition-all"
                    >
                      <ShareAltOutlined />
                    </button>
                  </Tooltip>

                  <Tooltip title="Comments">
                    <Link to="/socialHomePage">
                      <button className="w-10 h-10 rounded-full bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white flex items-center justify-center transition-all">
                        <CommentOutlined />
                      </button>
                    </Link>
                  </Tooltip>
                </div>
              </div>
            </div>

            {/* 2. Episodes Grid */}
            {!isMovie && video.length > 0 && (
              <div className="max-w-5xl mx-auto mb-10">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-300">
                  <PlayCircleOutlined className="text-red-500" /> All Episodes
                </h3>
                <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 gap-2">
                  {video.map((ep, index) => (
                    <button
                      key={index}
                      onClick={() => setPage(index + 1)}
                      className={`py-2 px-2 rounded font-medium text-sm transition-all border ${
                        page === index + 1
                          ? "bg-red-600 border-red-600 text-white"
                          : "bg-[#1f1f1f] border-gray-800 text-gray-400 hover:border-gray-600 hover:text-white"
                      }`}
                    >
                      EP {index + 1}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Movie Info & Details (ĐÃ FIX: Poster nhỏ lại) */}
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="md:col-span-2 space-y-4">
                <h3 className="text-xl font-bold text-white border-l-4 border-red-600 pl-3">
                  Overview
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {film?.description ||
                    "No description available for this content."}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 mt-4 border-t border-gray-800">
                  <div>
                    <span className="text-gray-500 text-xs uppercase tracking-wider block mb-1">
                      Director
                    </span>
                    <span className="text-gray-200 text-sm">
                      Christopher Nolan
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs uppercase tracking-wider block mb-1">
                      Cast
                    </span>
                    <span className="text-gray-200 text-sm">
                      Leonardo DiCaprio
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs uppercase tracking-wider block mb-1">
                      Country
                    </span>
                    <span className="text-gray-200 text-sm">USA</span>
                  </div>
                </div>
              </div>

              <div className="md:col-span-1">
                {/* Giới hạn max-width poster là 250px cho gọn */}
                <div className="w-full max-w-[250px] mx-auto md:ml-auto rounded-lg overflow-hidden shadow-lg border border-gray-800">
                  <img
                    src={film?.small_image}
                    alt={film?.name}
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
            </div>

            {/* 4. Similar Movies */}
            <div className="max-w-5xl mx-auto pb-10">
              <h3 className="text-xl font-bold mb-5 text-gray-300">
                You May Also Like
              </h3>

              {relatedFilm.length > 0 ? (
                <div className="flex overflow-x-auto pb-4 gap-4 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
                  {relatedFilm.slice(0, 10).map((item, index) => (
                    <Link
                      to={`/watchPage/${item._id}`}
                      key={index}
                      className="flex-none w-[150px] group"
                    >
                      <div className="aspect-[2/3] rounded-md overflow-hidden mb-2 relative">
                        <img
                          src={item?.small_image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
                        />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <PlayCircleOutlined className="text-3xl text-white drop-shadow-md" />
                        </div>
                      </div>
                      <h4 className="text-sm text-gray-300 truncate group-hover:text-red-500">
                        {item.name}
                      </h4>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-sm">
                  No similar content found.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};
