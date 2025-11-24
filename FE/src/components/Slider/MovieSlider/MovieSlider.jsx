import { RightCircleOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import filmApi from "../../../hooks/filmApi";

export const MovieSlider = ({ category }) => {
  const [moviesToShow, setMoviesToShow] = useState(5);
  const [movies, setMovies] = useState([]);
  const [historyFilms, setHistoryFilms] = useState([]);


  const fetchMovie = async () => {
    try {
      const response = await filmApi.getAllFilm({
        sort: category,
        typeUser: "user",
      });
      if (response.data && response.data.data) {
        setMovies(response.data.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchHistoryFilm = async () => {
    try {
      const response = await filmApi.getHistoryFilm();
      if (response.data) {
        setHistoryFilms(response.data);
      }
    } catch (error) {
      console.error("Error fetching history films:", error);
    }
  };

  useEffect(() => {
    if (category === "Your History") {
      fetchHistoryFilm();
    } else {
      fetchMovie();
    }
  }, [category]);


  const updateMoviesToShow = () => {
    if (window.innerWidth >= 1280) setMoviesToShow(10);
    else if (window.innerWidth >= 768) setMoviesToShow(5);
    else setMoviesToShow(3);
  };

  useEffect(() => {
    updateMoviesToShow();
    window.addEventListener("resize", updateMoviesToShow);
    return () => window.removeEventListener("resize", updateMoviesToShow);
  }, []);

  const handleUpdateStatus = async (id, type, data) => {
    try {
      await filmApi.postUpdateStatusFilm(id, type, data);
    } catch (error) {
      console.log(error);
    }
  };


  const isHistory = category === "Your History";


  const dataSource = isHistory ? historyFilms : movies;

  if (!dataSource || dataSource.length === 0) {
    return null;
  }

  return (
    <div className="bg-black text-white relative px-5 md:px-20">
      <div className="flex items-center">
        <h2 className="font-bold text-2xl pt-7 mb-5">{category}</h2>
        <Link to={"/search"}>
          <RightCircleOutlined className="text-3xl pl-3 hover:text-red-600 transition-colors" />
        </Link>
      </div>

      <div className="flex space-x-4 overflow-auto scroll-smooth w-screen pb-4 scrollbar-hide">
        {dataSource.slice(0, moviesToShow).map((item) => {
          // Xử lý cấu trúc dữ liệu khác nhau
          // History: dữ liệu nằm trong item.film_id
          // Phim thường: dữ liệu nằm trực tiếp trong item
          const movie = isHistory ? item.film_id : item;

          // Đề phòng trường hợp data bị lỗi null
          if (!movie) return null;

          return (
            <Link
              key={movie._id}
              to={`/watchPage/${movie._id}`}
              className="w-[180px] flex-shrink-0 relative group"
              onClick={() => handleUpdateStatus(movie._id, "click", 1)}
            >
              <div className="rounded-lg overflow-hidden shadow-lg">
                <img
                  src={movie.small_image}
                  alt={movie.name}
                  className="w-[180px] h-[260px] object-cover rounded-md transition-transform duration-300 ease-in-out group-hover:scale-110 opacity-90 group-hover:opacity-100"
                />
              </div>
              <p className="mt-2 text-center truncate px-1 text-sm font-medium group-hover:text-red-500 transition-colors">
                {movie.name}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
