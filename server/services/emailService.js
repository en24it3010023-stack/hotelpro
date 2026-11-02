const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

let transporter = null;

const getTransporter = async () => {
  if (transporter) return transporter;

  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
      port: parseInt(process.env.EMAIL_PORT, 10) || 587,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    return transporter;
  }

  // Safe fallback: Log to console in local development
  return null;
};

const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const mailer = await getTransporter();
    const from = process.env.EMAIL_FROM || 'HotelPro Luxury Stays <reservations@hotelpro.com>';

    if (!mailer) {
      logger.info(`[Email Service Simulation] -> To: ${to} | Subject: "${subject}"`);
      logger.info(`[Email Content Preview] -> ${text || html.replace(/<[^>]*>?/gm, '').slice(0, 150)}...`);
      return { success: true, simulated: true };
    }

    const info = await mailer.sendMail({
      from,
      to,
      subject,
      text: text || '',
      html,
    });

    logger.info(`[Email Sent] MessageId: ${info.messageId} to ${to}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    logger.warn(`[Email Failed] Could not send to ${to}: ${error.message}`);
    return { success: false, error: error.message };
  }
};

const sendBookingConfirmation = async (booking, user, hotel) => {
  const subject = `Booking Confirmed: ${booking.bookingReference} at ${hotel.name}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
      <div style="background: #0f172a; color: #d4af37; padding: 24px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">HOTELPRO</h1>
        <p style="margin: 4px 0 0; color: #94a3b8; font-size: 13px;">Sanctuary of Refinement & Hospitality</p>
      </div>
      <div style="padding: 24px;">
        <h2 style="color: #0f172a; margin-top: 0;">Reservation Confirmed!</h2>
        <p>Dear <strong>${user.name}</strong>,</p>
        <p>Thank you for choosing <strong>${hotel.name}</strong>. Your luxury stay has been confirmed with reference <strong>${booking.bookingReference}</strong>.</p>
        
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px; margin: 20px 0;">
          <p style="margin: 4px 0;"><strong>Hotel:</strong> ${hotel.name}</p>
          <p style="margin: 4px 0;"><strong>Address:</strong> ${hotel.address.street}, ${hotel.address.city}, ${hotel.address.country}</p>
          <p style="margin: 4px 0;"><strong>Check-In:</strong> ${new Date(booking.checkInDate).toLocaleDateString()}</p>
          <p style="margin: 4px 0;"><strong>Check-Out:</strong> ${new Date(booking.checkOutDate).toLocaleDateString()}</p>
          <p style="margin: 4px 0;"><strong>Total Nights:</strong> ${booking.totalNights}</p>
          <p style="margin: 4px 0;"><strong>Total Paid:</strong> $${booking.pricing.totalAmount.toFixed(2)} USD</p>
        </div>

        <p>You can view your full itinerary and access mobile check-in anytime on your Guest Dashboard.</p>
        <p style="margin-top: 24px;">Warm regards,<br><strong>${hotel.name} Guest Relations</strong></p>
      </div>
    </div>
  `;
  return sendEmail({ to: user.email, subject, html });
};

const sendCancellationNotice = async (booking, user, hotel) => {
  const subject = `Booking Cancellation: ${booking.bookingReference}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2>Reservation Cancelled</h2>
      <p>Dear ${user.name},</p>
      <p>Your reservation <strong>${booking.bookingReference}</strong> for <strong>${hotel.name}</strong> has been cancelled.</p>
      ${booking.refundAmount > 0 ? `<p>Refund amount of $${booking.refundAmount.toFixed(2)} has been queued to your original payment method.</p>` : ''}
      <p>We hope to welcome you again soon.</p>
    </div>
  `;
  return sendEmail({ to: user.email, subject, html });
};

const sendPasswordResetEmail = async (user, resetUrl) => {
  const subject = 'HotelPro Password Reset Request';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2>Reset Your HotelPro Password</h2>
      <p>Dear ${user.name},</p>
      <p>We received a request to reset your password. Click the link below to set a new password. This link is valid for 30 minutes.</p>
      <p><a href="${resetUrl}" style="background: #d4af37; color: #0f172a; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Reset Password</a></p>
      <p>If you did not request this, please ignore this email.</p>
    </div>
  `;
  return sendEmail({ to: user.email, subject, html });
};

module.exports = {
  sendEmail,
  sendBookingConfirmation,
  sendCancellationNotice,
  sendPasswordResetEmail,
};
