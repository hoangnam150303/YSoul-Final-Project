
import { axiosClient } from "../ApiConfig/apiConfig";

const SINGLE_API_ENDPOINT = "/api/v1/single";
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

  changeStatusSingle: (id) => {
    const url = `${SINGLE_API_ENDPOINT}/activeOrDeactive/${id}`;
    return axiosClient.put(url);
  },

  updateSingle: (id, value) => {
    const url = `${SINGLE_API_ENDPOINT}/updateSingle/${id}`; // update single by id
    return axiosClient.put(url, value, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  getSingleById: (id) => {
    const url = `${SINGLE_API_ENDPOINT}/getSingleById/${id}`;
    return axiosClient.get(url);
  },
  nextSingle: (id) => {
    const url = `${SINGLE_API_ENDPOINT}/nextSingle/${id}`;
    return axiosClient.get(url);
  }
};

export default singleApi;
