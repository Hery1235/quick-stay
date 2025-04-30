import React from "react";
import Hero from "../components/Hero";
import FeatureDestinations from "../components/FeatureDestinations";
import Title from "../components/Title";
import ExclusiveOffers from "../components/ExclusiveOffers";

const Home = () => {
  return (
    <div>
      <Hero />
      <Title />
      <FeatureDestinations />
      <ExclusiveOffers />
    </div>
  );
};

export default Home;
