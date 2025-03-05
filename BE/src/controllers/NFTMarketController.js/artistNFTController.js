const artistNFTService = require("../../services/NFTService/artistNFTService")
exports.createArtistNFT = async(res,req)=>{
    try {
        const {addressWallet} = req.body;
        const userId = req.user.id;
        const avatar  = req.file.path;
        const response = await artistNFTService.createArtistNFT(userId,addressWallet,avatar);
        if (!response.success) {
            return res.status(400).json("Fail to create artistNFT");
        }
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json("Error",error)
    }
}

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