const nftService = require('../../services/NFTService/nftService');

// this function is for artist NFTs, artist can create new NFT
exports.createNFT = async (req, res) => {
    try {
        const { addressWallet, name, description, price } = req.body; // get addressWallet, name, description, price from body
        const userId = req.user.id; // get userId from user
        const image = req.file.path; // get image from file
        if (!userId || !addressWallet || !image || !name || !description || !price) { // if userId, addressWallet, image, name, description, price is empty
            return res.status(400).json("All fields are required");
        }
        // call createNFTService from nftService
        const response = await nftService.createNFTService(userId, addressWallet, image, name, description, price);
        if (!response.success) { // if response is not success
            return res.status(400).json("Fail to create NFT");
        }
        return res.status(200).json(response); // return response
    } catch (error) {
        return res.status(500).json("Error", error);
    }
};

// this function is for user, admin can get all NFTs
exports.getAllNFTs = async (req, res) => {
    try {
        const {filter,search,page,limit} = req.query // get filter and search from query
        const response = await nftService.getAllNFTsService(filter,search,page,limit);  // call getAllNFTsService from nftService
        if (!response.success) { // if response is not success
            return res.status(400).json("Fail to get NFTs"); 
        }
        return res.status(200).json(response); // return response
    } catch (error) {
        return res.status(500).json({ message: "Error", error });
    }
};

exports.getNFTByArtist = async (req, res) => {
    try {

        const {filter,search,typeUser,artistId,page,limit} = req.query    
        const response = await nftService.getNFTByArtistService(filter,search,typeUser,artistId,page,limit); // call getNFTByArtistService from nftService
        if (!response.success) { // if response is not success
            return res.status(400).json("Fail to get NFTs");
        }
        return res.status(200).json(response); // return response
    } catch (error) {
        return res.status(500).json({ message: "Error", error });
    }
};

exports.updateNFT = async (req,res)=>{
    try {
        const { id } = req.params; // get id from params
        const { name, description, price } = req.body; // get addressWallet, name, description, price from body
        const image = req.file?.path; // get image from file
        const response = await nftService.updateNFTService(id, image, name, description, price); // call updateNFTService from nftService
        if (!response.success) { // if response is not success
            return res.status(400).json("Fail to update NFT");
        }
        return res.status(200).json(response); // return response
    } catch (error) {
        
    }
}

exports.updateStatusNFt = async (req,res)=>{
    try {
        const { id } = req.params; // get id from params
        if (!id) {
            return res.status(401).json({ message: "NFT id is required." });
        }
        const response = await nftService.updateStatusNFtService(id); // call updateStatusNFtService from nftService
        if (!response.success) { // if response is not success
            return res.status(401).json({ message: "Error! Please try again." });
        }
        return res.status(200).json(response); // return response
        
    } catch (error) {
        return res.status(500).json({ message: "Error! Please try again." });
    }
}

exports.getNFTById = async (req, res) => {
    try {
        const id = req.params.id; // get id from request params
        if (!id) {
            return res.status(401).json({ message: "NFT id is required." });
        }
        const response = await nftService.getNFTByIdService(id); // call getNFTByIdService from nftService
        if (!response.success) {
            // if response is not success, return error message
            return res.status(401).json({ message: "Error! Please try again." });
        }
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({ message: "Error! Please try again." });
    }
};

exports.buyNFT = async (req, res) => {
    try {
        const { id } = req.params; // get id from params
        const userId = req.user.id; // get userId from user
        if (!id) {
            return res.status(401).json({ message: "NFT id is required." });
        }
        const response = await nftService.buyNFTService(id, userId); // call buyNFTService from nftService
        if (!response.success) { // if response is not success
            return res.status(401).json({ message: "Error! Please try again." });
        }
        return res.status(200).json(response); // return response
        
    } catch (error) {
        return res.status(500).json({ message: "Error! Please try again." });
    }
}