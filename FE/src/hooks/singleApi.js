import { axiosClient } from "../ApiConfig/apiConfig";

const SINGLE_API_ENDPOINT = "/single";
const singleApi = {
  getAllSingle: ({ filter, search, typeUser }) => {
    const url = `${SINGLE_API_ENDPOINT}/getAllSingle?filter=${filter}&search=${search}&typeUser=${typeUser}`;
    return axiosClient.get(url);
  },
  postCreateSingle: (value) => {
    const url = `${SINGLE_API_ENDPOINT}/createSingle`;
    return axiosClient.post(url, value, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

export default singleApi;
