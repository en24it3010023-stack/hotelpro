const Razorpay = require('razorpay');
const Stripe = require('stripe');

let razorpayClient = null;
let stripeClient = null;

const initializePayments = () => {
  const mode = process.env.PAYMENT_MODE || 'demo';

  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    try {
      razorpayClient = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      });
      console.log('[Payment] Razorpay client initialized successfully.');
    } catch (err) {
      console.warn('[Payment] Failed to initialize Razorpay:', err.message);
    }
  }

  if (process.env.STRIPE_SECRET_KEY) {
    try {
      stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2023-10-16',
      });
      console.log('[Payment] Stripe client initialized successfully.');
    } catch (err) {
      console.warn('[Payment] Failed to initialize Stripe:', err.message);
    }
  }

  console.log(`[Payment] Active Payment Mode: ${mode.toUpperCase()}`);
};

const getRazorpayClient = () => razorpayClient;
const getStripeClient = () => stripeClient;
const getPaymentMode = () => process.env.PAYMENT_MODE || 'demo';

module.exports = {
  initializePayments,
  getRazorpayClient,
  getStripeClient,
  getPaymentMode,
};
