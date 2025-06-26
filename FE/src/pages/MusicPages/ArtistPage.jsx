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
  const { audioRef, track, updateSong } = useContext(PlayerContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [artistSelected, setArtistSelected] = useState({});
  const [listAlbum, setListAlbum] = useState([]);
  const [listSong, setListSong] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        const response = await artistApi.getArtistById(id);
        console.log(response.data);
        setArtistSelected(response.data.artist);
        setListSong(response.data.singles);
        setListAlbum(response.data?.albums);
      } catch (error) {
        // Xử lý lỗi nếu có
      }
    };
    fetchArtist();
  }, [id]);

  const handleToggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
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
    image: song.image,
    title: song.title,
    album:
      listAlbum.find((album) => album.id === song.album_id)?.title || "N/A",
    dateAdded: song.createdAt,
    clock: song.duration,
  }));

  return (
    <>
      <div className="relative min-h-screen gradient-bg-hero text-white flex">
        <div className="z-50">
          <MusicSideBar onToggle={handleToggleSidebar} isOpen={isSidebarOpen} />
        </div>
        <div className="flex-1 flex flex-col">
          <BreadCrumb pageName="Artist" />
          <div className="mt-10 flex gap-8 flex-col md:flex-row md:items-center w-full px-60">
            <img
              src={artistSelected.avatar}
              alt="Album Cover"
              className="w-48 rounded"
            />
            <div className="flex flex-col">
              <p>Artist</p>
              <h2 className="text-5xl font-bold mb-4 md:text-7xl">
                {artistSelected.name}
              </h2>
              <p className="mt-1">
                <img
                  className="inline-block w-5"
                  src="https://res.cloudinary.com/dnv7bjvth/image/upload/v1736842897/fancyai_1736839648739_gfhqk9.png"
                  alt=""
                />
                <b>YSoul</b> • {artistSelected.likes} likes •{" "}
                {artistSelected.follows} followers •{" "}
                <b>{listSong.length} songs</b>
              </p>
            </div>
          </div>

          {/* Bảng danh sách single */}
          <Table
            onRow={(record) => ({
              onClick: () => {
                updateSong(record.key);
              },
            })}
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

          {/* Hàng album bên dưới bảng single */}
          <div className="mt-10 pl-32 pr-20 text-gray-400 bg-black">
            <h2 className="text-2xl font-bold mb-4">Albums</h2>
            <div className="flex gap-4 overflow-x-auto">
              {listAlbum.map((album) => (
                <div key={album.id} className="flex-shrink-0 w-48">
                  <img
                    src={album.image} // Thay đổi key image nếu cần thiết
                    alt={album.title}
                    className="w-full h-auto rounded"
                  />
                  <p className="mt-2">{album.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="fixed bottom-0 w-full">
        <Player />
        <audio preload="auto" ref={audioRef} src={track}></audio>
      </div>
    </>
  );
};
