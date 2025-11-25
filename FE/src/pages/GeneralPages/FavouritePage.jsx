import React, { useEffect, useState } from "react";
import wishListApi from "../../hooks/wishListApi";
import { Card, Spin, message } from "antd";
import { Link } from "react-router-dom";
import { MovieSideBar } from "../../components/SideBar/MovieSideBar";

const FavouritePage = () => {
  const [films, setFilms] = useState([]);
  const [singles, setSingles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const fetchWishList = async () => {
    try {
      const response = await wishListApi.getWishList();
      if (response.status === 200 && response.data.success) {
        const data = response.data.data;
        setFilms(data.film_id || []);
        setSingles(data.single || []);
        console.log(data.single);
      } else {
        message.error("You dont have any wishlist");
      }
    } catch (error) {
      console.log(error);
      message.error("You dont have any wishlist");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    fetchWishList();
  }, []);

  // Component Card tùy chỉnh (đẹp hơn Card AntD mặc định)
  const CustomMediaCard = ({ item, type }) => {
    const isFilm = type === "film";
    const itemId = isFilm ? item._id : item.single_id;
    const itemTitle = isFilm ? item.name : item.title;
    const itemImage = isFilm ? item.small_image : item.image;
    const itemPath = isFilm ? `/watchPage/${itemId}` : `/singlePage/${itemId}`;

    return (
      <Link to={itemPath} className="block group">
        <div className="bg-[#1f1f1f] rounded-xl shadow-lg overflow-hidden border border-[#2a2a2a] transform transition-all duration-300 group-hover:scale-[1.03] group-hover:shadow-2xl">
          {/* Cover Image */}
          <div className="h-48 overflow-hidden">
            <img
              alt={itemTitle}
              src={itemImage}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>

          {/* Content */}
          <div className="p-4">
            <h4 className="text-white font-bold text-base truncate mb-1">
              {itemTitle}
            </h4>
            <p className="text-gray-500 text-xs">
              {isFilm ? "Movie / Series" : "Single / Song"}
            </p>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      {/* Sidebar (Cần đảm bảo wrapper cho sidebar không bị cuộn) */}
      <div className="fixed top-0 left-0 h-full z-50">
        <MovieSideBar onToggle={handleToggleSidebar} isOpen={isSidebarOpen} />
      </div>

      {/* Main Content (Offset để tránh bị sidebar che) */}
      <div
        className={`pt-6 px-8 transition-all duration-300 ${
          isSidebarOpen ? "ml-52 lg:ml-64" : "ml-20 lg:ml-20" // Điều chỉnh margin-left theo trạng thái sidebar
        }`}
      >
        <h2 className="text-4xl font-extrabold mb-10 text-white pt-4">
          Your Wishlist
        </h2>

        {loading ? (
          <Spin
            size="large"
            className="text-center block mx-auto mt-20 text-red-500"
          />
        ) : (
          <>
            {/* --- FILMS Section --- */}
            <section className="mb-12">
              <h3 className="text-2xl font-bold mb-6 text-red-500 flex items-center gap-3">
                <span className="text-3xl">🎬</span> Films
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {films.length > 0 ? (
                  films.map((film) => (
                    <CustomMediaCard key={film._id} item={film} type="film" />
                  ))
                ) : (
                  <p className="text-gray-400 col-span-full bg-[#1a1a1a] p-4 rounded-lg border border-[#2a2a2a]">
                    You haven't added any favorite films yet.
                  </p>
                )}
              </div>
            </section>

            {/* --- MUSIC Section --- */}
            <section className="mb-12">
              <h3 className="text-2xl font-bold mb-6 text-indigo-400 flex items-center gap-3">
                <span className="text-3xl">🎵</span> Music
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {singles.length > 0 ? (
                  singles.map((single) => (
                    // Lưu ý: single.single_id là ID thực tế cần truyền
                    <CustomMediaCard
                      key={single.single_id}
                      item={single}
                      type="music"
                    />
                  ))
                ) : (
                  <p className="text-gray-400 col-span-full bg-[#1a1a1a] p-4 rounded-lg border border-[#2a2a2a]">
                    You haven't added any favorite music yet.
                  </p>
                )}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default FavouritePage;
