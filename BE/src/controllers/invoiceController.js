const invoiceService = require("../services/invoiceService");
exports.createStripeInvoice = async (req, res) => {
  try {
    const userId = req.params.id;
    const { totalPrice } = req.body;

    const response = await invoiceService.createStripeInvoiceSerivice(
      userId,
      totalPrice
    );
    if (!response.success) {
      return res.status(400).json({
        message: "Error create invoice",
      });
    }
    return res.status(200).json({
      response,
      success: true,
    });
  } catch (error) {}
};

exports.createVNPayInvoice = async (req, res) => {
  try {
    const userId = req.params.id;
    const { totalPrice } = req.body;
    let ipAddr =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;
      
    const response = await invoiceService.createVNPayInvoiceService(
      userId,
      totalPrice,
      ipAddr
    );
    if (!response.success) {
      return res.status(400).json({
        message: "Error create invoice",
      });
    }
    return res.status(200).json({
      response,
      success: true,
    });
  } catch (error) {}
};
