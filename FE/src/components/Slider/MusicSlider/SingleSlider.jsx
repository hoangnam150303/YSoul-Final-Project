import React, { useEffect, useState, useContext } from "react";
import singleApi from "../../../hooks/singleApi";
import { PlayerContext } from "../../../context/PlayerContext";

export const SingleSlider = ({ category }) => {
  const [single, setSingle] = useState([]);
  const { updateSong } = useContext(PlayerContext);

  const fetchSingle = async () => {
    try {
      const response = await singleApi.getAllSingle({
        filter: category,
        search: "",
        typeUser: "user",
      });
      setSingle(response.data.singles);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSingle();
  }, [category]);

  return (
    <div className="pl-60 pr-10">
      <h4 className="text-lg font-semibold mb-3">{category}</h4>
      <div className="grid grid-cols-[repeat(auto-fit,_minmax(180px,_1fr))] gap-6">
        {single.map((item) => (
          <div
            key={item.id}
            onClick={() => updateSong(item.id)}
            className="p-2 rounded cursor-pointer hover:bg-gray-700"
          >
            <img
              className="rounded w-full h-[150px] object-cover"
              src={item.image}
              alt={item.title}
            />
            <p className="font-bold mt-2 mb-1">{item.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
