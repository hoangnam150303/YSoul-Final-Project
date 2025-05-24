import { axiosClient } from "../ApiConfig/apiConfig";

const WISHLIST_API_ENDPOINT = "/api/v1/wishList";
const wishListApi = {
  addToWishList: (type, id) => {
    const url = `${WISHLIST_API_ENDPOINT}/addWishList/${type}/${id}`;
    return axiosClient.post(url);
  },
  checkIsFavourite: (type, id) => {
    const url = `${WISHLIST_API_ENDPOINT}/checkIsFavorite/${type}/${id}`;
    return axiosClient.get(url);
  },
  getWishList: () => {
    const url = `${WISHLIST_API_ENDPOINT}/getWishList`;
    return axiosClient.get(url);
  },
  deleteItemFromWishList: (type, id) => {
    const url = `${WISHLIST_API_ENDPOINT}/deleteWishList/${type}/${id}`;
    return axiosClient.put(url);
  },
};
export default wishListApi;
