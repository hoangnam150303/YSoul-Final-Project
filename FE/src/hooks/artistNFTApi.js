
import { axiosClient } from "../ApiConfig/apiConfig";

const ARTISTNFT_API_ENDPOINT = "/api/v1/artistNFT";
const artistNFTApi = {
  
 getArtist :(addressWallet)=>{    
    const url = `${ARTISTNFT_API_ENDPOINT}/getArtistNFT/${addressWallet}`;
    return axiosClient.get(url)
 },
 postRegisterArtist:(value) =>{
    const url = `${ARTISTNFT_API_ENDPOINT}/registerArtist`
    return axiosClient.post(url,value,{
        headers: {
            "Content-Type": "multipart/form-data",
          },
    })
 },
 
 getAllArtists:(page,limit,search)=>{
   const url = `${ARTISTNFT_API_ENDPOINT}/getAllArtistNFT?page=${page}&limit=${limit}&search=${search}`;
   return axiosClient.get(url);
 }
};

export default artistNFTApi;
