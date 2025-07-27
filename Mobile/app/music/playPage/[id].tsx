import { View, Text, TouchableOpacity, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Slider } from '@react-native-assets/slider';
import { Link, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import singleApi from '@/Hooks/single_api';
import { Audio, AVPlaybackStatus } from 'expo-av';

interface song {
    id: string;
    artistName: string;
    data: {
        title: string;
        artist: string;
        album: string;
        duration: number;
        image: string;
        mp3: string;
    };
}

const PlayPage = () => {
    const { id } = useLocalSearchParams();
    const [song, setSong] = useState<song>();
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [position, setPosition] = useState<number>(0); // ms
    const [duration, setDuration] = useState<number>(1); // ms
    const [isSeeking, setIsSeeking] = useState(false);

    const fetchSong = async (id: string) => {
        try {
            const response = await singleApi.getSingleById(id);
            setSong(response.data);
        } catch (error) {
            console.error("Fetch song error", error);
        }
    };

    const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
        if (!status.isLoaded) return;

        if (!isSeeking) {
            setPosition(status.positionMillis);
        }

        setDuration(status.durationMillis ?? 1);
        setIsPlaying(status.isPlaying);
    };


    const handlePlayPause = async () => {
        if (!song?.data.mp3) return;

        try {
            if (sound && isPlaying) {
                await sound.pauseAsync();
                setIsPlaying(false);
                return;
            }

            if (sound && !isPlaying) {
                await sound.playAsync();
                setIsPlaying(true);
                return;
            }

            // Nếu chưa có sound
            const { sound: newSound } = await Audio.Sound.createAsync(
                { uri: song.data.mp3 },
                { shouldPlay: true },
                onPlaybackStatusUpdate
            );
            setSound(newSound);
        } catch (err) {
            console.error("Playback error", err);
        }
    };

    useEffect(() => {
        if (id) fetchSong(id as string);
    }, [id]);

    useEffect(() => {
        return () => {
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, [sound]);

    const formatTime = (ms: number) => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <View className="flex-1 bg-[#1c2834] items-center justify-center px-6">
            {/* Album Art */}
            <View className="w-64 h-64 rounded-xl bg-white items-center justify-center">
                {song?.data.image && (
                    <Image
                        source={{ uri: song.data.image }}
                        style={{ width: 256, height: 256, borderRadius: 16 }}
                        resizeMode="cover"
                    />
                )}
            </View>

            {/* Song Info */}
            <View className="items-center mt-6">
                <Text className="text-white text-xl font-bold">{song?.data.title}</Text>
                <Text className="text-gray-300 text-sm mt-1">{song?.artistName}</Text>
            </View>

            {/* Slider */}
            <View className="w-full mt-6">
                <Slider
                    value={position}
                    minimumValue={0}
                    maximumValue={duration}
                    onSlidingStart={() => setIsSeeking(true)}
                    onSlidingComplete={async (value) => {
                        if (sound) {
                            await sound.setPositionAsync(value);
                            setIsSeeking(false);
                        }
                    }}
                    minimumTrackTintColor="#fff"
                    maximumTrackTintColor="#ccc"
                    thumbTintColor="#fff"
                />
                <View className="flex-row justify-between mt-2">
                    <Text className="text-white text-xs">{formatTime(position)}</Text>
                    <Text className="text-white text-xs">{formatTime(duration)}</Text>
                </View>
            </View>

            {/* Controls */}
            <View className="flex-row items-center justify-between w-full px-6 mt-8">
                <TouchableOpacity>
                    <Feather name="heart" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Feather name="skip-back" size={28} color="white" />
                </TouchableOpacity>
                <TouchableOpacity className="bg-white p-4 rounded-full" onPress={handlePlayPause}>
                    <Feather name={isPlaying ? "pause" : "play"} size={28} color="#1c2834" />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Feather name="skip-forward" size={28} color="white" />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Feather name="repeat" size={24} color="white" />
                </TouchableOpacity>
            </View>

            {/* Bottom nav */}
            <View className="flex-row justify-center mt-6 space-x-10">
                <TouchableOpacity>
                    <Link href={"/music"}>
                        <Feather name="home" size={24} color="white" />
                    </Link>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Feather name="menu" size={24} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default PlayPage;
