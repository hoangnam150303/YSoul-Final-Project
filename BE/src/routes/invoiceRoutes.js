const express = require("express");
const invoiceRoute = express.Router();
const invoiceController = require("../controllers/invoiceController");
const auth = require("../middlewares/auth");

invoiceRoute.post(
  "/createInvoice/:id",
  auth.isAuth,
  invoiceController.createStripeInvoice
);

module.exports = invoiceRoute;
