

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
  },
  deleteComment:(postId,commentId)=>{
    const url = `${COMMENT_ENDPOINT}/deleteComment/${postId}/${commentId}`;
    return axiosClient.delete(url);
  },
  deleteReplyComment:(postId,commentId,replyId)=>{
    const url = `${COMMENT_ENDPOINT}/deleteCommentReply/${postId}/${commentId}/${replyId}`;
    return axiosClient.delete(url);
  },
  updateComment:(commentId,postId,content)=>{
    const url = `${COMMENT_ENDPOINT}/updateComment/${postId}/${commentId}`;
    return axiosClient.put(url,{content});
  },
  updateCommentReply:(commentId,postId,replyId,content)=>{
    const url = `${COMMENT_ENDPOINT}/updateCommentReply/${postId}/${commentId}/${replyId}`;
    return axiosClient.put(url,{content});
  }
};


export default commentApi;
