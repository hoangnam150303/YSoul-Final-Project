import { axiosClient } from "../ApiConfig/apiConfig";

const userApi = {
  getUser: () => {
    const url = "/getUser";
    return axiosClient.get(url);
  },
};
export default userApi;
