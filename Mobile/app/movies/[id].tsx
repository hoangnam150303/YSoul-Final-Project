import React from 'react';
import { ScrollView, Text, View, Image, FlatList, TouchableOpacity } from 'react-native';
import { Video, ResizeMode } from 'expo-av';


import { useLocalSearchParams } from 'expo-router';

const episodes = Array.from({ length: 17 }, (_, i) => `EP ${i + 1}`);

const similarMovies = [
    {
        id: 1,
        title: 'Doraemon',
        image: 'https://upload.wikimedia.org/wikipedia/en/0/00/Doraemon_character.png',
    },
    {
        id: 2,
        title: 'Predator: Killer of Killers',
        image: 'https://upload.wikimedia.org/wikipedia/en/9/95/Predator_poster.jpg',
    },
    {
        id: 3,
        title: 'Kaiju No.8',
        image: 'https://upload.wikimedia.org/wikipedia/en/0/09/Kaiju_No._8_volume_1_cover.jpg',
    },
    {
        id: 4,
        title: 'Super Cube',
        image: 'https://upload.wikimedia.org/wikipedia/en/5/5f/Cube_movie_poster.jpg',
    },
];

const MovieDetails = () => {
    const { id } = useLocalSearchParams();

    return (
        <ScrollView className="flex-1 bg-black">
            {/* Video */}
            <View className="w-full h-[220px] bg-zinc-900">
                <Video
                    source={{ uri: 'https://res.cloudinary.com/dnv7bjvth/video/upload/v1750404168/YSoul/us8oofkw5xkkynncuhu3.mp4' }}
                    useNativeControls
                    resizeMode={ResizeMode.COVER}
                    shouldPlay
                    onError={(err) => {
                        console.log('Video error:', err);
                        // Có thể hiển thị fallback UI nếu muốn
                    }}
                    style={{ width: '100%', height: '100%' }}
                />


            </View>


            {/* Episode List */}
            <FlatList
                data={episodes}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 10 }}
                keyExtractor={(item) => item}
                renderItem={({ item, index }) => (
                    <TouchableOpacity
                        className={`px-4 py-2 rounded-md mr-2 ${index === 0 ? 'bg-red-600' : 'bg-zinc-800'
                            }`}
                    >
                        <Text className={`font-bold ${index === 0 ? 'text-white' : 'text-zinc-300'}`}>{item}</Text>
                    </TouchableOpacity>
                )}
            />

            {/* Detail Section */}
            <View className="flex-row px-4 gap-4 mt-2">
                <Image
                    source={{
                        uri: 'https://upload.wikimedia.org/wikipedia/en/0/00/Doraemon_character.png',
                    }}
                    className="w-28 h-44 rounded-xl"
                    resizeMode="cover"
                />
                <View className="flex-1">
                    <Text className="text-white text-xl font-bold">Doraemon episode 1</Text>
                    <Text className="text-zinc-400 mt-1 mb-2">2015 | <Text className="text-green-400">5+</Text></Text>
                    <Text className="text-zinc-300 text-sm">
                        Doraemon is a popular Japanese manga and anime series that follows the adventures of a robotic cat named Doraemon,
                        who travels back in time from the 22nd century to help a young boy named Nobita Nobi...
                    </Text>
                </View>
            </View>

            {/* Similar Section */}
            <Text className="text-white font-bold text-lg px-4 mt-8 mb-3">Similar Movies/Tv Show</Text>

            <FlatList
                data={similarMovies}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View className="mr-4 items-center">
                        <Image
                            source={{ uri: item.image }}
                            className="w-24 h-36 rounded-lg"
                            resizeMode="cover"
                        />
                        <Text className="text-white text-xs text-center mt-2" numberOfLines={2}>
                            {item.title}
                        </Text>
                    </View>
                )}
            />
        </ScrollView>
    );
};

export default MovieDetails;
