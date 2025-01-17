import React, { useState, useEffect, useRef } from "react";
import { MovieSideBar } from "../../components/SideBar/MovieSideBar";
import {
  CaretLeftFilled,
  CommentOutlined,
  HeartFilled,
  HeartOutlined,
  LeftOutlined,
  RightOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import ReactPlayer from "react-player";
import { Rate } from "antd";
export const WatchPage = () => {
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const navigate = useNavigate();

  const handleToggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev); // Đổi trạng thái open
  };

  const backHome = () => {
    navigate(`/`);
  };

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
            url={
              "https://res.cloudinary.com/dnv7bjvth/video/upload/v1737041935/Big_Video_1_vawwi8.mp4"
            }
          />
          <div className="flex gap-10 mt-4 cursor-pointer">
            <HeartFilled
              style={{ fontSize: "24px", color: favorite ? "red" : "white" }}
              onClick={() => setFavorite(!favorite)}
            />
            <ShareAltOutlined style={{ fontSize: "24px" }} />
            <CommentOutlined style={{ fontSize: "24px" }} />
            <Rate
              allowHalf
              defaultValue={2.5}
              style={{ fontSize: "24px", color: "red" }}
            />
          </div>
        </div>

        {/* Movie Detail */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-20 max-w-6xl mx-auto">
          <div className="mb-4 md:mb-0">
            <h2 className="text-5xl font-bold text-balance">Doraemon</h2>

            <p className="mt-2 text-lg">
              <span>Jun 11, 2024 | </span>
              <span className="text-green-600">PG-13</span>
            </p>
            <p className="mt-4 text-lg">
              {" "}
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iste
              vero nihil non minima, ratione nostrum fuga praesentium officia
              expedita dignissimos. Possimus ducimus eveniet perferendis fugit,
              explicabo tenetur quod officiis sed.
            </p>
          </div>
          <img
            src="https://www.shutterstock.com/image-photo/doraemon-600nw-2426094143.jpg"
            alt="POSTER"
            className="max-h[600px] rounded-md"
          />
        </div>
        <div className="mt-12 max-w-5xl mx-auto relative">
          <h3 className="text-3xl font-bold">Similar Movies/Tv Show</h3>
          <div className="flex overflow-x-scroll scrollbar-hide gap-4 pb-4 group">
            {Array(5)
              .fill("")
              .map((_, index) => (
                <Link className="min-w-45 flex-none" key={index}>
                  <img
                    src="https://res.cloudinary.com/dnv7bjvth/image/upload/v1736953120/strangerthings_s3_fdp4gm.jpg"
                    alt="small poster"
                    className="w-full h-auto rounded-md"
                  />
                  <h4 className="mt-2 text-lg font-semibold">
                    Stranger Things
                  </h4>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
