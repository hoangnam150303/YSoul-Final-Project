import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Modal, Image
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const UpdateProfileModal = () => {
  const [showModal, setShowModal] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  const [name, setName] = useState('hoang nam');
  const [email, setEmail] = useState('hoangnam150303@gmail.com');
  const [avatar, setAvatar] = useState<string | null>(null);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1
    });
    if (!result.canceled && result.assets.length > 0) {
      setAvatar(result.assets[0].uri);
    }
  };

  const handleUpdate = () => {
    console.log({
      name, email, avatar,
      ...(showPasswordFields ? { oldPassword, newPassword, confirmPassword } : {})
    });
    setShowModal(false);
  };

  return (
    <>
      <TouchableOpacity onPress={() => setShowModal(true)} className="bg-blue-600 py-3 px-6 rounded-lg">
        <Text className="text-white font-bold text-base">Update Profile</Text>
      </TouchableOpacity>

      <Modal visible={showModal} animationType="slide" transparent>
        <View className="flex-1 bg-black/60 justify-center items-center px-4">
          <View className="bg-white w-full rounded-lg p-6 space-y-4">
            <Text className="text-lg font-bold text-center">Update Profile</Text>

            <TextInput value={name} onChangeText={setName} placeholder="Name" className="border px-4 py-2 rounded-md" />
            <TextInput value={email} onChangeText={setEmail} placeholder="Email" className="border px-4 py-2 rounded-md" />

            <TouchableOpacity onPress={pickImage} className="border px-4 py-2 rounded-md bg-gray-100">
              <Text>Choose Avatar</Text>
            </TouchableOpacity>
            {avatar && <Image source={{ uri: avatar }} className="w-16 h-16 rounded-full mt-2" />}

            <TouchableOpacity onPress={() => setShowPasswordFields(!showPasswordFields)} className="border px-4 py-2 rounded-md mt-2">
              <Text>{showPasswordFields ? 'Hide Password Update' : 'Update Password'}</Text>
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
              <TouchableOpacity onPress={() => setShowModal(false)} className="border px-5 py-2 rounded-md">
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleUpdate} className="bg-blue-600 px-5 py-2 rounded-md">
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
