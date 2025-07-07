import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import userApi from '@/Hooks/user_api';

interface UpdateProfileProps {
  userId: string;
  email: string;
  name: string;
  avatar: string;
  vip: any;
  onProfileUpdated: () => void;
}

const UpdateProfileModal = ({
  userId,
  email,
  name,
  avatar,
  vip,
  onProfileUpdated
}: UpdateProfileProps) => {
  const [showModal, setShowModal] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [updateName, setUpdateName] = useState<string>(name);
  const [updateEmail, setUpdateEmail] = useState<string>(email);

  const [updateAvatar, setAvatar] = useState<string | null>(avatar);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!result.canceled && result.assets.length > 0) {
      setAvatar(result.assets[0].uri);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const formData = new FormData();

      formData.append('name', updateName);
      formData.append('email', updateEmail);
      formData.append('vip', vip);
      if (showPasswordFields) {
        formData.append('oldPassword', oldPassword);
        formData.append('password', newPassword);
        formData.append('confirmPassword', confirmPassword);
      } else {
        formData.append('oldPassword', '');
        formData.append('password', '');
        formData.append('confirmPassword', '');
      }

      if (updateAvatar) {
        const fileName = updateAvatar.split('/').pop() || 'avatar.jpg';
        const fileType = fileName.split('.').pop();

        formData.append('avatar', {
          uri: updateAvatar,
          name: fileName,
          type: `image/${fileType}`,
        } as any);
      }

      const response = await userApi.updateUserProfile(userId, formData);

      if (response.status === 200) {
        alert('Profile updated successfully!');
        setShowModal(false);
        onProfileUpdated();
      }
    } catch (error) {
      console.log('❌ Update failed:', error);
    }
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => setShowModal(true)}
        className="bg-blue-600 py-3 px-6 rounded-lg"
      >
        <Text className="text-white font-bold text-base">Update Profile</Text>
      </TouchableOpacity>

      <Modal visible={showModal} animationType="slide" transparent>
        <View className="flex-1 bg-black/60 justify-center items-center px-4">
          <View className="bg-white w-full rounded-lg p-6 space-y-4">
            <Text className="text-lg font-bold text-center">Update Profile</Text>
            <TextInput
              value={updateName}
              onChangeText={setUpdateName}
              placeholder="Name"
              className="border px-4 py-2 rounded-md"
            />
            <TextInput
              value={updateEmail}
              onChangeText={setUpdateEmail}
              placeholder="Email"
              className="border px-4 py-2 rounded-md"
            />

            <TouchableOpacity
              onPress={pickImage}
              className="border px-4 py-2 rounded-md bg-gray-100"
            >
              <Text>Choose Avatar</Text>
            </TouchableOpacity>
            {updateAvatar && (
              <Image
                source={{ uri: updateAvatar }}
                className="w-16 h-16 rounded-full mt-2"
              />
            )}

            <TouchableOpacity
              onPress={() => setShowPasswordFields(!showPasswordFields)}
              className="border px-4 py-2 rounded-md mt-2"
            >
              <Text>
                {showPasswordFields ? 'Hide Password Update' : 'Update Password'}
              </Text>
            </TouchableOpacity>

            {showPasswordFields && (
              <>
                <TextInput
                  value={oldPassword}
                  onChangeText={setOldPassword}
                  placeholder="Old Password"
                  secureTextEntry
                  className="border px-4 py-2 rounded-md"
                />
                <TextInput
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="New Password"
                  secureTextEntry
                  className="border px-4 py-2 rounded-md"
                />
                <TextInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm Password"
                  secureTextEntry
                  className="border px-4 py-2 rounded-md"
                />
              </>
            )}

            <View className="flex-row justify-between mt-4">
              <TouchableOpacity
                onPress={() => setShowModal(false)}
                className="border px-5 py-2 rounded-md"
              >
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleUpdateProfile}
                className="bg-blue-600 px-5 py-2 rounded-md"
              >
                <Text className="text-white font-bold">Update</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default UpdateProfileModal;
