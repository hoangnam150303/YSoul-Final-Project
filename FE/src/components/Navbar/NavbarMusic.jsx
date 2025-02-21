import React from "react";

export const NavbarMusic = ({ selectedType, onTypeChange }) => {
  return (
    <div className="w-full items-center font-semibold pt-10 pl-60">
      <div className="flex items-center gap-2 mt-4">
        <p
          className={`px-4 py-1 rounded-2xl cursor-pointer ${
            selectedType === "All" ? "bg-white text-black" : ""
          }`}
          onClick={() => onTypeChange("All")}
        >
          All
        </p>
        <p
          className={`px-4 py-1 rounded-2xl cursor-pointer ${
            selectedType === "Single" ? "bg-white text-black" : ""
          }`}
          onClick={() => onTypeChange("Single")}
        >
          Single
        </p>
        <p
          className={`px-4 py-1 rounded-2xl cursor-pointer ${
            selectedType === "Album" ? "bg-white text-black" : ""
          }`}
          onClick={() => onTypeChange("Album")}
        >
          Album
        </p>
        <p
          className={`px-4 py-1 rounded-2xl cursor-pointer ${
            selectedType === "Artist" ? "bg-white text-black" : ""
          }`}
          onClick={() => onTypeChange("Artist")}
        >
          Artist
        </p>
      </div>
    </div>
  );
};
