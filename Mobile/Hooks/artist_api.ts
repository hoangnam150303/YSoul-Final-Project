import { axiosClient } from "../Config/api";

const ARTIST_API_ENDPOINT = "/artist";

const artistApi = {
  getAllArtist: (filter: string, search: string, typeUser: string) => {
    return axiosClient.get(
      `${ARTIST_API_ENDPOINT}/getAllArtist?filter=${filter}&search=${search}&typeUser=${typeUser}`
    );
  },

  postCreateArtist: (data: FormData) => {
    return axiosClient.post(`${ARTIST_API_ENDPOINT}/createArtist`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  changeStatusArtist: (id: string) => {
    return axiosClient.put(`${ARTIST_API_ENDPOINT}/activeOrDeactiveArtist/${id}`);
  },

  updateArtist: (id: string, data: FormData) => {
    return axiosClient.put(`${ARTIST_API_ENDPOINT}/updateArtist/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  getArtistById: (id: string) => {
    return axiosClient.get(`${ARTIST_API_ENDPOINT}/getArtistById/${id}`);
  },
};

export default artistApi;
