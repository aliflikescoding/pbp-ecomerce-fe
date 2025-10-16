import React from "react";
import HeroSection from "../Section/HeroSection";
import NewProduct from "../Section/NewProduct";
import WhyUs from "../Section/WhyUsSection";
import FaqSection from "../Section/FaqSection";

const HomePage = () => {
  return (
    <section
      className="relative min-h-screen py-20 overflow-hidden"
      style={{
        backgroundImage: "url(/hero-image.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-amber-950/80 to-slate-900/92"></div>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/5 w-[30rem] h-[30rem] bg-amber-600/18 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-6rem] left-1/4 w-[32rem] h-[32rem] bg-yellow-500/12 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 left-0 w-[20rem] h-[20rem] bg-white/5 rounded-full blur-3xl opacity-20"></div>
      </div>

      <div className="relative space-y-20">
        <HeroSection />
        <NewProduct />
        <WhyUs />
        <FaqSection />
      </div>
    </section>
  );
};

export default HomePage;
