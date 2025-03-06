
import { axiosClient } from "../ApiConfig/apiConfig";

const ARTISTNFT_API_ENDPOINT = "/artistNFT";
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
 }
};

export default artistNFTApi;
