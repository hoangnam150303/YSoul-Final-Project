const WishList = require("../../models/WishListModel/wishList");
const { conectPostgresDb } = require("../../configs/database");
const Film = require("../../models/FilmModel/film");
const NFT = require("../../models/MarketModel/NFTs");

// This function adds an item to the user's wishlist based on the type of item (film, single, or NFT).
exports.addToWishListService = async (type,id,user_id) => {
    try {
        const wishList = await WishList.findOne({ user_id: user_id }); // Check if the user already has a wishlist
        if (!wishList) { // If not, create a new wishlist
       wishList =  await WishList.create({
                user_id: user_id,
            });
        }
            // If the wishlist already exists, check the type of item to add
            if (type === "film") { // Check if the type is "film"
                const film = await Film.findById(id); // Find the film by ID
                if (!film) {
                   return {success: false};
                }
                wishList.film_id.push(film._id);
                await wishList.save();
            }else if (type === "single") { // Check if the type is "single"

                
                const single = await conectPostgresDb.query(
                    `SELECT * FROM singles WHERE id = $1`,
                    [id]
                );
                
                if (single.rows.length === 0) {
                   return {success: false};
                }
                wishList.single.push({ // Add the single item to the wishlist
                    single_id: single.rows[0].id,
                    title: single.rows[0].title,
                    image: single.rows[0].image,
                    mp3: single.rows[0].mp3,
                });
                await wishList.save();
            }else if (type === "nft") { // Check if the type is "nft"
                const nft = await NFT.findById(id);
                if (!nft) {
               return {success: false};
                }
                wishList.NFT_id.push(nft._id); // Add the NFT ID to the wishlist
                await wishList.save();
            } else { // If the type is not recognized, return false
                return {success: false};
            }
       
       return {success: true}; // Return success if the item was added successfully
    } catch (error) {
        console.log(error);
        
        return {success: false}; // If an error occurs, return false
    }
}

// This function retrieves the user's wishlist.
exports.getWishListService = async (user_id) => {
    try {
        const wishList = await WishList.findOne({ user_id: user_id }) // Find the wishlist by user ID
            .populate("film_id","name small_image") // Populate the film_id field with film data
            .populate("NFT_id","name image"); // Populate the NFT_id field with NFT data
        if (!wishList) { // If the wishlist does not exist, return false
            return {success: false};
        }
        return {success:true, data: wishList}; // Return the wishlist data
    } catch (error) {
        console.log(error);
        
        return {success: false}; // If an error occurs, return false
    }
}

// This function deletes an item from the user's wishlist based on the type of item (film, single, or NFT).
exports.deleteItemFromWishListService = async (type,id,user_id) => {
    try {
        const wishList = await WishList.findOne({ user_id: user_id }); // Find the wishlist by user ID
        if (!wishList) { // If the wishlist does not exist, return false
            return {success: false};
        }
        if (type === "film") { // Check if the type is "film"
            wishList.film_id = wishList.film_id.filter((item) => item.toString() !== id); // Remove the film ID from the wishlist
        } else if (type === "single") { // Check if the type is "single"
            wishList.single = wishList.single.filter((item) => item.id !== id); // Remove the single item from the wishlist
        } else if (type === "nft") { // Check if the type is "nft"
            wishList.NFT_id = wishList.NFT_id.filter((item) => item.toString() !== id); // Remove the NFT ID from the wishlist
        } else { // If the type is not recognized, return false
            return {success: false};
        }
        await wishList.save(); // Save the updated wishlist
        return {success: true}; // Return success if the item was deleted successfully
    } catch (error) {
        return {success: false}; // If an error occurs, return false
    }
}

// This function checks if an item is in the user's wishlist based on the type of item (film, single, or NFT).
exports.checkIsFavoriteService = async (type,id,user_id) => {
    try {
        const wishList = await WishList.findOne({ user_id: user_id }); // Find the wishlist by user ID
        if (!wishList) { // If the wishlist does not exist, return false
            return {success: false};
        }
        if (type === "film") { // Check if the type is "film"
            const isFavorite = wishList.film_id.includes(id); // Check if the film ID is in the wishlist
            return {success: true, isFavorite}; // Return success and the favorite status
        } else if (type === "single") { // Check if the type is "single"            
            const isFavorite = wishList.single.some( (item) => item.single_id.toString() === id.toString()); // Check if the single item is in the wishlist
            return {success: true, isFavorite}; // Return success and the favorite status
        } else if (type === "nft") { // Check if the type is "nft"
            const isFavorite = wishList.NFT_id.includes(id); // Check if the NFT ID is in the wishlist
            return {success: true, isFavorite}; // Return success and the favorite status
        } else { // If the type is not recognized, return false
            return {success: false};
        }
    }catch (error) {
        return {success: false}; // If an error occurs, return false
    }
}