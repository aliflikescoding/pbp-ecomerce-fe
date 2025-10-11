import React from "react";
import { NavLink } from "react-router-dom";
import { FaArrowRightLong } from "react-icons/fa6";

const ArrowText = ({ text, link }) => {
  return (
    <NavLink
      className="text-xl capitalize font-normal text-base-content flex items-center group transition-all ease-in-out"
      to={`${link}`}
    >
      <p className="relative group-hover:text-primary">
        {text}
        <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full"></span>
      </p>
      <FaArrowRightLong className="ml-2 transition-all group-hover:ml-4 group-hover:text-primary" />
    </NavLink>
  );
};

export default ArrowText;
