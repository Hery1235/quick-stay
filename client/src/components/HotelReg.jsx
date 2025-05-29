import React, { useState } from "react";
import { assets, cities } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const HotelReg = () => {
  const { setShowHotelReg, axios, getToken, setIsOwner } = useAppContext();
  const [hotelData, setHotelData] = useState({
    name: "",
    address: "",
    contact: "",
    city: "Dubai",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHotelData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axios.post("/api/hotels", hotelData, {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      if (data.success) {
        toast.success("Hotel Registered Successfully");
        setIsOwner(true);
        setShowHotelReg(false);
      } else {
        toast.error("Not registered");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div
      onClick={() => setShowHotelReg(false)}
      className="fixed top-0 bottom-0 left-0 right-0 z-100 flex items-center justify-center bg-black/70"
    >
      <form
        onSubmit={onSubmitHandler}
        onClick={(e) => e.stopPropagation()}
        className="flex bg-white rounded-xl max-w-4xl max-md:mx-2"
      >
        <img
          className="w-1/2 rounded-xl hidden md:block transition-all duration-500"
          src={assets.regImage}
          alt="reg-image"
        />
        <div className="relative flex flex-col items-center md:w-1/2 p-8 md:p-10 ">
          <img
            onClick={() => {
              setShowHotelReg(false);
            }}
            className="absolute top-4 right-4 h-4 w-4 cursor-pointer"
            src={assets.closeIcon}
            alt="close-icon"
          />
          <p className="text-2xl font-semibold mt-6">Register Your Hotel</p>
          {/*Hotel Name */}
          <div className="w-full mt-4">
            <label className="font-medium text-gray-500" htmlFor="name">
              Hotel Name
            </label>
            <input
              onChange={handleChange}
              name="name"
              value={hotelData.name}
              id="name"
              className="border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light"
              required
              type="text"
              placeholder="Type Here"
            />
          </div>
          {/*Phone */}
          <div className="w-full mt-4">
            <label className="font-medium text-gray-500" htmlFor="contact">
              Phone
            </label>
            <input
              onChange={handleChange}
              name="contact"
              value={hotelData.contact}
              id="contact"
              className="border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light"
              required
              type="text"
              placeholder="Type Here"
            />
          </div>
          {/*Adress */}
          <div className="w-full mt-4">
            <label className="font-medium text-gray-500" htmlFor="address">
              Address
            </label>
            <input
              onChange={handleChange}
              name="address"
              value={hotelData.address}
              id="address"
              className="border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light"
              required
              type="text"
              placeholder="Type Here"
            />
          </div>
          {/*Select City drop down menu  */}
          <div className="w-full mt-4 max-w-60 mr-auto">
            <label className="font-medium text-gray-500" htmlFor="city">
              City
            </label>
            <select
              className="border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light"
              required
              value={hotelData.city}
              name="city"
              onChange={handleChange}
              id="city"
            >
              <option value="">Select City</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
          <button className="bg-indigo-500 hover:bg-indigo-600 transition-all text-white mr-auto px-6 py-2 rounded cursor-pointer mt-6">
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default HotelReg;
