import React from "react";
import Hero from "../components/Hero";
import FeatureDestinations from "../components/FeatureDestinations";
import Title from "../components/Title";
import ExclusiveOffers from "../components/ExclusiveOffers";
import Testomonial from "../components/Testomonial";
import NewsLetter from "../components/NewsLetter";
import RecommendedHotels from "../components/RecommendedHotels";

const Home = () => {
  return (
    <div>
      <Hero />
      <Title />
      <RecommendedHotels />
      <FeatureDestinations />
      <ExclusiveOffers />
      <Testomonial />
      <NewsLetter />
    </div>
  );
};

export default Home;
