import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { Image } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import MovieCard from '@/Components/MovieCard'
import SearchBar from '@/Components/SearchBar'

const search = () => {
    const newestMovies = [
        {
            id: 1,
            title: "Dune: Part Two",
            image: "https://upload.wikimedia.org/wikipedia/en/5/52/Dune_Part_Two_poster.jpeg",
        },
        {
            id: 2,
            title: "Godzilla x Kong: The New Empire",
            image: "https://m.media-amazon.com/images/M/MV5BMDVhMjk2OGUtYzYxNS00NzBjLTk5YTItYzI0ZjgzNjY1NmI0XkEyXkFqcGc@._V1_.jpg",
        },
        {
            id: 3,
            title: "The Fall Guy",
            image: "https://upload.wikimedia.org/wikipedia/en/thumb/1/1f/The_Fall_Guy_%282024%29_poster.jpg/250px-The_Fall_Guy_%282024%29_poster.jpg",
        },
        {
            id: 4,
            title: "Kung Fu Panda 4",
            image: "https://upload.wikimedia.org/wikipedia/vi/7/7f/Kung_Fu_Panda_4_poster.jpg",
        },
        {
            id: 5,
            title: "Inside Out 2",
            image: "https://upload.wikimedia.org/wikipedia/vi/a/a3/Inside_Out_2_VN_poster.jpg",
        },
        {
            id: 6,
            title: "Fast X",
            image: "https://khenphim.com/wp-content/uploads/2023/05/FastX-1-poster_KP.webp",
        },
        {
            id: 7,
            title: "Kung Fu Panda 4",
            image: "https://upload.wikimedia.org/wikipedia/vi/7/7f/Kung_Fu_Panda_4_poster.jpg",
        },
        {
            id: 8,
            title: "Inside Out 2",
            image: "https://upload.wikimedia.org/wikipedia/vi/a/a3/Inside_Out_2_VN_poster.jpg",
        },
        {
            id: 9,
            title: "Fast X",
            image: "https://khenphim.com/wp-content/uploads/2023/05/FastX-1-poster_KP.webp",
        },
    ];
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
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

            <FlatList
                data={newestMovies}
                renderItem={({ item }) => <MovieCard {...item} />}
                keyExtractor={(item) => item.id.toString()}
                className='px-5'
                numColumns={3}
                columnWrapperStyle={{
                    justifyContent: 'space-between',
                    gap: 16,
                    marginVertical: 16,
                }}
                contentContainerStyle={{
                    paddingBottom: 100,
                    paddingTop: 80, // giống với ScrollView trong Index
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
                        {
                            isLoading ? (
                                <ActivityIndicator size="large" color="#0000ff" className="my-3" />
                            ) : (
                                <Text className='text-xl text-white font-bold'>
                                    Search results for{' '}
                                    <Text className='color-purple-500'>{searchTerm}</Text>
                                </Text>
                            )
                        }
                    </>
                }
            />
        </View>

    )
}

export default search
