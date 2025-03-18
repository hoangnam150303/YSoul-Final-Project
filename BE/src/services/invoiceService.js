const { conectPostgresDb } = require("../configs/database");
const stripeLoad = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Invoice = require("../models/invoice");
const moment = require("moment");
const crypto = require("crypto");
const querystring = require("qs");
const axios = require("axios");
const { stringify } = require("querystring");
exports.createStripeInvoiceSerivice = async (id, totalPrice) => {
  try {
    const user = await conectPostgresDb.query(
      "SELECT * FROM users WHERE id = $1",
      [id]
    );

    if (user.rows.length === 0) {
      throw new Error("User not found");
    }
    const urlReturn = process.env.CLIENT_URL;

    if (totalPrice <= 0) {
      throw new Error("Total price must be greater than 0");
    }

    const invoice = await Invoice.create({
      user_id: user.rows[0].id,
      price: totalPrice,
      isSuccess: false,
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
      success_url: `${urlReturn}/paymentSuccess/${invoice._id}`,
      //   cancel_url: `${process.env.CLIENT_URL}/cart`,
      metadata: {
        invoice_id: invoice._id.toString(),
      },
    });

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

    if (totalPrice <= 0) {
      throw new Error("Total price must be greater than 0");
    }

    const invoice = await Invoice.create({
      user_id: user.rows[0].id,
      price: totalPrice,
      isSuccess: false,
      paymentMethod: "VNPay",
    });
    const urlReturn = `${process.env.CLIENT_URL}/paymentSuccess/${invoice._id}`;
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
    vnp_Params["vnp_ReturnUrl"] = urlReturn.split("?")[0];
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

exports.createMomoInvoiceService = async (id, totalPrice) => {
  try {
    const user = await conectPostgresDb.query(
      "SELECT * FROM users WHERE id = $1",
      [id]
    );

    if (user.rows.length === 0) {
      throw new Error("User not found");
    }

    if (totalPrice <= 0) {
      throw new Error("Total price must be greater than 0");
    }
    var amount = `${totalPrice * 100000}`;
    const invoice = await Invoice.create({
      user_id: user.rows[0].id,
      price: totalPrice,
      isSuccess: false, // Ban đầu chưa thành công
      paymentMethod: "MoMo",
    });
    var accessKey = process.env.MOMO_ACCESS_KEY;
    var secretKey = process.env.MOMO_SECRET_KEY;
    var orderInfo = "pay with MoMo";
    var partnerCode = "MOMO";
    var redirectUrl = `${process.env.CLIENT_URL}/paymentSuccess/${invoice._id}`;
    var ipnUrl = "https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b";
    var requestType = "payWithMethod";
    var amount = amount;
    var orderId = invoice._id.toString();
    var requestId = orderId;
    var extraData = "";
    var orderGroupId = "";
    var autoCapture = true;
    var lang = "vi";

    var rawSignature =
      "accessKey=" +
      accessKey +
      "&amount=" +
      amount +
      "&extraData=" +
      extraData +
      "&ipnUrl=" +
      ipnUrl +
      "&orderId=" +
      orderId +
      "&orderInfo=" +
      orderInfo +
      "&partnerCode=" +
      partnerCode +
      "&redirectUrl=" +
      redirectUrl +
      "&requestId=" +
      requestId +
      "&requestType=" +
      requestType;
    //puts raw signature

    const crypto = require("crypto");
    var signature = crypto
      .createHmac("sha256", secretKey)
      .update(rawSignature)
      .digest("hex");

    //json object send to MoMo endpoint
    const requestBody = {
      partnerCode: partnerCode,
      partnerName: "Test",
      storeId: "MomoTestStore",
      requestId: requestId,
      amount: amount,
      orderId: orderId,
      orderInfo: orderInfo,
      redirectUrl: redirectUrl,
      ipnUrl: ipnUrl,
      lang: lang,
      requestType: requestType,
      autoCapture: autoCapture,
      extraData: extraData,
      orderGroupId: orderGroupId,
      signature: signature,
    };

    const options = {
      method: "POST",
      url: "https://test-payment.momo.vn/v2/gateway/api/create",
      headers: {
        "Content-Type": "application/json",
      },
      data: requestBody,
    };

    let result;

    result = await axios(options);


    return {
      requestBody,
      invoiceId: invoice._id,
      result: result.data,
      url: result.data.payUrl,
      success: true,
    };
  } catch (error) {
    console.error("Error creating MoMo invoice:", error.message);
    throw error;
  }
};

exports.returnInvoiceService = async (orderId) => {
  try {
    const order = await Invoice.findById(orderId);
    if (!order) {
      throw new Error("Order not found");
    }
    order.isSuccess = true;
    await order.save();
    await conectPostgresDb.query("UPDATE users SET vip = $1 WHERE id = $2", [
      true,
      order.user_id,
    ]);

    return { success: true };
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
