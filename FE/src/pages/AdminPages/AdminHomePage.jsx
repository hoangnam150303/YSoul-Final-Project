import React, { useEffect, useState } from "react";
import { Layout, message, theme } from "antd";
import { AdminSideBar } from "../../components/SideBar/AdminSideBar";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import dashBoardsApi from "../../hooks/dashBoardsApi";
import dayjs from "dayjs";
const { Content } = Layout;

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export const AdminHomePage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [revenueData, setRevenueData] = useState([]);

  const [vipUsers, setVipUsers] = useState(0);
  const [normalUsers, setNormalUsers] = useState(0);
  const [film, setFilm] = useState(0);
  const [music, setMusic] = useState(0);
  const [social, setSocial] = useState(0);
  const [market, setMarket] = useState(0);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const fetchNumberOfTypeUser = async () => {
    try {
      const response = await dashBoardsApi.getNumberOfTypeUser();

      if (response.status === 200) {
        setVipUsers(response.data.userData[1].count);
        setNormalUsers(response.data.userData[0].count);
      }
    } catch (error) {
      message.error("Error fetching user data: " + error.message);
    }
  };
  const fetchFavouriteCount = async () => {
    try {
      const response = await dashBoardsApi.getFavouriteCount();
      if (response.status === 200) {
        setFilm(response.data.data.film);
        setMusic(response.data.data.music);
        setSocial(response.data.data.social);
        setMarket(response.data.data.market);
      }
    } catch (error) {
      message.error("Error fetching favourite count: " + error.message);
    }
  };
  const fetchRevenue = async () => {
    try {
      const response = await dashBoardsApi.getRevenue();
      if (response.status === 200) {
        const rawData = response.data.data;

        // Nhóm theo tháng (yyyy-MM) và cộng tổng
        const groupedByMonth = rawData.reduce((acc, item) => {
          const month = dayjs(item.createdAt).format("YYYY-MM");
          const price = parseFloat(item.price || 0);

          if (!acc[month]) {
            acc[month] = price;
          } else {
            acc[month] += price;
          }
          return acc;
        }, {});

        // Định dạng lại để render biểu đồ
        const revenueArray = Object.entries(groupedByMonth)
          .map(([month, total]) => ({
            month,
            revenue: total,
          }))
          .sort((a, b) => new Date(a.month) - new Date(b.month));

        setRevenueData(revenueArray);
      }
    } catch (error) {
      message.error("Error fetching revenue: " + error.message);
    }
  };

  useEffect(() => {
    fetchNumberOfTypeUser();
    fetchFavouriteCount();
    fetchRevenue();
  }, []);
  const userData = [
    { type: "Normal", count: normalUsers },
    { type: "VIP", count: vipUsers },
  ];
  const trafficData = [
    { name: "Film", value: film },
    { name: "Music", value: music },
    { name: "Social", value: social },
    { name: "Market", value: market },
  ];
  return (
    <Layout>
      <AdminSideBar />
      <Layout>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <h2 style={{ marginBottom: 24 }}>Dashboard Overview</h2>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 32,
            }}
          >
            {/* Biểu đồ cột bên trái */}
            <div style={{ flex: 1, minWidth: 400, height: 400 }}>
              <h3>User Statistics</h3>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={userData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Biểu đồ tròn bên phải */}
            <div style={{ flex: 1, minWidth: 400, height: 400 }}>
              <h3>Traffic Sources</h3>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={trafficData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    label
                  >
                    {trafficData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Biểu đồ line bên dưới */}
          <div style={{ marginTop: 60 }}>
            <h3>Revenue by Month</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#00bcd4"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};
