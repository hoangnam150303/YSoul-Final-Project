const { conectPostgresDb } = require("../configs/database");
const stripeLoad = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Invoice = require("../models/invoice");
const moment = require("moment");
const crypto = require("crypto");
const querystring = require("qs");
exports.createStripeInvoiceSerivice = async (id, totalPrice) => {
  try {
    const user = await conectPostgresDb.query(
      "SELECT * FROM users WHERE id = $1",
      [id]
    );

    if (user.rows.length === 0) {
      throw new Error("User not found");
    }
    const urlReturn = process.env.URL_BE;

    if (totalPrice <= 0) {
      throw new Error("Total price must be greater than 0");
    }

    const invoice = await Invoice.create({
      user_id: user.rows[0].id,
      price: totalPrice,
      isSuccess: true,
      paymentMethod: "Stripe",
    });

    const session = await stripeLoad.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Update account",
            },
            unit_amount: Math.round(totalPrice * 100),
          },
          quantity: 1,
        },
      ],
      success_url: `${urlReturn}/invoice/stripe-return?invoice_id=${invoice._id}`,
      //   cancel_url: `${process.env.CLIENT_URL}/cart`,
      metadata: {
        invoice_id: invoice._id.toString(),
      },
    });
    console.log(session);

    return { success: true, url: session.url };
  } catch (error) {}
};

exports.createVNPayInvoiceService = async (id, totalPrice, IpAddr) => {
  try {
    const user = await conectPostgresDb.query(
      "SELECT * FROM users WHERE id = $1",
      [id]
    );

    if (user.rows.length === 0) {
      throw new Error("User not found");
    }
    const urlReturn = process.env.URL_BE;

    if (totalPrice <= 0) {
      throw new Error("Total price must be greater than 0");
    }

    const invoice = await Invoice.create({
      user_id: user.rows[0].id,
      price: totalPrice,
      isSuccess: true,
      paymentMethod: "VN Pay",
    });

    let date = new Date();
    let createDate = moment(date).format("YYYYMMDDHHmmss");

    let ipAddr = IpAddr;

    let tmnCode = process.env.TMN_CODE;
    let secretKey = process.env.VNPAY_SECRETKEY;
    let vnpUrl = process.env.VNP_URL;
    let invoiceInfor = moment(date).format("DDHHmmss");
    let bankCode = process.env.BANKCODE;
    let invoiceId = invoice._id.toString();
    let locale = "vn";
    let currCode = "VND";

    let vnp_Params = {};
    vnp_Params["vnp_Version"] = "2.1.0";
    vnp_Params["vnp_Command"] = "pay";
    vnp_Params["vnp_TmnCode"] = tmnCode;
    vnp_Params["vnp_Locale"] = locale;
    vnp_Params["vnp_CurrCode"] = currCode;
    vnp_Params["vnp_TxnRef"] = invoiceId;
    vnp_Params["vnp_OrderInfo"] = "Thanh toan cho ma GD:" + invoiceInfor;
    vnp_Params["vnp_OrderType"] = "other";
    vnp_Params["vnp_Amount"] = totalPrice * 10000000;
    vnp_Params["vnp_ReturnUrl"] = urlReturn + "/invoice/vnpay-return";
    vnp_Params["vnp_IpAddr"] = ipAddr;
    vnp_Params["vnp_CreateDate"] = createDate;
    vnp_Params["vnp_BankCode"] = bankCode;

    vnp_Params = sortObject(vnp_Params);

    let signData = querystring.stringify(vnp_Params, { encode: false });

    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");
    vnp_Params["vnp_SecureHash"] = signed;
    vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });

    return { success: true, url: vnpUrl, invoiceId: invoiceId };
  } catch (error) {}
};

function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}
