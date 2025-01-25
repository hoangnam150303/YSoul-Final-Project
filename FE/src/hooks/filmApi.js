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
};
export default filmApi;
