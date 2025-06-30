import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { API_URL } from '@env'; // lấy biến môi trường từ .env
// console.log(API_URL);
const axiosClient = axios.create({
  baseURL: process.env.API_URL,
  headers: {
    'Content-Type': 'application/json',
    accept: 'application/json',
  },
});

axiosClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export { axiosClient };