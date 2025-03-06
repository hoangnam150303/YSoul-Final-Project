import React, { useContext, useState } from "react";
import Transactions from "../../components/Transactions/Transactions";
import MarketHeader from "../../components/Header/MarketHeader";
import { ArtistNFTContext } from "../../context/ArtistNFTContext";
import artistNFTApi from "../../hooks/artistNFTApi";
import { TransactionContext } from "../../context/TransactionContext";
import { message } from "antd";
const CreateNFTModal = ({ onClose, onSubmit }) => {
  const [nftData, setNftData] = useState({
    image: null,
    price: "",
    description: "",
    name: "",
  });

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
const StoreProfile = () => {
  const { isArtist } = useContext(ArtistNFTContext);
  const { currentAccount } = useContext(TransactionContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNFTModalOpen, setIsNFTModalOpen] = useState(false);
  // Lưu avatar dưới dạng file và name dưới dạng text
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
    // Lấy file đầu tiên được chọn
    setFormData((prev) => ({ ...prev, avatar: e.target.files[0] }));
  };

  const handleRegister = async () => {
    // Ví dụ sử dụng FormData để gửi file cùng dữ liệu

    setFormData((prev) => ({ ...prev, addressWallet: currentAccount }));

    const data = new FormData();
    data.append("avatar", formData.avatar);
    data.append("name", formData.name);
    data.append("addressWallet", formData.addressWallet); // Gọi API để đăng ký artist (ví dụ: artistNFTApi.registerArtist(data))
    const response = await artistNFTApi.postRegisterArtist(formData);
    if (response.status === 200) {
      message.success("Register Success!");
    } else {
      message.error("Register fail!", response.data);
    }

    // Sau khi đăng ký thành công, có thể đóng modal
    setIsModalOpen(false);
  };

  const storeData = {
    avatar:
      "https://cdn.i-scmp.com/sites/default/files/styles/768x768/public/d8/images/canvas/2024/04/24/a94e2d09-2f19-4bd2-a13f-6d6eff58684c_eadcc3b5.jpg?itok=X0MrjxZs&v=1713940582",
    name: "Store Name",
    nfts: [
      {
        id: 1,
        image:
          "https://miro.medium.com/v2/resize:fit:628/1*xm2-adeU3YD4MsZikpc5UQ.png",
        title: "NFT 1",
      },
      {
        id: 2,
        image:
          "https://miro.medium.com/v2/resize:fit:628/1*xm2-adeU3YD4MsZikpc5UQ.png",
        title: "NFT 2",
      },
      {
        id: 3,
        image:
          "https://miro.medium.com/v2/resize:fit:628/1*xm2-adeU3YD4MsZikpc5UQ.png",
        title: "NFT 3",
      },
    ],
    transactions: [
      { id: 1, detail: "Transaction 1 - 0.5 ETH" },
      { id: 2, detail: "Transaction 2 - 1.0 ETH" },
      { id: 3, detail: "Transaction 3 - 0.75 ETH" },
    ],
  };
  const handleCreateNFT = async (nftData) => {
    // Xử lý dữ liệu tạo NFT (có thể gọi API, upload file, v.v.)
    console.log("Create NFT with data:", nftData);
    message.success("NFT created successfully!");
    setIsNFTModalOpen(false);
  };
  return (
    <div className="gradient-bg-hero min-h-screen">
      <MarketHeader />
      {isArtist ? (
        <div className="flex flex-col items-center">
          {/* Thông tin cửa hàng */}
          <div className="mb-6">
            <img
              src={storeData.avatar}
              alt="Avatar"
              className="rounded-full w-32 h-32"
            />
            <h2 className="text-2xl font-bold text-center">{storeData.name}</h2>
          </div>
          <button
            onClick={() => setIsNFTModalOpen(true)}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
          >
            Create NFTs
          </button>
          {/* Danh sách NFT */}
          <div className="w-full mb-6">
            <h3 className="text-xl font-semibold mb-2">NFTs</h3>
            <div className="grid grid-cols-3 gap-4">
              {storeData.nfts.map((nft) => (
                <div key={nft.id} className="border rounded-lg p-2">
                  <div className="w-full aspect-square relative">
                    <img
                      src={nft.image}
                      alt={nft.title}
                      className="absolute inset-0 w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-center">
                    {nft.title}
                  </h3>
                </div>
              ))}
            </div>
          </div>

          {/* Giao dịch */}
          <div className="w-full">
            <h3 className="text-xl font-semibold mb-2">Transactions</h3>
            <Transactions />
          </div>

          {/* Nút Create NFTs */}

          {/* Modal tạo NFT */}
          {isNFTModalOpen && (
            <CreateNFTModal
              onClose={() => setIsNFTModalOpen(false)}
              onSubmit={handleCreateNFT}
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
