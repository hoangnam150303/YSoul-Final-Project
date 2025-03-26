import { axiosClient } from "../ApiConfig/apiConfig";

const userApi = {
  postLoginWithGoogle: (accessToken) => {
    const url = "/loginGoogle";
    return axiosClient.post(url, accessToken);
  },

  postRegister: (value) => {
    console.log(value);
    const url = "/register";
    return axiosClient.post(url, value);
  },
  postSendCode: (value) => {
    const url = "/sendCode";
    return axiosClient.post(url, value);
  },
  postLoginLocal: (value) => {
    const url = "/loginLocal";
    return axiosClient.post(url, value);
  },
  getAllUsers:(filter,search) =>{
    const url = `/getAllUser?filter=${filter}&search=${search}`;
    return axiosClient.get(url);
  },
  updateStatusUser: (id) => {
    const url = `/activeOrDeactive/${id}`; // update album by id
    return axiosClient.put(url);
  },
  updateUserProfile:(id,data) =>{
    const url = `/updateProfile/${id}`; // update album by id
    return axiosClient.put(url,data,{
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  getUserProfile:() =>{
    const url = `/getUserProfile`; // update album by id
    return axiosClient.get(url);
  },

  getAllReviewer:(filter,search)=>{
    const url = `/getAllReviewer?filter=${filter}&search=${search}`;
    return axiosClient.get(url);
  },
  followUser:(id)=>{
    const url = `/followUser/${id}`;
    return axiosClient.put(url)
  }
};

export default userApi;
