import { axiosClient } from "../ApiConfig/apiConfig";

const DASHBOARDS_API_ENDPOINT = "/api/v1/dashboards";
const dashBoardsApi = {
  getNumberOfTypeUser: () => {
    const url = `${DASHBOARDS_API_ENDPOINT}/getNumberOfTypeUser`;
    return axiosClient.get(url);
  },
  increaseFavouriteCount: (type) => {
    const url = `${DASHBOARDS_API_ENDPOINT}/increaseFavouriteCount?type=${type}`;
    return axiosClient.put(url);
  },
  getFavouriteCount: () => {
    const url = `${DASHBOARDS_API_ENDPOINT}/getFavouriteCount`;
    return axiosClient.get(url);
  },
};
export default dashBoardsApi;
