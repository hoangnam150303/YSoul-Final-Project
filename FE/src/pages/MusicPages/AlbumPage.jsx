import React, { useContext, useEffect, useState } from "react";
import { MusicSideBar } from "../../components/SideBar/MusicSideBar";
import { NavbarMusic } from "../../components/Navbar/NavbarMusic";
import { ClockCircleOutlined } from "@ant-design/icons";
import { Space, Table, Tag } from "antd";
import { BreadCrumb } from "../../components/BreadCrumb/BreadCrumb";
import { useParams } from "react-router-dom";
import albumApi from "../../hooks/albumApi";
import { Player } from "../../components/Player/Player";
import { PlayerContext } from "../../context/PlayerContext";

export const AlbumPage = () => {
   const { audioRef, track,updateSong } = useContext(PlayerContext);
   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
   const [albumSelected, setAlbumSelected] = useState({});
   const [artist, setArtist] = useState({});
   const [listSong, setListSong] = useState([]);
  const id = useParams().id;
  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        const response = await albumApi.getAlbumById(id);
        setAlbumSelected(response.data.album);
        setArtist(response.data.artist);
        setListSong(response.data.singles);
      } catch (error) {
        
      }
    };
    fetchAlbum();
  },[id])
  const handleToggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev); // Toggle sidebar state
  };
  const columns = [
    {
      title: "# Image",
      dataIndex: "image",
      key: "image",
      render: (text) => (
        <div className="w-16 h-16">
          <img src={text} alt="..." className="w-full h-auto" />
        </div>
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
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
    image:song.image,
    title: song.title,
    dateAdded: song.createdAt,
    clock: song.duration,
  }))
  return (
  <>
    <div className="relative min-h-screen gradient-bg-hero text-white flex">
      <div className="z-50">
        <MusicSideBar onToggle={handleToggleSidebar} isOpen={isSidebarOpen} />
      </div>
      <div className="flex-1 flex flex-col">
        <BreadCrumb pageName="Album" />
        <div className="mt-10 flex gap-8 flex-col md:flex-row md:items-center w-full px-60">
          <img
            src={albumSelected.image}
            alt="Album Cover"
            className="w-48 rounded"
          />
          <div className="flex flex-col">
            <p>Playlist</p>
            <h2 className="text-5xl font-bold mb-4 md:text-7xl">{albumSelected.title}</h2>
            <h4>{artist.name}</h4>
            <p className="mt-1">
              <img
                className="inline-block w-5"
                src="https://res.cloudinary.com/dnv7bjvth/image/upload/v1736842897/fancyai_1736839648739_gfhqk9.png"
                alt=""
              />
              <b>YSoul</b> • {albumSelected.likes} likes
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
