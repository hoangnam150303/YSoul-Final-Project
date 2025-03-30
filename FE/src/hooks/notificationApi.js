
import { axiosClient } from "../ApiConfig/apiConfig";

const NOTIFICATION_API_ENDPOINT = "/notification";
const notificationApi = {

    getNotification:(filter) => {
        const url = `${NOTIFICATION_API_ENDPOINT}/getNotificationByUser?filter=${filter}`;
       return axiosClient.get(url)
    },
};
export default notificationApi;
