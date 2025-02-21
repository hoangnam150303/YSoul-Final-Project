import React, { useEffect, useState } from "react";
import albumApi from "../../../hooks/albumApi";
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
    <div className="pl-60 ">
      <h4 className="text-lg font-semibold mb-3">{category}</h4>
      <div className="grid grid-cols-8 gap-4">
        {album.map((item) => (
          <div
            key={item.id}
            className="min-w-[180px] p-2 rounded cursor-pointer hover:bg-gray-600"
          >
            <img
              className="rounded w-full h-[150px] object-cover"
              src={item.image}
              alt={item.title}
            />
            <p className="font-bold mt-2 mb-1">{item.title}</p>
            <p className="text-sm text-gray-400">{item.artist}</p>
            <p className="text-sm text-gray-400">{item.release_year}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
