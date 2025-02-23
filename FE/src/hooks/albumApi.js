import { axiosClient } from "../ApiConfig/apiConfig";

const ALBUM_API_ENDPOINT = "/album";
const albumApi = {
  getAllAlbum: ({ filter, search, typeUser }) => {
    const url = `${ALBUM_API_ENDPOINT}/getAllAlbums?filter=${filter}&search=${search}&typeUser=${typeUser}`;
    return axiosClient.get(url);
  },
  postCreateAlbum: (value) => {
    const url = `${ALBUM_API_ENDPOINT}/createAlbum`;
    return axiosClient.post(url, value, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  changeStatusAlbum: (id) => {
    const url = `${ALBUM_API_ENDPOINT}/activeOrDeactive/${id}`;
    return axiosClient.put(url);
  },
  updateAlbum: (id, value) => {
    const url = `${ALBUM_API_ENDPOINT}/updateAlbum/${id}`; // update album by id
    return axiosClient.put(url, value, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  getAlbumById: (id) => {
    const url = `${ALBUM_API_ENDPOINT}/getAlbumById/${id}`; // get album by id
    return axiosClient.get(url);
  }
};

export default albumApi;
