import { axiosClient } from '../Config/api';

const SINGLE_API_ENDPOINT = '/api/v1/single';

const singleApi = {
  getAllSingle: (params: { filter: string; search: string; typeUser: string }) => {
    const { filter, search, typeUser } = params;
    const url = `${SINGLE_API_ENDPOINT}/getAllSingle`;
    return axiosClient.get(url, {
      params: { filter, search, typeUser },
    });
  },

  postCreateSingle: (formData: FormData) => {
    const url = `${SINGLE_API_ENDPOINT}/createSingle`;
    return axiosClient.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  changeStatusSingle: (id: string) => {
    const url = `${SINGLE_API_ENDPOINT}/activeOrDeactive/${id}`;
    return axiosClient.put(url);
  },

  updateSingle: (id: string, formData: FormData) => {
    const url = `${SINGLE_API_ENDPOINT}/updateSingle/${id}`;
    return axiosClient.put(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  getSingleById: (id: string) => {
    const url = `${SINGLE_API_ENDPOINT}/getSngleById/${id}`;
    return axiosClient.get(url);
  },

  nextSingle: (id: string) => {
    const url = `${SINGLE_API_ENDPOINT}/nextSingle/${id}`;
    return axiosClient.get(url);
  },
};

export default singleApi;
