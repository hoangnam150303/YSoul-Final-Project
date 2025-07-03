import { axiosClient } from "../Config/api";

const FILM_API_ENDPOINT = "/api/v1/film";

const filmApi = {
  getAllFilm: async ({ typeFilm, category, sort, search, typeUser }:any) => {
    const queryParams = new URLSearchParams({
      typeFilm,
      category,
      sort,
      search,
      typeUser,
    }).toString();

    const url = `${FILM_API_ENDPOINT}/getAllFilm?${queryParams}`;
    const res = await axiosClient.get(url);
    return res.data;
  },

  getFilmById: async (id: string) => {
    const url = `${FILM_API_ENDPOINT}/getFilmById/${id}`;
    const res = await axiosClient.get(url);
    return res.data;
  },
};

export default filmApi;
