const artistNFTService = require("../../services/NFTService/artistNFTService")
exports.createArtistNFT = async (req, res) => {
  try {
    const { addressWallet, name } = req.body;
    const userId = req.user.id;
    const avatar = req.file.path;

    if (!userId || !addressWallet || !avatar || !name) {
      return res.status(400).json("All fields are required");
    } ;
    
    const response = await artistNFTService.createArtistNFT(userId, addressWallet, avatar, name);
    if (!response.success) {
      return res.status(400).json("Fail to create artistNFT");
    }
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json("Error", error);
  }
};


exports.updateArtistNFT = async (res,req)=>{
    try {
        const aritstId = req.user.id; 
        const avatar = req.file.path;
        const response = await artistNFTService.updateArtistNFT(avatar,aritstId);
        if (!response.success) {
            return res.status(400).json("Fail to update artist")
        }
        return {success:true,message:"Update Success"};
    } catch (error) {
        return res.status(500).json("Error",error)
    }
}


exports.getArtistNFT = async (req, res) => {
    try {

      const { addressWallet } = req.params;
      if (!addressWallet) {
        return res.status(400).json("Address wallet is required");
      }
      const response = await artistNFTService.getArtistNFT(addressWallet);
      if (!response.success) {
        return res.status(400).json("Fail to get artistNFT");
      }
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json("Error", error);
    }
  }

exports.getAllArtistNFT = async (req, res) => {
  try {
      const {search,page,limit} = req.query;
      const response = await artistNFTService.getAllArtistNFT(search,page,limit);
      if (!response.success) {
          return res.status(400).json("Fail to get all artistNFT")
      }
      return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json("Error", error);
  }
}