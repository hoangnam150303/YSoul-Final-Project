import React, { useContext, useEffect, useState } from "react";
import { MusicSideBar } from "../../components/SideBar/MusicSideBar";

import { ClockCircleOutlined } from "@ant-design/icons";
import { Table } from "antd";
import { BreadCrumb } from "../../components/BreadCrumb/BreadCrumb";
import { useParams } from "react-router-dom";

import { Player } from "../../components/Player/Player";
import { PlayerContext } from "../../context/PlayerContext";
import artistApi from "../../hooks/artistApi";

export const ArtistPage = () => {
   const { audioRef, track,updateSong } = useContext(PlayerContext);
   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
   const [artistSelected, setArtistSelected] = useState({});
   const [listAlbum, setListAlbum] = useState([]);
   const [listSong, setListSong] = useState([]);
  const id = useParams().id;
  useEffect(() => {
    const fetchArtist = async () => {
      try {
        const response = await artistApi.getArtistById(id);
        console.log(response.data);
        setArtistSelected(response.data.artist);
        setListSong(response.data.singles);
        setListAlbum(response.data?.albums);
      } catch (error) {
        
      }
    };
    fetchArtist();
  },[id])
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
  const data = listSong.map((song) => ({
    key: song.id,
    title: song.title,
    dateAdded: song.createdAt,
    clock: song.duration,
  }))
  return (
  <>
    <div className="relative min-h-screen bg-black text-white flex">
      <div className="z-50">
        <MusicSideBar onToggle={handleToggleSidebar} isOpen={isSidebarOpen} />
      </div>
      <div className="flex-1 flex flex-col">
        <BreadCrumb pageName="Album" />
        <div className="mt-10 flex gap-8 flex-col md:flex-row md:items-center w-full px-60">
          <img
            src={artistSelected.image}
            alt="Album Cover"
            className="w-48 rounded"
          />
          <div className="flex flex-col">
            <p>Artist</p>
            <h2 className="text-5xl font-bold mb-4 md:text-7xl">{artistSelected.name}</h2>
            <p className="mt-1">
              <img
                className="inline-block w-5"
                src="https://res.cloudinary.com/dnv7bjvth/image/upload/v1736842897/fancyai_1736839648739_gfhqk9.png"
                alt=""
              />
              <b>YSoul</b> • {artistSelected.likes} likes
              <b> • {listSong.length} songs</b>
            </p>
          </div>
        </div>
        <Table
        onRow={(record) => {
          return {
            onClick: () => {
              // Lấy id của bản ghi được click (ở đây record.key chính là id)
              updateSong(record.key);
            },
          };
        }}
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
    
          <div className="fixed bottom-0 w-full">
            <Player />
            <audio preload="auto" ref={audioRef} src={track}></audio>
          </div>
    </>
  );
};
