import { createContext, useEffect, useRef, useState } from "react";
import singleApi from "../hooks/singleApi";
import contants from "../constants/contants";

export const PlayerContext = createContext();

const PlayerContextProvider = (props) => {
  const audioRef = useRef();
  const seekBg = useRef();
  const seekBar = useRef();
  const songId = useRef();

  const [track, setTrack] = useState("");
  const [information, setInformation] = useState({});
  const [playStatus, setPlayStatus] = useState(false);
  const [listSong, setListSong] = useState(() => {
    const savedList = localStorage.getItem(contants.LIST_SONG);
    return savedList ? JSON.parse(savedList) : [];
  });
  const [currentSong, setCurrentSong] = useState(() => {
    const savedCurrentSong = localStorage.getItem(contants.CURRENT_SONG);
    return savedCurrentSong ? savedCurrentSong : null;
  });
  // Đồng nhất key với contants.IS_LOOP
  const [songLoop, setSongLoop] = useState(() => {
    const savedSongLoop = localStorage.getItem(contants.IS_LOOP);
    return savedSongLoop === "true";
  });
  const [time, setTime] = useState({
    currentTime: { seconds: 0, minute: 0 },
    totalTime: { seconds: 0, minute: 0 },
  });

  // Function lấy thông tin bài hát dựa trên songId hiện tại
  const getSong = async () => {
    if (!currentSong) return;
    try {
      const response = await singleApi.getSingleById(currentSong);
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
    try {
      const storedList = JSON.parse(localStorage.getItem(contants.LIST_SONG));
      const newList = [...storedList];
      newList.pop(); // Loại bỏ bài hiện tại
      let prevSongId = newList[newList.length - 1];
      if (prevSongId === songId.current) {
        prevSongId = newList[newList.length - 1];
      }
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

  // Hàm chuyển đổi chế độ loop
  const handleSongLoop = () => {
    setSongLoop((prev) => {
      const newLoopState = !prev;
      // Sử dụng key đồng nhất với useState: contants.IS_LOOP
      localStorage.setItem(contants.IS_LOOP, newLoopState);
      return newLoopState;
    });
    // Lưu ý: songLoop ở đây chưa được cập nhật ngay do setState bất đồng bộ
    console.log("Loop state (old):", songLoop);
  };

  // Dùng useEffect để log giá trị mới khi songLoop thay đổi
  useEffect(() => {
    console.log("Loop state (new):", songLoop);
  }, [songLoop]);

  useEffect(() => {
    localStorage.setItem(contants.LIST_SONG, JSON.stringify(listSong));
  }, [listSong]);

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
    setCurrentSong(id);
    localStorage.setItem(contants.CURRENT_SONG, id);
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
        // Khi bài nhạc kết thúc
        audioRef.current.onended = () => {

            nextSong();
        };
      };
    }
  }, [audioRef, currentSong, songLoop]);

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
    prevSong,
    handleSongLoop,
    isLoop: songLoop, // Đặt tên thống nhất cho context
  };

  return (
    <PlayerContext.Provider value={contextValue}>
      {props.children}
    </PlayerContext.Provider>
  );
};

export default PlayerContextProvider;
