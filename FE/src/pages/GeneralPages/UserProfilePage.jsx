import React, { useEffect, useState } from "react";
import { Avatar, Input, Button, Modal, message, Popconfirm } from "antd";
import {
  CheckCircleOutlined,
  EditOutlined,
  PictureOutlined,
} from "@ant-design/icons";
import userApi from "../../hooks/userApi";
import { MovieSideBar } from "../../components/SideBar/MovieSideBar";

const UserProfilePage = () => {
  const [user, setUser] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Các state lưu giá trị form update
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

  // State cho password update
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userNFTs, setUserNFTs] = useState([]);

  const handleToggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const fetchProfile = async () => {
    try {
      const response = await userApi.getUserProfile();

      const userData = response.data.user;
      setUser(userData);
      // Khởi tạo giá trị cho form update
      setName(userData.name);
      setEmail(userData.email);
      setAvatarPreview(userData.avatar);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUserStore = async () => {
    try {
      const response = await userApi.getUserStore();
      const allNFTs = response.data.data?.[0]?.NFTs || [];
      setUserNFTs(allNFTs);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchUserStore();
  }, []);

  // Mở Modal cập nhật profile
  const openModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setShowPasswordFields(false);
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setAvatarFile(null); // Reset file sau khi đóng
  };

  const handleUpdateProfile = async () => {
    // FormData để gửi file
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);

    if (showPasswordFields) {
      formData.append("password", newPassword);
      formData.append("confirmPassword", confirmPassword);
      formData.append("oldPassword", oldPassword);
    } else {
      // Gửi rỗng nếu không update password
      formData.append("password", "");
      formData.append("confirmPassword", "");
      formData.append("oldPassword", "");
    }

    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }

    formData.append("vip", user.vip);

    try {
      const response = await userApi.updateUserProfile(user.id, formData);
      if (response.status === 200) {
        message.success("Profile updated successfully!");
        setUser(response.data.user);
        setAvatarPreview(response.data.user?.avatar);
        closeModal();
        fetchProfile();
      }
    } catch (error) {
      message.error("Update failed!");
      console.error(error);
    }
  };

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    }
  };

  const handleUpdateAvatar = async (image) => {
    try {
      const response = await userApi.updateAvatarNFT({ image });
      if (response.status === 200) {
        message.success("Avatar updated successfully!");
        setAvatarPreview(image);
        fetchProfile();
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Tính toán margin-left dựa trên trạng thái sidebar
  const mainContentMargin = isSidebarOpen ? "ml-52 lg:ml-64" : "ml-20 lg:ml-20";

  return (
    <>
      {/* Sidebar cố định bên trái */}
      <div className="fixed top-0 left-0 h-full z-50">
        <MovieSideBar onToggle={handleToggleSidebar} isOpen={isSidebarOpen} />
      </div>

      {/* Nội dung chính: Dark Theme + Dynamic margin */}
      <div
        className={`bg-[#0f0f0f] text-white w-full min-h-screen pt-6 px-8 transition-all duration-300 ${mainContentMargin}`}
      >
        <h1 className="text-4xl font-extrabold mb-10 text-white pt-4">
          My Profile
        </h1>

        {/* Thông tin người dùng */}
        <div className="bg-[#1f1f1f] rounded-xl border border-[#2a2a2a] shadow-lg p-8 mb-12 flex flex-col md:flex-row items-center gap-10">
          {/* Avatar + VIP */}
          <div className="flex flex-col items-center">
            <div className="p-[4px] rounded-full bg-gradient-to-tr from-red-500 to-purple-600 transition-all duration-300 hover:scale-105">
              <Avatar
                size={160}
                src={avatarPreview}
                className="border-4 border-[#1f1f1f] object-cover"
              />
            </div>

            <div className="text-center mt-4">
              <h2 className="text-2xl font-bold text-white mb-1">
                {user?.name}
              </h2>
              {user?.vip ? (
                <div className="bg-green-600 text-white text-sm p-1 px-3 rounded-full inline-flex items-center gap-1 font-medium">
                  <CheckCircleOutlined /> VIP USER
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Standard User</p>
              )}
            </div>
          </div>

          {/* Thông tin chi tiết */}
          <div className="md:w-1/2 w-full max-w-md space-y-4">
            <h3 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">
              Account Details
            </h3>

            {/* Name */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">
                Name
              </label>
              <Input
                value={user?.name}
                disabled
                className="bg-[#141414] border-[#333] text-white rounded-lg focus:border-red-500"
                style={{ color: "white" }}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">
                Email
              </label>
              <Input
                value={user?.email}
                disabled
                className="bg-[#141414] border-[#333] text-white rounded-lg focus:border-red-500"
                style={{ color: "white" }}
              />
            </div>

            <Button
              type="primary"
              onClick={openModal}
              className="w-full bg-red-600 hover:bg-red-500 border-none h-10 rounded-lg font-bold shadow-lg shadow-red-900/40"
              icon={<EditOutlined />}
            >
              Update Profile
            </Button>
          </div>
        </div>

        {/* --- NFT Collection --- */}
        {userNFTs.length > 0 && (
          <div className="mt-10 mb-12 bg-[#1f1f1f] rounded-xl border border-[#2a2a2a] shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6 text-red-500 flex items-center gap-2">
              <PictureOutlined /> Your NFT Collection
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {userNFTs.map((nft) => (
                <div
                  key={nft._id}
                  className={`relative group rounded-xl overflow-hidden border transition-all duration-300 transform hover:scale-[1.02] ${
                    avatarPreview === nft.image
                      ? "border-green-500 shadow-lg shadow-green-900/30"
                      : "border-[#333] hover:border-red-500"
                  } bg-[#141414]`}
                >
                  <img
                    src={nft.image}
                    alt={nft.name}
                    className="w-full h-48 object-cover rounded-t-xl"
                  />

                  <div className="px-3 py-3 bg-[#141414] flex justify-between items-center">
                    <h3 className="text-sm font-semibold truncate text-white">
                      {nft.name}
                    </h3>
                    {avatarPreview === nft.image && (
                      <p className="text-green-400 text-xs font-semibold">
                        (Current)
                      </p>
                    )}
                  </div>

                  {/* Action Overlay */}
                  {avatarPreview !== nft.image && (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                      <Popconfirm
                        title={
                          <span className="text-black">
                            Set this image as your avatar?
                          </span>
                        }
                        onConfirm={() => handleUpdateAvatar(nft.image)}
                        okText="Yes"
                        cancelText="No"
                      >
                        <Button
                          type="primary"
                          className="bg-red-600 hover:bg-red-500 border-none"
                          icon={<CheckCircleOutlined />}
                        >
                          Set as Avatar
                        </Button>
                      </Popconfirm>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal cập nhật thông tin (Chỉnh sửa để hợp Dark Theme) */}
      <Modal
        title={<span className="text-white">Update Profile</span>}
        visible={isModalVisible}
        onCancel={closeModal}
        footer={[
          <Button
            key="cancel"
            onClick={closeModal}
            className="bg-gray-700 text-white border-none hover:bg-gray-600"
          >
            Cancel
          </Button>,
          <Button
            key="update"
            type="primary"
            onClick={handleUpdateProfile}
            className="bg-red-600 hover:bg-red-500 border-none"
          >
            Update
          </Button>,
        ]}
        // Custom Modal Style cho Dark Theme
        wrapClassName="dark-theme-modal-wrap"
        style={{ color: "white" }}
        maskStyle={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
        bodyStyle={{ backgroundColor: "#1f1f1f", color: "white" }}
        headerStyle={{
          backgroundColor: "#1a1a1a",
          borderBottom: "1px solid #333",
        }}
      >
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Name
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="bg-[#141414] border-[#333] text-white focus:border-red-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Email
          </label>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="bg-[#141414] border-[#333] text-white focus:border-red-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-1">
            New Avatar
          </label>
          <Input
            type="file"
            onChange={handleAvatarChange}
            className="bg-[#141414] border-[#333] text-gray-300 focus:border-red-500"
          />
        </div>

        {/* Avatar Preview trong Modal */}
        {avatarFile && (
          <div className="mb-4 flex justify-center">
            <img
              src={avatarPreview}
              alt="New Avatar Preview"
              className="w-24 h-24 rounded-full object-cover border border-[#333]"
            />
          </div>
        )}

        <div className="mb-4">
          <Button
            onClick={() => setShowPasswordFields(!showPasswordFields)}
            className="bg-gray-700 text-white border-none hover:bg-gray-600"
          >
            {showPasswordFields ? "Hide Update Password" : "Update Password"}
          </Button>
        </div>
        {showPasswordFields && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Old Password
              </label>
              <Input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="bg-[#141414] border-[#333] text-white focus:border-red-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                New Password
              </label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="bg-[#141414] border-[#333] text-white focus:border-red-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Confirm Password
              </label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-[#141414] border-[#333] text-white focus:border-red-500"
              />
            </div>
          </>
        )}
      </Modal>
    </>
  );
};

export default UserProfilePage;
