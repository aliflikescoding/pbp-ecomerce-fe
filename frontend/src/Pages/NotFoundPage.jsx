import React from "react";
import { NavLink } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-4">
        <img src="logo-vertical.svg" alt="logo" />
        <h1 className="text-2xl">
          This page is not found go back to{" "}
          <NavLink className={`link link-accent capitalize`} to="/">home screen</NavLink>
        </h1>
        <NavLink className={`btn btn-xl btn-accent`} to="/">Home</NavLink>
      </div>
    </div>
  );
};

export default NotFoundPage;
