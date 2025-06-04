import React, { useEffect, useState } from "react";
import {
  Layout,
  theme,
  Table,
  Popconfirm,
  Button,
  Modal,
  Switch,
  Select,
  Input,
} from "antd";
import { AdminSideBar } from "../../components/SideBar/AdminSideBar";
import userApi from "../../hooks/userApi";

const { Option } = Select;

export const AccountPage = () => {
  const [users, setUsers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [vipStatus, setVipStatus] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All");
  const fetchUsers = async () => {
    try {
      const response = await userApi.getAllUsers(filter, searchTerm, "admin");
      setUsers(response.data.users);
    } catch (error) {
      console.error(error);
    }
  };

  const handleStatusChangeUser = async (userId) => {
    try {
      await userApi.updateStatusUser(userId);
      fetchUsers();
    } catch (error) {
      console.error(error);
    }
  };

  // Khi bấm nút Edit, mở Modal và khởi tạo vipStatus từ dữ liệu user
  const handleEditUser = (userId) => {
    const userToEdit = users.find((user) => user.id === userId);
    if (userToEdit) {
      setSelectedUser(userToEdit);
      setVipStatus(userToEdit.vip);
      setIsModalVisible(true);
    }
  };

  // Khi bấm OK trên Modal: gọi API updateUserProfile với các field bắt buộc
  const handleModalOk = async () => {
    try {
      // Tạo payload với các field cần thiết.
      // Để cập nhật vip theo BE, ta cần gửi name, email, vip và các trường password, confirmPassword, oldPassword là null.
      const payload = {
        name: selectedUser.name,
        email: selectedUser.email,
        password: null,
        confirmPassword: null,
        oldPassword: null,
        vip: vipStatus,
      };
      await userApi.updateUserProfile(selectedUser.id, payload);
      fetchUsers();
      setIsModalVisible(false);
      setSelectedUser(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setSelectedUser(null);
  };

  useEffect(() => {
    fetchUsers();
  }, [filter, searchTerm]);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // Map dữ liệu user cho Table
  const data = users.map((user) => ({
    key: user.id,
    avatar: user.avatar,
    name: user.name,
    email: user.email,
    status: user.status,
    authProvider: user.authprovider,
    lastLogin: user.lastlogin,
    vip: user.vip,
  }));

  const alignCenter = { align: "center" };

  const columns = [
    {
      title: "Avatar",
      dataIndex: "avatar",
      key: "avatar",
      width: 150,
      ...alignCenter,
      render: (avatar) => (
        <div>
          <img src={avatar} alt="Avatar" className="w-full h-auto" />
        </div>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Last Login",
      dataIndex: "lastLogin",
      key: "lastLogin",
    },
    {
      title: "Auth Provider",
      dataIndex: "authProvider",
      key: "authProvider",
    },
    {
      title: "Vip",
      dataIndex: "vip",
      key: "vip",
      render: (vip) => (vip ? "Vip" : "Not Vip"),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button
            onClick={() => handleEditUser(record.key)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Edit
          </button>
          {record.status ? (
            <Popconfirm
              title="Active the Artist"
              description="Are you sure to active this artist?"
              onConfirm={() => handleStatusChangeUser(record.key)}
              cancelText="No"
            >
              <Button className="text-white bg-green-500 px-2 py-1 rounded-md">
                Active
              </Button>
            </Popconfirm>
          ) : (
            <Popconfirm
              title="Inactive the artist"
              description="Are you sure to inactive this artist?"
              onConfirm={() => handleStatusChangeUser(record.key)}
              cancelText="No"
            >
              <button className="text-white bg-red-500 px-2 py-1 rounded-md">
                Inactive
              </button>
            </Popconfirm>
          )}
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <AdminSideBar />
      <div
        style={{
          margin: "24px 16px",
          padding: 24,
          minHeight: "85vh",
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
        }}
      >
        {/* Container cho Select và Input trên 1 hàng */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 16,
            gap: "16px",
          }}
        >
          <Select
            className="pl-2"
            placeholder="Filter"
            onChange={(value) => setFilter(value)}
            style={{ width: "16%" }}
          >
            <Option value="all">All</Option>
            <Option value="unactive">Unactive</Option>
            <Option value="active">Active</Option>
            <Option value="isVip">Vip User</Option>
            <Option value="normalUser">Normal User</Option>
            <Option value="recent_login">Recent Login</Option>
          </Select>

          <Input
            placeholder="Search..."
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              color: "black",
              flex: 1,
            }}
            className="bg-white border border-gray-300 rounded-lg py-2 px-4 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <Table dataSource={data} columns={columns} />

        <Modal
          title="Edit Vip Status"
          visible={isModalVisible}
          onOk={handleModalOk}
          onCancel={handleModalCancel}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ marginRight: "8px" }}>Vip: </span>
            <Switch
              checked={vipStatus}
              onChange={(value) => setVipStatus(value)}
            />
          </div>
        </Modal>
      </div>
    </Layout>
  );
};
