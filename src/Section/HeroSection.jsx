import React from "react";
import { NavLink } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative">
      <div className="custom-container py-24">
        <div className="max-w-4xl mx-auto text-center text-neutral-content">
          <div className="inline-block mb-6">
            <div className="h-px w-14 bg-gradient-to-r from-transparent via-amber-400 to-transparent mb-4 mx-auto"></div>
            <span className="text-xs font-light tracking-[0.35em] text-amber-200 uppercase">
              Welcome To Aurora &amp; Co
            </span>
            <div className="h-px w-14 bg-gradient-to-r from-transparent via-amber-400 to-transparent mt-4 mx-auto"></div>
          </div>
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-[2.5rem] px-10 py-16 shadow-[0_40px_120px_-60px_rgba(0,0,0,0.9)]">
            <h1 className="text-5xl md:text-6xl font-light font-playfair leading-tight mb-6">
              Where <span className="italic text-amber-200">Elegance</span>{" "}
              Meets <span className="italic text-amber-200">Brilliance</span>
            </h1>
            <p className="text-neutral-content/75 font-light text-lg leading-relaxed mb-10">
              At Aurora &amp; Co, luxury is felt in every detail. Discover
              collections crafted to illuminate your individuality, blending
              timeless sophistication with modern artistry for pieces that tell
              your story.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
              <NavLink
                to="/register"
                className="w-full sm:w-auto"
                aria-label="Register"
              >
                <span className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-3 text-sm uppercase tracking-[0.3em] font-light bg-amber-400/20 border border-amber-300/60 text-amber-100 hover:bg-amber-400/30 hover:border-amber-200/80 transition-all duration-500 rounded-full">
                  Register
                </span>
              </NavLink>
              <NavLink
                to="/store"
                className="w-full sm:w-auto"
                aria-label="Shop now"
              >
                <span className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-3 text-sm uppercase tracking-[0.3em] font-light bg-white/10 border border-white/20 text-neutral-content hover:bg-white/20 hover:border-amber-300/60 transition-all duration-500 rounded-full">
                  Shop Now
                </span>
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
