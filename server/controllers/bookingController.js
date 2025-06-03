import Booking from "../models/Booking.js";
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import stripe from "stripe";

// Function to check availiblity of room
const checkAvailibilty = async ({ checkInDate, checkOutDate, room }) => {
  try {
    const booking = await Booking.find({
      room,
      checkInDate: { $lte: checkOutDate },
      checkOutDate: { $gte: checkInDate },
    });

    const isAvailible = booking.length === 0;
    return isAvailible;
  } catch (error) {
    console.error(error.message);
  }
};

// Api to check the availibity of room
export const checkAvailibiltyApi = async (req, res) => {
  try {
    const { room, checkInDate, checkOutDate } = req.body;
    const isAvailible = await checkAvailibilty({
      room,
      checkInDate,
      checkOutDate,
    });

    return res.json({ success: true, isAvailible });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Api to create a new booking
// Post /api/bookings/

export const createBooking = async (req, res) => {
  try {
    const { room, checkInDate, checkOutDate, guests } = req.body;
    console.log(req.body);
    const user = req.user._id;

    // Check availability
    const isAvailable = await checkAvailibilty({
      room,
      checkInDate,
      checkOutDate,
    });

    if (!isAvailable) {
      return res.json({ success: false, message: "Room is not available" });
    }

    // Find Room and Hotel data
    const roomData = await Room.findById(room).populate("hotel");
    if (!roomData) {
      return res.json({ success: false, message: "Room not found" });
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    if (isNaN(checkIn) || isNaN(checkOut) || checkOut <= checkIn) {
      return res.json({
        success: false,
        message: "Invalid check-in or check-out dates",
      });
    }

    // Calculate number of nights
    const timeDiff = checkOut.getTime() - checkIn.getTime();
    const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));

    // Calculate total price
    let totalPrice = roomData.pricePerNight * nights;

    // Create booking
    const booking = await Booking.create({
      user,
      room,
      hotel: roomData.hotel._id,
      guests: +guests,
      checkInDate,
      checkOutDate,
      totalPrice,
    });

    res.json({
      success: true,
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Api to get all booking a user

export const getBookingForUser = async (req, res) => {
  try {
    const user = req.user._id;

    const booking = await Booking.find({ user })
      .populate("room hotel")
      .sort({ createdAt: -1 });

    res.json({ success: true, booking });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Api to get all booking for a hotel owner

export const getHotelBooking = async (req, res) => {
  try {
    const hotel = await Hotel.findOne({ owner: req.auth.userId });
    if (!hotel) {
      res.json({ success: false, message: "Hotel Not found" });
    }
    const booking = await Booking.find({ hotel: hotel._id })
      .populate("user hotel room")
      .sort({ createdAt: -1 });
    // Total bookings
    const totalBooking = booking.length;
    // Total revenue
    const totalRevenue = booking.reduce(
      (acc, booking) => acc + booking.totalPrice,
      0
    );

    res.json({
      success: true,
      dashboardData: { totalBooking, totalRevenue, booking },
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const stripePayment = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findById(bookingId);
    const roomData = await Room.findById(booking.room).populate("hotel");
    const totalPrice = booking.totalPrice;
    const { origin } = req.headers;

    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

    const line_items = [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: roomData.hotel.name,
          },
          unit_amount: totalPrice * 100,
        },
        quantity: 1,
      },
    ];
    // Create checkout Session
    const session = await stripeInstance.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${origin}/loader/my-bookings`,
      cancel_url: `${origin}/loader/my-bookings`,
      metadata: {
        bookingId,
      },
    });
    res.json({ success: true, url: session.url });
  } catch (error) {
    res.json({ success: false, message: "Payment Failded" });
  }
};
