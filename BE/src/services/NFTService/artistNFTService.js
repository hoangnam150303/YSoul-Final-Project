const ArtistNFT = require("../../models/MarketModel/artistNFT")
const cloudinaryHelpers = require("../../helpers/cloudinaryHelpers");
exports.createArtistNFT = async (userId,addressWallet,avatar,name) =>{
    try {
        const validArtist = await ArtistNFT.findOne({addressWallet:addressWallet});
        if (validArtist) {
            return {success:false,message:"artist is valid"}
        }
       const artist =  await ArtistNFT.create({
            user_id:userId,
            addressWallet:addressWallet,
            avatar:avatar,
            name:name
        })
        if (artist) {
            return {success:true,message:"Create Success!"}
        }
    } catch (error) {
        console.log(error);
    }
}

exports.updateArtistNFT = async(avatar,aritstId) =>{
    try {
        const validArtist = await ArtistNFT.findOne({user_id:aritstId});
        if (!validArtist) {
            return {success:false,message:"Artist not found"};
        }

             const result = await cloudinaryHelpers.removeFile(
                   validArtist.avatar
                  );
                  if (!result.success) {
                    throw new Error("Error removing old image");
                  } else {
                    validArtist.avatar = avatar;
                    validArtist.save();
                  }
        return {success:true,message:"Update Success"}
    } catch (error) {
        console.log(error);
        
    }
}

exports.getArtistNFT = async (addressWallet) =>{
    try {
        const validArtist = await ArtistNFT.findOne({addressWallet:addressWallet});
        if (!validArtist) {
            return {success:false,message:"Artist not found"};
        }
        return {success:true,validArtist}
    } catch (error) {
        console.log(error);
        
    }
}