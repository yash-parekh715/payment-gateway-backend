const stripe = require("../config/stripe");
const Payment = require("../models/paymentModel");

// Creating a payment
exports.createPayment = async (req, res, next) => {
  try {
    const { user_id, amount, currency } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency,
      // payment_method_types: ['card', 'wallets', 'net banking'],
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: { user_id },
    });

    const payment = new Payment({
      user_id,
      amount,
      currency,
      status: "pending",
      stripe_payment_id: paymentIntent.id,
      payment_method: "automatic", //initially setting the payment_method as 'automatic', will further change it after the payment is processed
    });
    await payment.save();

    res.status(201).json({
      success: true,
      payment,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    next(error);
  }
};

// Process a payment
exports.processPayment = async (req, res, next) => {
  try {
    const { user_id } = req.params;
    const payment = await Payment.findOne({ user_id });
    if (!payment) {
      return res
        .status(404)
        .json({ success: false, message: "No payments found for this user" });
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(
      payment.stripe_payment_id
    );
    if (paymentIntent.status === "succeeded") {
      payment.status = "completed";
      payment.payment_method = paymentIntent.payment_method_types[0]; //update with the automatically selected payment method
    } else {
      payment.status = "failed";
      payment.payment_method = paymentIntent.payment_method_types[0];
    }
    await payment.save();

    res.status(200).json({ success: true, payment });
  } catch (error) {
    next(error);
  }
};

// Retrieve payment status
exports.getPaymentStatus = async (req, res, next) => {
  try {
    const { user_id } = req.params;
    const payment = await Payment.findOne({ user_id });
    if (!payment) {
      return res
        .status(404)
        .json({ success: false, message: "No payments found for this user" });
    }

    res.status(200).json({ success: true, payment });
  } catch (error) {
    next(error);
  }
};

// Handle refunds
exports.refundPayment = async (req, res, next) => {
  try {
    const { user_id } = req.params;
    const payment = await Payment.findOne({ user_id });
    if (!payment) {
      return res
        .status(404)
        .json({ success: false, message: "No payments found for this user" });
    }

    const refund = await stripe.refunds.create({
      payment_intent: payment.stripe_payment_id,
    });
    payment.status = "refunded";
    await payment.save();

    res.status(200).json({ success: true, payment, refund });
  } catch (error) {
    next(error);
  }
};
