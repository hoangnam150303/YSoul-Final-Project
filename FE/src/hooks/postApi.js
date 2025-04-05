import { axiosClient } from "../ApiConfig/apiConfig";

const POST_ENDPOINT = "/api/v1/post";
const postApi = {
  
  postCreatePost: (value) => {
    const url = `${POST_ENDPOINT}/createPost`;
    return axiosClient.post(url, value, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  getAllPost:(search)=>{
    const url = `${POST_ENDPOINT}/getAllPost?search=${search}`
    return axiosClient.get(url)
  },
  activeOrDeactivePost:(id)=>{
    const url = `${POST_ENDPOINT}/activeOrDeactive/${id}`
    return axiosClient.put(url)
  },
  getPostById:(id)=>{
    const url = `${POST_ENDPOINT}/getPostById/${id}`
    return axiosClient.get(url)
  },
  updatePost:(id,value)=>{
    const url = `${POST_ENDPOINT}/updatePost/${id}`
    return axiosClient.put(url,value, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  },
  likePost:(id)=>{
    const url = `${POST_ENDPOINT}/likePost/${id}`
    return axiosClient.put(url)
  },
  getPostByUser:(id)=>{
    const url = `${POST_ENDPOINT}/getPostByUser/${id}`
    return axiosClient.get(url)
  },

};


export default postApi;
