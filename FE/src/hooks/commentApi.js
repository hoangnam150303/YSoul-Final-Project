import { axiosClient } from "../ApiConfig/apiConfig";

const COMMENT_ENDPOINT = "/comment";
const commentApi = {
  
  postCreateComment: (value,id) => {
    const url = `${COMMENT_ENDPOINT}/postComment/${id}`;
    return axiosClient.post(url, value);
  },
  postReplyComment:(value,postId,commentId) => {
    const url = `${COMMENT_ENDPOINT}/replyComment/${postId}/${commentId}`;
    return axiosClient.post(url, value);
  }
};


export default commentApi;
