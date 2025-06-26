import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground, Image } from 'react-native';
import { router } from 'expo-router';

const SignUpPage = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');

  return (
    <ImageBackground
      source={{ uri: 'https://res.cloudinary.com/dnv7bjvth/image/upload/v1736841888/892ddbe9-a03d-4ff9-9c2a-c2915a2851e6.png' }}
      className="flex-1 justify-center items-center px-5"
      resizeMode="cover"
    >
      <View className="absolute inset-0 bg-black/70" />

      <View className="w-full max-w-md z-10">
        {/* Logo */}
        <Image
          source={{ uri: 'https://res.cloudinary.com/dnv7bjvth/image/upload/v1750588965/logo_ysoul_dark_lnbm7k.png' }}
          className="w-16 h-16 mb-8 self-center"
          resizeMode="contain"
        />

        <Text className="text-white text-2xl font-bold text-center mb-6">Sign Up</Text>

        <TextInput
          placeholder="you@example.com"
          placeholderTextColor="#ccc"
          value={email}
          onChangeText={setEmail}
          className="bg-white/10 text-white px-4 py-3 rounded-md mb-3 border border-white/20"
        />

        <TextInput
          placeholder="User Name"
          placeholderTextColor="#ccc"
          value={username}
          onChangeText={setUsername}
          className="bg-white/10 text-white px-4 py-3 rounded-md mb-3 border border-white/20"
        />

        <TextInput
          placeholder="Password"
          placeholderTextColor="#ccc"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          className="bg-white/10 text-white px-4 py-3 rounded-md mb-3 border border-white/20"
        />

        <TextInput
          placeholder="Confirm Password"
          placeholderTextColor="#ccc"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          className="bg-white/10 text-white px-4 py-3 rounded-md mb-3 border border-white/20"
        />

        <View className="flex-row items-center gap-2 mb-3">
          <TextInput
            placeholder="Enter OTP"
            placeholderTextColor="#ccc"
            value={otp}
            onChangeText={setOtp}
            className="flex-1 bg-white/10 text-white px-4 py-3 rounded-md border border-white/20"
          />
          <TouchableOpacity className="bg-blue-500 px-4 py-3 rounded-md">
            <Text className="text-white font-semibold">Send Code</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity className="bg-red-600 py-3 rounded-md mb-4">
          <Text className="text-white text-center font-semibold">Sign Up</Text>
        </TouchableOpacity>

        <Text className="text-white text-center">
          Already a member?{' '}
          <Text className="text-red-400 font-semibold" onPress={() => router.push('/auth/LoginPage')}>
            Login
          </Text>
        </Text>
      </View>
    </ImageBackground>
  );
};

export const options = {
  headerShown: false,
};

export default SignUpPage;
