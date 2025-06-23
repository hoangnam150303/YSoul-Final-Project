import { Image, ScrollView, View } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import SearchBar from "@/Components/SearchBar";
import { useRouter } from "expo-router";
export default function Index() {
  const router = useRouter();
  return (
    <View className="flex-1 bg-primary relative">
      {/* Ảnh nền */}
      <Image
        style={{
          position: "absolute",
          top: 0,
          width: "100%",
          height: 200, // Độ cao đến icon
          zIndex: 0,
        }}
        source={{
          uri: "https://res.cloudinary.com/dnv7bjvth/image/upload/v1736841888/892ddbe9-a03d-4ff9-9c2a-c2915a2851e6.png",
        }}
        resizeMode="cover"
      />

      {/* Gradient để mờ dần ảnh */}
      <LinearGradient
        colors={['rgba(0,0,0,0)', '#120c26']} // màu cuối khớp bg-primary
        style={{
          position: "absolute",
          top: 0,
          height: 200,
          width: "100%",
          zIndex: 1,
        }}
      />

      {/* Nội dung */}
      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: 100, paddingTop: 80 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ICON nằm đúng chỗ */}
        <Image
          className="w-12 h-10 mb-5 mx-auto z-10"
          source={{
            uri: "https://res.cloudinary.com/dnv7bjvth/image/upload/v1736842897/fancyai_1736839648739_gfhqk9.png",
          }}
        />
        <View className="flex-1 mt-20">
          <SearchBar
            onPress={() => router.push('/search')}
            placeholder="Search for a movie"
          />
        </View>
      </ScrollView>
    </View>
  );
}
