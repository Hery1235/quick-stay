import express from "express";
import {
  checkAvailibiltyApi,
  createBooking,
  getBookingForUser,
  getHotelBooking,
} from "../controllers/bookingController.js";
import { protect } from "../middleware/authMiddleware.js";

const bookingRouter = express.Router();

bookingRouter.post("/check-availibility", checkAvailibiltyApi);
bookingRouter.post("/book", protect, createBooking);
bookingRouter.get("/user", protect, getBookingForUser);
bookingRouter.get("/hotel", protect, getHotelBooking);

export default bookingRouter;
