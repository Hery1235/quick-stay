import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import { clerkMiddleware } from "@clerk/express";
import { clerkClient, requireAuth, getAuth } from "@clerk/express";
import clerkWebHooks from "./controllers/clerkWebhooks.js";
import userRouter from "./routes/userRoutes.js";
import hotelRouter from "./routes/hotelRoutes.js";
import connectCloudinary from "./configs/coudinary.js";
import roomRouter from "./routes/roomRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import { stripeWebHooks } from "./controllers/stripeWebHooks.js";
const PORT = process.env.PORT || 3000;
// Database connection
connectDB();
// Connect to Cloudinary
connectCloudinary();
const app = express();
app.use(cors());

//Api to listen to stripe webhooks
app.post(
  "/api/webhook",
  express.raw({ type: "application/json" }),
  stripeWebHooks
);
app.use(express.json());
app.use(clerkMiddleware());

// Api to listen clerk web hooks
app.use("/api/clerk", clerkWebHooks);
app.get("/", (req, res) => {
  res.send("Api is working");
});
// Api to get user hooks
app.use("/api/user", userRouter);
// Api to get Hotel hooks
app.use("/api/hotels", hotelRouter);
// Api to get Room hooks
app.use("/api/rooms", roomRouter);

// Api to get bookings hooks
app.use("/api/bookings", bookingRouter);

app.listen(PORT, () => {
  console.log(`App is runndding on ${PORT}`);
});
