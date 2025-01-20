import React, { useEffect, useState } from "react";
import { MovieSideBar } from "../../components/SideBar/MovieSideBar";
import { Checkbox, Flex, Input, Pagination, Select } from "antd";
import { Link } from "react-router-dom";
import filmApi from "../../hooks/filmApi";

export const SearchPage = () => {
  const [type, setType] = useState("All");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalFilm, setTotalFilm] = useState(0);
  const fetchFilm = async () => {
    const response = await filmApi.getAllFilm({
      page: page,
      limit: limit,
      typeFilm: type,
      category: category,
      sort: status,
      search: searchTerm,
    });
    setResults(response.data.data.data);
    setTotalFilm(response.data.data.total);
  };
  const handleTypeChange = (newType) => {
    setType(newType);
  };

  const handleSearch = (e) => {
    if (e && e.target) {
      setSearchTerm(e.target.value);
    }
  };
  const handleToggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev); // Đổi trạng thái open
  };
  const items = [
    {
      value: "Newest",
      label: "Newest",
    },
    {
      value: "Top",
      label: "Top Rated",
    },
    {
      value: "Popular",
      label: "Popular",
    },
    {
      value: "Trending",
      label: "Trending ",
    },
    {
      value: "Your History",
      label: "Your History",
    },
  ];
  const options = [
    {
      label: "Action",
      value: "Action",
    },
    {
      label: "Animation",
      value: "Animation",
    },
    {
      label: "Romance",
      value: "Romance",
    },
    {
      label: "Horror",
      value: "Horror",
    },
    {
      label: "Comedy",
      value: "Comedy",
    },
    {
      label: "Adventure",
      value: "Adventure",
    },
    {
      label: "Science Fiction",
      value: "Science Fiction",
    },
    {
      label: "Drama",
      value: "Drama",
    },
    {
      label: "Fantasy",
      value: "Fantasy",
    },
    {
      label: "Crime",
      value: "Crime",
    },
    {
      label: "Documentary",
      value: "Documentary",
    },
    {
      label: "Historical",
      value: "Historical",
    },
    {
      label: "Mystery",
      value: "Mystery",
    },
    {
      label: "Education",
      value: "Education",
    },
    {
      label: "Superhero",
      value: "Superhero",
    },
  ];
  const onChange = (checkedValues) => {
    setCategory(checkedValues);
  };
  const onChangeStatus = (value) => {
    console.log(`selected ${value}`);
  };
  useEffect(() => {
    fetchFilm();
    handleSearch();
    onChange(category);
    handleTypeChange(type);
  }, [category, type, searchTerm, page, limit, status]);
  return (
    <div className="bg-black min-h-screen text-white">
      <div className="z-50">
        <MovieSideBar onToggle={handleToggleSidebar} isOpen={isSidebarOpen} />
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center gap-3 mb-4">
          <button
            className={`py-2 px-4 rounded ${
              type === "Movie" ? "bg-red-600" : "bg-gray-800"
            } hover:bg-red-700`}
            onClick={() => handleTypeChange("Movie")}
          >
            Movies
          </button>
          <button
            className={`py-2 px-4 rounded ${
              type === "TV Shows" ? "bg-red-600" : "bg-gray-800"
            } hover:bg-red-700`}
            onClick={() => handleTypeChange("TV Shows")}
          >
            TV Shows
          </button>
          <button
            className={`py-2 px-4 rounded ${
              type === "Person" ? "bg-red-600" : "bg-gray-800"
            } hover:bg-red-700`}
            onClick={() => handleTypeChange("Person")}
          >
            Person
          </button>
          <button
            className={`py-2 px-4 rounded ${
              type === "All" ? "bg-red-600" : "bg-gray-800"
            } hover:bg-red-700`}
            onClick={() => handleTypeChange("All")}
          >
            All
          </button>
        </div>
        <div className="flex gap-2 items-stretch mb-8 max-w-2xl mx-auto ">
          <Flex vertical gap={12} className="w-full p-2 rounded bg-gray-600">
            <Input
              placeholder="Search..."
              variant="borderless"
              onChange={handleSearch} // Trực tiếp truyền sự kiện vào
              style={{ color: "white" }}
              className="bg-gray-600"
            />
          </Flex>
          <Select
            showSearch
            placeholder="Status"
            optionFilterProp="label"
            onChange={onChangeStatus}
            options={items}
            className="ml-3.5"
            size="large"
          />
        </div>
        <Checkbox.Group
          options={options}
          defaultValue={["Pear"]}
          onChange={onChange}
          className="mb-4 bg-white p-4 rounded"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {results.length > 0 &&
            results.map((film, index) => (
              <div key={index} className="bg-gray-800 p-4 rounded">
                <Link
                  to={`/watchPage/${film._id}`}
                  className="flex flex-col items-center"
                >
                  <img
                    src={film.small_image}
                    alt="small poster"
                    className="max-h-96 rounded mx-auto"
                  />
                  <h2 className="mt-2 text-xl font-bold">{film.name}</h2>
                </Link>
              </div>
            ))}
        </div>
      </div>
      <Pagination align="end" defaultCurrent={1} total={totalFilm} />;
    </div>
  );
};
