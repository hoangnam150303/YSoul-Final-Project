import React from "react";

export const MusicSlider = ({ category }) => {
  const musics = [
    {
      id: 1,
      image:
        "https://res.cloudinary.com/dnv7bjvth/image/upload/v1738655275/71Q82A9HWBL_mtuanu.jpg",
      name: "Justin Bieber",
      description: "This is description",
    },
    {
      id: 2,
      image:
        "https://res.cloudinary.com/dnv7bjvth/image/upload/v1738655275/71Q82A9HWBL_mtuanu.jpg",
      name: "Justin Bieber",
      description: "This is description",
    },
    {
      id: 3,
      image:
        "https://res.cloudinary.com/dnv7bjvth/image/upload/v1738655275/71Q82A9HWBL_mtuanu.jpg",
      name: "Justin Bieber",
      description: "This is description",
    },
    {
      id: 4,
      image:
        "https://res.cloudinary.com/dnv7bjvth/image/upload/v1738655275/71Q82A9HWBL_mtuanu.jpg",
      name: "Justin Bieber",
      description: "This is description",
    },
    {
      id: 5,
      image:
        "https://res.cloudinary.com/dnv7bjvth/image/upload/v1738655275/71Q82A9HWBL_mtuanu.jpg",
      name: "Justin Bieber",
      description: "This is description",
    },
    {
      id: 6,
      image:
        "https://res.cloudinary.com/dnv7bjvth/image/upload/v1738655275/71Q82A9HWBL_mtuanu.jpg",
      name: "Justin Bieber",
      description: "This is description",
    },
    {
      id: 7,
      image:
        "https://res.cloudinary.com/dnv7bjvth/image/upload/v1738655275/71Q82A9HWBL_mtuanu.jpg",
      name: "Justin Bieber",
      description: "This is description",
    },
    {
      id: 8,
      image:
        "https://res.cloudinary.com/dnv7bjvth/image/upload/v1738655275/71Q82A9HWBL_mtuanu.jpg",
      name: "Justin Bieber",
      description: "This is description",
    },
    {
      id: 8,
      image:
        "https://res.cloudinary.com/dnv7bjvth/image/upload/v1738655275/71Q82A9HWBL_mtuanu.jpg",
      name: "Justin Bieber",
      description: "This is description",
    },
    {
      id: 8,
      image:
        "https://res.cloudinary.com/dnv7bjvth/image/upload/v1738655275/71Q82A9HWBL_mtuanu.jpg",
      name: "Justin Bieber",
      description: "This is description",
    },
    {
      id: 8,
      image:
        "https://res.cloudinary.com/dnv7bjvth/image/upload/v1738655275/71Q82A9HWBL_mtuanu.jpg",
      name: "Justin Bieber",
      description: "This is description",
    },
  ];
  return (
    <div className="pl-60 ">
      <h4 className="text-lg font-semibold mb-3">{category}</h4>
      <div className="flex gap-4 overflow-auto">
        {musics.map((item) => (
          <div
            key={item.id}
            className="min-w-[180px] p-2 rounded cursor-pointer hover:bg-gray-600"
          >
            <img
              className="rounded w-full h-[150px] object-cover"
              src={item.image}
              alt={item.name}
            />
            <p className="font-bold mt-2 mb-1">{item.name}</p>
            <p className="text-slate-200 text-sm">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
