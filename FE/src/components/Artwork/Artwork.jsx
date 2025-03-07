import React, { useEffect } from "react";
import nftApi from "../../hooks/nftApi";

const Artwork = () => {
  const [nfts, setNFTs] = React.useState([]);

  const fetchNFTs = async () => {
    try {
      const response = await nftApi.getAllNFTs("", "newest");
      if (response.status === 200) {
        setNFTs(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchNFTs();
  }, []);

  // Component Card được cập nhật để hiển thị thông tin từ đối tượng nft
  const Card = ({ nft }) => (
    <div className="w-full shadow-xl shadow-black rounded-md overflow-hidden bg-gray-800 my-2 p-3">
      <img
        className="h-60 w-full object-cover shadow-lg shadow-black rounded-lg mb-3"
        src={
          nft.image ||
          "https://cassette.sphdigital.com.sg/image/thepeak/864211938788f543b65acc5de1c6dd8ca89953a2a1ebecb0da57e43e13a6de4e?w=1000&q=85"
        }
        alt={nft.name || "NFT Image"}
      />
      <h4 className="text-white font-semibold">
        {nft.name || `NFT #${nft._id || ""}`}
      </h4>
      <p className="text-gray-400 text-sm my-1">
        {nft.description || "No description provided."}
      </p>
      <div className="flex justify-between items-center mt-3 text-white">
        <div className="flex flex-col">
          <small className="text-xs">Current Price</small>
          <p className="text-sm font-semibold">{nft.price || "0"} ETH</p>
        </div>
        <button className="shadow-lg shadow-black text-sm bg-[#e32970] hover:bg-[#bd255f] rounded-full px-1.5 py-1">
          View Details
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-[#151c25] gradient-bg-artworks">
      <div className="w-4/5 py-10 mx-auto">
        <h4 className="text-white text-3xl font-bold uppercase text-gradient">
          Latest Artworks
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-4 lg:gap-3 py-2.5">
          {nfts.length > 0 ? (
            nfts.map((nft, index) => <Card key={index} nft={nft} />)
          ) : (
            <p className="text-white">No NFTs found</p>
          )}
        </div>
        <div className="text-center my-5">
          <button className="shadow-lg shadow-black text-white bg-[#e32970] hover:bg-[#bd255f] rounded-full p-2">
            Load More
          </button>
        </div>
      </div>
    </div>
  );
};

export default Artwork;
