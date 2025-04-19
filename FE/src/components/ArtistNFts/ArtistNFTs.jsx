import React, { useEffect, useState } from "react";
import artistApi from "../../hooks/artistApi"; // Bạn cần tạo hoặc mock file này
import { Link } from "react-router-dom";

const ArtistNFTs = () => {
  const [artists, setArtists] = useState([]);

  const fetchArtists = async () => {
    try {
      const response = await artistApi.getAllArtists(); // API trả về toàn bộ artist
      if (response.status === 200) {
        setArtists(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch artists", error);
    }
  };

  useEffect(() => {
    fetchArtists();
  }, []);

  return (
    <div className="bg-[#151c25] gradient-bg-artworks min-h-screen py-10">
      <div className="w-4/5 mx-auto text-white">
        <h2 className="text-3xl font-bold text-gradient mb-6">All Artists</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {artists.length > 0 ? (
            artists.map((artist, index) => (
              <div
                key={index}
                className="bg-gray-800 p-4 rounded-lg shadow-lg hover:shadow-pink-500 transition-shadow"
              >
                <img
                  src={
                    artist.avatar ||
                    "https://i.pinimg.com/564x/11/1f/45/111f4590e168778aa17cda7f3d0dc7d7.jpg"
                  }
                  alt={artist.name}
                  className="w-full h-40 object-cover rounded-md mb-3"
                />
                <h3 className="text-lg font-bold">{artist.name}</h3>
                <p className="text-sm text-gray-400 mb-2">
                  {artist.bio?.slice(0, 80) || "No bio available."}
                </p>
                <Link
                  to={`/artist/${artist._id}`}
                  className="inline-block mt-2 text-sm font-medium text-pink-400 hover:underline"
                >
                  View Artworks →
                </Link>
              </div>
            ))
          ) : (
            <p>No artists found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtistNFTs;
