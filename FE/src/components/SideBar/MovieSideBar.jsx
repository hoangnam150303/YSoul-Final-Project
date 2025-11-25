import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { CloseOutlined } from "@ant-design/icons";
import {
  AlignLeftOutlined,
  RightOutlined,
  UserOutlined,
  MutedOutlined,
  LineChartOutlined,
  WechatWorkOutlined,
  SearchOutlined,
  HeartOutlined,
  LogoutOutlined,
  LoginOutlined,
} from "@ant-design/icons";
import { Button, Drawer, Tooltip } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../reducers/user";
import dashBoardsApi from "../../hooks/dashBoardsApi";

export const MovieSideBar = ({ onToggle, isOpen }) => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const userId = useSelector((state) => state.user.id);
  const dispatch = useDispatch();

  const Menus = [
    { title: "Profile", icon: <UserOutlined />, path: `/userprofile` },
    { title: "Search", icon: <SearchOutlined />, path: `/search` },
    { title: "Favourite", icon: <HeartOutlined />, path: `/favourite` },
    { title: "Music", icon: <MutedOutlined />, path: `/musicHomePage` },
    { title: "Market", icon: <LineChartOutlined />, path: `/market` },
    { title: "Social", icon: <WechatWorkOutlined />, path: `/socialHomePage` },
  ];

  const showDrawer = () => setOpenDrawer(true);
  const onCloseDrawer = () => setOpenDrawer(false);

  const handleIncreaseFavouriteCount = async (type) => {
    try {
      await dashBoardsApi.increaseFavouriteCount(type);
    } catch (error) {
      console.error("Failed to increase count:", error.message);
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    setTimeout(() => {
      window.location.href = "/";
    }, 100);
  };

  useEffect(() => {
    console.log(`User ID: ${userId}`);
  }, [userId]);

  // ✨ Component con để render từng item menu (Tái sử dụng cho cả Desktop & Mobile)
  const MenuLink = ({ menu, isMobile = false }) => (
    <NavLink
      to={menu.path}
      onClick={() => {
        if (isMobile) onCloseDrawer();
        const typeMap = {
          "/musicHomePage": "music",
          "/market": "market",
          "/socialHomePage": "social",
        };
        if (typeMap[menu.path]) {
          handleIncreaseFavouriteCount(typeMap[menu.path]);
        }
      }}
      className={({ isActive }) =>
        `group relative flex items-center gap-x-4 py-3 px-4 mx-2 my-1 rounded-xl transition-all duration-300 font-medium ${
          isActive
            ? "bg-gradient-to-r from-red-600 to-red-900 text-white shadow-lg shadow-red-900/40"
            : "text-gray-400 hover:bg-[#ffffff10] hover:text-white"
        }`
      }
    >
      <span className="text-xl flex items-center">{menu.icon}</span>
      <span
        className={`${
          !isOpen && !isMobile && "hidden"
        } origin-left duration-200 text-sm whitespace-nowrap`}
      >
        {menu.title}
      </span>

      {/* Tooltip khi thu nhỏ sidebar */}
      {!isOpen && !isMobile && (
        <div className="absolute left-full rounded-md px-2 py-1 ml-6 bg-gray-900 text-white text-xs opacity-0 -translate-x-3 transition-all group-hover:opacity-100 group-hover:translate-x-0 z-50 whitespace-nowrap border border-gray-700 shadow-xl">
          {menu.title}
        </div>
      )}
    </NavLink>
  );

  return (
    <div className="h-full relative z-40">
      {/* ================= DESKTOP SIDEBAR ================= */}
      <div
        className={`${
          isOpen ? "w-64" : "w-20"
        } duration-300 ease-in-out fixed h-full bg-[#0f0f0f] border-r border-[#2a2a2a] hidden lg:flex flex-col justify-between shadow-2xl`}
      >
        {/* --- Header / Avatar --- */}
        <div className="flex flex-col items-center pt-8 pb-4">
          <Link to={"/"} className="relative group">
            <div className="p-[2px] rounded-full bg-gradient-to-tr ">
              <img
                src={
                  "https://res.cloudinary.com/dnv7bjvth/image/upload/v1736842897/fancyai_1736839648739_gfhqk9.png"
                }
                alt="User"
                className={`rounded-full border-2 border-[#0f0f0f] object-cover transition-all duration-300 ${
                  isOpen ? "w-16 h-16" : "w-10 h-10"
                }`}
              />
            </div>
          </Link>
          <div
            className={`mt-3 text-center transition-all duration-300 ${
              !isOpen && "scale-0 h-0 overflow-hidden"
            }`}
          >
            <h3 className="text-white font-bold text-sm tracking-wide m-0">
              Welcome Back
            </h3>
            <p className="text-gray-500 text-xs m-0">Premium Member</p>
          </div>
        </div>

        {/* --- Toggle Button --- */}
        <button
          onClick={onToggle}
          className="absolute -right-3 top-12 bg-[#2a2a2a] text-gray-300 hover:text-white border border-[#3f3f3f] rounded-full w-7 h-7 flex items-center justify-center cursor-pointer transition-all hover:scale-110 shadow-lg z-50 focus:outline-none"
        >
          <RightOutlined
            className={`text-xs transition-transform duration-300 ${
              isOpen && "rotate-180"
            }`}
          />
        </button>

        {/* --- Menus --- */}
        <div className="flex-1 overflow-y-auto px-1 py-4 scrollbar-hide space-y-1">
          {Menus.map((menu, index) => (
            <MenuLink key={index} menu={menu} />
          ))}
        </div>

        {/* --- Footer / Auth --- */}
        <div className="p-4 border-t border-[#2a2a2a]">
          {userId !== 0 && userId !== null ? (
            <Button
              type="text"
              onClick={handleLogout}
              className={`w-full flex items-center justify-center gap-2 text-gray-400 hover:text-red-500 hover:bg-[#ffffff05] border-none transition-all duration-300 h-12 rounded-xl ${
                !isOpen && "px-0"
              }`}
            >
              <LogoutOutlined className="text-xl" />
              {isOpen && <span className="font-medium">Logout</span>}
            </Button>
          ) : (
            <Link to={`/login`}>
              <Button
                type="primary"
                className={`w-full bg-red-600 hover:bg-red-700 border-none h-12 rounded-xl shadow-lg shadow-red-900/20 font-medium flex items-center justify-center gap-2 ${
                  !isOpen && "px-0"
                }`}
              >
                {isOpen ? <span>Login</span> : <LoginOutlined />}
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* ================= MOBILE / TABLET DRAWER ================= */}
      <div className="m-4 lg:hidden fixed top-0 left-0 z-50">
        <Button
          type="text"
          onClick={showDrawer}
          className="bg-[#0f0f0f]/80 backdrop-blur-md text-white border border-[#2a2a2a] w-12 h-12 rounded-xl flex items-center justify-center hover:bg-[#1f1f1f]"
        >
          <AlignLeftOutlined className="text-xl" />
        </Button>

        <Drawer
          title={
            <span className="text-white font-bold tracking-wider uppercase">
              Menu
            </span>
          }
          onClose={onCloseDrawer}
          open={openDrawer}
          placement="left"
          width={280}
          closeIcon={
            <CloseOutlined className="text-gray-400 hover:text-white" />
          }
          styles={{
            header: {
              backgroundColor: "#0f0f0f",
              borderBottom: "1px solid #2a2a2a",
            },
            body: { backgroundColor: "#0f0f0f", padding: 0 },
            mask: { backdropFilter: "blur(3px)" }, 
          }}
        >
          <div className="flex flex-col h-full bg-[#0f0f0f]">
            {/* Mobile Profile Area */}
            <div className="p-6 flex items-center gap-4 border-b border-[#2a2a2a] bg-[#141414]">
              <div className="p-[2px] rounded-full ">
                <img
                  src="https://res.cloudinary.com/dnv7bjvth/image/upload/v1736842897/fancyai_1736839648739_gfhqk9.png"
                  alt="User"
                  className="w-12 h-12 rounded-full border-2 border-[#141414] object-cover"
                />
              </div>
              <div>
                <h4 className="text-white font-bold m-0 text-sm">
                  Hello, User!
                </h4>
                <p className="text-gray-500 text-xs m-0">Welcome back</p>
              </div>
            </div>

            <div className="flex-1 px-3 py-4 space-y-1">
              {Menus.map((menu, index) => (
                <MenuLink key={index} menu={menu} isMobile={true} />
              ))}
            </div>

            <div className="p-6 border-t border-[#2a2a2a] bg-[#141414]">
              {userId !== 0 ? (
                <Button
                  onClick={handleLogout}
                  className="w-full h-12 bg-[#2a2a2a] text-gray-300 border-none hover:bg-red-600 hover:text-white rounded-xl font-medium transition-all"
                >
                  Logout
                </Button>
              ) : (
                <Link to={`/login`}>
                  <Button className="w-full h-12 bg-red-600 text-white border-none hover:bg-red-700 rounded-xl font-medium shadow-lg shadow-red-900/30">
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </Drawer>
      </div>
    </div>
  );
};
