import { axiosClient } from "../ApiConfig/apiConfig";

const FILM_API_ENDPOINT = "/api/v1/film";
const filmApi = {
  getAllFilm: ({ typeFilm, category, sort, search, typeUser }) => {
    const queryParams = new URLSearchParams({
      typeFilm,
      category,
      sort,
      search,
      typeUser,
    }).toString();
    const url = `${FILM_API_ENDPOINT}/getAllFilm?${queryParams}`;
    return axiosClient.get(url);
  },
  getFilmById: (id) => {
    const url = `${FILM_API_ENDPOINT}/getFilmById/${id}`;
    return axiosClient.get(url);
  },
  getHistoryFilm: () => {
    const url = `${FILM_API_ENDPOINT}/getHistoryFilm`;
    return axiosClient.get(url);
  },
  postCreateFilm: (formData) => {
    const url = `${FILM_API_ENDPOINT}/createFilm`;
    return axiosClient.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  postAddFilmToHistory: (id) => {
    const url = `${FILM_API_ENDPOINT}/addFilmToHistory/${id}`;
    return axiosClient.post(url);
  },
  postDeleteFilm: (id) => {
    const url = `${FILM_API_ENDPOINT}/activeOrDeactiveFilmById/${id}`;
    return axiosClient.put(url);
  },

  postUpdateStatusFilm: (id, type, data, userId) => {
    const url = `${FILM_API_ENDPOINT}/updateStatusFilmById/${id}/${type}/${userId}`;
    return axiosClient.put(url, { data });
  },

  postUpdateFilm: (id, formData) => {
    const url = `${FILM_API_ENDPOINT}/updateFilmById/${id}`; // update album by id
    return axiosClient.put(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  postActiveOrDeactive: (id) => {
    const url = `${FILM_API_ENDPOINT}/activeOrDeactiveFilmById/${id}`; // update album by id
    return axiosClient.put(url);
  },
};
export default filmApi;
