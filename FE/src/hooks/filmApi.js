import { axiosClient } from "../ApiConfig/apiConfig";

const FILM_API_ENDPOINT = "/film";
const filmApi = {
  getAllFilm: ({ page, limit, typeFilm, category, sort }) => {
    const queryParams = new URLSearchParams({
      page,
      limit,
      typeFilm,
      category,
      sort,
    }).toString();
    const url = `${FILM_API_ENDPOINT}/getAllFilm?${queryParams}`;
    return axiosClient.get(url);
  },
  getFilmById: (id) => {
    const url = `${FILM_API_ENDPOINT}/getFilmById/${id}`;
    return axiosClient.get(url);
  },
};
export default filmApi;
