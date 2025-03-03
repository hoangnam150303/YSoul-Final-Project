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
  getAllUsers:() =>{
    const url = "/getAllUser";
    return axiosClient.get(url);
  }
};

export default userApi;
