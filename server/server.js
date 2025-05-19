import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import { clerkMiddleware } from "@clerk/express";
import { clerkClient, requireAuth, getAuth } from "@clerk/express";
import clerkWebHooks from "./controllers/clerkWebhooks.js";
const PORT = process.env.PORT || 3000;
// Database connection
connectDB();
const app = express();
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());
// Api to listen clerk web hooks
app.use("/api/clerk", clerkWebHooks);
app.get("/", (req, res) => {
  res.send("The backennd is workiong ginddde ");
});
// app.get("/protected", requireAuth(), async (req, res) => {
//   // Use `getAuth()` to get the user's `userId`
//   const { userId } = getAuth(req);

//   // Use Clerk's JavaScript Backend SDK to get the user's User object
//   const user = await clerkClient.users.getUser(userId);

//   return res.json({ user });
// });
app.listen(PORT, () => {
  console.log(`App is runndding on ${PORT}`);
});
