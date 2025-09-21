import React from "react";

const WhyUs = () => {
  return (
    <div className="pb-12 custom-container">
      <h1 className="text-5xl font-bold font-playfair text-center mb-8">
        Why Choose Us?
      </h1>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Top large image spanning both columns */}
          <div className="col-span-2 w-full">
            <img src="/whyus/whyus-1.png" alt="Why Us 1" className="" />
          </div>

          <div className="grid grid-cols-2 col-span-2 gap-4">
            <div>
              <img src="/whyus/whyus-2.png" alt="Why Us 2" className="" />
            </div>
            <div>
              <img src="/whyus/whyus-3.png" alt="Why Us 3" className="" />
            </div>
          </div>
        </div>
        <p className="sm:max-w-[50%]">
          Choosing Aurora & Co means embracing more than just a purchase — it’s
          an investment in timeless elegance. Each creation is crafted with
          precision, care, and a passion for excellence. We blend modern
          sophistication with classic artistry, ensuring every piece reflects
          not only beauty but also lasting value. With us, luxury isn’t an
          option — it’s a standard.
        </p>
      </div>
    </div>
  );
};

export default WhyUs;
