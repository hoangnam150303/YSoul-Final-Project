import React, { useEffect, useState } from "react";
import artistApi from "../../../hooks/artistApi";
import { Link } from "react-router-dom";

export const ArtistSlider = ({ category }) => {
  const [artist, setArtist] = useState([]);

  const fetchArtists = async () => {
    try {
      const response = await artistApi.getAllArtist({
        filter: category,
        search: "",
        typeUser: "user",
      });
      setArtist(response.data.artists);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchArtists();
  }, [category]);

  return (
    <div className="pl-60 pr-10">
      <h4 className="text-lg font-semibold mb-3">{category}</h4>
      <div className="grid grid-cols-[repeat(auto-fit,_minmax(180px,_1fr))] gap-6">
        {artist.slice(0, 8).map((item) => (
          <Link key={item.id} to={`/artist/${item.id}`}>
            <div className="p-2 rounded cursor-pointer hover:bg-gray-700">
              <img
                className="rounded w-full h-[150px] object-cover"
                src={item.avatar}
                alt={item.name}
              />
              <p className="font-bold mt-2 mb-1">{item.name}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
