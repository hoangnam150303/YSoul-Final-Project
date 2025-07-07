import { Text, View, Image, ScrollView, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import wishListApi from '@/Hooks/wishList_api';
import { Link } from 'expo-router';
import { useRouter } from "expo-router";
const Section = ({ title, icon }: { title: string; icon: string }) => (
  <View className="mt-6 mb-3 flex-row items-center gap-2">
    <Text className="text-white text-lg font-bold">{icon} {title}</Text>
  </View>
);

const ItemCard = ({
  title,
  image,
  onPress,
}: {
  title: string;
  image: string;
  onPress?: () => void;
}) => (
  <Pressable onPress={onPress} className="w-[48%] bg-neutral-800 rounded-lg mb-4 overflow-hidden">
    <Image source={{ uri: image }} className="w-full h-28" resizeMode="cover" />
    <Text className="text-white text-sm px-2 py-1">{title}</Text>
  </Pressable>
);

const Favourite = () => {
  const router = useRouter();
  const [films, setFilms] = useState<any[]>([]);
  const [music, setMusic] = useState<any[]>([]);

  const fetchData = async () => {
    try {
      const response = await wishListApi.getWishList();
      const res = response.data;
     
      
      setFilms(res.film_id || []);
      setMusic(res.single || []);
    } catch (error) {
      console.log('Error fetching wishlist:', error);
    }
  };
  const handleSwitchFilm = (id: string) => {
    router.push(`/movies/${id}`);
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ScrollView className="flex-1 bg-black px-4 py-6">
      <Text className="text-white text-2xl font-bold mb-2">Your Favorites</Text>

      {films.length > 0 && (
        <>
          <Section title="Films" icon="🎬" />
          <View className="flex-row flex-wrap justify-between">
            {films.map((item) => (

              <ItemCard
                key={item._id}
                title={item.name}
                image={item.small_image}
                onPress={() => handleSwitchFilm(item._id)}
              />
            ))}
          </View>
        </>
      )}

      {music.length > 0 && (
        <>
          <Section title="Music" icon="🎵" />
          <View className="flex-row flex-wrap justify-between">
            {music.map((item) => (
              <ItemCard
                key={item._id}
                title={item.title}
                image={item.image}
              />
            ))}
          </View>
        </>
      )}
    </ScrollView>
  );
};

export default Favourite;
