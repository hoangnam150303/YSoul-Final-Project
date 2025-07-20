import { createContext, useEffect, useRef, useState } from 'react';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import singleApi from '../../Hooks/single_api';

interface TimeType {
    currentTime: number;
    totalTime: number;
}

interface PlayerContextType {
    track: string;
    information: any;
    playStatus: boolean;
    time: TimeType;
    play: () => void;
    pause: () => void;
    nextSong: () => void;
    prevSong: () => void;
    updateSong: (id: string) => void;
    setTrack: (src: string) => void;
    setInformation: (info: any) => void;
    handleSongLoop: () => void;
    isLoop: boolean;
    currentSong: string | null;
    listSong: string[];
}

export const PlayerContext = createContext<PlayerContextType>({} as PlayerContextType);

export const PlayerProvider = ({ children }: { children: React.ReactNode }) => {
    const soundRef = useRef<Audio.Sound | null>(null);
    const songId = useRef<string | null>(null);

    const [track, setTrack] = useState('');
    const [information, setInformation] = useState({});
    const [playStatus, setPlayStatus] = useState(false);
    const [isLoop, setIsLoop] = useState(false);
    const [time, setTime] = useState<TimeType>({ currentTime: 0, totalTime: 0 });

    const [listSong, setListSong] = useState<string[]>([]);
    const [currentSong, setCurrentSong] = useState<string | null>(null);

    // Load từ AsyncStorage
    useEffect(() => {
        (async () => {
            const savedList = await AsyncStorage.getItem('LIST_SONG');
            const savedCurrent = await AsyncStorage.getItem('CURRENT_SONG');
            const savedLoop = await AsyncStorage.getItem('IS_LOOP');

            if (savedList) setListSong(JSON.parse(savedList));
            if (savedCurrent) setCurrentSong(savedCurrent);
            if (savedLoop === 'true') setIsLoop(true);
        })();
    }, []);

    // Lấy dữ liệu bài hát mới khi currentSong thay đổi
    useEffect(() => {
        if (currentSong) getSong(currentSong);
    }, [currentSong]);

    // Lưu list + current vào AsyncStorage
    useEffect(() => {
        AsyncStorage.setItem('LIST_SONG', JSON.stringify(listSong));
    }, [listSong]);

    useEffect(() => {
        if (currentSong) AsyncStorage.setItem('CURRENT_SONG', currentSong);
    }, [currentSong]);

    const getSong = async (id: string) => {
        try {
            const res = await singleApi.getSingleById(id);
            const song = res.data?.data;
            if (!song) return;

            setInformation(res.data);
            setTrack(song.mp3);
            setPlayStatus(true);

            // update danh sách
            setListSong((prev) => (prev.includes(song.id) ? prev : [...prev, song.id]));

            await loadAudio(song.mp3);
            songId.current = song.id;
        } catch (err) {
            console.error('Error fetching song:', err);
        }
    };

    const loadAudio = async (uri: string) => {
        if (soundRef.current) await soundRef.current.unloadAsync();
        const { sound } = await Audio.Sound.createAsync(
            { uri },
            { shouldPlay: true, isLooping: isLoop },
            onPlaybackStatusUpdate
        );
        soundRef.current = sound;
    };

    const onPlaybackStatusUpdate = (status: any) => {
        if (!status.isLoaded) return;

        setTime({
            currentTime: status.positionMillis,
            totalTime: status.durationMillis || 0,
        });

        if (status.didJustFinish && !isLoop) {
            nextSong();
        }
    };

    const updateSong = (id: string) => {
        if (id === currentSong) return;
        songId.current = id;
        setCurrentSong(id);
    };

    const play = async () => {
        if (soundRef.current) {
            await soundRef.current.playAsync();
            setPlayStatus(true);
        }
    };

    const pause = async () => {
        if (soundRef.current) {
            await soundRef.current.pauseAsync();
            setPlayStatus(false);
        }
    };

    const handleSongLoop = () => {
        const newState = !isLoop;
        setIsLoop(newState);
        AsyncStorage.setItem('IS_LOOP', String(newState));
        if (soundRef.current) soundRef.current.setIsLoopingAsync(newState);
    };

    const nextSong = async () => {
        if (isLoop) {
            soundRef.current?.setPositionAsync(0);
            play();
        } else {
            try {
                if (!songId.current) return;
                const response = await singleApi.nextSingle(songId.current);
                const next = response.data?.data;
                if (!next) return;
                setInformation(response.data);
                setTrack(next.mp3);
                setPlayStatus(true);

                setListSong((prev) => (prev.includes(next.id) ? prev : [...prev, next.id]));

                setCurrentSong(next.id);
                songId.current = next.id;
                await loadAudio(next.mp3);
            } catch (err) {
                console.error('Error nextSong:', err);
            }
        }
    };

    const prevSong = () => {
        const list = [...listSong];
        const idx = list.indexOf(currentSong || '');
        if (idx > 0) {
            const prevId = list[idx - 1];
            updateSong(prevId);
        }
    };

    return (
        <PlayerContext.Provider
            value={{
                track,
                information,
                playStatus,
                time,
                play,
                pause,
                nextSong,
                prevSong,
                updateSong,
                setTrack,
                setInformation,
                handleSongLoop,
                isLoop,
                currentSong,
                listSong,
            }}
        >
            {children}
        </PlayerContext.Provider>
    );
};
