import {axiosClient} from "../Config/api";

const AUTH_API_ENDPOINT = '/api/v1/auth';

const authApi = {
  postLoginWithGoogle: (accessToken: string) => {
    const url = `${AUTH_API_ENDPOINT}/loginGoogle`;
    return axiosClient.post(url, { accessToken }); // phải gửi { accessToken } nếu API yêu cầu JSON
  },

  postRegister: (data: {
    email: string;
    password: string;
    name: string;
    confirmPassword: string;
    otp: string;
    verifyToken: string | null;
  }) => {
    const url = `${AUTH_API_ENDPOINT}/register`;
    return axiosClient.post(url, data);
  },

  postSendCode: (data: { email: string }) => {
    const url = `${AUTH_API_ENDPOINT}/sendCode`;
    return axiosClient.post(url, data);
  },

  postLoginLocal: (data: { email: string; password: string }) => {
    const url = `${AUTH_API_ENDPOINT}/loginLocal`;
    return axiosClient.post(url, data);
  },
};

export default authApi;