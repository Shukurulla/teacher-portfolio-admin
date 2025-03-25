import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header className=" py-3 shadow-md mx-auto ">
      <div className="w-[90%] mx-auto flex items-center justify-between">
        <div className="logo">
          <Link to={"/"} className="text-[25px] font-bold hover:text-black">
            Teacher<span className="text-[#6366F1]">Portfolio</span>
          </Link>
        </div>
        <div className="user text-[17px] font-semibold items-center cursor-pointer flex gap-2">
          Admin
        </div>
      </div>
    </header>
  );
};

export default Navbar;
