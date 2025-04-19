import React, { useContext, useEffect, useState } from "react";
import Transactions from "../../components/Transactions/Transactions";
import MarketHeader from "../../components/Header/MarketHeader";
import { ArtistNFTContext } from "../../context/ArtistNFTContext";
import artistNFTApi from "../../hooks/artistNFTApi";
import { TransactionContext } from "../../context/TransactionContext";
import { Input, message, Pagination, Popconfirm, Select } from "antd";
import nftApi from "../../hooks/nftApi";
const CreateNFTModal = ({ onClose, onSubmit }) => {
  const { currentAccount } = useContext(TransactionContext);
  const [nftData, setNftData] = useState({
    image: null,
    price: "",
    description: "",
    addressWallet: "", // ban đầu là chuỗi rỗng
    name: "",
  });

  // useEffect này sẽ chạy mỗi khi currentAccount thay đổi
  useEffect(() => {
    setNftData((prev) => ({ ...prev, addressWallet: currentAccount }));
  }, [currentAccount]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNftData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setNftData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = () => {
    onSubmit(nftData);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Create NFT</h2>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Image:</label>
          <input
            type="file"
            name="image"
            onChange={handleFileChange}
            className="w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Price:</label>
          <input
            type="number"
            name="price"
            value={nftData.price}
            onChange={handleInputChange}
            className="w-full border rounded px-2 py-1"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Description:</label>
          <textarea
            name="description"
            value={nftData.description}
            onChange={handleInputChange}
            className="w-full border rounded px-2 py-1"
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Name:</label>
          <input
            type="text"
            name="name"
            value={nftData.name}
            onChange={handleInputChange}
            className="w-full border rounded px-2 py-1"
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="mr-4 px-4 py-2 bg-gray-300 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

const EditNFTModal = ({ nft, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    image: nft.image || null,
    price: nft.price || "",
    description: nft.description || "",
    name: nft.name || "",
  });

  // Tạo state cho image preview
  const [previewImage, setPreviewImage] = useState(nft.image || null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, image: file }));
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Edit NFT</h2>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Image:</label>
          {/* Hiển thị preview image nếu có */}
          {previewImage && (
            <img
              src={previewImage}
              alt="NFT Preview"
              className="mb-2 w-full h-60 object-cover rounded"
            />
          )}
          <input
            type="file"
            name="image"
            onChange={handleFileChange}
            className="w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Price:</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            className="w-full border rounded px-2 py-1"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full border rounded px-2 py-1"
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full border rounded px-2 py-1"
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="mr-4 px-4 py-2 bg-gray-300 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

const StoreProfile = () => {
  const { isArtist, artist } = useContext(ArtistNFTContext);
  const { currentAccount } = useContext(TransactionContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNFTModalOpen, setIsNFTModalOpen] = useState(false);
  const [nftData, setNftData] = useState([]);
  const [totalNFT, setTotalNFT] = useState(0); // Tổng số NFT
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);
  const [editingNft, setEditingNft] = useState(null);
  // State cho form đăng ký artist
  const [formData, setFormData] = useState({
    avatar: null,
    name: "",
    addressWallet: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, avatar: e.target.files[0] }));
  };
  const handleEditNFT = async (updatedData) => {
    try {
      // Giả sử bạn có hàm updateNFT trong nftApi, truyền vào id và dữ liệu cập nhật
      const response = await nftApi.updateNFT(editingNft._id, updatedData);
      if (response.status === 200) {
        message.success("NFT updated successfully!");
        setEditingNft(null);
        fetchNFTs();
      }
    } catch (error) {
      message.error("Failed to update NFT!");
    }
  };
  const handleRegister = async () => {
    setFormData((prev) => ({ ...prev, addressWallet: currentAccount }));
    
    const response = await artistNFTApi.postRegisterArtist(formData);
    if (response.status === 200) {
      message.success("Register Success!");
      setIsModalOpen(false);
    } else {
      message.error("Register fail!", response.data);
    }
  };
  const fetchNFTs = async () => {
    try {
      if (artist) {
        const response = await nftApi.getNFTByArtist(
          artist._id,
          searchTerm,
          filter,
          "artist",
          page,
          limit
        );
        if (response.status === 200) {
          // Giả sử API trả về response.data có cấu trúc { data: [...], page, limit, total }
          setNftData(response.data.data);
          setTotalNFT(response.data.totalNft);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchNFTs();
  }, [artist, page, limit, searchTerm, filter]);

  const handleCreateNFT = async (nftData) => {
    try {
      const response = await nftApi.postCreateNFT(nftData);
      if (response.status === 200) {
        message.success("NFT created successfully!");
        setIsNFTModalOpen(false);
        fetchNFTs();
      }
    } catch (error) {
      message.error("Failed to create NFT!");
    }
  };
  const handleUpdateStatusNFt = async (id, status) => {
    try {
      const response = await nftApi.updateStatusNFT(id);
      if (response.status === 200) {
        message.success("NFT updated successfully!");
        fetchNFTs();
      }
    } catch (error) {
      message.error("Failed to update NFT!");
    }
  };

  return (
    <div className="gradient-bg-hero min-h-screen">
      <MarketHeader />
      {isArtist ? (
        <div className="flex flex-col items-center">
          {/* Thông tin cửa hàng */}
          <div className="mb-6">
            <img
              src="https://cassette.sphdigital.com.sg/image/thepeak/864211938788f543b65acc5de1c6dd8ca89953a2a1ebecb0da57e43e13a6de4e?w=1000&q=85"
              alt="Avatar"
              className="rounded-full w-32 h-32"
            />
            <h2 className="text-2xl font-bold text-center">"Your Store"</h2>
          </div>
          <button
            onClick={() => setIsNFTModalOpen(true)}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
          >
            Create NFTs
          </button>
          {/* Danh sách NFT */}
          <div className="w-full mb-6">
            <h4 className="text-white text-3xl font-bold uppercase text-gradient">
              Artworks
            </h4>
            <div className="flex justify-end">
              <Select
                onChange={(value) => setLimit(value)}
                defaultValue={"Filter"}
                className="mr-2"
              >
                <option value="2">2</option>
                <option value="8">8</option>
                <option value="16">16</option>
              </Select>
              <Select
                onChange={(value) => setFilter(value)}
                defaultValue={"Filter"}
                style={{ width: 200 }}
                className="mr-2"
              >
                <option value="all">All</option>
                <option value="popular">Popular</option>
                <option value="priceDesc">Price: High to Low</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="isDeleted">Deleted</option>
                <option value="Active">Active</option>
              </Select>
              <Input
                placeholder="Search NFTs"
                onChange={(event) => setSearchTerm(event.target.value)}
                style={{ width: 200 }}
                className="ml-2"
              />
            </div>

            <div className="grid grid-cols-4 gap-4">
              {nftData.map((nft) => (
                <div
                  key={nft._id}
                  className="w-full shadow-xl shadow-black rounded-md overflow-hidden bg-gray-800 my-2 p-3"
                >
                  <img
                    className="h-60 w-full object-cover shadow-lg shadow-black rounded-lg mb-3"
                    src={
                      nft.image ||
                      "https://cassette.sphdigital.com.sg/image/thepeak/864211938788f543b65acc5de1c6dd8ca89953a2a1ebecb0da57e43e13a6de4e?w=1000&q=85"
                    }
                    alt={nft.name || "NFT Image"}
                  />
                  <h4 className="text-white font-semibold">
                    {nft.name || `NFT #${nft._id}`}
                  </h4>
                  <p className="text-gray-400 text-sm my-1">
                    {nft.description || "No description provided."}
                  </p>
                  <div className="flex justify-between items-center mt-3 text-white">
                    <div className="flex flex-col">
                      <small className="text-xs">Current Price</small>
                      <p className="text-sm font-semibold">
                        {nft.price || "0"} ETH
                      </p>
                    </div>
                    <button
                      onClick={() => setEditingNft(nft)}
                      className="shadow-lg shadow-black text-sm bg-[#e32970] hover:bg-[#bd255f] rounded-full px-1.5 py-1"
                    >
                      Edit NFT
                    </button>
                    <Popconfirm
                      title="Do you want to change status?"
                      onConfirm={() => handleUpdateStatusNFt(nft._id)}
                      okText="Yes"
                      cancelText="No"
                    >
                      {nft.status ? (
                        <button className="shadow-lg shadow-black text-sm bg-red-500 hover:bg-red-800 rounded-full px-1.5 py-1">
                          Inactive
                        </button>
                      ) : (
                        <button className="shadow-lg shadow-black text-sm bg-green-500 hover:bg-green-800 rounded-full px-1.5 py-1">
                          Active
                        </button>
                      )}
                    </Popconfirm>
                  </div>
                </div>
              ))}
            </div>
            {/* Điều chỉnh Pagination */}
            <div className="flex justify-end mt-4">
              <Pagination
                current={page}
                pageSize={limit}
                total={totalNFT}
                onChange={(newPage, newPageSize) => {
                  setPage(newPage);
                  setLimit(newPageSize);
                }}
              />
            </div>
          </div>

          {/* Giao dịch */}
          <div className="w-full">
            <h3 className="text-xl font-semibold mb-2">Transactions</h3>
            <Transactions />
          </div>

          {/* Modal tạo NFT */}
          {isNFTModalOpen && (
            <CreateNFTModal
              onClose={() => setIsNFTModalOpen(false)}
              onSubmit={handleCreateNFT}
            />
          )}

          {editingNft && (
            <EditNFTModal
              nft={editingNft}
              onClose={() => setEditingNft(null)}
              onSubmit={handleEditNFT}
            />
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-screen pb-40">
          <p className="mb-4 text-white font-bold text-3xl">
            You are not an artist. Register to become an artist.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Register as Artist
          </button>
          {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">Register as Artist</h2>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-1">
                    Avatar File:
                  </label>
                  <input
                    type="file"
                    name="avatar"
                    onChange={handleFileChange}
                    className="w-full"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-1">Name:</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full border rounded px-2 py-1"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="mr-4 px-4 py-2 bg-gray-300 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRegister}
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                  >
                    Register
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StoreProfile;
