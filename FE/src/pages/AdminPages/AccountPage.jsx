import React, { useEffect, useState } from "react";
import { Layout, theme, Table, Popconfirm, Button } from "antd";
import { AdminSideBar } from "../../components/SideBar/AdminSideBar";
import userApi from "../../hooks/useUser";

export const AccountPage = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const response = await userApi.getAllUsers();
      setUsers(response.data.users);
      console.log(response.data.users);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // Tạo data từ danh sách user
  const data = users.map((user) => ({
    key: user.id,
    avatar: user.avatar,
    name: user.name,
    email: user.email,
    status: user.status ? "Active" : "Inactive",
    authProvider: user.authprovider,
    lastLogin: user.lastlogin,
    vip: user.vip? "Vip" : "Not vip",
  }));
  const alignCenter = {
    align: "center",
  };
  // Định nghĩa các cột cho bảng
  const columns = [
    {
      title: "Avatar",
      dataIndex: "avatar", // sử dụng artist.avatar
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
      title: "Status",
      dataIndex: "status",
      key: "status",
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
    },
    {
        title: "Action",
        dataIndex: "action",
        key: "action",
        render: (text, record) => (
          <div>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Edit
            </button>
            <div className="ml-3">
                  {record.status ? (
                    <Popconfirm
                      title="Active the Artist"
                      description="Are you sure to active this artist?"
                      onConfirm={() => handleStatusChangeArtist(record.key)}
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
                      onConfirm={() => handleStatusChangeArtist(record.key)}
                      cancelText="No"
                    >
                      <button className="text-white bg-red-500 px-2 py-1 rounded-md mb-2">
                        Inactive
                      </button>
                    </Popconfirm>
                  )}
                </div>
          </div>
          
        ),
    }
    
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
        <Table dataSource={data} columns={columns} />
      </div>
    </Layout>
  );
};
