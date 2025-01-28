const express = require("express");
const invoiceRoute = express.Router();
const invoiceController = require("../controllers/invoiceController");
const auth = require("../middlewares/auth");

invoiceRoute.post(
  "/createStripeInvoice/:id",
  auth.isAuth,
  invoiceController.createStripeInvoice
);
invoiceRoute.post(
  "/createVNPayInvoice/:id",
  auth.isAuth,
  invoiceController.createVNPayInvoice
);

module.exports = invoiceRoute;
