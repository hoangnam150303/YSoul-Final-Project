import artistApi from '@/Hooks/artist_api';
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image } from 'react-native';

interface Props {
    category: string;
    search?: string
}
interface Artist {
    id: string;
    name: string;
    avatar: string;
}
export const ArtistSlider = ({ category, search }: Props) => {
    const [data, setData] = useState<Artist[]>([]);
    const fetchArtists = async () => {
        
        
        try {
            const response = await artistApi.getAllArtist(
                category,
                search || "",
                "user",
            )
            setData(response.data.artists);
        } catch (error) {
            console.log(error);

        }
    }
    useEffect(() => {
        fetchArtists();
    }, [category, search]);
    return (
        <View className="mt-2">
            <Text className="text-white text-lg px-4">{category}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-2 mt-2">
                {data.map((artist, idx) => (
                    <View key={idx} className="mr-4 items-center">
                        <Image
                            source={{ uri: artist.avatar }}
                            className="w-24 h-24 rounded-full"
                            resizeMode="cover"
                        />
                        <Text className="text-white mt-1 text-xs text-center w-24" numberOfLines={1}>
                            {artist.name}
                        </Text>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};
