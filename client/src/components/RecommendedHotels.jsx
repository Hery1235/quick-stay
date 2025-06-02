import React, { useEffect, useState } from "react";
import { roomsDummyData } from "../assets/assets";
import HotelCard from "./HotelCard";
import Title from "./Title";
import { useAppContext } from "../context/AppContext";

const RecommendedHotels = () => {
  const { navigate, allRooms, searchCities } = useAppContext();

  const [recommended, setRecommended] = useState([]);

  const filterHotels = async () => {
    console.log(searchCities);
    const filteredHotels = allRooms
      .slice()
      .filter((room) => searchCities.includes(room.hotel.city));
    setRecommended(filteredHotels);
  };
  useEffect(() => {
    filterHotels();
  }, [allRooms, searchCities]);
  return (
    recommended.length > 0 && (
      <div className="flex flex-col items-center px-6 md:px-16 lg:px-24 bg-slate-50 py-20">
        <Title
          title="Recommended Hotels "
          subtitle="Discover our handpicked selection of exceptional properties around the world, offering unparalleled luxury and unforgettable experiences."
        />

        <div className="flex flex-wrap items-center justify-center gap-6 mt-20">
          {allRooms.slice(0, 4).map((room, index) => (
            <HotelCard key={room._id} room={room} index={index} />
          ))}
        </div>

        <button
          onClick={() => {
            navigate("/rooms");
            scrollTo(0, 0);
          }}
          className="my-16 border px-4 py-2 font-medium border-grey-300 rounded bg-white hover:bg-gray-50 text-sm transition-all cursor-pointer"
        >
          View All Destinations
        </button>
      </div>
    )
  );
};

export default RecommendedHotels;
