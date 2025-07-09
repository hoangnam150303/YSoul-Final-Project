// FavouritePage.jsx
import React, { useEffect, useState } from "react";
import wishListApi from "../../hooks/wishListApi";
import { Card, Spin, message } from "antd";
import { Link } from "react-router-dom";
const FavouritePage = () => {
  const [films, setFilms] = useState([]);
  const [singles, setSingles] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchWishList();
  }, []);

  return (
    <div className="min-h-screen bg-[#151c25] py-10 px-5 text-white">
      <h2 className="text-3xl font-bold mb-8 text-white">Your Favorites</h2>

      {loading ? (
        <Spin size="large" className="text-center block mx-auto mt-20" />
      ) : (
        <>
          <section className="mb-10">
            <h3 className="text-2xl font-semibold mb-4 text-white">🎬 Films</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {films.length > 0 ? (
                films.map((film, idx) => (
                  <Link to={`/watchPage/${film._id}`}>
                    <Card
                      key={idx}
                      title={<span className="text-white">{film.name}</span>}
                      cover={
                        <img
                          alt={film.name}
                          src={film.small_image}
                          className="h-48 object-cover rounded-t"
                        />
                      }
                      className="bg-gray-800 text-white"
                      bordered={false}
                    />
                  </Link>
                ))
              ) : (
                <p className="text-gray-400">No favorite films yet.</p>
              )}
            </div>
          </section>

          <section>
            <h3 className="text-2xl font-semibold mb-4 text-white">🎵 Music</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {singles.length > 0 ? (
                singles.map((single, idx) => (
                  <Link to={`/singlePage/${single.single_id}`}>
                    <Card
                      key={idx}
                      title={<span className="text-white">{single.title}</span>}
                      cover={
                        <img
                          alt={single.title}
                          src={single.image}
                          className="h-48 object-cover rounded-t"
                        />
                      }
                      className="bg-gray-800 text-white"
                      bordered={false}
                    />
                  </Link>
                ))
              ) : (
                <p className="text-gray-400">No favorite music yet.</p>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default FavouritePage;
