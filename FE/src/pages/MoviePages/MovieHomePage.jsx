import React, { useEffect, useRef, useState } from "react";
import { MovieSideBar } from "../../components/SideBar/MovieSideBar";
import { Link } from "react-router-dom";
import { CaretRightOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { MovieSlider } from "../../components/Slider/MovieSlider/MovieSlider";

export const MovieHomePage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  const category = [
    { id: 1, name: "Newest" },
    { id: 2, name: "Top Rated" },
    { id: 3, name: "Popular" },
    { id: 4, name: "Trending" },
  ];

  const banners = [
    {
      id: 1,
      imageSrc:
        "https://res.cloudinary.com/dnv7bjvth/image/upload/v1736866910/5fed6514-2bab-49fd-b713-a223e376bc6f.png",
      title: "Extraction",
      year: 2014,
      rating: "18+",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea repudiandae ad atque eligendi. Doloremque, maiores? Quis a quasi molestiae illo at distinctio iure quaerat. Ipsa doloribus molestiae consequatur cupiditate sapiente.",
      watchLink: "/watchPage",
      infoLink: "/watch/123",
    },
    {
      id: 2,
      imageSrc:
        "https://res.cloudinary.com/dnv7bjvth/image/upload/v1736866910/5fed6514-2bab-49fd-b713-a223e376bc6f.png",
      title: "Inception",
      year: 2010,
      rating: "13+",
      description:
        "A mind-bending thriller that blurs the lines between dreams and reality. Directed by Christopher Nolan.",
      watchLink: "/watch/inception",
      infoLink: "/watch/456",
    },
    {
      id: 3,
      imageSrc:
        "https://res.cloudinary.com/dnv7bjvth/image/upload/v1736954981/logo_large.8b77e59c_j8vxkt.png",
      title: "Interstellar",
      year: 2014,
      rating: "PG-13",
      description:
        "A journey through space and time to save humanity. Directed by Christopher Nolan.",
      watchLink: "/watch/interstellar",
      infoLink: "/watch/789",
    },
    {
      id: 4,
      imageSrc:
        "https://res.cloudinary.com/dnv7bjvth/image/upload/v1737045316/8f4828ec-f6fa-4ba5-aa51-67a4da3b2cfd.png",
      title: "The Matrix",
      year: 1999,
      rating: "R",
      description:
        "A computer hacker learns about the true nature of his reality and his role in the war against its controllers.",
      watchLink: "/watch/the-matrix",
      infoLink: "/watch/101",
    },
  ];

  const handleToggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev); // Đổi trạng thái open
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval); // Dọn dẹp bộ đếm thời gian
  }, [banners.length]);

  return (
    <>
      <div className="relative h-screen text-white flex overflow-x-hidden ">
        {/* Sidebar */}
        <div className="z-50">
          <MovieSideBar onToggle={handleToggleSidebar} isOpen={isSidebarOpen} />
        </div>

        <div className="">
          <div className="relative w-screen h-screen">
            {banners.map((banner, index) => (
              <div
                key={banner.id}
                className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${
                  index === currentBannerIndex ? "opacity-100" : "opacity-0"
                }`}
              >
                <img
                  src={banner.imageSrc}
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
                      {banner.title}
                    </h1>
                    <p className="mt-2 text-lg">
                      {banner.year} | {banner.rating}
                    </p>

                    <p className="mt-4 text-lg">{banner.description}</p>
                  </div>

                  <div className="flex mt-8">
                    <Link
                      to={banner.watchLink}
                      className="bg-red-600 hover:bg-red-800 text-white font-bold py-2 px-4 rounded mr-4 flex items-center"
                    >
                      <CaretRightOutlined className="size-6 inline-block mr-2 fill-white mt-2" />
                      Watch Now
                    </Link>

                    <Link
                      to={banner.infoLink}
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
