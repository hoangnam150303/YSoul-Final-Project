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
        // Make API call to fetch artists
      });
      console.log(response.data);

      setArtist(response.data.artists);
    } catch (error) {
      console.log(error);
    }
    // Update artist state with the fetched data
  };
  useEffect(() => {
    // Log any errors to the console
    fetchArtists();
  }, []);
  return (
    <div className="pl-60 ">
      <h4 className="text-lg font-semibold mb-3">{category}</h4>
      <div className="grid grid-cols-8 gap-4">
        {artist.map((item) => (
        <Link to={`/artist/${item.id}`}>
            <div
            key={item.id}
            className="p-2 rounded cursor-pointer hover:bg-gray-600"
          >
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
