
import { axiosClient } from "../ApiConfig/apiConfig";

const PAYMENT_API_ENDPOINT = "/api/v1/invoice";
const paymentApi = {
  postPayment: (totalPrice, userId, paymentMethod) => {
    const url = `${PAYMENT_API_ENDPOINT}/createInvoice/${userId}/${paymentMethod}`;
    return axiosClient.post(url, { totalPrice });
  },
  putReturnInvoice: (orderId) => {
    const url = `${PAYMENT_API_ENDPOINT}/returnInvoice/${orderId}`;
    return axiosClient.put(url);
  },
};
export default paymentApi;
