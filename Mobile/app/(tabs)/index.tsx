import { ActivityIndicator, FlatList, Image, ScrollView, Text, View } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import MovieCard from "@/Components/MovieCard";
import filmApi from "@/Hooks/film_api";

export default function index() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const [newest, setNewest] = useState<any[]>([]);
  const [topRated, setTopRated] = useState<any[]>([]);
  const [popular, setPopular] = useState<any[]>([]);
  const [trending, setTrending] = useState<any[]>([]);

  const fetchFilms = async (category: string, setData: React.Dispatch<React.SetStateAction<any[]>>) => {
    try {
      const response = await filmApi.getAllFilm({
        typeUser: "user",
        category: "",
        sort: category,
      });
      setData(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        fetchFilms("Popular", setNewest),
        fetchFilms("Newest", setTopRated),
        fetchFilms("Top Rated", setPopular),
        fetchFilms("Trending", setTrending),
      ]);
      setIsLoading(false);
    };

    loadData();
  }, []);

  const renderCategory = (title: string, data: any[], showIndex: boolean = false) => (
    <View>
      <Text className="text-white text-lg font-bold mt-8 mb-3">{title}</Text>
      <FlatList
        data={data}
        renderItem={({ item, index }) => (
          <MovieCard
            id={item._id}
            name={item.name}
            small_image={item.small_image}
            {...(showIndex ? { index } : {})} // chỉ truyền index nếu showIndex = true
          />
        )}
        keyExtractor={(item) => item._id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
        contentContainerStyle={{ paddingRight: 16 }}
      />
    </View>
  );


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

      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: 100, paddingTop: 80 }}
        showsVerticalScrollIndicator={false}
      >
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
            {renderCategory("Newest", newest, true)}
            {renderCategory("Top Rated", topRated)}
            {renderCategory("Popular", popular)}
            {renderCategory("Trending", trending)}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
