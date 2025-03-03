import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { Button, Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export const AdminSideBar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Lấy đường dẫn hiện tại

  const items = [
    {
      key: "1",
      icon: <i className="bi bi-house-fill"></i>,
      label: "Home Page",
      path: "/homePageAdmin",
    },
    {
      key: "2",
      icon:<i className="bi bi-film"></i>,
      label: "Film",
      path: "/movieAdmin",
    },
    {
      key: "3",
      icon: <i className="bi bi-music-note"></i>,
      label: "Music",
      path: "/musicAdmin",
    },
    {
      key: "4",
      icon: <i className="bi bi-people-fill"></i>,
      label: "User",
      path: "/userAccount",
    },
  ];

  // Xác định key hiện tại dựa trên đường dẫn
  const currentKey = items.find((item) => item.path === location.pathname)?.key;

  const handleMenuClick = (e) => {
    const selectedItem = items.find((item) => item.key === e.key);
    if (selectedItem && selectedItem.path) {
      navigate(selectedItem.path); // Điều hướng đến path
    }
  };

  return (
    <>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[currentKey]} // Cập nhật key được chọn
          items={items.map(({ key, icon, label }) => ({
            key,
            icon,
            label,
          }))}
          onClick={handleMenuClick} // Bắt sự kiện click
        />
      </Sider>
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => setCollapsed(!collapsed)}
        style={{
          fontSize: "16px",
          width: 64,
          height: 64,
        }}
      />
    </>
  );
};
