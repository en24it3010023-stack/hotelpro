import { describe, it, expect } from 'vitest';
import { calculateNights, validateDateRange } from '../utils/dateUtils.js';
import { calculateBookingPrices, PROMO_CODES } from '../utils/priceCalculator.js';
import { calculateRefundAmount } from '../services/paymentService.js';

describe('Date Utilities', () => {
  it('calculates nights correctly between two dates', () => {
    const nights = calculateNights('2026-12-01', '2026-12-05');
    expect(nights).toBe(4);
  });

  it('rejects checkout dates before or equal to checkin date', () => {
    const res = validateDateRange('2026-12-05', '2026-12-01');
    expect(res.valid).toBe(false);
  });

  it('validates a correct future date range', () => {
    const futureIn = new Date();
    futureIn.setDate(futureIn.getDate() + 10);
    const futureOut = new Date();
    futureOut.setDate(futureOut.getDate() + 15);

    const res = validateDateRange(futureIn, futureOut);
    expect(res.valid).toBe(true);
    expect(res.nights).toBe(5);
  });
});

describe('Pricing Calculator Engine', () => {
  it('accurately computes room total, taxes, and service fees without promo code', () => {
    const result = calculateBookingPrices({
      basePrice: 200,
      nights: 3,
      rooms: 1,
    });

    expect(result.roomTotal).toBe(600);
    expect(result.taxAmount).toBe(72); // 12% of 600
    expect(result.serviceFee).toBe(30); // 5% of 600
    expect(result.discountAmount).toBe(0);
    expect(result.totalAmount).toBe(702);
  });

  it('applies percentage promo code WELCOME10 (10% off room total)', () => {
    const result = calculateBookingPrices({
      basePrice: 200,
      nights: 2,
      rooms: 1,
      promoCode: 'WELCOME10',
    });

    expect(result.roomTotal).toBe(400);
    expect(result.discountAmount).toBe(40); // 10% of 400
    expect(result.taxAmount).toBe(48); // 12% of 400
    expect(result.serviceFee).toBe(20); // 5% of 400
    expect(result.totalAmount).toBe(428); // 400 + 48 + 20 - 40
  });

  it('applies summer special promo SUMMER25 (25% off room total)', () => {
    const result = calculateBookingPrices({
      basePrice: 1000,
      nights: 1,
      rooms: 1,
      promoCode: 'SUMMER25',
    });

    expect(result.discountAmount).toBe(250);
  });
});

describe('Cancellation and Refund Rules Engine', () => {
  it('awards full refund when cancelled well before policy threshold', () => {
    const checkInDate = new Date();
    checkInDate.setDate(checkInDate.getDate() + 10); // 10 days out

    const booking = {
      checkInDate,
      pricing: { totalAmount: 500 },
    };

    const hotel = {
      policies: {
        cancellationDays: 2,
        cancellationRefundPercent: 100,
      },
    };

    const refund = calculateRefundAmount(booking, hotel);
    expect(refund).toBe(500);
  });

  it('awards 50% partial refund when cancelled within late notice window', () => {
    const checkInDate = new Date();
    checkInDate.setHours(checkInDate.getHours() + 12); // Only 12 hours out (less than 2 days)

    const booking = {
      checkInDate,
      pricing: { totalAmount: 400 },
    };

    const hotel = {
      policies: {
        cancellationDays: 2,
        cancellationRefundPercent: 100,
      },
    };

    const refund = calculateRefundAmount(booking, hotel);
    expect(refund).toBe(200);
  });
});
