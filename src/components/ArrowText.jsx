import React from "react";
import { NavLink } from "react-router-dom";
import { FaArrowRightLong } from "react-icons/fa6";

const ArrowText = ({ text, link }) => {
  return (
    <NavLink
      className="text-lg capitalize font-light text-amber-100 flex items-center group transition-all ease-in-out tracking-[0.15em]"
      to={`${link}`}
    >
      <p className="relative group-hover:text-amber-50 transition-colors">
        {text}
        <span className="absolute left-0 bottom-0 w-0 h-px bg-amber-200 transition-all duration-300 group-hover:w-full"></span>
      </p>
      <FaArrowRightLong className="ml-3 transition-all group-hover:ml-5 group-hover:text-amber-50" />
    </NavLink>
  );
};

export default ArrowText;
