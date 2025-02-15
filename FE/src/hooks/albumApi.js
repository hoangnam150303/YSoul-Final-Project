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
};

export default albumApi;
