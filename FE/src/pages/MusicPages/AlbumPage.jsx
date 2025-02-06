import React, { useState } from "react";
import { MusicSideBar } from "../../components/SideBar/MusicSideBar";
import { NavbarMusic } from "../../components/Navbar/NavbarMusic";
import { ClockCircleOutlined } from "@ant-design/icons";
import { Space, Table, Tag } from "antd";
import { BreadCrumb } from "../../components/BreadCrumb/BreadCrumb";

export const AlbumPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const handleToggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev); // Toggle sidebar state
  };
  const columns = [
    {
      title: "# Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Album",
      dataIndex: "album",
      key: "album",
    },
    {
      title: "Date Added",
      dataIndex: "dateAdded",
      key: "dateAdded",
    },
    {
      title: <ClockCircleOutlined />,
      dataIndex: "clock",
      key: "clock",
    },
  ];
  const data = [
    {
      key: "1",
      title: "John Brown",
      album: 32,
      dateAdded: "New York No. 1 Lake Park",
      clock: ["nice", "developer"],
    },
    {
      key: "2",
      name: "Jim Green",
      age: 42,
      address: "London No. 1 Lake Park",
      tags: ["loser"],
    },
    {
      key: "3",
      name: "Joe Black",
      age: 32,
      address: "Sydney No. 1 Lake Park",
      tags: ["cool", "teacher"],
    },
  ];
  return (
    <div className="relative min-h-screen bg-black text-white flex">
      <div className="z-50">
        <MusicSideBar onToggle={handleToggleSidebar} isOpen={isSidebarOpen} />
      </div>
      <div className="flex-1 flex flex-col">
        <BreadCrumb pageName="Album" />
        <div className="mt-10 flex gap-8 flex-col md:flex-row md:items-center w-full px-60">
          <img
            src="https://res.cloudinary.com/dnv7bjvth/image/upload/v1738655275/71Q82A9HWBL_mtuanu.jpg"
            alt="Album Cover"
            className="w-48 rounded"
          />
          <div className="flex flex-col">
            <p>Playlist</p>
            <h2 className="text-5xl font-bold mb-4 md:text-7xl">Confident</h2>
            <h4>This is description</h4>
            <p className="mt-1">
              <img
                className="inline-block w-5"
                src="https://res.cloudinary.com/dnv7bjvth/image/upload/v1736842897/fancyai_1736839648739_gfhqk9.png"
                alt=""
              />
              <b>YSoul</b> • 1,323,154 likes
              <b> • 50 songs, </b>
              about 2hr 30 min
            </p>
          </div>
        </div>
        <Table
          className="mt-10 pl-32 pr-20 text-gray-400 bg-black"
          columns={columns}
          dataSource={data}
          pagination={{
            pageSize: 100,
            showSizeChanger: false,
            showQuickJumper: false,
            showTotal: (total) => `Total ${total} items`,
          }}
        />
      </div>
    </div>
  );
};
