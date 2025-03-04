import React, { useEffect, useState } from "react";
import { Avatar, Input, Button, Modal, message } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import userApi from "../../hooks/useUser";
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

  useEffect(() => {
    fetchProfile();
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

  return (
    <>
      <div className="z-50">
        <MovieSideBar onToggle={handleToggleSidebar} isOpen={isSidebarOpen} />
      </div>
      <div className="flex flex-col md:flex-row items-center p-5 bg-black min-h-screen text-white">
        {/* Left Column: Avatar + VIP */}

        <div className="md:w-1/2 flex flex-col items-center mb-4 md:mb-0">
          <Avatar
            size={200}
            src={avatarPreview}
            className="border-2 border-gray-300"
          />
          {user?.vip && (
            <div className="mt-2 bg-green-500 text-white p-2 rounded-full">
              <CheckCircleOutlined /> VIP USER
            </div>
          )}
        </div>

        {/* Right Column: Thông tin người dùng */}
        <div className="md:w-1/2 w-full max-w-md">
          <h1 className="text-2xl font-bold mb-4">User Profile</h1>
          <div className="mb-4">
            <label className="block text-sm font-medium text-white">Name</label>
            <Input
              value={user?.name}
              disabled
              style={{ backgroundColor: "black", color: "white" }}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-white">
              Email
            </label>
            <Input
              value={user?.email}
              disabled
              style={{ backgroundColor: "black", color: "white" }}
            />
          </div>
          <Button type="primary" onClick={openModal} className="w-full">
            Update Profile
          </Button>
        </div>

        {/* Modal cập nhật profile (nền trắng, chữ đen) */}
        <Modal
          title="Update Profile"
          visible={isModalVisible}
          onCancel={closeModal}
          footer={[
            <Button key="cancel" onClick={closeModal}>
              Cancel
            </Button>,
            <Button key="update" type="primary" onClick={handleUpdateProfile}>
              Update
            </Button>,
          ]}
        >
          {/* Ở Modal, ta để mặc định background trắng, text màu đen (Antd default) */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Avatar
            </label>
            <Input type="file" onChange={handleAvatarChange} />
          </div>
          <div className="mb-4">
            <Button onClick={() => setShowPasswordFields(!showPasswordFields)}>
              {showPasswordFields ? "Hide Update Password" : "Update Password"}
            </Button>
          </div>
          {showPasswordFields && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Old Password
                </label>
                <Input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </>
          )}
        </Modal>
      </div>
    </>
  );
};

export default UserProfilePage;
