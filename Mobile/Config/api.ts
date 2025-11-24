import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const axiosClient = axios.create({
 baseURL: "http://192.168.1.104:8080/api/v1",
  headers: {
    "Content-Type": "application/json",
    accept: "application/json",
  },
});
axiosClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.log(error);

    return Promise.reject(error);
  }
);

export { axiosClient };
