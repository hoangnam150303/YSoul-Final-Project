import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View, Image, FlatList, TouchableOpacity } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { useLocalSearchParams } from 'expo-router';
import filmApi from '@/Hooks/film_api';

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
    const [movie, setMovie] = useState<any>(null);
    const [selectedEpIndex, setSelectedEpIndex] = useState(0);
    const { id } = useLocalSearchParams();

    const fetchMovieDetails = async (id: string) => {
        const response = await filmApi.getFilmById(id);
        setMovie(response.data);
    };

    useEffect(() => {
        fetchMovieDetails(id as string);
    }, [id]);

    return (
        <ScrollView className="flex-1 bg-black">
            {/* Video */}
            <View className="w-full h-[220px] bg-zinc-900">
                <Video
                    source={{ uri: movie?.video?.[selectedEpIndex]?.urlVideo }}
                    useNativeControls
                    resizeMode={ResizeMode.COVER}
                    shouldPlay
                    onError={(err) => {
                        console.log('Video error:', err);
                    }}
                    style={{ width: '100%', height: '100%' }}
                />
            </View>

            {/* Episode List */}
            {movie?.video?.length > 1 && (
                <FlatList
                    data={movie.video}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 10 }}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity
                            onPress={() => setSelectedEpIndex(index)}
                            className={`px-4 py-2 rounded-md mr-2 ${selectedEpIndex === index ? 'bg-red-600' : 'bg-zinc-800'
                                }`}
                        >
                            <Text
                                className={`font-bold ${selectedEpIndex === index ? 'text-white' : 'text-zinc-300'
                                    }`}
                            >
                                EP {index + 1}
                            </Text>
                        </TouchableOpacity>
                    )}
                />
            )}

            {/* Detail Section */}
            <View className="flex-row px-4 gap-4 mt-2">
                <Image
                    source={{ uri: movie?.small_image }}
                    className="w-28 h-44 rounded-xl"
                    resizeMode="cover"
                />
                <View className="flex-1">
                    <Text className="text-white text-xl font-bold">
                        {movie?.name} episode {selectedEpIndex + 1}
                    </Text>
                    <Text className="text-zinc-400 mt-1 mb-2">
                        {movie?.releaseYear} | <Text className="text-green-400">{movie?.age}+</Text>
                    </Text>
                    <Text className="text-zinc-300 text-sm" numberOfLines={5}>
                        {movie?.description}
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
