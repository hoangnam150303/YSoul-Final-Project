
import { axiosClient } from "../ApiConfig/apiConfig";

const REVIEWER_API_ENDPOINT = "/api/v1/reviewer";
const reviewerApi = {
    getAllReviewer:(filter,search,pageSize,currentPage)=>{
        const url = `${REVIEWER_API_ENDPOINT}/getAllReviewer?filter=${filter}&search=${search}&pageSize=${pageSize}&currentPage=${currentPage}`;
        return axiosClient.get(url);
      },
      followUser:(id)=>{
        const url = `${REVIEWER_API_ENDPOINT}/followUser/${id}`;
        return axiosClient.put(url)
      }
};
export default reviewerApi;
