// src/api/wishListApi.ts
import { axiosClient } from "../Config/api";

const WISHLIST_API_ENDPOINT = "/wishList";

const wishListApi = {
  addToWishList: async (type: string, id: string) => {
    const url = `${WISHLIST_API_ENDPOINT}/addWishList/${type}/${id}`;
    const res = await axiosClient.post(url);
    return res.data;
  },

  checkIsFavourite: async (type: string, id: string) => {
    const url = `${WISHLIST_API_ENDPOINT}/checkIsFavorite/${type}/${id}`;   
    const res = await axiosClient.get(url);    
    return res.data;
  },

  getWishList: async () => {
    const url = `${WISHLIST_API_ENDPOINT}/getWishList`;
    const res = await axiosClient.get(url);
    return res.data;
  },

  deleteItemFromWishList: async (type: string, id: string) => {
    const url = `${WISHLIST_API_ENDPOINT}/deleteWishList/${type}/${id}`;
    const res = await axiosClient.put(url);
    return res.data;
  },
};

export default wishListApi;
