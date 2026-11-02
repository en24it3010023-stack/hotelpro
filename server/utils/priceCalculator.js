const PROMO_CODES = {
  WELCOME10: { type: 'percent', value: 10, description: '10% New Guest Welcome Discount' },
  SUMMER25: { type: 'percent', value: 25, description: '25% Luxury Summer Getaway Special' },
  WEEKEND15: { type: 'percent', value: 15, description: '15% Weekend Escape' },
  HONEYMOON: { type: 'percent', value: 20, description: '20% Honeymoon Romance Package' },
  HOTELPRO50: { type: 'fixed', value: 50, description: '$50 Instant HotelPro Credit' },
};

const calculateBookingPrices = ({
  basePrice,
  nights,
  rooms = 1,
  promoCode = '',
}) => {
  const roomTotal = Math.round(basePrice * nights * rooms * 100) / 100;

  // 12% Hospitality Tax & Local City Surcharge
  const taxAmount = Math.round(roomTotal * 0.12 * 100) / 100;

  // 5% Concierge & Maintenance Service Fee
  const serviceFee = Math.round(roomTotal * 0.05 * 100) / 100;

  let discountAmount = 0;
  let validatedPromo = null;

  if (promoCode && typeof promoCode === 'string') {
    const cleanCode = promoCode.trim().toUpperCase();
    if (PROMO_CODES[cleanCode]) {
      const promo = PROMO_CODES[cleanCode];
      validatedPromo = { code: cleanCode, ...promo };
      if (promo.type === 'percent') {
        discountAmount = Math.round((roomTotal * (promo.value / 100)) * 100) / 100;
      } else if (promo.type === 'fixed') {
        discountAmount = Math.min(roomTotal, promo.value);
      }
    }
  }

  const totalAmount = Math.max(0, Math.round((roomTotal + taxAmount + serviceFee - discountAmount) * 100) / 100);

  return {
    basePrice,
    nights,
    rooms,
    roomTotal,
    taxAmount,
    serviceFee,
    discountAmount,
    promoCode: validatedPromo ? validatedPromo.code : '',
    totalAmount,
    currency: 'USD',
  };
};

module.exports = {
  PROMO_CODES,
  calculateBookingPrices,
};
