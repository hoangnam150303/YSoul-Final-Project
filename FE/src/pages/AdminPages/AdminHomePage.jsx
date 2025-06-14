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

const { Content } = Layout;





const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

// Dữ liệu biểu đồ đường
const accountPurchaseData = [
  { date: "Mon", purchases: 10 },
  { date: "Tue", purchases: 20 },
  { date: "Wed", purchases: 15 },
  { date: "Thu", purchases: 25 },
  { date: "Fri", purchases: 18 },
  { date: "Sat", purchases: 30 },
  { date: "Sun", purchases: 22 },
];

export const AdminHomePage = () => {
  const [collapsed, setCollapsed] = useState(false);
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
  useEffect(() => {
    fetchNumberOfTypeUser();
    fetchFavouriteCount();
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
            <h3>Account Purchases Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={accountPurchaseData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="purchases"
                  stroke="#82ca9d"
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
