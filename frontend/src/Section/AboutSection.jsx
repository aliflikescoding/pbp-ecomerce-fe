import React from "react";

const TeamCard = ({ name, role, imgSrc }) => (
  <div className="bg-white rounded-lg shadow-sm overflow-hidden w-full max-w-sm">
    <img
      src={imgSrc}
      alt={name}
      className="w-full h-40 object-cover"
      onError={(event) => {
        event.currentTarget.onerror = null;
        event.currentTarget.src = "/hero-image.png";
      }}
    />
    <div className="p-4">
      <h4 className="font-semibold">{name}</h4>
      <p className="text-sm text-neutral/70">{role}</p>
    </div>
  </div>
);

const AboutSection = () => {
  const team = [
    { name: "Alif Putra Wibowo", role: "Founder & Creative Director", imgSrc: "/hero-image.png" },
    {
      name: "Favian Hanindito ",
      role: "Head of Product",
      imgSrc: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80",
    },
    {
      name: "Duta Adi ",
      role: "Head of Marketing",
      imgSrc: "https://images.unsplash.com/photo-1545996124-1e9f3b7a3f5b?w=800&q=80",
    },
    {
      name: "Diaz cahyo utomo",
      role: "Lead Engineer",
      imgSrc: "https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?w=800&q=80",
    },
  ];

  return (
    <section className="py-16 custom-container">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h2 className="text-4xl font-playfair font-bold mb-4">About Aurora & Co</h2>
        <p className="text-neutral/70 text-lg">
          Aurora & Co is a curated lifestyle brand focused on timeless design and quality craftsmanship.
          We create pieces that last and tell a story — made with care, inspired by the modern wardrobe.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
        <div>
          <h3 className="text-2xl font-semibold mb-3">Our Mission</h3>
          <p className="text-neutral/70 mb-4">
            To craft beautifully made wardrobe staples that combine functionality with elegant design.
            We believe in responsible sourcing and meaningful products that people love to wear.
          </p>
          <ul className="space-y-2 text-neutral/80">
            <li>• Timeless materials</li>
            <li>• Thoughtful craftsmanship</li>
            <li>• Sustainable practices</li>
          </ul>
        </div>
        <div>
          <img src="/public/whyus/whyus-1.png" alt="about" className="w-full rounded-lg object-cover h-64" onError={(e)=>{e.target.src='/hero-image.png'}}/>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-2xl font-semibold text-center mb-6">Meet the team</h3>
        <div className="max-w-4xl mx-auto">
          <div className="-mx-4 flex gap-6 overflow-x-auto px-4 pb-4 sm:mx-0 sm:px-0 sm:pb-0 snap-x snap-mandatory">
            {team.map((t) => (
              <div key={t.name} className="snap-center flex-shrink-0 w-72 sm:w-64 md:w-72 lg:w-80">
                <TeamCard name={t.name} role={t.role} imgSrc={t.imgSrc} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
