import { View, Text, TouchableOpacity } from 'react-native'
import React, { useContext, useEffect } from 'react'
import { Slider } from '@react-native-assets/slider'
import { useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons'; // Expo style
import { PlayerContext } from '@/app/Context/PlayerContext';
const PlayPage = () => {
    const { id } = useLocalSearchParams();
    const {
        play,
        pause,
        playStatus,
        nextSong,
        prevSong,
        handleSongLoop,
        information,
        updateSong,
        time,
        isLoop,
    } = useContext(PlayerContext);
    useEffect(() => {
        if (typeof id === 'string') {
            updateSong(id); // Gọi để load bài hát khi mở trang
        }
    }, [id]);

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
                <Feather name="music" size={64} color="#1c2834" />
            </View>

            {/* Song Info */}
            <View className="items-center mt-6">
                <Text className="text-white text-xl font-bold">Ban Mai Remix</Text>
                <Text className="text-gray-300 text-sm mt-1">Kirimi Prod</Text>
            </View>

            {/* Slider */}
            <View className="w-full mt-6">
                <Slider
                    value={0}
                    minimumValue={0}
                    maximumValue={4.6}
                    minimumTrackTintColor="#fff"
                    maximumTrackTintColor="#ccc"
                    thumbTintColor="#fff"
                />
                <View className="flex-row justify-between mt-2">
                    <Text className="text-white text-xs">0:00</Text>
                    <Text className="text-white text-xs">4:06</Text>
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
                <TouchableOpacity className="bg-white p-4 rounded-full">
                    <Feather name="play" size={28} color="#1c2834" />
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
                    <Feather name="home" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Feather name="menu" size={24} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default PlayPage
