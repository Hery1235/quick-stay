import React from "react";
import Navbar from "./components/navbar";
import { useLocation } from "react-router-dom";
import Hero from "./components/Hero";

const App = () => {
  const isOwnerPath = useLocation().pathname.includes("owner");

  return <div>{!isOwnerPath && <Navbar />}</div>;
};

export default App;
