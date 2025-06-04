import { axiosClient } from "../ApiConfig/apiConfig";
const USER_API_ENDPOINT = "/api/v1/user";
const userApi = {
  getUser: () => {
    const url = `${USER_API_ENDPOINT}/getUser`;
    return axiosClient.get(url);
  },
  getAllUsers: (filter, search, typeUser) => {
    const url = `${USER_API_ENDPOINT}/getAllUser?filter=${filter}&search=${search}&typeUser=${typeUser}`; // get all users
    return axiosClient.get(url);
  },
  updateStatusUser: (id) => {
    const url = `${USER_API_ENDPOINT}/activeOrDeactive/${id}`; // update album by id
    return axiosClient.put(url);
  },
  updateUserProfile: (id, data) => {
    const url = `${USER_API_ENDPOINT}/updateProfile/${id}`; // update album by id
    return axiosClient.put(url, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  getUserProfile: () => {
    const url = `${USER_API_ENDPOINT}/getUserProfile`; // update album by id
    return axiosClient.get(url);
  },
  getDetailUser: (id) => {
    const url = `${USER_API_ENDPOINT}/getDetailUser/${id}`; // update album by id
    return axiosClient.get(url);
  },
  getUserStore: () => {
    const url = `${USER_API_ENDPOINT}/getUserStore`; // update album by id
    return axiosClient.get(url);
  },
  updateAvatarNFT: (data) => {
    const url = `${USER_API_ENDPOINT}/updateUserAvatarNFT`; // update album by id
    return axiosClient.put(url, data);
  },
};
export default userApi;
