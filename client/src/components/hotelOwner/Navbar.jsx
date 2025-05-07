import React from "react";
import { Link } from "react-router-dom";
import { assets } from "../../assets/assets";
import { UserButton } from "@clerk/clerk-react";

const Navbar = () => {
  return (
    <div className="flex justify-between items-center px-4 py-3 border-gray-300 md:px-8 border-b bg-white transition-all duration-300">
      <Link to={"/"}>
        <img className="h-9 opacity-80 invert" src={assets.logo} alt="logo" />
      </Link>
      <UserButton />
    </div>
  );
};

export default Navbar;
