import React, { useEffect, useState } from "react";
import { MovieSideBar } from "../../components/SideBar/MovieSideBar";
import { Button, Dropdown, Flex, Input, Pagination } from "antd";
import { Link } from "react-router-dom";

export const SearchPage = () => {
  const [type, setType] = useState("movie");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const handleTypeChange = (newType) => {
    setType(newType);
  };
  useEffect(() => {
    handleSearch();
  });
  const handleSearch = () => {};
  const handleToggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev); // Đổi trạng thái open
  };
  const items = [
    {
      key: "1",
      label: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.antgroup.com"
        >
          1st menu item
        </a>
      ),
    },
    {
      key: "2",
      label: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.aliyun.com"
        >
          2nd menu item
        </a>
      ),
    },
    {
      key: "3",
      label: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.luohanacademy.com"
        >
          3rd menu item
        </a>
      ),
    },
  ];
  return (
    <div className="bg-black min-h-screen text-white">
      <div className="z-50">
        <MovieSideBar onToggle={handleToggleSidebar} isOpen={isSidebarOpen} />
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center gap-3 mb-4">
          <button
            className={`py-2 px-4 rounded ${
              type === "movie" ? "bg-red-600" : "bg-gray-800"
            } hover:bg-red-700`}
            onClick={() => handleTypeChange("movie")}
          >
            Movies
          </button>
          <button
            className={`py-2 px-4 rounded ${
              type === "tv" ? "bg-red-600" : "bg-gray-800"
            } hover:bg-red-700`}
            onClick={() => handleTypeChange("tv")}
          >
            TV Shows
          </button>
          <button
            className={`py-2 px-4 rounded ${
              type === "person" ? "bg-red-600" : "bg-gray-800"
            } hover:bg-red-700`}
            onClick={() => handleTypeChange("person")}
          >
            Person
          </button>
          <button
            className={`py-2 px-4 rounded ${
              type === "all" ? "bg-red-600" : "bg-gray-800"
            } hover:bg-red-700`}
            onClick={() => handleTypeChange("all")}
          >
            All
          </button>
        </div>
        <div className="flex gap-2 items-stretch mb-8 max-w-2xl mx-auto">
          <Flex vertical gap={12} className="w-full p-2 rounded bg-gray-600">
            <Input
              placeholder="Search..."
              variant="borderless"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ color: "white" }}
              className="bg-gray-600"
            />
          </Flex>
          <Dropdown
            menu={{
              items,
            }}
            placement="bottom"
            arrow
          >
            <Button size="large">bottom</Button>
          </Dropdown>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array(20)
            .fill("")
            .map((_, index) => (
              <div key={index} className="bg-gray-800 p-4 rounded">
                <Link to={"/watchPage"} className="flex flex-col items-center">
                  <img
                    src="https://res.cloudinary.com/dnv7bjvth/image/upload/v1736953120/strangerthings_s3_fdp4gm.jpg"
                    alt="small poster"
                    className="max-h-96 rounded mx-auto"
                  />
                  <h2 className="mt-2 text-xl font-bold">Stranger Things</h2>
                </Link>
              </div>
            ))}
        </div>
      </div>
      <Pagination align="end" defaultCurrent={1} total={100} />;
    </div>
  );
};
