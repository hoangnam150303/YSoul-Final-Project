import { axiosClient } from "../ApiConfig/apiConfig";

const FILM_API_ENDPOINT = "/film";
const filmApi = {
  getAllFilm: ({ page, limit, typeFilm, category, sort, search }) => {
    const queryParams = new URLSearchParams({
      page,
      limit,
      typeFilm,
      category,
      sort,
      search,
    }).toString();
    const url = `${FILM_API_ENDPOINT}/getAllFilm?${queryParams}`;
    return axiosClient.get(url);
  },
  getFilmById: (id) => {
    const url = `${FILM_API_ENDPOINT}/getFilmById/${id}`;
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
  postDeleteFilm: (id) => {
    const url = `${FILM_API_ENDPOINT}/activeOrDeactiveFilmById/${id}`;
    return axiosClient.put(url);
  },

  postUpdateStatusFilm: (id, type, data) => {
    console.log(id, type, data);

    const url = `${FILM_API_ENDPOINT}/updateStatusFilmById/${id}/${type}`;
    return axiosClient.put(url, { data });
  },
};
export default filmApi;
