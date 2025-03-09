


import { axiosClient } from "../ApiConfig/apiConfig";

const NFT_ENDPOINT = "/nft";
const nftApi = {
  
 postCreateNFT:(value) =>{
    const url = `${NFT_ENDPOINT}/createNFT`
    return axiosClient.post(url,value,{
        headers: {
            "Content-Type": "multipart/form-data",
          },
    })
 },
 getAllNFTs: (search,filter) => {    
    const url = `${NFT_ENDPOINT}/getAllNFTs?search=${search}&filter=${filter}`
    return axiosClient.get(url)
},

getNFTByArtist: (id,search,filter,typeUser,page,limit) => {
    const url = `${NFT_ENDPOINT}/getNFTByArtist/?search=${search}&filter=${filter}&typeUser=${typeUser}&artistId=${id}&page=${page}&limit=${limit}`
    return axiosClient.get(url)
},

updateNFT: (id,value) => {
    const url = `${NFT_ENDPOINT}/updateNFT/${id}`
    return axiosClient.put(url,value,{
        headers: {
            "Content-Type": "multipart/form-data",
          },
    })
},

updateStatusNFT: (id) => {
    const url = `${NFT_ENDPOINT}/updateStatus/${id}`
    return axiosClient.put(url)
},

getNFTById:(id) => {
    const url = `${NFT_ENDPOINT}/getNFTById/${id}`
    return axiosClient.get(url)
}
};


export default nftApi;
