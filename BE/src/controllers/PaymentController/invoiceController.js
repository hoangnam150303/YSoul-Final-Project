const invoiceService = require("../../services/PaymentService/invoiceService");
exports.createInvoice = async (req, res) => {
  try {
    const userId = req.params.id;
    const paymentMethod = req.params.paymentMethod;
    const { totalPrice } = req.body;

    let response;
    if (paymentMethod === "stripe") {
      response = await invoiceService.createStripeInvoiceSerivice(
        userId,
        totalPrice
      );
    } else if (paymentMethod === "vnpay") {
      let ipAddr =
        req.headers["x-forwarded-for"] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

      response = await invoiceService.createVNPayInvoiceService(
        userId,
        totalPrice,
        ipAddr
      );
    } else if (paymentMethod === "momo") {
      response = await invoiceService.createMomoInvoiceService(
        userId,
        totalPrice
      );
    } else {
      return res.status(400).json({
        message: "Error create invoice",
      });
    }

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

exports.returnInvoice = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    if (!orderId) {
      return res.status(400).json({
        message: "Error return invoice",
      });
    }
    const response = await invoiceService.returnInvoiceService(orderId);
    if (!response.success) {
      return res.status(400).json({
        message: "Error return invoice",
      });
    }
    return res.status(200).json({
      response,
      success: true,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Error return invoice",
    });
  }
};
