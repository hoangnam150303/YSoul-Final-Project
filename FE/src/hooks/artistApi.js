import { axiosClient } from "../ApiConfig/apiConfig";

const ARTIST_API_ENDPOINT = "/artist";
const artistApi = {
  getAllArtist: ({ filter, search, typeUser }) => {
    const url = `${ARTIST_API_ENDPOINT}/getAllArtist?filter=${filter}&search=${search}&typeUser=${typeUser}`;
    return axiosClient.get(url);
  },
  postCreateArtist: (value) => {
    const url = `${ARTIST_API_ENDPOINT}/createArtist`;
    return axiosClient.post(url, value, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

export default artistApi;
