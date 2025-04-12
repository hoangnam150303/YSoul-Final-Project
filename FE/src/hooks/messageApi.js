
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
    },
    deleteConversation:(id)=>{
        const url = `${MESSAGE_API_ENDPOINT }/deleteConversation/${id}`
        return axiosClient.delete(url)
    },
    deleteMessage:(conversationId, messageId) => {
        const url = `${MESSAGE_API_ENDPOINT}/deleteMessage/${conversationId}/${messageId}`;
        return axiosClient.delete(url);
    },
    updateMessage:(conversationId,messageId,text)=>{
        const url = `${MESSAGE_API_ENDPOINT}/updateMessage/${conversationId}/${messageId}`
        return axiosClient.put(url,{text})
    },
};
export default messageApi;
