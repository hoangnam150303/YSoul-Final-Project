import singleApi from '@/Hooks/single_api';
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
interface Props {
    category: string;
}
interface Single {
    id: string;
    title: string;
    image: string;
}
export const SingleSlider = ({ category }: Props) => {
    const [data, setData] = useState<Single[]>([]);
    const fetchSingle = async () => {
        try {
            const response = await singleApi.getAllSingle({
                filter: category,
                search: "",
                typeUser: "user",
            })

            setData(response.data.singles);
        } catch (error) {
            console.log(error);

        }
    }
    useEffect(() => {
        fetchSingle();
    }, [category]);
    return (
        <View className="mt-2">
            <Text className="text-white text-lg px-4">{category}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-2 mt-2">
                {data.map((single, idx) => (
                    <View key={idx} className="mr-4 items-center">
                        <Link
                            href={{ pathname: "/music/playPage/[id]", params: { id: single.id } }}
                            asChild
                        >
                            <TouchableOpacity>
                                <Image
                                    source={{ uri: single.image }}
                                    className="w-24 h-24 rounded-full"
                                    resizeMode="cover"
                                />
                                <Text className="text-white mt-1 text-xs text-center w-24" numberOfLines={1}>
                                    {single.title}
                                </Text>
                            </TouchableOpacity>
                        </Link>
                    </View>
                ))}
            </ScrollView >
        </View >
    );
};
