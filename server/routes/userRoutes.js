import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getUserData,
  storeUserSearchCities,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/", protect, getUserData);
userRouter.post("/store-recent-search", protect, storeUserSearchCities);

export default userRouter;
