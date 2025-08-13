import React from "react";
import {
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

const DetailArtist = () => {
    const artist = {
        name: "Billie Eilish",
        image: "https://i.imgur.com/w1w1Vqs.png", // ảnh artist
        likes: 0,
        followers: 0,
        songs: 0,
        albums: [
            {
                title: "Happier Than Ever",
                image: "https://i.imgur.com/2nCt3Sbl.jpg", // ảnh album
            },
        ],
    };

    return (
        <SafeAreaView className="flex-1 bg-black">
            <ScrollView className="flex-1">
                {/* Back button */}
                <TouchableOpacity className="absolute top-4 left-4 z-10">
                    <Feather name="arrow-left" size={24} color="white" />
                </TouchableOpacity>

                {/* Header */}
                <View className="p-4 bg-gradient-to-b from-purple-800 to-black">
                    <View className="flex-row items-center space-x-4 mt-8">
                        <Image
                            source={{ uri: artist.image }}
                            className="w-20 h-20 rounded-lg"
                            resizeMode="cover"
                        />
                        <View className="flex-1">
                            <Text className="text-white text-sm">Artist</Text>
                            <Text className="text-white text-2xl font-bold">
                                {artist.name}
                            </Text>
                            <View className="flex-row items-center flex-wrap gap-1 mt-1">
                                <Feather name="headphones" size={14} color="#9CA3AF" />
                                <Text className="text-gray-300 text-sm ml-1">
                                    YSoul • {artist.likes} likes • {artist.followers} followers • {artist.songs} songs
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Song List Section */}
                <View className="p-4 bg-white rounded-t-2xl">
                    <View className="flex items-center justify-center py-10">
                        <Feather name="clock" size={32} color="#9CA3AF" />
                        <Text className="text-gray-400 mt-2">No data</Text>
                    </View>
                </View>

                {/* Albums */}
                <View className="p-4 bg-black">
                    <Text className="text-white text-xl font-bold mb-3">Albums</Text>
                    <View className="flex-row flex-wrap gap-4">
                        {artist.albums.map((album, index) => (
                            <TouchableOpacity key={index} className="w-40">
                                <Image
                                    source={{ uri: album.image }}
                                    className="w-full h-40 rounded-md"
                                    resizeMode="cover"
                                />
                                <Text className="text-white mt-2">{album.title}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default DetailArtist;
