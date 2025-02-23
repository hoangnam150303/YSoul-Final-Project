import { createContext, useEffect, useRef, useState } from "react";
import singleApi from "../hooks/singleApi";

export const PlayerContext = createContext();

const PlayerContextProvider = (props) => {
  const audioRef = useRef();
  const seekBg = useRef();
  const seekBar = useRef();
  const songId = useRef();

  const [track, setTrack] = useState("");
  const [information, setInformation] = useState({});
  const [playStatus, setPlayStatus] = useState(false);
  const [listSong, setListSong] = useState([]);
  const [time, setTime] = useState({
    currentTime: { seconds: 0, minute: 0 },
    totalTime: { seconds: 0, minute: 0 },
  });

  // Function lấy thông tin bài hát dựa trên songId hiện tại
  const getSong = async () => {
    if (!songId.current) {
      return;
    }
    try {
      const response = await singleApi.getSingleById(songId.current);
      setInformation(response.data);
      setTrack(response.data.data.mp3);
      if (!listSong.includes(response.data.data.id)) {
        setListSong((prevList) => [...prevList, response.data.data.id]);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const prevSong = async () => {
    // Nếu mảng chỉ có 0 hoặc 1 phần tử, không có bài trước đó
    if (listSong.length <= 1) {
      return;
    }
    try {
      // Tạo một bản sao của mảng listSong
      const newList = [...listSong];
      console.log(newList);

      // Loại bỏ bài hiện tại (phần tử cuối cùng)
      newList.pop();
      // Lấy bài trước đó: phần tử cuối của newList
      let prevSongId = newList[newList.length - 1];
      if (prevSongId === songId.current) {
        prevSongId = newList[newList.length - 1];
      }
      // Cập nhật lại state listSong
      setListSong(newList);
      updateSong(prevSongId);
    } catch (error) {
      console.log(error);
    }
  };

  const nextSong = async () => {
    try {
      const response = await singleApi.nextSingle(songId.current);
      const newTrack = response.data.data.mp3;
      setInformation(response.data); // Lưu thông tin bài nhạc
      setTrack(newTrack);
      if (!listSong.includes(response.data.data.id)) {
        setListSong((prevList) => [...prevList, response.data.data.id]);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (track && audioRef.current) {
      audioRef.current.src = track; // Đảm bảo audio element nhận src mới
      audioRef.current.load();
      audioRef.current.play();
      setPlayStatus(true);
    }
  }, [track]);

  // Function cập nhật songId và gọi getSong
  const updateSong = (id) => {
    songId.current = id;
    getSong();
  };

  const play = () => {
    audioRef.current.play();
    setPlayStatus(true);
  };

  const pause = () => {
    audioRef.current.pause();
    setPlayStatus(false);
  };

  useEffect(() => {
    getSong();
    // Chờ audio metadata được load xong
    if (audioRef.current) {
      audioRef.current.onloadedmetadata = () => {
        audioRef.current.ontimeupdate = () => {
          if (audioRef.current.duration && !isNaN(audioRef.current.duration)) {
            const progress = Math.floor(
              (audioRef.current.currentTime / audioRef.current.duration) * 100
            );
            seekBar.current.style.width = progress + "%";
            setTime({
              currentTime: {
                seconds: Math.floor(audioRef.current.currentTime % 60),
                minute: Math.floor(audioRef.current.currentTime / 60),
              },
              totalTime: {
                seconds: Math.floor(audioRef.current.duration % 60),
                minute: Math.floor(audioRef.current.duration / 60),
              },
            });
          }
        };
      };
    }
  }, [audioRef, songId]);

  const contextValue = {
    audioRef,
    seekBg,
    seekBar,
    track,
    setTrack,
    playStatus,
    setPlayStatus,
    time,
    setTime,
    play,
    pause,
    updateSong,
    information,
    nextSong,
    prevSong, // Truyền function updateSong qua context
  };

  return (
    <PlayerContext.Provider value={contextValue}>
      {props.children}
    </PlayerContext.Provider>
  );
};

export default PlayerContextProvider;
