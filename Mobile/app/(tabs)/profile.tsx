// Profile.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UpdateProfileModal from '../../Components/UpdateProfileModal';
import { router } from 'expo-router';
import userApi from '@/Hooks/user_api';
const Profile = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<any>();

  const [nfts, setNfts] = useState<string[]>([
    'https://cdn-icons-png.flaticon.com/512/2922/2922510.png',
    'https://cdn-icons-png.flaticon.com/512/2922/2922656.png',
    'https://cdn-icons-png.flaticon.com/512/2922/2922688.png'
  ]);

  useEffect(() => {
    const getToken = async () => {
      const token = await AsyncStorage.getItem('access_token');
      setAccessToken(token);
    };
    getToken();
  }, []);
  const fetchUserProfile = async () => {
    try {
      const response = await userApi.getUserProfile();
      
      setUserInfo(response.data.user);
    } catch (error) {

    }
  }
  useEffect(() => {
    fetchUserProfile();
  }, [])
  // const handleSetAvatar = (uri: string) => {
  //   setUserInfo((prev) => ({ ...prev, avatar: uri }));
  // };

  if (!accessToken) {
    return (
      <View className="flex-1 bg-[#0f0d23] items-center justify-center px-5">
        <Text className="text-white text-lg mb-5">Bạn chưa đăng nhập</Text>
        <TouchableOpacity className="bg-red-500 py-3 px-8 rounded-lg">
          <Text className="text-white font-semibold text-base" onPress={() => router.push('/auth/LoginPage')}>Đăng nhập</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!accessToken) {
    return (
      <View className="flex-1 bg-[#0f0d23] items-center justify-center px-5">
        <Text className="text-white text-lg mb-5">Bạn chưa đăng nhập</Text>
        <TouchableOpacity
          className="bg-red-500 py-3 px-8 rounded-lg"
          onPress={() => router.push('/auth/LoginPage')}
        >
          <Text className="text-white font-semibold text-base">Đăng nhập</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!userInfo) {
    return null; // hoặc spinner
  }

  return (
    <View className="flex-1 bg-[#0f0d23] items-center justify-start pt-10 px-5">
      <View className="items-center mb-6">
        <Image source={{ uri: userInfo.avatar }} className="w-28 h-28 rounded-full" />
        {userInfo.vip && (
          <View className="bg-green-500 px-3 py-1 rounded-full mt-2">
            <Text className="text-white font-bold text-sm">✔ VIP USER</Text>
          </View>
        )}
        <Text className="text-white text-xl font-bold mt-4">{userInfo.name}</Text>
        <Text className="text-gray-300 text-sm mt-1">{userInfo.email}</Text>
      </View>

      <View className="flex-row space-x-4 mb-4">
        <UpdateProfileModal userId={userInfo.id} email={userInfo.email} name={userInfo.name} avatar={userInfo.avatar} vip={userInfo.vip}  onProfileUpdated={fetchUserProfile} />
        <TouchableOpacity
          className="bg-red-600 py-3 px-6 rounded-lg"
          onPress={async () => {
            await AsyncStorage.removeItem('access_token');
            setAccessToken(null);
          }}
        >
          <Text className="text-white font-bold text-base">Logout</Text>
        </TouchableOpacity>
      </View>

      {nfts.length > 0 && (
        <View className="w-full mt-6">
          <Text className="text-white text-base font-semibold mb-3">Your NFTs</Text>
          <FlatList
            horizontal
            data={nfts}
            keyExtractor={(item, index) => index.toString()}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity className="relative mr-3">
                <Image source={{ uri: item }} className="w-24 h-24 rounded-xl border border-gray-600" />
                <View className="absolute bottom-1 w-full px-1">
                  <Text className="bg-black/50 text-white text-center text-xs py-1 rounded-md">
                    Set Avatar
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );

};

export default Profile;
