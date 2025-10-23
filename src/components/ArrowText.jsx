import React from "react";
import { NavLink } from "react-router-dom";
import { FaArrowRightLong } from "react-icons/fa6";

const ArrowText = ({ text, link }) => {
  return (
    <NavLink
      className="text-base font-medium text-blue-600 flex items-center group transition-all ease-in-out"
      to={`${link}`}
    >
      <p className="relative group-hover:text-blue-700 transition-colors">
        {text}
        <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
      </p>
      <FaArrowRightLong className="ml-3 transition-all group-hover:ml-5 group-hover:text-blue-700" />
    </NavLink>
  );
};

export default ArrowText;
