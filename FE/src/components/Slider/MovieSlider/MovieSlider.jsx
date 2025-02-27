import { RightCircleOutlined } from "@ant-design/icons";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import filmApi from "../../../hooks/filmApi";

export const MovieSlider = ({ category }) => {
  const [moviesToShow, setMoviesToShow] = useState(5); // Số phim hiển thị mặc định
  const [movies, setMovies] = useState([]);
  const fetchMovie = async () => {
    const response = await filmApi.getAllFilm({
      sort: category,
    });

    setMovies(response.data.data.data);
  };
  // Hàm để tính toán số phim dựa trên kích thước màn hình
  const updateMoviesToShow = () => {
    if (window.innerWidth >= 1280) {
      setMoviesToShow(10); // Màn hình lớn
    } else if (window.innerWidth >= 768) {
      setMoviesToShow(5); // Màn hình trung bình
    } else {
      setMoviesToShow(3); // Màn hình nhỏ
    }
  };
  const handleUpdateStatus = async (id, type, data) => {
    await filmApi.postUpdateStatusFilm(id, type, data);
  };
  useEffect(() => {
    updateMoviesToShow(); // Cập nhật khi component được render lần đầu
    fetchMovie();

    // Lắng nghe sự thay đổi kích thước màn hình
    window.addEventListener("resize", updateMoviesToShow);
    // Xóa sự kiện khi component bị unmount
    return () => {
      window.removeEventListener("resize", updateMoviesToShow);
    };
  }, []);

  return (
    <div className="bg-black text-white relative px-5 md:px-20 ">
      <div className="flex items-center">
        <h2 className="font-bold text-2xl pt-7 mb-5">{category}</h2>
        <Link to={"/"}>
          <RightCircleOutlined className="text-3xl pl-3" />
        </Link>
      </div>

      <div className="flex space-x-4 overflow-auto scroll-smooth w-screen">
        {movies.length > 0 &&
          movies.slice(0, moviesToShow).map((movie) => (
            <Link
              key={movie._id}
              to={`/watchPage/${movie._id}`}
              className="min-w-[275px] flex-shrink-0 relative group"
              onClick={() => handleUpdateStatus(movie._id, "click", 1)}
            >
              <div className="rounded-lg overflow-hidden">
                <img
                  src={movie.small_image}
                  alt="small_image"
                  className="transition-transform duration-300 ease-in-out group-hover:scale-125"
                />
              </div>
              <p className="mt-2 text-center">{movie.name}</p>
            </Link>
          ))}
      </div>
    </div>
  );
};
