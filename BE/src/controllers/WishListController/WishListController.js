const WishListService = require("../../services/WishListService/WishListService");

// This function handles the addition of items to the user's wishlist.
exports.addToWishList = async (req, res) => {
  try {
    const { type, id } = req.params; // Extracting type and id from request parameters
    if (!type || !id) {
      return res.status(400).json({
        status: false,
        message: "Type and ID are required",
      });
    }
    const user_id = req.user.id; // Extracting user ID from the request object
    const response = await WishListService.addToWishListService(
      type,
      id,
      user_id
    ); // Calling the service to add the item to the wishlist
    if (!response.success) {
      // If the response is false, it means the item was not added successfully
      return res.status(400).json({
        status: false,
        message: "Error adding to wishlist",
      });
    }
    // If the item was added successfully, return a success response
    return res.status(200).json({
      status: true,
      message: "Added to wishlist successfully",
      data: response,
    });
  } catch (error) {
    // If an error occurs, return a 500 status code with the error message
    return res.status(500).json({
      status: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// This function handles the retrieval of the user's wishlist.
exports.getWishList = async (req, res) => {
  try {
    const user_id = req.user.id; // Extracting user ID from the request object
    const response = await WishListService.getWishListService(user_id); // Calling the service to get the wishlist
    if (!response.success) {
      // If the response is false, it means the wishlist was not retrieved successfully
      console.log(response);

      return res.status(400).json({
        status: false,
        message: "Error retrieving wishlist",
      });
    }
    // If the wishlist was retrieved successfully, return a success response
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// This function handles the deletion of items from the user's wishlist.
exports.deleteItemFromWishList = async (req, res) => {
  try {
    const { type, id } = req.params; // Extracting type and id from request parameters
    const user_id = req.user.id; // Extracting user ID from the request object
    if (!type || !id) {
      return res.status(400).json({
        status: false,
        message: "Type and ID are required",
      });
    }
    const response = await WishListService.deleteItemFromWishListService(
      type,
      id,
      user_id
    ); // Calling the service to delete the item from the wishlist
    if (!response.success) {
      // If the response is false, it means the item was not deleted successfully
      return res.status(400).json({
        status: false,
        message: "Error deleting from wishlist",
      });
    }
    // If the item was deleted successfully, return a success response
    return res.status(200).json({
      status: true,
      message: "Deleted from wishlist successfully",
      data: response,
    });
  } catch (error) {
    // If an error occurs, return a 500 status code with the error message
    return res.status(500).json({
      status: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.checkIsFavorite = async (req, res) => {
  try {
    const { type, id } = req.params; // Extracting type and id from request parameters
    const user_id = req.user.id; // Extracting user ID from the request object

    if (!type || !id) {
      return res.status(400).json({
        status: false,
        message: "Type and ID are required",
      });
    }

    const response = await WishListService.checkIsFavoriteService(
      type,
      id,
      user_id
    ); // Calling the service to check if the item is a favorite
    if (!response.success) {
      // If the response is false, it means the item was not found in the wishlist
      return res.status(400).json({
        status: false,
        message: "Error checking favorite status",
      });
    }
    // If the item was found in the wishlist, return a success response
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
