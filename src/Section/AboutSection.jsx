import React, { useState } from "react";

const TeamCard = ({ name, role, imgSrc, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`
        relative overflow-hidden bg-white border border-gray-200 rounded-xl
        transition-all duration-300
        ${isHovered ? 'border-blue-300 shadow-lg -translate-y-1' : 'shadow'}
      `}>
        {/* Image container */}
        <div className="relative h-80 overflow-hidden">
          <img
            src={imgSrc}
            alt={name}
            className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = "/hero-image.png";
            }}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent"></div>
        </div>

        {/* Content */}
        <div className="relative p-6 bg-white">
          <h4 className="text-xl font-semibold text-gray-900 mb-2">
            {name}
          </h4>
          <p className="text-sm text-blue-600 font-medium uppercase">
            {role}
          </p>
        </div>
      </div>
    </div>
  );
};

const ValueCard = ({ icon, title, description }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`
        bg-white border border-gray-200 rounded-xl p-6
        transition-all duration-300
        ${isHovered ? 'border-blue-300 shadow-lg -translate-y-1' : 'shadow'}
      `}>
        <div className={`
          text-4xl mb-4 transition-transform duration-300
          ${isHovered ? 'scale-110' : 'scale-100'}
        `}>
          {icon}
        </div>
        <h4 className="text-xl font-semibold text-gray-900 mb-3">
          {title}
        </h4>
        <p className="text-gray-600 text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};

const AboutSection = () => {
  const team = [
    { name: "Alif Putra Wibowo", 
      role: "Founder & Creative Director", 
      imgSrc: "/alip.jpeg" 
    },
    {
      name: "Favian Hanindito",
      role: "Head of Product",
      imgSrc: "/otid.jpeg",
    },
    {
      name: "Duta Adi",
      role: "Head of Marketing",
      imgSrc: "/duta.jpeg",
    },
    {
      name: "Diaz Cahyo Utomo",
      role: "Lead Engineer",
      imgSrc: "/dias.jpeg",
    },
  ];

  const values = [
    {
      icon: "✨",
      title: "Quality Products",
      description: "Every item is carefully selected and passes our quality standards. We only offer products that meet our high expectations.",
    },
    {
      icon: "💎",
      title: "Best Prices",
      description: "Competitive pricing with regular promotions and discounts. Get the best value for your money with us.",
    },
    {
      icon: "🌿",
      title: "Eco-Friendly",
      description: "We care about the environment. Our packaging is sustainable and we work with responsible suppliers.",
    },
    {
      icon: "🎨",
      title: "Wide Selection",
      description: "Browse through thousands of products across multiple categories. Find exactly what you're looking for.",
    },
  ];

  const milestones = [
    { year: "2020", event: "Store Founded" },
    { year: "2021", event: "Reached 10,000 Customers" },
    { year: "2023", event: "Expanded Product Range" },
    { year: "2024", event: "Customer Satisfaction Award" },
  ];

  return (
    <section className="min-h-screen py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Hero Header */}
        <div className="text-center mb-16">
          <div className="mb-4">
            <span className="text-sm font-medium tracking-wide text-blue-600 uppercase">Our Story</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            About Us
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We're an online store dedicated to bringing you quality products at great prices.
            From the latest trends to everyday essentials, we've got you covered.
          </p>
        </div>

        {/* Our Story Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Our Journey
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              What started as a small online store has grown into a trusted destination for
              thousands of customers. We're committed to providing quality products, excellent
              service, and a seamless shopping experience.
            </p>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Every product in our catalog is carefully selected to ensure it meets our quality
              standards. We work directly with suppliers to bring you the best prices without
              compromising on quality.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-blue-600">
                <span className="text-2xl">✓</span>
                <span className="font-medium">Carefully Selected Products</span>
              </div>
              <div className="flex items-center gap-3 text-blue-600">
                <span className="text-2xl">✓</span>
                <span className="font-medium">Competitive Pricing</span>
              </div>
              <div className="flex items-center gap-3 text-blue-600">
                <span className="text-2xl">✓</span>
                <span className="font-medium">Fast & Secure Checkout</span>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="bg-white border border-gray-200 rounded-xl p-2 shadow-lg">
              <img 
                src="/hero-image.png" 
                alt="Our Store" 
                className="w-full h-[500px] object-cover rounded-lg"
                onError={(e)=>{e.target.src='/hero-image.png'}}
              />
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What We Stand For
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <ValueCard key={index} {...value} />
            ))}
          </div>
        </div>

        {/* Journey Timeline */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Milestones
            </h2>
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex gap-6 items-start group">
                  <div className="bg-blue-600 text-white px-6 py-3 rounded-lg transition-all duration-300 group-hover:bg-blue-700 group-hover:scale-105 shadow">
                    <span className="text-xl font-bold">{milestone.year}</span>
                  </div>
                  <div className="flex-1 pt-2">
                    <p className="text-lg text-gray-700 font-medium">{milestone.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The people behind our success. Meet the team that works hard to bring you
              the best shopping experience.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <TeamCard key={index} {...member} index={index} />
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="inline-block bg-white border border-gray-200 rounded-xl px-12 py-12 max-w-3xl shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Start Shopping Today
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Browse our latest products and discover great deals. Quality products,
              competitive prices, and excellent service await you.
            </p>
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 hover:bg-blue-700 hover:scale-105 shadow">
              Browse Products
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
