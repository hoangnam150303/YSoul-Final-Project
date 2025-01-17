import {
  LeftOutlined,
  RightCircleOutlined,
  RightOutlined,
} from "@ant-design/icons";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

export const MovieSlider = ({ category }) => {
  const sliderRef = useRef(null);
  const [moviesToShow, setMoviesToShow] = useState(5); // Số phim hiển thị mặc định

  // Hàm để tính toán số phim dựa trên kích thước màn hình
  const updateMoviesToShow = () => {
    if (window.innerWidth >= 1280) {
      setMoviesToShow(6); // Màn hình lớn
    } else if (window.innerWidth >= 768) {
      setMoviesToShow(5); // Màn hình trung bình
    } else {
      setMoviesToShow(3); // Màn hình nhỏ
    }
  };

  useEffect(() => {
    updateMoviesToShow(); // Cập nhật khi component được render lần đầu

    // Lắng nghe sự thay đổi kích thước màn hình
    window.addEventListener("resize", updateMoviesToShow);

    // Xóa sự kiện khi component bị unmount
    return () => {
      window.removeEventListener("resize", updateMoviesToShow);
    };
  }, []);

  return (
    <div className="bg-black text-white relative px-5 md:px-20 overflow-hidden">
      <div className="flex items-center">
        <h2 className="font-bold text-2xl pt-7 mb-5">{category}</h2>
        <Link to={"/"}>
          <RightCircleOutlined className="text-3xl pl-3" />
        </Link>
      </div>

      <div
        className="flex space-x-4 overflow-x-auto scrollbar-hide scroll-smooth w-screen"
        ref={sliderRef}
      >
        {Array(moviesToShow)
          .fill("")
          .map((_, index) => (
            <Link
              key={index}
              to={`/`}
              className="min-w-[275px] flex-shrink-0 relative group"
            >
              <div className="rounded-lg overflow-hidden">
                <img
                  src="https://res.cloudinary.com/dnv7bjvth/image/upload/v1736953120/strangerthings_s3_fdp4gm.jpg"
                  alt="small_image"
                  className="transition-transform duration-300 ease-in-out group-hover:scale-125"
                />
              </div>
              <p className="mt-2 text-center">Stranger Things {index + 1}</p>
            </Link>
          ))}
      </div>
    </div>
  );
};
