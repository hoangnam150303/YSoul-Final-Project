const { conectPostgresDb } = require("../configs/database");
const stripeLoad = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Invoice = require("../models/invoice");

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
