import { ActivityIndicator, FlatList, Image, ScrollView, Text, View } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import SearchBar from "@/Components/SearchBar";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import MovieCard from "@/Components/MovieCard";
import filmApi from "@/Hooks/film_api";

export default function Index() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const fetchFilms = async (category: string) => {
    try {
      const response = await filmApi.getAllFilm({
        typeUser: "user",
        category: category
      })
      console.log(response.data.data.data);

    } catch (error) {
      console.log(error);

    }
  }
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

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View className="flex-1 bg-primary relative">
      {/* Background image */}
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

      {/* Gradient overlay */}
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

      {/* Content */}
      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: 100, paddingTop: 80 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <Image
          className="w-12 h-10 mb-5 mx-auto z-10"
          source={{
            uri: "https://res.cloudinary.com/dnv7bjvth/image/upload/v1736842897/fancyai_1736839648739_gfhqk9.png",
          }}
        />

        {isLoading ? (
          <ActivityIndicator size="large" color="#0000ff" className="mt-20 self-center" />
        ) : (
          <View className="flex-1 mt-20">

            <View>
              <Text className="text-white text-lg font-bold mt-8 mb-3">
                Newest
              </Text>

              <FlatList
                data={newestMovies.slice(0, 10)} // lấy tối đa 10
                renderItem={({ item, index }) => (
                  <MovieCard {...item} index={index} />
                )}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
                contentContainerStyle={{ paddingRight: 16 }}
              />
            </View>
            <View>
              <Text className="text-white text-lg font-bold mt-8 mb-3">
                Top Rated
              </Text>

              <FlatList
                data={newestMovies.slice(0, 10)} // lấy tối đa 10
                renderItem={({ item, index }) => (
                  <MovieCard {...item} index={index} />
                )}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
                contentContainerStyle={{ paddingRight: 16 }}
              />
            </View>
            <View>
              <Text className="text-white text-lg font-bold mt-8 mb-3">
                Popular
              </Text>

              <FlatList
                data={newestMovies.slice(0, 10)} // lấy tối đa 10
                renderItem={({ item, index }) => (
                  <MovieCard {...item} index={index} />
                )}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
                contentContainerStyle={{ paddingRight: 16 }}
              />
            </View>
            <View>
              <Text className="text-white text-lg font-bold mt-8 mb-3">
                Trending
              </Text>

              <FlatList
                data={newestMovies.slice(0, 10)} // lấy tối đa 10
                renderItem={({ item, index }) => (
                  <MovieCard {...item} index={index} />
                )}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
                contentContainerStyle={{ paddingRight: 16 }}
              />
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
