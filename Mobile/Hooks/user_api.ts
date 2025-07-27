
import { axiosClient } from "../Config/api";

const USER_API_ENDPOINT = "/user";

const userApi = {
  getUser: () => {
    return axiosClient.get(`${USER_API_ENDPOINT}/getUser`);
  },
  updateUserProfile: (id: string, data: FormData) => {
    return axiosClient.put(`${USER_API_ENDPOINT}/updateProfile/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getUserProfile: () => {
    return axiosClient.get(`${USER_API_ENDPOINT}/getUserProfile`);
  },
  getDetailUser: (id: string) => {
    return axiosClient.get(`${USER_API_ENDPOINT}/getDetailUser/${id}`);
  },
  getUserStore: () => {
    return axiosClient.get(`${USER_API_ENDPOINT}/getUserStore`);
  },
  updateAvatarNFT: (data: any) => {
    return axiosClient.put(`${USER_API_ENDPOINT}/updateUserAvatarNFT`, data);
  },
};

export default userApi;
