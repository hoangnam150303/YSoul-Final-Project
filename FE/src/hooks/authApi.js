import { axiosClient } from "../ApiConfig/apiConfig";

const AUTH_API_ENDPOINT = "/api/v1/auth";
const authApi = {
  postLoginWithGoogle: (accessToken) => {
    const url = `${AUTH_API_ENDPOINT}/loginGoogle`;
    return axiosClient.post(url, accessToken);
  },

  postRegister: (value) => {
    console.log(value);
    const url = `${AUTH_API_ENDPOINT}/register`;
    return axiosClient.post(url, value);
  },
  postSendCode: (value) => {
    const url = `${AUTH_API_ENDPOINT}/sendCode`;
    return axiosClient.post(url, value);
  },
  postLoginLocal: (value) => {
    const url = `${AUTH_API_ENDPOINT}/loginLocal`;
    return axiosClient.post(url, value);
  },
  postForgotPassword: (email) => {
    const url = `${AUTH_API_ENDPOINT}/forgotPassword`;
    return axiosClient.post(url, { email });
  },
  resetPassword: (value) => {
    const url = `${AUTH_API_ENDPOINT}/resetPassword`;
    return axiosClient.put(url, value);
  },
};
export default authApi;
