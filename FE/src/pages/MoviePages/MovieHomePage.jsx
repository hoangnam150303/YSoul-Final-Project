import React, { useEffect, useRef, useState } from "react";
import { MovieSideBar } from "../../components/SideBar/MovieSideBar";
import { Link } from "react-router-dom";
import { CaretRightOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { MovieSlider } from "../../components/Slider/MovieSlider/MovieSlider";
import filmApi from "../../hooks/filmApi";

export const MovieHomePage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [films, setFilms] = useState([]);
  const category = [
    { id: 1, name: "Newest" },
    { id: 2, name: "Top Rated" },
    { id: 3, name: "Popular" },
    { id: 4, name: "Trending" },
  ];
  const fetchNewestFilm = async () => {
    try {
      const response = await filmApi.getAllFilm({
        sort: "Newest",
        typeUser: "user"
      })
      setFilms(response.data.data.data);
    } catch (error) {
      console.log(error);
      
    }
  };
  useEffect(() => {
    fetchNewestFilm();
  }, []);
 

  const handleToggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev); // Đổi trạng thái open
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex((prevIndex) => (prevIndex + 1) % films.length);
    }, 5000);

    return () => clearInterval(interval); // Dọn dẹp bộ đếm thời gian
  }, [films.length]);

  return (
    <>
      <div className="relative h-screen text-white flex overflow-x-hidden ">
        {/* Sidebar */}
        <div className="z-50">
          <MovieSideBar onToggle={handleToggleSidebar} isOpen={isSidebarOpen} />
        </div>

        <div className="">
          <div className="relative w-screen h-screen">
            {films.map((film, index) => (
              <div
                key={film._id}
                className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${
                  index === currentBannerIndex ? "opacity-100" : "opacity-0"
                }`}
              >
                <img
                  src={film.large_image}
                  alt="banner"
                  className="absolute top-0 left-0 w-full h-full object-cover -z-10"
                />

                <div
                  className="absolute top-0 left-0 w-full h-full bg-black/50 -z-10"
                  aria-hidden="true"
                />

                <div className="relative z-20 h-full flex flex-col justify-center px-8 md:px-16 lg:px-32">
                  <div className="bg-gradient-to-b from-black via-transparent to-transparent absolute w-full h-full top-0 left-0 -z-10" />
                  <div className="max-w-2xl ">
                    <h1 className="mt-4 text-6xl font-extrabold text-balance">
                      {film.name}
                    </h1>
                    <p className="mt-2 text-lg">
                      {film.releaseYear} | {film.age}+
                    </p>

                    <p className="mt-4 text-lg">{film.description}</p>
                  </div>

                  <div className="flex mt-8">
                    <Link
                      to={`/watchPage/${film._id}`}
                      className="bg-red-600 hover:bg-red-800 text-white font-bold py-2 px-4 rounded mr-4 flex items-center"
                    >
                      <CaretRightOutlined className="size-6 inline-block mr-2 fill-white mt-2" />
                      Watch Now
                    </Link>

                    <Link
                      to={`/watchPage/${film._id}`}
                      className="bg-gray-500/70 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded mr-4 flex items-center"
                    >
                      <InfoCircleOutlined className="size-6 inline-block mr-2 fill-white mt-2" />
                      More Info
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {category.map((item) => (
            <MovieSlider key={item.id} category={item.name} />
          ))}
        </div>
      </div>
    </>
  );
};
