import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Image } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import MovieCard from '@/Components/MovieCard'
import SearchBar from '@/Components/SearchBar'
import filmApi from "@/Hooks/film_api";
const search = () => {
    type Movie = {
        _id: string;
        name: string;
        small_image: string;
    };
    const [movies, setMovies] = useState<Movie[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchAllFilms = async () => {
        try {
            setIsLoading(true); // Bắt đầu loading
            const response = await filmApi.getAllFilm({ typeUser: "user", search: searchTerm, sort: "newest" });
            setMovies(response.data.data);
        } catch (error) {
            console.error("Fetch films failed:", error);
        } finally {
            setIsLoading(false); // Dừng loading
        }
    };

    useEffect(() => {
        fetchAllFilms()
    }, [searchTerm])

    return (
        <View className='flex-1 bg-primary relative'>
            {/* Background Image */}
            <Image
                style={{
                    position: "absolute",
                    top: 0,
                    width: "100%",
                    height: 200,
                    zIndex: 0,
                }}
                source={{
                    uri: "https://res.cloudinary.com/dnv7bjvth/image/upload/v1736841888/892ddbe9-a03d-4ff9-9c2a-c2915a2851e6.png",
                }}
                resizeMode="cover"
            />

            {/* Gradient */}
            <LinearGradient
                colors={['rgba(0,0,0,0)', '#120c26']}
                style={{
                    position: "absolute",
                    top: 0,
                    height: 200,
                    width: "100%",
                    zIndex: 1,
                }}
            />

            {isLoading ? (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#ffffff" />
                    <Text className="text-white mt-4">Loading...</Text>
                </View>
            ) : (
                <FlatList
                    data={movies}
                    renderItem={({ item, index }) =>
                        <MovieCard
                            id={item._id}
                            name={item.name}
                            small_image={item.small_image}
                            index={index}
                        />}
                    keyExtractor={(item) => item._id.toString()}
                    className='px-5'
                    numColumns={3}
                    columnWrapperStyle={{
                        justifyContent: 'space-between',
                        gap: 16,
                        marginVertical: 16,
                    }}
                    contentContainerStyle={{
                        paddingBottom: 100,
                        paddingTop: 80,
                    }}
                    ListHeaderComponent={
                        <>
                            <Image
                                className="w-12 h-10 mb-5 mx-auto z-10"
                                source={{
                                    uri: "https://res.cloudinary.com/dnv7bjvth/image/upload/v1736842897/fancyai_1736839648739_gfhqk9.png",
                                }}
                            />
                            <View className="z-10 mt-20">
                                <SearchBar placeholder="Search movie..." value={searchTerm} onChangeText={(text: string) => setSearchTerm(text)} />
                            </View>
                            <Text className='text-xl text-white font-bold'>
                                Search results for{' '}
                                <Text className='color-purple-500'>{searchTerm}</Text>
                            </Text>
                        </>
                    }
                />
            )}
        </View>
    );

}

export default search
