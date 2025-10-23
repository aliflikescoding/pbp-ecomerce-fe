import React from "react";

const features = [
  {
    id: 1,
    title: "Quality Products",
    text: "Selected premium materials and craftsmanship for lasting wear.",
    img: "/whyus/whyus-1.png",
  },
  {
    id: 2,
    title: "Fast Shipping",
    text: "Quick and reliable delivery to your doorstep.",
    img: "/whyus/whyus-2.png",
  },
  {
    id: 3,
    title: "Easy Returns",
    text: "Hassle-free returns within 30 days of purchase.",
    img: "/whyus/whyus-3.png",
  },
];

const WhyUs = () => {
  return (
    <section className="custom-container py-16">
      <div className="bg-white rounded-2xl px-8 py-12 shadow-lg border border-gray-200">
        <div className="text-center mb-12">
          <div className="mb-4">
            <span className="text-sm font-medium tracking-wide text-blue-600 uppercase">
              Why Choose Us
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            What Makes Us Different
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature) => (
            <article
              key={feature.id}
              className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-300 hover:shadow-lg hover:border-blue-300"
            >
              <div className="w-full h-56 overflow-hidden">
                <img
                  src={feature.img}
                  alt={feature.title}
                  className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
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
