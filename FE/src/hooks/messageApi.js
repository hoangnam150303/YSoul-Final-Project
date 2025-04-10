
import { axiosClient } from "../ApiConfig/apiConfig";

const MESSAGE_API_ENDPOINT = "/api/v1/message";
const messageApi = {
    createConvesation:(id)=>{
        const url = `${MESSAGE_API_ENDPOINT}/createConversation/${id}`
        return axiosClient.post(url)
    },
    getAllConversation:()=>{
        const url = `${MESSAGE_API_ENDPOINT }/getAllConversation`
        return axiosClient.get(url)
    },
    getDetailConversation:(id)=>{
        const url = `${MESSAGE_API_ENDPOINT }/getDetailConversation/${id}`
        return axiosClient.get(url)
    },
    sendMessage:(id,message)=>{        
        const url = `${MESSAGE_API_ENDPOINT }/sendMessage/${id}`
        return axiosClient.put(url,message,{
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
    }
};
export default messageApi;
