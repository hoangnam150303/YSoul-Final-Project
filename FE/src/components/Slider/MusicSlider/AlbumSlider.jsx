import React, { useEffect, useState } from "react";
import albumApi from "../../../hooks/albumApi";
import { Link } from "react-router-dom";

export const AlbumSlider = ({ category }) => {
  const [album, setAlbum] = useState([]);

  const fetchAlbum = async () => {
    try {
      const response = await albumApi.getAllAlbum({
        filter: category,
        search: "",
        typeUser: "user",
      });
      setAlbum(response.data.albums);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAlbum();
  }, []);

  return (
    // Sử dụng margin trái responsive: pl-4 cho màn hình nhỏ, pl-60 cho màn hình lớn
    <div className="pl-4 md:pl-60">
      <h4 className="text-lg font-semibold mb-3">{category}</h4>
      {/* Grid responsive: số cột thay đổi theo kích thước màn hình */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
        {album.map((item) => (
          <Link key={item.id} to={`/album/${item.id}`}>
            <div className="p-2 rounded cursor-pointer hover:bg-gray-600">
              <img
                className="rounded w-full h-[150px] object-cover"
                src={item.image}
                alt={item.title}
              />
              <p className="font-bold mt-2 mb-1">{item.title}</p>
              <p className="text-sm text-gray-400">{item.artist}</p>
              <p className="text-sm text-gray-400">{item.release_year}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
