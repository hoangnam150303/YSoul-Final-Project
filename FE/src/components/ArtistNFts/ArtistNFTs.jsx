import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import artistNFTApi from "../../hooks/artistNFTApi";
import { Input, Pagination } from "antd";

const ArtistNFTs = () => {
  const [artists, setArtists] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(0); // Tổng số nghệ sĩ

  const { Search } = Input;

  const fetchArtists = async () => {
    try {
      const response = await artistNFTApi.getAllArtists(page, limit, search); // Gọi API
      if (response.status === 200) {
        setArtists(response.data.artistNFTs);
        setTotal(response.data.total);
      }
    } catch (error) {
      console.error("Failed to fetch artists", error);
    }
  };

  useEffect(() => {
    fetchArtists();
  }, [page, limit, search]); // Cập nhật khi có thay đổi

  return (
    <div className="bg-[#151c25] gradient-bg-artworks min-h-screen py-10">
      <div className="w-4/5 mx-auto text-white">
        <h2 className="text-3xl font-bold text-gradient mb-6">All Artists</h2>

        {/* Thanh tìm kiếm */}
        <div className="flex justify-center my-6">
          <Search
            placeholder="Find an artist..."
            allowClear
            enterButton="Tìm"
            size="large"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onSearch={(value) => {
              setSearch(value);
              setPage(1);
            }}
            className="w-full max-w-xl rounded-lg overflow-hidden"
            style={{
              borderRadius: "999px",
              padding: "4px 10px",
            }}
          />
        </div>

        {/* Hiển thị danh sách nghệ sĩ */}
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
            <p className="text-center w-full col-span-4">No artists found.</p>
          )}
        </div>

        {/* Pagination */}

        <div className="flex justify-end mt-8">
          <Pagination
            current={page}
            pageSize={limit}
            total={total}
            onChange={(newPage, newPageSize) => {
              setPage(newPage);
              setLimit(newPageSize);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ArtistNFTs;
