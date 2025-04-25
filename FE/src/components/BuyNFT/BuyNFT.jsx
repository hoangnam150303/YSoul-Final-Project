import React, { useContext, useEffect, useState } from "react";
import { Button, message, Spin } from "antd";
import nftApi from "../../hooks/nftApi";
import { TransactionContext } from "../../context/TransactionContext";
export const BuyNFT = ({ id, visible, onClose }) => {
  const [nftData, setNftData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { formData, setFormData, sendTransaction } =
    useContext(TransactionContext);

  // Lấy dữ liệu NFT theo id
  const fetchNFTs = async () => {
    try {
      setLoading(true);
      const response = await nftApi.getNFTById(id);
      setNftData(response.data.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error("Failed to fetch NFT data!");
    }
  };

  useEffect(() => {
    if (id && visible) {
      fetchNFTs();
    }
  }, [id, visible]);
  useEffect(() => {
    if (nftData) {
      setFormData({
        addressTo: nftData.artistId.addressWallet,
        amount: nftData.price,
        keyword: "buy nft",
        nftName: nftData.name,
        urlImage: nftData.image,
      });
    }
  }, [nftData]);
  const handleBuy = () => {
    sendTransaction();
  };

  // Nếu không visible thì không render gì
  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }} // Nền overlay
    >
      <div className="p-10 rounded-lg max-w-md w-full bg-gray-700 text-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold" style={{ color: "#ffffff" }}>
            Buy NFT
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            ×
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-32">
            <Spin
              tip={
                <span style={{ color: "#ffffff" }}>Loading NFT data...</span>
              }
            />
          </div>
        ) : nftData ? (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold" style={{ color: "#ffffff" }}>
              {nftData.name}
            </h3>
            {nftData.image && (
              <img
                src={nftData.image}
                alt={nftData.name}
                className="w-full max-h-64 object-cover rounded-lg"
              />
            )}
            <div className="space-y-2">
              {nftData.description && (
                <p style={{ color: "#d1d1d1" }}>{nftData.description}</p>
              )}
              {nftData.price && (
                <p className="text-xl font-bold" style={{ color: "#40c4ff" }}>
                  Price: {nftData.price} ETH
                </p>
              )}
              {nftData.addressWallet && (
                <>
                  <p className="text-sm text-gray-400 flex items-center">
                    <img
                      className="h-10 w-10 rounded-full mr-3"
                      src={
                        nftData.artistId.avatar ||
                        "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                      }
                      size={50}
                    />
                    <div>
                      <h6 className="text-pink-800 font-bold">
                        @{nftData.artistId.name}
                      </h6>
                      <p className="text-white font-semibold">
                        {`${nftData.artistId.addressWallet.slice(
                          0,
                          6
                        )}...${nftData.artistId?.addressWallet.slice(-4)}`}
                      </p>
                    </div>
                  </p>
                </>
              )}
            </div>
          </div>
        ) : (
          <p style={{ color: "#ffffff" }}>No NFT data available</p>
        )}

        <div className="flex justify-end space-x-2 mt-6">
          <Button
            onClick={onClose}
            style={{
              backgroundColor: "#333333",
              color: "#ffffff",
              border: "none",
            }}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            onClick={handleBuy}
            disabled={loading || !nftData}
            style={{
              backgroundColor: "#1890ff",
              border: "none",
            }}
          >
            Buy Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BuyNFT;
