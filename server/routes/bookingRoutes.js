import express from "express";
import {
  checkAvailibiltyApi,
  createBooking,
  getBookingForUser,
  getHotelBooking,
  stripePayment,
} from "../controllers/bookingController.js";
import { protect } from "../middleware/authMiddleware.js";

const bookingRouter = express.Router();

bookingRouter.post("/check-availibility", checkAvailibiltyApi);
bookingRouter.post("/book", protect, createBooking);
bookingRouter.get("/user", protect, getBookingForUser);
bookingRouter.get("/hotel", protect, getHotelBooking);
bookingRouter.post("/stripe-payment", protect, stripePayment);

export default bookingRouter;
