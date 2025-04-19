const ArtistNFT = require("../../models/MarketModel/artistNFT")
const cloudinaryHelpers = require("../../helpers/cloudinaryHelpers");

// this function is for artist NFTs, artist can create new NFT
exports.createArtistNFT = async (userId,addressWallet,avatar,name) =>{
    try {
        const validArtist = await ArtistNFT.findOne({addressWallet:addressWallet}); // check if artist is valid
        if (validArtist) {
            return {success:false,message:"artist is valid"} // if artist is valid
        }
       const artist =  await ArtistNFT.create({ // create artist
            user_id:userId,
            addressWallet:addressWallet,
            avatar:avatar,
            name:name
        })
        if (artist) {
            return {success:true,message:"Create Success!"} // return success
        }
    } catch (error) {
        return {success:false,message:error.toString()} // return fail
    }
}

// this function is for user, user can get all NFTs
exports.updateArtistNFT = async(avatar,aritstId) =>{
    try {
        const validArtist = await ArtistNFT.findOne({user_id:aritstId}); // check if artist is valid
        if (!validArtist) {
            return {success:false,message:"Artist not found"}; // if artist is not valid
        }

             const result = await cloudinaryHelpers.removeFile( // remove old image
                   validArtist.avatar
                  );
                  if (!result.success) {
                    throw new Error("Error removing old image"); // if error remove old image
                  } else {
                    validArtist.avatar = avatar; // set new image
                    validArtist.save();
                  }
        return {success:true,message:"Update Success"} // return success
    } catch (error) {
        return {success:false,message:error.toString()} // return fail
        
    }
}

// this function is for user, user can get all NFTs
exports.getArtistNFT = async (addressWallet) =>{
    try {
        const validArtist = await ArtistNFT.findOne({addressWallet:addressWallet}); // check if artist is valid
        if (!validArtist) { // if artist is not valid
            return {success:false,message:"Artist not found"};
        }
        return {success:true,validArtist} // return success and artist
    } catch (error) {
        return {success:false,message:error.toString()} // return fail
    }
}

exports.getAllArtistNFT = async (page,limit) =>{
    try {
        
    } catch (error) {
        
    }
}