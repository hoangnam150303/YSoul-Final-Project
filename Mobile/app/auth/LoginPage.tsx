import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground, Image } from 'react-native';
import { router } from 'expo-router';
import authApi from '@/Hooks/auth_api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import userApi from '@/Hooks/user_api';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const handleLogin = async () => {
        try {
            console.log(1111);
            
            const response = await authApi.postLoginLocal({ email, password });
            if (response.data.success === true) {
                const accessToken = response.data.access_token;
                await AsyncStorage.setItem('access_token', accessToken);
                const user = await userApi.getUser();
                console.log(user);
                
                await AsyncStorage.setItem('userId', user.data.id);
                await AsyncStorage.setItem('vip', user.data.vip.toString());
                router.replace('/(tabs)');
            }
        } catch (error: any) {
            console.error('Login failed:',error);
            alert('Login failed: ' + (error.response?.data?.message || 'Unknown error'));
        }
    };



    return (
        <ImageBackground
            source={{
                uri: 'https://res.cloudinary.com/dnv7bjvth/image/upload/v1736841888/892ddbe9-a03d-4ff9-9c2a-c2915a2851e6.png', // ảnh nền bạn up
            }}
            className="flex-1 justify-center items-center px-5"
            resizeMode="cover"
        >
            {/* Lớp phủ mờ để làm tối nền */}
            <View className="absolute inset-0 bg-black/70" />

            <View className="w-full max-w-md z-10">
                {/* Logo */}
                <Image
                    source={{
                        uri: 'https://res.cloudinary.com/dnv7bjvth/image/upload/v1750588965/logo_ysoul_dark_lnbm7k.png',
                    }}
                    className="w-16 h-16 mb-8 self-center"
                    resizeMode="contain"
                />

                {/* Tiêu đề */}
                <Text className="text-white text-2xl font-bold text-center mb-6">Login</Text>

                {/* Email */}
                <TextInput
                    placeholder="you@example.com"
                    placeholderTextColor="#ccc"
                    className="bg-white/10 text-white px-4 py-3 rounded-md mb-4 border border-white/20"
                    value={email}
                    onChangeText={setEmail}
                />

                {/* Password */}
                <TextInput
                    placeholder="Password"
                    placeholderTextColor="#ccc"
                    secureTextEntry
                    className="bg-white/10 text-white px-4 py-3 rounded-md mb-6 border border-white/20"
                    value={password}
                    onChangeText={setPassword}
                />

                {/* Login button */}
                <TouchableOpacity className="bg-red-600 py-3 rounded-md mb-4" onPress={handleLogin}>
                    <Text className="text-white text-center font-semibold">Login</Text>
                </TouchableOpacity>


                {/* Google login */}
                <TouchableOpacity className="flex-row items-center justify-center bg-red-500 py-3 rounded-md">
                    <Text className="text-white font-semibold">G Login With Google</Text>
                </TouchableOpacity>

                {/* Đăng ký */}
                <Text className="text-white text-center mt-6">
                    Don’t have any account?
                    <Text className="text-red-400 font-semibold" onPress={() => router.push('/auth/SignUpPage')}> Sign Up</Text>
                </Text>
            </View>
        </ImageBackground>
    );
};
export const options = {
    headerShown: false,
};
export default LoginPage;
