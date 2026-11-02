require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const { connectDB, disconnectDB } = require('../config/db');

// Models
const User = require('../models/User');
const Hotel = require('../models/Hotel');
const RoomCategory = require('../models/RoomCategory');
const Room = require('../models/Room');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const Review = require('../models/Review');
const ServiceRequest = require('../models/ServiceRequest');
const Notification = require('../models/Notification');
const StaffAssignment = require('../models/StaffAssignment');
const AdminLog = require('../models/AdminLog');
const Invoice = require('../models/Invoice');
const logger = require('../utils/logger');

const seedData = async (shouldDisconnect = false) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      logger.info('Connecting to database for seeding...');
      await connectDB();
    }

    logger.info('Purging existing data...');
    await Promise.all([
      User.deleteMany({}),
      Hotel.deleteMany({}),
      RoomCategory.deleteMany({}),
      Room.deleteMany({}),
      Booking.deleteMany({}),
      Payment.deleteMany({}),
      Review.deleteMany({}),
      ServiceRequest.deleteMany({}),
      Notification.deleteMany({}),
      StaffAssignment.deleteMany({}),
      AdminLog.deleteMany({}),
      Invoice.deleteMany({}),
    ]);

    logger.info('Creating demo accounts for all roles...');
    // Create Users (all pass 'Password123!' or specific hashes)
    const adminUser = await User.create({
      name: 'Alexander Vance',
      email: 'admin@hotelpro.com',
      password: 'Admin@123',
      role: 'admin',
      phone: '+1 (555) 019-2834',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      isVerified: true,
    });

    const managerUser = await User.create({
      name: 'Elena Rostova',
      email: 'manager@hotelpro.com',
      password: 'Manager@123',
      role: 'manager',
      phone: '+1 (555) 028-4729',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      isVerified: true,
    });

    const staffUser = await User.create({
      name: 'Marcus Brody',
      email: 'staff@hotelpro.com',
      password: 'Staff@123',
      role: 'staff',
      phone: '+1 (555) 037-5821',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      isVerified: true,
    });

    const guestUser = await User.create({
      name: 'Sophia Montgomery',
      email: 'guest@hotelpro.com',
      password: 'Guest@123',
      role: 'guest',
      phone: '+1 (555) 091-7231',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
      isVerified: true,
    });

    const guestUser2 = await User.create({
      name: 'David Sterling',
      email: 'traveler@hotelpro.com',
      password: 'Guest@123',
      role: 'guest',
      phone: '+1 (555) 082-9473',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      isVerified: true,
    });

    logger.info('Creating 5 luxury flagship hotels...');

    // Hotel 1: Grand Azure Resort & Spa
    const hotel1 = await Hotel.create({
      name: 'The Grand Azure Resort & Spa',
      slug: 'the-grand-azure-resort-and-spa',
      tagline: 'Premier Oceanfront Sanctuary on Miami Beach',
      description:
        'Nestled directly along the pristine golden sands of South Beach, The Grand Azure Resort & Spa epitomizes modern coastal luxury. Featuring an expansive ocean-facing infinity pool, an award-winning Clarins wellness spa, Michelin-star dining, and private beachfront cabanas.',
      manager: managerUser._id,
      address: {
        street: '4401 Collins Avenue',
        city: 'Miami Beach',
        state: 'Florida',
        country: 'United States',
        zipCode: '33140',
        coordinates: { lat: 25.819, lng: -80.122 },
      },
      contact: {
        email: 'concierge@grandazure.hotelpro.com',
        phone: '+1 (305) 555-0199',
        website: 'https://hotelpro.com/hotels/grand-azure',
      },
      starRating: 5,
      startingPrice: 320,
      currency: 'USD',
      featured: true,
      status: 'active',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
          caption: 'Oceanfront Swimming Pool and Sun Loungers',
          isPrimary: true,
        },
        {
          url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
          caption: 'Presidential Oceanfront Suite Bedroom',
          isPrimary: false,
        },
        {
          url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
          caption: 'Sunset Over Azure Private Beach',
          isPrimary: false,
        },
        {
          url: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80',
          caption: 'Azure Lagoon Pool and Palm Terrace',
          isPrimary: false,
        },
      ],
      amenities: [
        'Free High-Speed WiFi',
        'Infinity Swimming Pool',
        'Private Ocean Beach Access',
        'Clarins Luxury Spa & Wellness',
        'Fine Dining Seafood Restaurant',
        '24/7 Concierge Service',
        'Valet Parking',
        'Fitness Center & Yoga Pavilion',
        'Airport Limousine Transfer',
        'Cocktail Bar & Sunset Lounge',
      ],
      policies: {
        checkInTime: '15:00',
        checkOutTime: '11:00',
        cancellationDays: 2,
        cancellationRefundPercent: 100,
        petPolicy: 'Luxury small pets welcome (under 25 lbs).',
        smokingPolicy: 'Strict non-smoking facility.',
      },
      ratingSummary: {
        averageRating: 4.9,
        totalReviews: 128,
        cleanliness: 5.0,
        service: 4.9,
        comfort: 4.9,
        location: 5.0,
        value: 4.8,
      },
    });

    // Assign hotel1 to manager & staff
    managerUser.assignedHotel = hotel1._id;
    await managerUser.save();
    staffUser.assignedHotel = hotel1._id;
    await staffUser.save();

    // Hotel 2: The Ritz Heritage Palace (Jaipur, India)
    const hotel2 = await Hotel.create({
      name: 'The Ritz Heritage Palace',
      slug: 'the-ritz-heritage-palace',
      tagline: 'Timeless Royal Grandeur in the Pink City',
      description:
        'A majestic 18th-century Rajput palace immaculately restored into a grand luxury sanctuary. Marvel at hand-carved jharokhas, peacock-adorned courtyards, opulent royal suites, traditional spa rituals, and regal dining under starry desert skies.',
      manager: managerUser._id,
      address: {
        street: 'Palace Road, Civil Lines',
        city: 'Jaipur',
        state: 'Rajasthan',
        country: 'India',
        zipCode: '302006',
        coordinates: { lat: 26.9124, lng: 75.7873 },
      },
      contact: {
        email: 'royal@ritzheritage.hotelpro.com',
        phone: '+91 141 555 4321',
        website: 'https://hotelpro.com/hotels/ritz-heritage',
      },
      starRating: 5,
      startingPrice: 240,
      currency: 'USD',
      featured: true,
      status: 'active',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
          caption: 'Grand Palace Facade and Mughal Gardens',
          isPrimary: true,
        },
        {
          url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
          caption: 'Royal Maharaja Bedroom with Four Poster Bed',
          isPrimary: false,
        },
        {
          url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80',
          caption: 'Palace Pool Courtyard at Twilight',
          isPrimary: false,
        },
      ],
      amenities: [
        'Free High-Speed WiFi',
        'Royal Marble Pool',
        'Ayurvedic Heritage Spa',
        'Regal Dining Hall',
        'Peacock Garden',
        '24/7 Butler Service',
        'Heritage Palace Walks',
        'Folk Music & Cultural Evenings',
        'Chauffeured Vintage Car Tours',
      ],
      policies: {
        checkInTime: '14:00',
        checkOutTime: '12:00',
        cancellationDays: 3,
        cancellationRefundPercent: 100,
        petPolicy: 'No pets permitted on heritage grounds.',
        smokingPolicy: 'Smoking designated in open royal lawns only.',
      },
      ratingSummary: {
        averageRating: 4.95,
        totalReviews: 215,
        cleanliness: 4.9,
        service: 5.0,
        comfort: 4.9,
        location: 4.9,
        value: 4.9,
      },
    });

    // Hotel 3: Skyline Metropolis Suites (New York)
    const hotel3 = await Hotel.create({
      name: 'Skyline Metropolis Suites',
      slug: 'skyline-metropolis-suites',
      tagline: 'Modern Architectural Marvel Overlooking Central Park',
      description:
        'Rising 60 stories above Midtown Manhattan, Skyline Metropolis Suites sets the benchmark for metropolitan elegance. Floor-to-ceiling panoramic glass walls frame breathtaking views of Central Park and the Manhattan skyline.',
      manager: managerUser._id,
      address: {
        street: '150 Central Park South',
        city: 'New York',
        state: 'New York',
        country: 'United States',
        zipCode: '10019',
        coordinates: { lat: 40.766, lng: -73.978 },
      },
      contact: {
        email: 'vip@skylinemetropolis.hotelpro.com',
        phone: '+1 (212) 555-8800',
        website: 'https://hotelpro.com/hotels/skyline-metropolis',
      },
      starRating: 5,
      startingPrice: 450,
      currency: 'USD',
      featured: true,
      status: 'active',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
          caption: 'Illuminated Manhattan Tower Architecture',
          isPrimary: true,
        },
        {
          url: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80',
          caption: 'Central Park View Penthouse Living Room',
          isPrimary: false,
        },
        {
          url: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80',
          caption: 'Floor-to-Ceiling Skyline Master Bedroom',
          isPrimary: false,
        },
      ],
      amenities: [
        'Free Ultra-Fast Fiber WiFi',
        'Rooftop Helipad & Sky Lounge',
        'Equinox Fitness & Spa Center',
        '2-Star Michelin Restaurant',
        'Dedicated Executive Concierge',
        'Valet EV Charging',
        'In-Room Bang & Olufsen Acoustics',
        'Business Executive Boardrooms',
      ],
      policies: {
        checkInTime: '15:00',
        checkOutTime: '12:00',
        cancellationDays: 1,
        cancellationRefundPercent: 100,
        petPolicy: 'Pet friendly with custom canine concierge amenities.',
        smokingPolicy: '100% Smoke-free environment.',
      },
      ratingSummary: {
        averageRating: 4.85,
        totalReviews: 94,
        cleanliness: 4.9,
        service: 4.8,
        comfort: 4.9,
        location: 5.0,
        value: 4.6,
      },
    });

    // Hotel 4: Serene Oasis Overwater Villas (Bora Bora)
    const hotel4 = await Hotel.create({
      name: 'Serene Oasis Overwater Villas',
      slug: 'serene-oasis-overwater-villas',
      tagline: 'Overwater Paradise Above Crystal Turquoise Lagoons',
      description:
        'Floating atop the crystalline turquoise waters of Mount Otemanu lagoon, Serene Oasis offers the ultimate romantic getaway. Each overwater villa features glass floor viewing panels, private infinity plunge pools, and direct ocean ladder access.',
      manager: managerUser._id,
      address: {
        street: 'Motu Piti Aau',
        city: 'Bora Bora',
        state: 'Leeward Islands',
        country: 'French Polynesia',
        zipCode: '98730',
        coordinates: { lat: -16.5004, lng: -151.7415 },
      },
      contact: {
        email: 'paradise@sereneoasis.hotelpro.com',
        phone: '+689 40 555 123',
        website: 'https://hotelpro.com/hotels/serene-oasis',
      },
      starRating: 5,
      startingPrice: 650,
      currency: 'USD',
      featured: true,
      status: 'active',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
          caption: 'Overwater Bungalows Along Turquoise Lagoon',
          isPrimary: true,
        },
        {
          url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
          caption: 'Lagoon Plunge Pool and Sun Terrace',
          isPrimary: false,
        },
        {
          url: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80',
          caption: 'Waterfront Sunset Suite with Canopy Bed',
          isPrimary: false,
        },
      ],
      amenities: [
        'Free WiFi throughout resort',
        'Private Lagoon Plunge Pool',
        'Glass Floor Reef Viewing Panels',
        'Canoe Breakfast Delivery',
        'Deep Ocean Polynesian Spa',
        'Scuba & Snorkeling Equipment',
        'Sunset Catamaran Cruises',
        'Private Island Dining',
      ],
      policies: {
        checkInTime: '14:00',
        checkOutTime: '11:00',
        cancellationDays: 7,
        cancellationRefundPercent: 90,
        petPolicy: 'No pets allowed to preserve lagoon marine reserve.',
        smokingPolicy: 'Non-smoking bungalows.',
      },
      ratingSummary: {
        averageRating: 4.98,
        totalReviews: 310,
        cleanliness: 5.0,
        service: 5.0,
        comfort: 5.0,
        location: 5.0,
        value: 4.8,
      },
    });

    // Hotel 5: Alpine Vista Mountain Lodge (Zermatt, Switzerland)
    const hotel5 = await Hotel.create({
      name: 'Alpine Vista Mountain Lodge',
      slug: 'alpine-vista-mountain-lodge',
      tagline: 'Ski-in Chalet Elegance Facing the Matterhorn',
      description:
        'Perched on the sunny slopes above Zermatt, Alpine Vista Mountain Lodge seamlessly blends Swiss alpine tradition with contemporary luxury. Enjoy wood-burning stone fireplaces, heated cedarwood outdoor hot tubs, and direct ski-in/ski-out access.',
      manager: managerUser._id,
      address: {
        street: 'Riedweg 45',
        city: 'Zermatt',
        state: 'Valais',
        country: 'Switzerland',
        zipCode: '3920',
        coordinates: { lat: 45.9765, lng: 7.7491 },
      },
      contact: {
        email: 'chalet@alpinevista.hotelpro.com',
        phone: '+41 27 555 7890',
        website: 'https://hotelpro.com/hotels/alpine-vista',
      },
      starRating: 5,
      startingPrice: 380,
      currency: 'USD',
      featured: false,
      status: 'active',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=1200&q=80',
          caption: 'Snowcapped Alps and Warm Timber Chalet',
          isPrimary: true,
        },
        {
          url: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=1200&q=80',
          caption: 'Alpine Suite with Stone Fireplace',
          isPrimary: false,
        },
      ],
      amenities: [
        'Free High-Speed WiFi',
        'Direct Ski-in / Ski-out Access',
        'Heated Outdoor Panoramic Hot Tub',
        'Finnish Pine Sauna & Steam Room',
        'Alpine Gourmet Fondue Stübli',
        'Ski & Snowboard Equipment Concierge',
        'Complimentary Electric Village Taxi',
      ],
      policies: {
        checkInTime: '15:00',
        checkOutTime: '11:00',
        cancellationDays: 5,
        cancellationRefundPercent: 100,
        petPolicy: 'Well-trained mountain dogs welcome.',
        smokingPolicy: 'Non-smoking indoor chalets.',
      },
      ratingSummary: {
        averageRating: 4.88,
        totalReviews: 87,
        cleanliness: 4.9,
        service: 4.9,
        comfort: 4.9,
        location: 4.9,
        value: 4.7,
      },
    });

    logger.info('Creating Room Categories & Inventory for Hotels...');

    // Categories for Hotel 1 (Grand Azure)
    const cat1_1 = await RoomCategory.create({
      hotel: hotel1._id,
      name: 'Deluxe Oceanfront Suite',
      slug: 'deluxe-oceanfront-suite',
      description:
        'Spacious suite with floor-to-ceiling glass doors opening onto an oversized private balcony overlooking the Atlantic Ocean. Furnished with Italian marble and bespoke teak.',
      basePrice: 320,
      weekendPrice: 380,
      maxGuests: { adults: 2, children: 1 },
      bedType: '1 King Bed',
      roomSizeSqFt: 580,
      view: 'Direct Panoramic Ocean View',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
          caption: 'Deluxe Suite King Bed',
        },
        {
          url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
          caption: 'Marble Bathroom with Soaking Tub',
        },
      ],
      amenities: [
        'Private Ocean Balcony',
        'Deep Soaking Marble Bathtub',
        'Nespresso Espresso Machine',
        'Smart 65" OLED TV',
        'Plush Bathrobes & Slippers',
        'Stocked Gourmet Minibar',
      ],
      features: ['Soundproof Windows', 'High Floor', 'Walk-in Closet'],
      totalRoomsCount: 6,
    });

    const cat1_2 = await RoomCategory.create({
      hotel: hotel1._id,
      name: 'Presidential Penthouse Villa',
      slug: 'presidential-penthouse-villa',
      description:
        'The pinnacle of South Beach grandeur. Two-story penthouse suite with private rooftop terrace, infinity plunge pool, personal butler service, and 360-degree ocean views.',
      basePrice: 750,
      weekendPrice: 890,
      maxGuests: { adults: 4, children: 2 },
      bedType: '2 King Beds + Living Quarters',
      roomSizeSqFt: 1850,
      view: '360° Ocean & Miami Skyline View',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80',
          caption: 'Presidential Master Suite',
        },
      ],
      amenities: [
        'Private Rooftop Plunge Pool',
        'Dedicated 24/7 Butler',
        'Sub-Zero Kitchen & Dining Salon',
        'Bang & Olufsen Sound System',
        'Rainforest Spa Shower & Jacuzzi',
      ],
      features: ['Private Elevator Access', 'Wine Cellar', 'Wraparound Terrace'],
      totalRoomsCount: 2,
    });

    // Categories for Hotel 2 (Ritz Heritage)
    const cat2_1 = await RoomCategory.create({
      hotel: hotel2._id,
      name: 'Royal Heritage Suite',
      slug: 'royal-heritage-suite',
      description:
        'Authentic royal quarters with original fresco ceilings, hand-woven silk tapestries, antique Rajasthani furnishings, and a marble jharokha overlooking the palace courtyard.',
      basePrice: 240,
      weekendPrice: 290,
      maxGuests: { adults: 2, children: 1 },
      bedType: '1 Royal Canopy King Bed',
      roomSizeSqFt: 620,
      view: 'Royal Peacock Courtyard View',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
          caption: 'Canopy Bed in Royal Suite',
        },
      ],
      amenities: [
        'Carved Stone Jharokha Balcony',
        'Deep Copper Soaking Tub',
        'Traditional Masala Tea Service',
        'Handmade Silk Robes',
      ],
      features: ['Heritage Architecture', 'Courtyard Garden Access'],
      totalRoomsCount: 5,
    });

    // Categories for Hotel 3 (Skyline Metropolis)
    const cat3_1 = await RoomCategory.create({
      hotel: hotel3._id,
      name: 'Executive Central Park King',
      slug: 'executive-central-park-king',
      description:
        'High-floor executive sanctuary featuring panoramic vistas of Central Park. Equipped with ergonomic Herman Miller workspace, motorized blackout shades, and deep soaking tub.',
      basePrice: 450,
      weekendPrice: 520,
      maxGuests: { adults: 2, children: 0 },
      bedType: '1 Custom Stearns & Foster King Bed',
      roomSizeSqFt: 520,
      view: 'Direct Central Park View',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80',
          caption: 'Park View Corner Suite',
        },
      ],
      amenities: [
        'Central Park Panorama',
        'Motorized Drapery & Mood Lighting',
        'Marble Bathroom with Heated Floors',
        'Nespresso Bar',
      ],
      features: ['High Speed Fiber', 'Smart Climate Control'],
      totalRoomsCount: 5,
    });

    // Categories for Hotel 4 (Serene Oasis Bora Bora)
    const cat4_1 = await RoomCategory.create({
      hotel: hotel4._id,
      name: 'Overwater Lagoon Villa with Plunge Pool',
      slug: 'overwater-lagoon-villa',
      description:
        'Iconic Polynesian thatched villa poised over the translucent turquoise lagoon. Step down private ladders directly into coral gardens or lounge on your sundeck catamaran net.',
      basePrice: 650,
      weekendPrice: 720,
      maxGuests: { adults: 2, children: 0 },
      bedType: '1 Polynesian Hardwood King Bed',
      roomSizeSqFt: 950,
      view: 'Mount Otemanu & Crystal Lagoon',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
          caption: 'Sundeck with Direct Lagoon Steps',
        },
      ],
      amenities: [
        'Private Infinity Plunge Pool',
        'Glass Floor Lagoon Viewing Window',
        'Overwater Catamaran Hammock Net',
        'Outdoor Rain Shower',
      ],
      features: ['Direct Snorkeling Access', 'Sunset Exposure'],
      totalRoomsCount: 4,
    });

    logger.info('Creating physical rooms with statuses...');

    // Rooms for Hotel 1
    const rooms1 = [
      { hotel: hotel1._id, category: cat1_1._id, roomNumber: '101', floor: 1, status: 'available', housekeepingStatus: 'clean' },
      { hotel: hotel1._id, category: cat1_1._id, roomNumber: '102', floor: 1, status: 'available', housekeepingStatus: 'clean' },
      { hotel: hotel1._id, category: cat1_1._id, roomNumber: '201', floor: 2, status: 'occupied', housekeepingStatus: 'clean' },
      { hotel: hotel1._id, category: cat1_1._id, roomNumber: '202', floor: 2, status: 'available', housekeepingStatus: 'dirty' },
      { hotel: hotel1._id, category: cat1_1._id, roomNumber: '301', floor: 3, status: 'available', housekeepingStatus: 'in_progress' },
      { hotel: hotel1._id, category: cat1_1._id, roomNumber: '302', floor: 3, status: 'maintenance', housekeepingStatus: 'clean' },
      { hotel: hotel1._id, category: cat1_2._id, roomNumber: 'PH-01', floor: 10, status: 'available', housekeepingStatus: 'clean' },
      { hotel: hotel1._id, category: cat1_2._id, roomNumber: 'PH-02', floor: 10, status: 'available', housekeepingStatus: 'clean' },
    ];
    const createdRooms = await Room.insertMany(rooms1);

    // Rooms for Hotel 2
    const rooms2 = [
      { hotel: hotel2._id, category: cat2_1._id, roomNumber: '101', floor: 1, status: 'available', housekeepingStatus: 'clean' },
      { hotel: hotel2._id, category: cat2_1._id, roomNumber: '102', floor: 1, status: 'available', housekeepingStatus: 'clean' },
      { hotel: hotel2._id, category: cat2_1._id, roomNumber: '201', floor: 2, status: 'occupied', housekeepingStatus: 'clean' },
    ];
    await Room.insertMany(rooms2);

    logger.info('Creating sample reservations, payments & invoices...');

    // Booking 1: Upcoming Confirmed booking for Sophia (Guest)
    const checkIn1 = new Date();
    checkIn1.setDate(checkIn1.getDate() + 5);
    const checkOut1 = new Date();
    checkOut1.setDate(checkOut1.getDate() + 8);

    const booking1 = await Booking.create({
      bookingReference: 'HP-902144-812',
      guest: guestUser._id,
      hotel: hotel1._id,
      roomCategory: cat1_1._id,
      assignedRoom: createdRooms[0]._id,
      checkInDate: checkIn1,
      checkOutDate: checkOut1,
      totalNights: 3,
      guestCount: { adults: 2, children: 0, rooms: 1 },
      guestDetails: {
        fullName: 'Sophia Montgomery',
        email: 'guest@hotelpro.com',
        phone: '+1 (555) 091-7231',
        specialRequests: 'High floor preferred, extra goose-down pillows.',
        estimatedArrivalTime: '14:30',
      },
      pricing: {
        basePrice: 320,
        nights: 3,
        roomTotal: 960,
        taxAmount: 115.2,
        serviceFee: 48,
        discountAmount: 96, // WELCOME10 applied
        promoCode: 'WELCOME10',
        totalAmount: 1027.2,
        currency: 'USD',
      },
      paymentStatus: 'paid',
      bookingStatus: 'Confirmed',
    });

    const payment1 = await Payment.create({
      transactionId: 'TXN-DEMO-94810284',
      booking: booking1._id,
      user: guestUser._id,
      gateway: 'demo',
      amount: 1027.2,
      currency: 'USD',
      status: 'completed',
      paymentMethod: 'card',
      cardLast4: '4242',
    });
    booking1.payment = payment1._id;
    await booking1.save();

    await Invoice.create({
      invoiceNumber: 'INV-2026-918234',
      booking: booking1._id,
      hotel: hotel1._id,
      user: guestUser._id,
      guestDetails: booking1.guestDetails,
      stayPeriod: { checkIn: checkIn1, checkOut: checkOut1, nights: 3 },
      roomCategoryName: cat1_1.name,
      lineItems: [
        {
          description: `${cat1_1.name} (3 Nights)`,
          quantity: 3,
          unitPrice: 320,
          total: 960,
        },
      ],
      subtotal: 960,
      taxAmount: 115.2,
      serviceFee: 48,
      discountAmount: 96,
      totalAmount: 1027.2,
      currency: 'USD',
      paymentStatus: 'paid',
    });

    // Booking 2: Active Checked-In Stay for David
    const checkIn2 = new Date();
    checkIn2.setDate(checkIn2.getDate() - 1);
    const checkOut2 = new Date();
    checkOut2.setDate(checkOut2.getDate() + 2);

    const booking2 = await Booking.create({
      bookingReference: 'HP-829141-551',
      guest: guestUser2._id,
      hotel: hotel1._id,
      roomCategory: cat1_1._id,
      assignedRoom: createdRooms[2]._id, // Room 201
      checkInDate: checkIn2,
      checkOutDate: checkOut2,
      totalNights: 3,
      guestCount: { adults: 2, children: 1, rooms: 1 },
      guestDetails: {
        fullName: 'David Sterling',
        email: 'traveler@hotelpro.com',
        phone: '+1 (555) 082-9473',
        specialRequests: 'Late checkout requested on departure day.',
      },
      pricing: {
        basePrice: 320,
        nights: 3,
        roomTotal: 960,
        taxAmount: 115.2,
        serviceFee: 48,
        discountAmount: 0,
        promoCode: '',
        totalAmount: 1123.2,
        currency: 'USD',
      },
      paymentStatus: 'paid',
      bookingStatus: 'Checked In',
    });

    // Link room 201 to currentBooking
    await Room.findByIdAndUpdate(createdRooms[2]._id, { currentBooking: booking2._id, status: 'occupied' });

    // Booking 3: Past Completed Stay for Sophia to have a Verified Stay Review
    const checkIn3 = new Date();
    checkIn3.setDate(checkIn3.getDate() - 14);
    const checkOut3 = new Date();
    checkOut3.setDate(checkOut3.getDate() - 11);

    const booking3 = await Booking.create({
      bookingReference: 'HP-718290-312',
      guest: guestUser._id,
      hotel: hotel1._id,
      roomCategory: cat1_1._id,
      checkInDate: checkIn3,
      checkOutDate: checkOut3,
      totalNights: 3,
      guestCount: { adults: 2, children: 0, rooms: 1 },
      guestDetails: {
        fullName: 'Sophia Montgomery',
        email: 'guest@hotelpro.com',
        phone: '+1 (555) 091-7231',
      },
      pricing: {
        basePrice: 320,
        nights: 3,
        roomTotal: 960,
        taxAmount: 115.2,
        serviceFee: 48,
        discountAmount: 0,
        totalAmount: 1123.2,
        currency: 'USD',
      },
      paymentStatus: 'paid',
      bookingStatus: 'Checked Out',
    });

    // Create Verified Review for Booking 3
    await Review.create({
      hotel: hotel1._id,
      booking: booking3._id,
      user: guestUser._id,
      rating: 5,
      subRatings: {
        cleanliness: 5,
        service: 5,
        comfort: 5,
        location: 5,
        value: 4.8,
      },
      title: 'Unrivaled Coastal Serenity and Sublime Hospitality',
      comment:
        'From the moment our limousine pulled up to The Grand Azure, every single detail exceeded our highest expectations. The oceanfront suite offered mesmerizing sunrises, the Clarins spa was heavenly, and the concierge secured us prime sunset dining effortlessly. Cannot wait to return!',
      roomCategoryName: cat1_1.name,
      verifiedStay: true,
      status: 'published',
      managerResponse: {
        responseText:
          'Dear Sophia, thank you tremendously for your gracious words. It was an absolute delight hosting you, and our entire concierge team looks forward to welcoming you back to your oceanfront home!',
        respondedAt: new Date(),
        respondedBy: managerUser._id,
      },
    });

    logger.info('Creating sample guest service requests & staff assignments...');

    await ServiceRequest.create({
      booking: booking2._id,
      hotel: hotel1._id,
      guest: guestUser2._id,
      roomNumber: '201',
      serviceType: 'room_service',
      title: 'Gourmet Breakfast in Bed for 2',
      description: 'Eggs Benedict with smoked salmon, fresh croissants, and two cappuccino roasts.',
      priority: 'high',
      status: 'in_progress',
      assignedStaff: staffUser._id,
    });

    await ServiceRequest.create({
      booking: booking2._id,
      hotel: hotel1._id,
      guest: guestUser2._id,
      roomNumber: '201',
      serviceType: 'housekeeping',
      title: 'Extra Egyptian Cotton Beach Towels',
      description: '4 oversized pool towels for afternoon cabana.',
      priority: 'medium',
      status: 'completed',
      assignedStaff: staffUser._id,
    });

    await StaffAssignment.create({
      hotel: hotel1._id,
      staff: staffUser._id,
      taskType: 'housekeeping',
      title: 'Deep Sanitization of Suite 202',
      description: 'Guest checked out this morning. Complete linen change and restock amenities.',
      targetRoom: createdRooms[3]._id,
      status: 'assigned',
      priority: 'high',
      assignedBy: managerUser._id,
    });

    await Notification.create({
      user: guestUser._id,
      title: 'Reservation Confirmed',
      message: `Your booking HP-902144-812 at The Grand Azure Resort is confirmed. Check-in on ${checkIn1.toLocaleDateString()}.`,
      type: 'booking',
      link: `/dashboard/guest/bookings/${booking1._id}`,
    });

    await AdminLog.create({
      actor: adminUser._id,
      action: 'SYSTEM_INITIALIZATION',
      resourceType: 'System',
      resourceId: 'INIT-01',
      details: {
        hotelsCount: 5,
        roomsCount: 11,
        usersCount: 5,
      },
    });

    logger.info('===========================================================');
    logger.info('🎉 HOTELPRO (ROOMLY) SEED COMPLETED SUCCESSFULLY!');
    logger.info('===========================================================');
    logger.info('Demo Logins Available:');
    logger.info('👑 Admin:        admin@hotelpro.com     / Admin@123');
    logger.info('👔 Hotel Manager: manager@hotelpro.com   / Manager@123');
    logger.info('🛎️ Staff Desk:    staff@hotelpro.com     / Staff@123');
    logger.info('🏖️ Guest:         guest@hotelpro.com     / Guest@123');
    logger.info('🎒 Guest 2:       traveler@hotelpro.com  / Guest@123');
    logger.info('===========================================================');

    if (require.main === module || shouldDisconnect) {
      await disconnectDB();
      if (require.main === module) {
        process.exit(0);
      }
    }
  } catch (err) {
    logger.error('Seeding error:', err);
    process.exit(1);
  }
};

if (require.main === module) {
  seedData();
}

module.exports = seedData;
