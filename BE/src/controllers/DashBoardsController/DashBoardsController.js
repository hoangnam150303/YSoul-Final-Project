const dashboardService = require("../../services/DashBoardsService/DashBoardService");

// this function is to get the number of users by type (normal and VIP)
exports.getNumberOfTypeUser = async (req, res) => {
  try {
    const response = await dashboardService.getNumberOfTypeUserService(); // call getNumberOfTypeUserService from dashboardService
    if (!response.success) {
      // check if the response is not successful
      return res.status(500).json({
        success: false,
        message: response.message,
      });
    }
    return res.status(200).json(response); // return the response with status 200
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.toString(),
    });
  }
};

// this function is to increase the favourite count of entertainment
exports.increaseFavouriteCount = async (req, res) => {
  try {
    const { type } = req.query; // Get the type from the query parameters
    if (!type) {
      return res.status(400).json({
        success: false,
        message: "Type is required",
      });
    }
    // Call the service to get the number of favourite entertainment
    const response = await dashboardService.increaseFavouriteCountService(type);
    if (!response.success) {
      return res.status(500).json({
        success: false,
        message: response.message,
      });
    }
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.toString(),
    });
  }
};

// this function is to get the favourite count of entertainment
exports.getFavouriteCount = async (req, res) => {
  try { 
    const response = await dashboardService.getFavouriteCountService(); // call getFavouriteCountService from dashboardService
    if (!response.success) { // check if the response is not successful
      return res.status(500).json({ 
        success: false,
        message: response.message,
      });
    }
    return res.status(200).json(response); // return the response with status 200
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.toString(),
    });
  }
};
