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
      console.log(response.data);
      setArtist(response.data.artists);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchArtists();
  }, []);

  return (
    <div className="pl-4 md:pl-60">
      <h4 className="text-lg font-semibold mb-3">{category}</h4>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
        {artist.map((item) => (
          <Link key={item.id} to={`/artist/${item.id}`}>
            <div className="p-2 rounded cursor-pointer hover:bg-gray-600">
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
