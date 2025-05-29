import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import { v2 as cloudinary } from "cloudinary";

// Function to add Room
export const createRoom = async (req, res) => {
  try {
    const { roomType, pricePerNight, amenities } = req.body;

    const hotel = await Hotel.findOne({ owner: req.auth.userId });
    if (!hotel) {
      return res.json({ success: false, message: "No Hotel found" });
    }

    const uploadImages = req.files.map(async (file) => {
      const responce = await cloudinary.uploader.upload(file.path);
      return responce.secure_url;
    });

    const images = await Promise.all(uploadImages);

    await Room.create({
      roomType,
      pricePerNight: +pricePerNight,
      amenities: JSON.parse(amenities),
      images,
      hotel: hotel._id,
    });

    return res.json({ success: true, message: "Room added" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Function to get all rooms
export const getRooms = async (req, res) => {
  try {
    const roomData = await Room.find({ isAvalible: true }).populate({
      path: "hotel",
      populate: {
        path: "owner",
        select: "image",
      },
    });
    console.log(roomData);
    res.json({ success: true, roomData });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Function to get all room for specific hotel
export const getOwnerRooms = async (req, res) => {
  try {
    const hotel = await Hotel.findOne({ owner: req.auth.userId });
    if (!hotel) {
      return res.json({ success: false, message: "No hotel found " });
    }
    const rooms = await Room.find({ hotel: hotel._id.toString() }).populate(
      "hotel"
    );
    res.json({ success: true, rooms });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Function to toggle room visibility

export const toggleRoomAvailibility = async (req, res) => {
  try {
    const { roomId } = req.body;

    const roomData = await Room.findById(roomId);
    roomData.isAvalible = !roomData.isAvalible;

    await roomData.save();
    res.json({ success: true, message: "Room updated" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
