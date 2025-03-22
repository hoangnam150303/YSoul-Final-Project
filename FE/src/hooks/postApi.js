import { axiosClient } from "../ApiConfig/apiConfig";

const POST_ENDPOINT = "/post";
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
  }
};


export default postApi;
