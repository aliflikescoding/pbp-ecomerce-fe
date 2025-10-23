import React from "react";
import HeroSection from "../Section/HeroSection";
import NewProduct from "../Section/NewProduct";
import WhyUs from "../Section/WhyUsSection";
import FaqSection from "../Section/FaqSection";

const HomePage = () => {
  return (
    <section className="min-h-screen bg-gray-50">
      <div className="space-y-16">
        <HeroSection />
        <NewProduct />
        <WhyUs />
        <FaqSection />
      </div>
    </section>
  );
};

export default HomePage;
