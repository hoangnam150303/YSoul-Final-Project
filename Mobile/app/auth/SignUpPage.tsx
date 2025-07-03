import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground, Image, Alert } from 'react-native';
import { router } from 'expo-router';
import authApi from '../../Hooks/auth_api'
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignUpPage = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSendCode = async () => {
    if (!email || !username) {
      Alert.alert('Missing Fields', 'Please enter email and username.');
      return;
    }

    try {
      setIsSending(true);
      const response = await authApi.postSendCode({ email });
      const token = response.data.verifyToken;

      if (response.status === 200) {
        await AsyncStorage.setItem('verify_token', token);
        Alert.alert('Success', 'OTP sent to your email.');
      }
    } catch (error) {
      console.error('SendCode error:', error);
      Alert.alert('Error', 'Failed to send OTP.');
    } finally {
      setIsSending(false);
    }
  };

  const handleSignUp = async () => {
    if (!email || !username || !password || !confirmPassword || !otp) {
      Alert.alert('Missing Fields', 'Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Password Error', 'Passwords do not match.');
      return;
    }

    try {
      setIsRegistering(true);
      const verifyToken = await AsyncStorage.getItem('verify_token');

      const payload = {
        email,
        name: username,
        password,
        confirmPassword,
        otp,
        verifyToken,
      };

      const response = await authApi.postRegister(payload);
      if (response.data.success) {
        await AsyncStorage.removeItem('verify_token');
        Alert.alert('Success', 'Account registered successfully!', [
          { text: 'OK', onPress: () => router.replace('/auth/LoginPage') },
        ]);
      } else {
        Alert.alert('Error', response.data.message || 'Registration failed.');
      }
    } catch (error) {
      console.error('Register error:', error);
      Alert.alert('Error', 'Something went wrong.');
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <ImageBackground
      source={{ uri: 'https://res.cloudinary.com/dnv7bjvth/image/upload/v1736841888/892ddbe9-a03d-4ff9-9c2a-c2915a2851e6.png' }}
      className="flex-1 justify-center items-center px-5"
      resizeMode="cover"
    >
      <View className="absolute inset-0 bg-black/70" />

      <View className="w-full max-w-md z-10">
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
          <TouchableOpacity
            className="bg-blue-500 px-4 py-3 rounded-md"
            onPress={handleSendCode}
            disabled={isSending}
          >
            <Text className="text-white font-semibold">{isSending ? 'Sending...' : 'Send Code'}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          className="bg-red-600 py-3 rounded-md mb-4"
          onPress={handleSignUp}
          disabled={isRegistering}
        >
          <Text className="text-white text-center font-semibold">{isRegistering ? 'Signing Up...' : 'Sign Up'}</Text>
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

export default SignUpPage;
