import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { router } from 'expo-router';

const Profile = () => {
  const handleLoginPress = () => {
    router.push('/auth/LoginPage');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Bạn chưa đăng nhập</Text>

      <TouchableOpacity style={styles.button} onPress={handleLoginPress}>
        <Text style={styles.buttonText}>Đăng nhập</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0d23',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  text: {
    color: 'white',
    fontSize: 18,
    marginBottom: 20
  },
  button: {
    backgroundColor: '#ef4444', // đỏ
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16
  }
});
