import { createContext, useEffect, useRef, useState } from "react";
import singleApi from "../hooks/singleApi";
import contants from "../constants/contants";

export const PlayerContext = createContext();

const PlayerContextProvider = ({ children }) => {
  const audioRef = useRef();
  const seekBg = useRef();
  const seekBar = useRef();
  const songId = useRef();
  const loopedSongId = useRef(null);

  const [track, setTrack] = useState("");
  const [information, setInformation] = useState({});
  const [playStatus, setPlayStatus] = useState(false);

  const [listSong, setListSong] = useState(() => {
    const saved = localStorage.getItem(contants.LIST_SONG);
    return saved ? JSON.parse(saved) : [];
  });

  const [currentSong, setCurrentSong] = useState(() => {
    return localStorage.getItem(contants.CURRENT_SONG) || null;
  });

  const [songLoop, setSongLoop] = useState(() => {
    return localStorage.getItem(contants.IS_LOOP) === "true";
  });

  const [time, setTime] = useState({
    currentTime: { seconds: 0, minute: 0 },
    totalTime: { seconds: 0, minute: 0 },
  });

  // Lấy bài hát theo ID
  const getSong = async () => {
    if (!currentSong) return;
    try {
      console.log("🔁 Fetching song:", currentSong);
      const response = await singleApi.getSingleById(currentSong);
      const song = response.data?.data;
      if (!song) return;

      setInformation(response.data);
      setTrack(song.mp3);

      setListSong((prevList) => {
        if (prevList.includes(song.id)) return prevList;
        return [...prevList, song.id];
      });
    } catch (err) {
      console.error("❌ Error fetching song:", err);
    }
  };

  const updateSong = (id) => {
    if (id === currentSong) return; // ✅ Tránh lặp nếu ID giống
    songId.current = id;
    setCurrentSong(id);
    localStorage.setItem(contants.CURRENT_SONG, id);
  };

  const prevSong = () => {
    const list = [...listSong];
    const idx = list.indexOf(currentSong);
    if (idx > 0) {
      const prevId = list[idx - 1];
      updateSong(prevId);
    }
  };

  const nextSong = async () => {
    if (songLoop) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } else {
      try {
        const response = await singleApi.nextSingle(songId.current);
        const next = response.data?.data;
        if (!next) return;
        setInformation(response.data);
        setTrack(next.mp3);

        setListSong((prevList) => {
          if (prevList.includes(next.id)) return prevList;
          return [...prevList, next.id];
        });

        songId.current = next.id;
        setCurrentSong(next.id);
        localStorage.setItem(contants.CURRENT_SONG, next.id);
      } catch (err) {
        console.error("❌ Error nextSong:", err);
      }
    }
  };

  const handleSongLoop = () => {
    setSongLoop((prev) => {
      const state = !prev;
      localStorage.setItem(contants.IS_LOOP, state);
      loopedSongId.current = state ? songId.current : null;
      return state;
    });
  };

  const play = () => {
    audioRef.current?.play();
    setPlayStatus(true);
  };

  const pause = () => {
    audioRef.current?.pause();
    setPlayStatus(false);
  };

  // Gán track vào audio
  useEffect(() => {
    if (track && audioRef.current) {
      audioRef.current.src = track;
      audioRef.current.load();
      audioRef.current.play();
      setPlayStatus(true);
    }
  }, [track]);

  // Lấy dữ liệu bài hát mỗi khi currentSong đổi
  useEffect(() => {
    getSong();
  }, [currentSong]);

  // Lưu danh sách vào localStorage
  useEffect(() => {
    localStorage.setItem(contants.LIST_SONG, JSON.stringify(listSong));
  }, [listSong]);

  // Cập nhật thời gian, kết thúc bài
  useEffect(() => {
    if (!audioRef.current) return;

    audioRef.current.onloadedmetadata = () => {
      audioRef.current.ontimeupdate = () => {
        const audio = audioRef.current;
        if (!audio.duration || isNaN(audio.duration)) return;

        const progress = Math.floor((audio.currentTime / audio.duration) * 100);
        if (seekBar.current) seekBar.current.style.width = `${progress}%`;

        setTime({
          currentTime: {
            seconds: Math.floor(audio.currentTime % 60),
            minute: Math.floor(audio.currentTime / 60),
          },
          totalTime: {
            seconds: Math.floor(audio.duration % 60),
            minute: Math.floor(audio.duration / 60),
          },
        });
      };

      audioRef.current.onended = () => {
        songLoop ? play() : nextSong();
      };
    };
  }, [songLoop,currentSong]);

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
    isLoop: songLoop,
  };

  return (
    <PlayerContext.Provider value={contextValue}>
      {children}
    </PlayerContext.Provider>
  );
};

export default PlayerContextProvider;
