import { Image, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Link } from 'expo-router';

interface Movie {
    id: number;
    title: string;
    image: string;
    index?: number;
}

const MovieCard = ({ id, title, image, index }: Movie) => {
    return (
        <Link href={`/movies/${id}`} asChild>
            <TouchableOpacity
                style={{
                    width: 130,
                    marginBottom: 12,
                    alignItems: 'center',
                }}
            >
                <View style={{ position: 'relative', width: '100%', height: 190, borderRadius: 10, overflow: 'hidden' }}>
                    <Image
                        source={{ uri: image || 'https://placehold.com/600x400/1a1a1a/fffff.png' }}
                        style={{
                            width: '100%',
                            height: '100%',
                        }}
                        resizeMode='cover'
                    />

                    {/* Số thứ tự to góc trái dưới */}
                    <Text
                        style={{
                            position: 'absolute',
                            bottom: 6,
                            left: 6,
                            color: 'white',
                            fontSize: 48,
                            fontWeight: 'bold',
                            textShadowColor: 'rgba(0, 0, 0, 0.9)',
                            textShadowOffset: { width: 2, height: 2 },
                            textShadowRadius: 4,
                        }}
                    >
                        {index !== undefined ? index + 1 : ''}
                    </Text>
                </View>

                {/* Tên phim dưới ảnh */}
                <Text
                    style={{
                        color: 'white',
                        fontWeight: '500',
                        fontSize: 14,
                        marginTop: 8,
                        textAlign: 'center',
                    }}
                    numberOfLines={2}
                >
                    {title}
                </Text>
            </TouchableOpacity>
        </Link>
    )
}

export default MovieCard;
