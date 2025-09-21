import React from "react";
import { NavLink } from "react-router-dom";

const HeroSection = () => {
  return (
    <div
      className="hero min-h-screen"
      style={{
        backgroundImage: "url(/hero-image.png)",
      }}
    >
      <div className="hero-overlay"></div>
      <div className="hero-content text-neutral-content text-center">
        <div className="max-w-md">
          <h1 className="mb-5 text-5xl font-bold font-playfair">
            Where Elegance Meets Brilliance.
          </h1>
          <p className="mb-5">
            At Aurora & Co, we believe true luxury lies in the details. Our
            collections are designed to illuminate your individuality, blending
            timeless sophistication with modern artistry. Step into a world
            where every piece tells a story of elegance and refinement.
          </p>
          <div className="flex justify-center items-center gap-5">
            <NavLink to="/register">
              <button className="btn btn-primary">Register</button>
            </NavLink>
            <NavLink to="/shop">
              <button className="btn btn-accent">Shop Now</button>
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
