import React from "react";

const features = [
  {
    id: 1,
    title: "Curated Quality",
    text: "Selected premium materials and craftsmanship for lasting wear.",
    img: "/whyus/whyus-1.png",
  },
  {
    id: 2,
    title: "Thoughtful Design",
    text: "Elegance and function merged to create timeless pieces.",
    img: "/whyus/whyus-2.png",
  },
  {
    id: 3,
    title: "Sustainable Practices",
    text: "We prioritize responsible sourcing and reduced waste.",
    img: "/whyus/whyus-3.png",
  },
];

const WhyUs = () => {
  return (
    <section className="custom-container">
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-[2rem] px-8 py-12 shadow-[0_40px_120px_-70px_rgba(0,0,0,0.9)]">
        <div className="text-center text-neutral-content mb-12">
          <div className="inline-block mb-6">
            <div className="h-px w-10 bg-gradient-to-r from-transparent via-amber-400 to-transparent mb-4 mx-auto"></div>
            <span className="text-xs font-light tracking-[0.3em] text-amber-200 uppercase">
              Our Promise
            </span>
            <div className="h-px w-10 bg-gradient-to-r from-transparent via-amber-400 to-transparent mt-4 mx-auto"></div>
          </div>
          <h2 className="text-4xl sm:text-5xl font-light font-playfair">
            Why Choose Aurora &amp; Co
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature) => (
            <article
              key={feature.id}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg transition-all duration-500 hover:border-amber-300/50 hover:bg-white/10"
            >
              <div className="w-full h-56 overflow-hidden">
                <img
                  src={feature.img}
                  alt={feature.title}
                  className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              </div>
              <div className="p-6 relative z-10">
                <h3 className="text-xl font-light text-neutral-content mb-2 tracking-wide font-playfair">
                  {feature.title}
                </h3>
                <p className="text-sm text-neutral-content/70 leading-relaxed">
                  {feature.text}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
