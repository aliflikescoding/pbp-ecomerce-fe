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
    <section className="py-12 custom-container">
      <h2 className="text-4xl sm:text-5xl font-playfair font-bold text-center mb-10">
        Why Choose Aurora & Co
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((f) => (
          <article key={f.id} className="bg-base-100 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="w-full h-52 overflow-hidden">
              <img src={f.img} alt={f.title} className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-105" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-neutral/80">{f.text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default WhyUs;
