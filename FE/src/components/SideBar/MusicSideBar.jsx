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
  const [open, setOpen] = useState(false);
  const id = useParams().id;
  const [shopDetail, setShopDetail] = useState();
  const role = useSelector((state) => state.user.role);
  const dispatch = useDispatch();
  const Menus = [
    {
      title: "Profile",
      icon: <UserOutlined className="text-2xl" />,
      path: `/`,
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
      icon: <MutedOutlined className="text-2xl" />,
      path: ``,
    },
    {
      title: "Market",
      icon: <LineChartOutlined className="text-2xl" />,
      path: ``,
    },
    {
      title: "Social",
      icon: <WechatWorkOutlined className="text-2xl" />,
      path: ``,
    },
  ];

  // useEffect(() => {
  //     const fetchShopDetail = async () => {
  //         try {
  //             const response = await shopApi.getDetailShop(id); // Gọi API
  //             const { shop } = response.data; // Lấy dữ liệu từ response
  //             setShopDetail(shop); // Lưu thông tin shop
  //         } catch (error) {
  //             console.error("Error fetching shop detail:", error);
  //         }
  //     };

  //     fetchShopDetail();
  // }, [id]);

  // Tablet - Mobile - Ipad
  const [openDrawer, setOpenDrawer] = useState(false);
  const showDrawer = () => {
    setOpenDrawer(true);
  };
  const onCloseDrawer = () => {
    setOpenDrawer(false);
  };
  useEffect(() => {
    console.log(role);
  }, [role]);
  const handleLogout = () => {
    console.log(role);
    dispatch(logoutUser()); // Dispatch action logout
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
                  shopDetail?.images[0] ||
                  "https://res.cloudinary.com/dnv7bjvth/image/upload/v1736842897/fancyai_1736839648739_gfhqk9.png"
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
          <Link to={`/login`}>
            <Button
              type="primary"
              className="w-full bg-black text-white px-3 py-2 rounded-full hover:bg-gray-800 duration-300 hover:text-white"
            >
              Login
            </Button>
          </Link>
        </div>
      </div>

      {/* Sidebar nhỏ (Tablet - Mobile - Ipad) */}
      <div className="m-2 lg:hidden">
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
          className="bg-black text-white"
        >
          <div className="w-64 h-20 mb-4">{/* Hình ảnh shop (nếu có) */}</div>
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
            {role && role !== "" ? (
              // Hiển thị nút Logout nếu role khác null
              <Button
                type="primary"
                className="w-full bg-black text-white px-3 py-2 rounded-full hover:bg-gray-800 duration-300 hover:text-white"
                onClick={handleLogout}
              >
                Logout
              </Button>
            ) : (
              // Hiển thị nút Login nếu role là null
              <Button
                type="primary"
                className="w-full bg-black text-white px-3 py-2 rounded-full hover:bg-gray-800 duration-300 hover:text-white"
              >
                Login
              </Button>
            )}
          </div>
        </Drawer>
      </div>
    </div>
  );
};
