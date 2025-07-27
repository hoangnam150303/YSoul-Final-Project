import { axiosClient } from '../Config/api';

const SINGLE_API_ENDPOINT = '/single';

const singleApi = {
  getAllSingle: (params: { filter: string; search: string; typeUser: string }) => {
    const { filter, search, typeUser } = params;
    const url = `${SINGLE_API_ENDPOINT}/getAllSingle`;
    return axiosClient.get(url, {
      params: { filter, search, typeUser },
    });
  },
  changeStatusSingle: (id: string) => {
    const url = `${SINGLE_API_ENDPOINT}/activeOrDeactive/${id}`;
    return axiosClient.put(url);
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
