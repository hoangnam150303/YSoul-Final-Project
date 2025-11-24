import React, { useEffect, useState } from "react";
import { MovieSideBar } from "../../components/SideBar/MovieSideBar";
import {
  Checkbox,
  Input,
  Pagination,
  Select,
  ConfigProvider,
  theme,
} from "antd";
import { Link } from "react-router-dom";
import { SearchOutlined } from "@ant-design/icons";
import filmApi from "../../hooks/filmApi";

// Định nghĩa lại style cho Ant Design để hợp với Dark Mode
const darkThemeConfig = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: "#dc2626", // Màu đỏ (Red-600)
    colorBgContainer: "#1f2937", // Gray-800
    colorBorder: "#374151", // Gray-700
    colorText: "#ffffff",
  },
};

export const SearchPage = () => {
  const [type, setType] = useState("All");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState(null);
  const [category, setCategory] = useState([]);
  const [totalFilm, setTotalFilm] = useState(0);

  const fetchFilm = async () => {
    try {
      const response = await filmApi.getAllFilm({
        typeFilm: type,
        category: category,
        sort: status,
        search: searchTerm,
      });
      if (response.data && response.data.data) {
        setResults(response.data.data.data);
        // setTotalFilm(response.data.data.total); // Nếu API có trả về total
      }
    } catch (error) {
      console.error("Failed to fetch films", error);
    }
  };

  const handleTypeChange = (newType) => setType(newType);

  // Dùng debounce đơn giản hoặc để nguyên logic cũ
  const handleSearch = (e) => {
    if (e && e.target) setSearchTerm(e.target.value);
  };

  const handleToggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const items = [
    { value: "Newest", label: "Newest" },
    { value: "Top Rated", label: "Top Rated" },
    { value: "Popular", label: "Popular" },
    { value: "Trending", label: "Trending" },
  ];

  const options = [
    "Action",
    "Animation",
    "Romance",
    "Horror",
    "Comedy",
    "Adventure",
    "Science Fiction",
    "Drama",
    "Fantasy",
    "Crime",
    "Documentary",
    "Historical",
    "Mystery",
    "Education",
    "Superhero",
  ].map((opt) => ({ label: opt, value: opt }));

  const onChange = (checkedValues) => setCategory(checkedValues);
  const onChangeStatus = (value) => setStatus(value);

  useEffect(() => {
    fetchFilm();
  }, [category, type, searchTerm, status]);

  return (
    <ConfigProvider theme={darkThemeConfig}>
      <div className="bg-black min-h-screen text-white flex">
        {/* Sidebar Wrapper - Giữ vị trí bên trái */}
        <div
          className={`fixed inset-y-0 left-0 z-50 transition-all duration-300 ${
            isSidebarOpen ? "w-64" : "w-20"
          }`}
        >
          <MovieSideBar onToggle={handleToggleSidebar} isOpen={isSidebarOpen} />
        </div>

        {/* Main Content - Thêm margin-left (pl) để không bị Sidebar che */}
        <div
          className={`flex-1 p-8 transition-all duration-300 ${
            isSidebarOpen ? "ml-64" : "ml-20"
          }`}
        >
          {/* 1. Header Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {["Movie", "TV Shows", "Person", "All"].map((item) => (
              <button
                key={item}
                className={`py-2 px-6 rounded-full font-medium transition-all duration-200 transform hover:scale-105 ${
                  type === item
                    ? "bg-red-600 text-white shadow-lg shadow-red-900/50"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
                onClick={() => handleTypeChange(item)}
              >
                {item}
              </button>
            ))}
          </div>

          {/* 2. Search & Sort Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-6 max-w-4xl mx-auto">
            <div className="flex-1">
              <Input
                size="large"
                placeholder="Find movies, TV shows..."
                prefix={<SearchOutlined className="text-gray-400 mr-2" />}
                onChange={handleSearch}
                className="rounded-lg bg-gray-900 border-gray-700 hover:border-red-500 focus:border-red-500 text-white placeholder-gray-500"
                style={{ backgroundColor: "#111827", color: "white" }}
              />
            </div>
            <div className="w-full md:w-48">
              <Select
                allowClear
                showSearch
                placeholder="Sort By"
                optionFilterProp="label"
                onChange={onChangeStatus}
                options={items}
                size="large"
                className="w-full"
                popupClassName="bg-gray-800"
              />
            </div>
          </div>

          {/* 3. Filter Categories (Checkbox) */}
          <div className="mb-8 max-w-4xl mx-auto">
            <div className="bg-[#111827] border border-gray-800 p-5 rounded-xl shadow-inner">
              <p className="text-gray-400 text-sm mb-3 uppercase tracking-wider font-semibold">
                Genres
              </p>
              <Checkbox.Group
                options={options}
                onChange={onChange}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 custom-checkbox-group"
              />
            </div>
          </div>

          {/* 4. Results Grid */}
          {results.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {results.map((film, index) => (
                <div
                  key={index}
                  className="group relative bg-gray-900 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:-translate-y-2 hover:shadow-red-900/20"
                >
                  <Link to={`/watchPage/${film._id}`} className="block h-full">
                    <div className="aspect-[2/3] overflow-hidden">
                      <img
                        src={film.small_image}
                        alt={film.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                        loading="lazy"
                      />
                    </div>
                    {/* Overlay Gradient khi hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <div>
                        <h2 className="text-white font-bold text-lg leading-tight">
                          {film.name}
                        </h2>
                        <p className="text-red-400 text-xs mt-1">
                          View Details
                        </p>
                      </div>
                    </div>
                    {/* Tiêu đề mặc định (khi chưa hover) */}
                    <div className="p-3 group-hover:opacity-0 transition-opacity duration-300">
                      <h2 className="text-gray-200 font-semibold text-sm truncate">
                        {film.name}
                      </h2>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-500">
              <p className="text-xl">
                No results found matching your criteria.
              </p>
            </div>
          )}

          {/* 5. Pagination */}
          <div className="mt-10 flex justify-center">
            <Pagination
              defaultCurrent={1}
              total={totalFilm}
              showSizeChanger={false}
            />
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};
