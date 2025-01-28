const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
  {
    user_id: { type: String },
    price: { type: String },
    isSuccess: { type: Boolean },
    paymentMethod: { type: String },
  },
  {
    timestamps: true,
  }
);

const Invoice = mongoose.model("Invoice", invoiceSchema);

module.exports = Invoice;
