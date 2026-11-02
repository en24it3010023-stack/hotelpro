const Invoice = require('../models/Invoice');
const logger = require('../utils/logger');

const generateInvoiceForBooking = async (booking, hotel, user) => {
  try {
    const existing = await Invoice.findOne({ booking: booking._id });
    if (existing) return existing;

    const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

    const invoice = await Invoice.create({
      invoiceNumber,
      booking: booking._id,
      hotel: hotel._id,
      user: user._id,
      guestDetails: {
        fullName: booking.guestDetails.fullName || user.name,
        email: booking.guestDetails.email || user.email,
        phone: booking.guestDetails.phone || user.phone,
      },
      stayPeriod: {
        checkIn: booking.checkInDate,
        checkOut: booking.checkOutDate,
        nights: booking.totalNights,
      },
      roomCategoryName: booking.roomCategory?.name || 'Luxury Room',
      lineItems: [
        {
          description: `${booking.roomCategory?.name || 'Room Stay'} (${booking.totalNights} Nights)`,
          quantity: booking.totalNights,
          unitPrice: booking.pricing.basePrice,
          total: booking.pricing.roomTotal,
        },
      ],
      subtotal: booking.pricing.roomTotal,
      taxAmount: booking.pricing.taxAmount,
      serviceFee: booking.pricing.serviceFee,
      discountAmount: booking.pricing.discountAmount,
      totalAmount: booking.pricing.totalAmount,
      currency: booking.pricing.currency || 'USD',
      paymentStatus: booking.paymentStatus === 'paid' ? 'paid' : 'pending',
      issuedAt: new Date(),
    });

    booking.invoiceNumber = invoiceNumber;
    await booking.save();

    logger.info(`[Invoice Generated] Number: ${invoiceNumber} for Booking: ${booking.bookingReference}`);
    return invoice;
  } catch (err) {
    logger.error(`[Invoice Error] Failed to generate invoice: ${err.message}`);
    return null;
  }
};

module.exports = {
  generateInvoiceForBooking,
};
