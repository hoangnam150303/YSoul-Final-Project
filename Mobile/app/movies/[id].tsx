import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View, Image, FlatList, TouchableOpacity } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { useLocalSearchParams } from 'expo-router';
import filmApi from '@/Hooks/film_api';
import wishListApi from '@/Hooks/wishList_api';
import { Link } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
const MovieDetails = () => {
    const [movie, setMovie] = useState<any>(null);
    const [rating, setRating] = useState<number>(0);
    const [selectedEpIndex, setSelectedEpIndex] = useState(0);
    const { id } = useLocalSearchParams();
    const [similarFilms, setSimilarFilms] = useState<any[]>([]);
    const [isFavourite, setIsFavourite] = useState(false);
    const fetchMovieDetails = async (id: string) => {
        const response = await filmApi.getFilmById(id);
        console.log(response.data);

        setMovie(response.data);
    };
    const fetchFamiliarFilms = async () => {
        try {
            const response = await filmApi.getAllFilm({
                typeUser: "user",
                category: movie?.genre,
            })
            setSimilarFilms(response.data.data);
        } catch (error) {
            console.log(error);
        }
    };
    const addToWishList = async () => {
        try {
            const response = await wishListApi.addToWishList(
                "film", id as string
            )
            setIsFavourite(true);

        } catch (error) {
            console.log(error);

        }
    }

    const deleteFromWishList = async () => {
        try {
            const response = await wishListApi.deleteItemFromWishList(
                "film", id as string
            )
            setIsFavourite(false);
        } catch (error) {
            console.log(error);

        }
    }

    const postUpdateStatusFilm = async (id: string, ratingValue: number) => {
        try {
            const userId = await AsyncStorage.getItem('userId');
            if (userId !== null) {
                console.log(userId, id, ratingValue);

                const response = await filmApi.postUpdateStatusFilm(
                    id, "rating", ratingValue, userId
                );
                console.log("Rating success:", response.data);
            }
        } catch (error) {
            console.log("Rating error:", error);
        }
    };

    const checkIsFavorite = async (id: string) => {
        try {
            const response = await wishListApi.checkIsFavourite(
                "film", id
            )
            console.log(response.isFavorite);

            setIsFavourite(response.isFavorite);
        } catch (error) {

        }
    }
    useEffect(() => {
        fetchMovieDetails(id as string);
        fetchFamiliarFilms();
        checkIsFavorite(id as string);
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
            <View className="flex-row items-center justify-between px-6 mt-4">
                {/* Heart (Like) */}
                {
                    isFavourite ? (
                        <TouchableOpacity onPress={deleteFromWishList}>
                            <Image
                                source={{ uri: 'https://res.cloudinary.com/dnv7bjvth/image/upload/v1750571924/heart_iysae0.png' }} // Bạn cần icon này trong thư mục assets
                                style={{ width: 24, height: 24, tintColor: isFavourite ? 'red' : 'white' }}
                            />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity onPress={addToWishList}>
                            <Image
                                source={{ uri: 'https://res.cloudinary.com/dnv7bjvth/image/upload/v1750571924/heart_iysae0.png' }} // Bạn cần icon này trong thư mục assets
                                style={{ width: 24, height: 24, tintColor: isFavourite ? 'red' : 'white' }}
                            />
                        </TouchableOpacity>
                    )
                }

                {/* Share */}
                <TouchableOpacity>
                    <Image
                        source={{ uri: "https://res.cloudinary.com/dnv7bjvth/image/upload/v1751731795/share_w64fmh.png" }}
                        style={{ width: 24, height: 24, tintColor: "white" }}
                    />
                </TouchableOpacity>

                {/* Comment */}
                <TouchableOpacity>
                    <Image
                        source={{ uri: "https://res.cloudinary.com/dnv7bjvth/image/upload/v1751731794/comment_ynszoi.png" }}
                        style={{ width: 24, height: 24, tintColor: "white" }}
                    />
                </TouchableOpacity>

                {/* Rating Stars */}
                <View className="flex-row items-center gap-1 mt-4 px-6">
                    {[1, 2, 3, 4, 5].map((value) => (
                        <TouchableOpacity
                            key={value}
                            onPress={() => {
                                setRating(value);
                                postUpdateStatusFilm(movie?._id, value);
                            }}
                        >
                            <Image
                                source={{
                                    uri: "https://res.cloudinary.com/dnv7bjvth/image/upload/v1751731794/star_rbbefa.png",
                                }}
                                style={{
                                    width: 24,
                                    height: 24,
                                    tintColor:
                                        (rating > 0 ? rating : movie?.totalRating) >= value
                                            ? 'yellow'
                                            : 'gray',
                                }}
                            />
                        </TouchableOpacity>
                    ))}
                    <Text className="text-white ml-2">
                        {(rating > 0 ? rating : movie?.totalRating)}/5
                    </Text>
                </View>


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
                data={similarFilms}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
                keyExtractor={(item) => item._id.toString()}
                renderItem={({ item }) => (
                    <Link href={`/movies/${item._id}`} asChild>
                        <View className="mr-4 items-center">
                            <Image
                                source={{ uri: item.small_image }}
                                className="w-24 h-36 rounded-lg"
                                resizeMode="cover"
                            />
                            <Text className="text-white text-xs text-center mt-2" numberOfLines={2}>
                                {item.name}
                            </Text>
                        </View></Link>
                )}
            />
        </ScrollView>
    );
};

export default MovieDetails;
