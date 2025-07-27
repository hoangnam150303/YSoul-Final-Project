import { axiosClient } from "../Config/api";

const ALBUM_API_ENDPOINT = "/album";

const albumApi = {
  getAllAlbum: (filter: string, search: string, typeUser: string) => {
    return axiosClient.get(
      `${ALBUM_API_ENDPOINT}/getAllAlbums?filter=${filter}&search=${search}&typeUser=${typeUser}`
    );
  },

  postCreateAlbum: (data: FormData) => {
    return axiosClient.post(`${ALBUM_API_ENDPOINT}/createAlbum`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  changeStatusAlbum: (id: string) => {
    return axiosClient.put(`${ALBUM_API_ENDPOINT}/activeOrDeactive/${id}`);
  },

  updateAlbum: (id: string, data: FormData) => {
    return axiosClient.put(`${ALBUM_API_ENDPOINT}/updateAlbum/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  getAlbumById: (id: string) => {
    return axiosClient.get(`${ALBUM_API_ENDPOINT}/getAlbumById/${id}`);
  },
};

export default albumApi;
