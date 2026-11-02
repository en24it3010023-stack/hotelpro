const crypto = require('crypto');
const { getRazorpayClient, getStripeClient, getPaymentMode } = require('../config/payment');
const logger = require('../utils/logger');

/**
 * Creates an order / payment intent with the chosen provider
 */
const createOrder = async ({ amount, currency = 'USD', receipt, notes = {} }) => {
  const mode = getPaymentMode();

  if (mode === 'razorpay') {
    const razorpay = getRazorpayClient();
    if (!razorpay) throw new Error('Razorpay client not configured in environment');

    // Razorpay requires amount in smallest currency unit (cents / paise)
    const options = {
      amount: Math.round(amount * 100),
      currency: currency.toUpperCase() === 'USD' ? 'USD' : 'INR',
      receipt: receipt.slice(0, 40),
      notes,
    };
    const order = await razorpay.orders.create(options);
    return {
      orderId: order.id,
      amount: order.amount / 100,
      currency: order.currency,
      provider: 'razorpay',
      key: process.env.RAZORPAY_KEY_ID,
    };
  }

  if (mode === 'stripe') {
    const stripe = getStripeClient();
    if (!stripe) throw new Error('Stripe client not configured in environment');

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: currency.toLowerCase(),
      metadata: notes,
    });
    return {
      orderId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
      amount,
      currency,
      provider: 'stripe',
    };
  }

  // Demo / Local Sandbox Mode
  const demoOrderId = `demo_ord_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  logger.info(`[Payment Service] Created Demo Order: ${demoOrderId} for amount: $${amount}`);
  return {
    orderId: demoOrderId,
    amount,
    currency,
    provider: 'demo',
    isTest: true,
  };
};

/**
 * Verifies payment signatures / tokens securely on backend
 */
const verifyPayment = async ({
  gateway,
  orderId,
  paymentId,
  signature,
}) => {
  if (gateway === 'razorpay') {
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) throw new Error('Razorpay secret key missing from environment');

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    const isValid = expectedSignature === signature;
    if (!isValid) {
      logger.warn(`[Payment] Razorpay signature mismatch: expected ${expectedSignature}, got ${signature}`);
    }
    return isValid;
  }

  if (gateway === 'stripe') {
    const stripe = getStripeClient();
    if (!stripe) throw new Error('Stripe client not configured');
    const paymentIntent = await stripe.paymentIntents.retrieve(orderId);
    return paymentIntent.status === 'succeeded';
  }

  // Demo mode verification: Ensure paymentId was passed
  if (gateway === 'demo') {
    return Boolean(paymentId && paymentId.startsWith('demo_pay_'));
  }

  return false;
};

/**
 * Calculates refund eligibility based on hotel cancellation policy
 */
const calculateRefundAmount = (booking, hotel) => {
  const now = new Date();
  const checkIn = new Date(booking.checkInDate);
  const diffHours = (checkIn - now) / (1000 * 60 * 60);

  const policyDays = hotel.policies?.cancellationDays || 2;
  const policyHours = policyDays * 24;

  if (diffHours >= policyHours) {
    // Full refund minus minimal processing
    const refundPercent = (hotel.policies?.cancellationRefundPercent || 100) / 100;
    return Math.round(booking.pricing.totalAmount * refundPercent * 100) / 100;
  } else if (diffHours > 0) {
    // Late cancellation: 50% refund
    return Math.round(booking.pricing.totalAmount * 0.5 * 100) / 100;
  } else {
    // After check-in date: non-refundable
    return 0;
  }
};

module.exports = {
  createOrder,
  verifyPayment,
  calculateRefundAmount,
};
