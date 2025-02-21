import React, { useEffect, useState, useContext } from "react";
import singleApi from "../../../hooks/singleApi";
import { PlayerContext } from "../../../context/PlayerContext"; // Đảm bảo đường dẫn đúng

export const SingleSlider = ({ category }) => {
  const [single, setSingle] = useState([]);
  const { updateSong } = useContext(PlayerContext); // Lấy updateSong từ context

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
  }, [category]); // Có thể thêm category vào dependency nếu cần cập nhật khi thay đổi

  return (
    <div className="pl-60 ">
      <h4 className="text-lg font-semibold mb-3">{category}</h4>
      <div className="grid grid-cols-8 gap-4">
        {single.map((item) => (
          <div
            key={item.id}
            onClick={() => updateSong(item.id)} // Khi click, truyền id vào updateSong
            className="min-w-[180px] p-2 rounded cursor-pointer hover:bg-gray-600"
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
