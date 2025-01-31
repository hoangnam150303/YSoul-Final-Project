const express = require("express");
const invoiceRoute = express.Router();
const invoiceController = require("../controllers/invoiceController");
const auth = require("../middlewares/auth");

invoiceRoute.post(
  "/createInvoice/:id/:paymentMethod",
  auth.isAuth,
  invoiceController.createInvoice
);

invoiceRoute.put(
  "/returnInvoice/:orderId",
  auth.isAuth,
  invoiceController.returnInvoice
);

module.exports = invoiceRoute;
