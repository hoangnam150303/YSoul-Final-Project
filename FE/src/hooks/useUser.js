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
  postVerify: (value) => {
    const url = "/verify";
    return axiosClient.post(url, value);
  },
  postLoginLocal: (value) => {
    const url = "/loginLocal";
    return axiosClient.post(url, value);
  },
};

export default userApi;
