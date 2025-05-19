import React from "react";
import {
  AlignLeftOutlined,
  RightOutlined,
  UserOutlined,
  MutedOutlined,
  LineChartOutlined,
  WechatWorkOutlined,
  SearchOutlined,
  HeartOutlined,
} from "@ant-design/icons";
import { Button, Drawer, Dropdown, Menu } from "antd";
import { useEffect, useState } from "react";
import { Link, NavLink, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
export const MusicSideBar = ({ onToggle, isOpen }) => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const userId = useSelector((state) => state.user.id);
  const Menus = [
    {
      title: "Profile",
      icon: <UserOutlined className="text-2xl" />,
      path: `/userprofile`,
    },
    {
      title: "Search",
      icon: <SearchOutlined className="text-2xl" />,
      path: `/searchPageMuscic`,
    },
    {
      title: "Favourite",
      icon: <HeartOutlined className="text-2xl" />,
      path: `/favouriteMovie`,
    },
    {
      title: "Music",
      icon: <i className="bi bi-film text-2xl"></i>,
      path: `/`,
    },
    {
      title: "Market",
      icon: <LineChartOutlined className="text-2xl" />,
      path: `/market`,
    },
    {
      title: "Social",
      icon: <WechatWorkOutlined className="text-2xl" />,
      path: `/socialHomePage`,
    },
  ];

  const showDrawer = () => {
    setOpenDrawer(true);
  };

  const onCloseDrawer = () => {
    setOpenDrawer(false);
  };

  // Hàm logout tự xử lý
  const handleLogout = () => {
    console.log(userId);
    dispatch(logoutUser()); // Đầu tiên là reset Redux
    setTimeout(() => {
      window.location.href = "/login"; // Redirect sau vài ms để đảm bảo Redux cập nhật xong
    }, 100); // 100ms là an toàn
  };

  return (
    <div className="h-full">
      {/* Sidebar lớn */}
      <div
        className={`${
          isOpen ? "w-52" : "w-20"
        } duration-300 fixed h-full bg-black hidden lg:block `}
      >
        <div className="w-64 h-20">
          <div className="w-3/5 flex justify-between items-center mx-2">
            <Link to={"/"}>
              <img
                src={
                  "https://res.cloudinary.com/dnv7bjvth/image/upload/v1736842897/fancyai_1736839648739_gfhqk9.png" // avatar mặc định
                }
                alt="User"
                className={`cursor-pointer duration-500 rounded-full w-16 h-16 my-2`}
              />
            </Link>
          </div>
        </div>
        <RightOutlined
          className={`${
            isOpen && "rotate-180"
          } absolute text-3xl cursor-pointer -right-4 top-16 w-8 border-2 bg-black text-white border-gray-800 rounded-full`}
          onClick={onToggle}
        />
        <ul className="pt-6">
          {Menus.map((menu, index) => (
            <NavLink
              key={index}
              to={menu.path}
              className={({ isActive }) =>
                `flex items-center gap-x-4 py-4 h-16 px-7 text-base ${
                  isActive ? "bg-black text-white" : "text-gray-400"
                } hover:bg-gray-700 hover:text-white duration-300`
              }
            >
              {menu.icon}
              <span
                className={`${
                  !isOpen && "scale-0"
                } origin-left duration-100 text-base font-medium`}
              >
                {menu.title}
              </span>
            </NavLink>
          ))}
        </ul>
        <div className="mt-auto p-4">
          {userId !== 0 ? (
            <Button
              type="primary"
              className="w-full bg-black text-white px-3 py-2 rounded-full hover:bg-gray-800 duration-300 hover:text-white"
              onClick={handleLogout}
            >
              Logout
            </Button>
          ) : (
            <Link to={`/login`}>
              <Button
                type="primary"
                className="w-full bg-black text-white px-3 py-2 rounded-full hover:bg-gray-800 duration-300 hover:text-white"
              >
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Sidebar nhỏ (Tablet - Mobile - Ipad) */}
      <div className="m-2 lg:hidden bg-black">
        <Button
          type="primary"
          onClick={showDrawer}
          className="text-base bg-black text-white px-3 py-2 rounded-full hover:bg-gray-800 duration-300 hover:text-white"
        >
          <AlignLeftOutlined />
        </Button>
        <Drawer
          title="Menu"
          onClose={onCloseDrawer}
          open={openDrawer}
          placement="left"
          width={225}
          className="bg-black text-white" // Giữ màu nền đen cho Drawer
          bodyStyle={{ backgroundColor: "black" }} // Đảm bảo phần thân của Drawer cũng có nền đen
        >
          <ul className="pt-6">
            {Menus.map((menu, index) => (
              <NavLink
                key={index}
                to={menu.path}
                className={({ isActive }) =>
                  `flex items-center gap-x-4 py-4 h-16 px-7 text-base ${
                    isActive ? "bg-gray-800 text-white" : "text-gray-400"
                  } hover:bg-gray-700 hover:text-white duration-300`
                }
              >
                {menu.icon}
                <span className="origin-left duration-300 text-base font-medium">
                  {menu.title}
                </span>
              </NavLink>
            ))}
          </ul>
          <div className="mt-auto p-4">
            {userId !== 0 ? (
              <Button
                type="primary"
                className="w-full bg-black text-white px-3 py-2 rounded-full hover:bg-gray-800 duration-300 hover:text-white"
                onClick={handleLogout}
              >
                Logout
              </Button>
            ) : (
              <Link to={`/login`}>
                <Button
                  type="primary"
                  className="w-full bg-black text-white px-3 py-2 rounded-full hover:bg-gray-800 duration-300 hover:text-white"
                >
                  Login
                </Button>
              </Link>
            )}
          </div>
        </Drawer>
      </div>
    </div>
  );
};
