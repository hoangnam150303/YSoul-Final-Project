import { Image, TextInput, View } from 'react-native';
import React from 'react';
interface Props {
    placeholder?: string;
    onPress?: () => void;
    value?: string;
    onChangeText?: (text: string) => void;
}
const SearchBar = ({ placeholder, onPress, value, onChangeText }: Props) => {

    return (
        <View className='flex-row items-center bg-dark-200 rounded-full px-5 py-4 z-0'>
            <Image
                source={{ uri: "https://res.cloudinary.com/dnv7bjvth/image/upload/v1750571925/search_i8qaaa.png" }}
                className='size-5'
                style={{ tintColor: '#ab8bff' }}
                resizeMode="contain"
            />
            <TextInput onPress={onPress}
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
                placeholderTextColor="#a8b5db"
                className='flex-1 ml-2 text-white' />
        </View>
    );
};

export default SearchBar;

