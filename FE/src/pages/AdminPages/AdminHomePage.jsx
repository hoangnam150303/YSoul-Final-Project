import React, { useState } from "react";
import { Layout, theme } from "antd";
import { AdminSideBar } from "../../components/SideBar/AdminSideBar";
const { Content } = Layout;
export const AdminHomePage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <Layout>
      <AdminSideBar />
      <Layout>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: "80vh",
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          Content
        </Content>
      </Layout>
    </Layout>
  );
};
