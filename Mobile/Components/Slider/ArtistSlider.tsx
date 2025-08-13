import artistApi from '@/Hooks/artist_api';
import { Link } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    Image,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';

interface Props {
    category: string;
    search?: string;
}

interface Artist {
    id: string;
    name: string;
    avatar: string;
}

export const ArtistSlider = ({ category, search }: Props) => {
    const [data, setData] = useState<Artist[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchArtists = async () => {
        try {
            const response = await artistApi.getAllArtist(
                category,
                search || '',
                'user',
            );
            setData(response.data.artists);
        } catch (error) {
            console.log('Error fetching artists:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArtists();
    }, [category, search]);

    return (
        <View className="mt-2">
            <Text className="text-white text-lg px-4">{category}</Text>

            {loading ? (
                <View className="py-4 items-center">
                    <ActivityIndicator size="small" color="#ffffff" />
                </View>
            ) : (
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    className="px-2 mt-2"
                >
                    {data.map((artist, idx) => (
                        <View key={idx} className="mr-4 items-center">
                            <Link
                                key={artist.id}
                                href={{
                                    pathname: '/music/detailArtist/[id]',
                                    params: { id: artist.id },
                                }}
                                asChild
                            >
                                <TouchableOpacity className="mr-4 items-center">
                                    <Image
                                        source={{ uri: artist.avatar }}
                                        className="w-24 h-24 rounded-full"
                                        resizeMode="cover"
                                    />
                                    <Text
                                        className="text-white mt-1 text-xs text-center w-24"
                                        numberOfLines={1}
                                    >
                                        {artist.name}
                                    </Text>
                                </TouchableOpacity>
                            </Link>
                        </View>
                    ))}
                </ScrollView>
            )}
        </View>
    );
};
