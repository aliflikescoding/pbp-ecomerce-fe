import React from "react";
import HeroSection from "../Section/HeroSection";
import NewProduct from "../Section/NewProduct";
import WhyUs from "../Section/WhyUsSection";
import FaqSection from "../Section/FaqSection";

const HomePage = () => {
  return (
    <>
      <HeroSection />
      <NewProduct />
      <WhyUs />
      <FaqSection />
    </>
  );
};

export default HomePage;
