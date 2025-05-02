import React from "react";
import Navbar from "./components/navbar";
import { Route, Routes, useLocation } from "react-router-dom";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import FooterCopy from "./components/FooterCopy";

const App = () => {
  const isOwnerPath = useLocation().pathname.includes("owner");

  return (
    <div>
      {!isOwnerPath && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>

      <FooterCopy />
    </div>
  );
};

export default App;
