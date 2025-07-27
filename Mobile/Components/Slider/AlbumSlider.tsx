import albumApi from '@/Hooks/album_api';
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image } from 'react-native';

interface Props {
    category: string;
    search?: string
}
interface Album {
    id: string;
    name: string;
    image: string;
}
export const AlbumSlider = ({ category,search }: Props) => {
    const [data, setData] = useState<Album[]>([]);
    const fetchAlbums = async () => {
        try {
            const response = await albumApi.getAllAlbum(
                category,
                search || "",
                "user",
            )

            setData(response.data.albums);
        } catch (error) {
            console.log(error);

        }
    }
    useEffect(() => {
        fetchAlbums();
    }, [category,search]);
    return (
        <View className="mt-2">
            <Text className="text-white text-lg px-4">{category}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-2 mt-2">
                {data.map((album, idx) => (
                    <View key={idx} className="mr-4 items-center">
                        <Image
                            source={{ uri: album.image }}
                            className="w-24 h-24 rounded-full"
                            resizeMode="cover"
                        />
                        <Text className="text-white mt-1 text-xs text-center w-24" numberOfLines={1}>
                            {album.name}
                        </Text>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};
