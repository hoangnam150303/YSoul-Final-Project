import React, { useState, useEffect } from "react";
import { MovieSideBar } from "../../components/SideBar/MovieSideBar";
import {
  CaretLeftFilled,
  CommentOutlined,
  HeartFilled,
  ShareAltOutlined,
} from "@ant-design/icons";
import { Link, useNavigate, useParams } from "react-router-dom";
import ReactPlayer from "react-player";
import { message, Pagination, Rate } from "antd";
import filmApi from "../../hooks/filmApi";
import { useSelector } from "react-redux";
import wishListApi from "../../hooks/wishListApi";
export const WatchPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const navigate = useNavigate();
  const [film, setFilm] = useState({});
  const [isMovie, setIsMovie] = useState(true);
  const [episodes, setEpisodes] = useState([]);
  const [video, setVideo] = useState([]);
  const movieId = useParams().movieId;
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [relatedFilm, setRelatedFilm] = useState([]);
  const [videoSelected, setVideoSelected] = useState("");
  const [category, setCategory] = useState("");
  const isVip = useSelector((state) => state.user.vip);
  const userId = useSelector((state) => state.user.id);
  const handleToggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev); // Đổi trạng thái open
  };

  const backHome = () => {
    navigate(`/`);
  };
  const fetchFilm = async (id) => {    
    const respone = await filmApi.getFilmById(id);
    setVideo(respone.data.data.video);
    setFilm(respone.data.data);
    setCategory(respone.data.data.genre);
  };
  const fetchAllFilm = async () => {
    try {
      const response = await filmApi.getAllFilm({
        category: category,
      });
      setRelatedFilm(response.data.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  const handleUpdateStatus = async (id, type, data) => {
    try {
      await filmApi.postUpdateStatusFilm(id, type, data, userId);
      fetchFilm(id);
    } catch (error) {
      console.log(error);
    }
  };
  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };
  useEffect(() => {
    fetchFilm(movieId);
    if (category !== "") {
      fetchAllFilm();
    }
  }, [movieId, category]);

  useEffect(() => {
    if (video.length > 1) {
      setIsMovie(false);
      setTotalPage(video?.length);
    }
    if (film) {
      if (isVip === false && film?.isForAllUsers === false) {
        navigate("/payment");
      }
    }
  }, [video, isVip]);
  const addToWishList = async (id) => {
    try {
      const response = await wishListApi.addToWishList("film", id);
      if (response.status === 200) {
        message.success("Added to wishlist successfully");
        setFavorite(true);
      }
    } catch (error) {
      message.error("Failed to add to wishlist");
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
    if (movieId !== null && movieId !== undefined) {
      checkIsFavorite(movieId);
    }
  }, [movieId]);
  return (
    <div className="bg-black min-h-screen text-white">
      <div className="z-50">
        <MovieSideBar onToggle={handleToggleSidebar} isOpen={isSidebarOpen} />
      </div>
      <div className="mx-auto container px-4 py-8 h-full">
        <div className="flex justify-between pl-5 items-center mb-4">
          <button
            className="bg-gray-500/70 hovver:bg-gray-500 text-white py-2 px-4 rounded"
            onClick={backHome}
          >
            <CaretLeftFilled size={24} />
          </button>
        </div>

        <div className="aspect-video mb-8 p-2 sm:px-10 md:px-32">
          <ReactPlayer
            controls={true}
            width={"100%"}
            height={"70vh"}
            className="mx-auto overflow-hidden rounded-lg"
            url={video[page - 1]?.urlVideo}
          />
          <div className="flex gap-10 mt-4 cursor-pointer">
            <HeartFilled
              style={{ fontSize: "24px", color: favorite ? "red" : "white" }}
              onClick={() => addToWishList(film?._id)}
            />
            <ShareAltOutlined style={{ fontSize: "24px" }} />
            <Link to={`/socialHomePage`}>
              <CommentOutlined style={{ fontSize: "24px" }} />
            </Link>
            <Rate
              allowHalf
              key={film.totalRating}
              defaultValue={film.totalRating}
              style={{ fontSize: "24px", color: "red" }}
              onChange={(value) =>
                handleUpdateStatus(film?._id, "rating", value)
              }
            />
            <span className="font-bold">
              {" "}
              {film?.feedback?.length || 0} rates
            </span>
          </div>
          {!isMovie && (
            <Pagination
              align="end"
              current={page}
              onChange={handlePageChange}
              total={totalPage}
              showSizeChanger={false}
              pageSize={1}
            />
          )}
        </div>

        {/* Movie Detail */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-20 max-w-6xl mx-auto">
          <div className="mb-4 md:mb-0">
            <h2 className="text-5xl font-bold text-balance">
              {!isMovie
                ? film?.name + " espisode" + episodes[page - 1]?.numberTitle
                : film?.name}
            </h2>

            <p className="mt-2 text-lg">
              <span>{film?.releaseYear}| </span>
              <span className="text-green-600">{film?.age}</span>
            </p>
            <p className="mt-4 text-lg"> {film?.description}</p>
          </div>
          <img
            src={film?.small_image}
            alt="POSTER"
            className="max-h[600px] rounded-md"
          />
        </div>
        <div className="mt-12 max-w-5xl mx-auto relative">
          <h3 className="text-3xl font-bold">Similar Movies/Tv Show</h3>
          <div className="flex overflow-x-scroll scrollbar-hide gap-4 pb-4 group">
            {relatedFilm.slice(0, 10).map((film, index) => (
              <Link
                className="min-w-45 flex-none"
                to={`/watchPage/${film._id}`}
              >
                <img
                  src={film?.small_image}
                  alt="small poster"
                  className="w-32 h-48 object-cover rounded-md"
                />
                <h4 className="mt-2 text-lg font-semibold">{film.name}</h4>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
