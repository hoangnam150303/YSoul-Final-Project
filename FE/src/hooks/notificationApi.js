
import { axiosClient } from "../ApiConfig/apiConfig";

const NOTIFICATION_API_ENDPOINT = "/api/v1/notification";
const notificationApi = {

    getNotification:(filter,page,limit) => {
    const url = `${NOTIFICATION_API_ENDPOINT}/getNotificationByUser?filter=${filter}&currentPage=${page}&pageSize=${limit}`;
       return axiosClient.get(url)
    },
};
export default notificationApi;
