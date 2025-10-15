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
        relative overflow-hidden backdrop-blur-xl bg-white/5 border border-white/10
        transition-all duration-700
        ${isHovered ? 'border-amber-300/50 shadow-2xl shadow-amber-500/10 scale-105' : ''}
      `}>
        {/* Image container */}
        <div className="relative h-80 overflow-hidden">
          <img
            src={imgSrc}
            alt={name}
            className={`w-full h-full object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = "/hero-image.png";
            }}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>
          
          {/* Shimmer effect */}
          <div className={`
            absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent
            transition-transform duration-1000
            ${isHovered ? 'translate-x-full' : '-translate-x-full'}
          `}></div>
        </div>

        {/* Content */}
        <div className="relative p-6">
          <div className="h-px w-12 bg-gradient-to-r from-amber-300/50 to-transparent mb-4"></div>
          <h4 className="text-xl font-light text-neutral-content mb-2 tracking-wide font-playfair">
            {name}
          </h4>
          <p className="text-sm text-amber-200 font-light tracking-wider uppercase">
            {role}
          </p>
        </div>

        {/* Corner accents */}
        <div className="absolute top-0 right-0 w-16 h-16 border-t border-r border-amber-300/20"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 border-b border-l border-amber-300/20"></div>
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
        backdrop-blur-xl bg-white/5 border border-white/10 p-8
        transition-all duration-700
        ${isHovered ? 'border-amber-300/50 shadow-xl shadow-amber-500/10 -translate-y-2' : ''}
      `}>
        <div className={`
          text-4xl mb-6 transition-transform duration-700
          ${isHovered ? 'scale-110 rotate-6' : 'scale-100'}
        `}>
          {icon}
        </div>
        <div className="h-px w-12 bg-gradient-to-r from-amber-300/50 to-transparent mb-4"></div>
        <h4 className="text-xl font-light text-neutral-content mb-3 tracking-wide font-playfair">
          {title}
        </h4>
        <p className="text-neutral-content/70 font-light text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};

const AboutSection = () => {
  const team = [
    { name: "Alif Putra Wibowo", role: "Founder & Creative Director", imgSrc: "/hero-image.png" },
    {
      name: "Favian Hanindito",
      role: "Head of Product",
      imgSrc: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80",
    },
    {
      name: "Duta Adi",
      role: "Head of Marketing",
      imgSrc: "https://images.unsplash.com/photo-1545996124-1e9f3b7a3f5b?w=800&q=80",
    },
    {
      name: "Diaz Cahyo Utomo",
      role: "Lead Engineer",
      imgSrc: "https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?w=800&q=80",
    },
  ];

  const values = [
    {
      icon: "✨",
      title: "Timeless Elegance",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco."
    },
    {
      icon: "💎",
      title: "Exceptional Quality",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco."
    },
    {
      icon: "🌿",
      title: "Sustainable Luxury",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco."
    },
    {
      icon: "🎨",
      title: "Artisan Craftsmanship",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco."
    }
  ];

  const milestones = [
    { year: "2020", event: "Aurora & Co Founded" },
    { year: "2021", event: "First Flagship Store Opens" },
    { year: "2023", event: "International Expansion" },
    { year: "2024", event: "Sustainability Award Winner" },
  ];

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
      {/* Dark elegant overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-amber-950/85 to-slate-900/90"></div>

      {/* Luxury light effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-600/15 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-yellow-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Hero Header */}
        <div className="text-center mb-20">
          <div className="inline-block mb-6">
            <div className="h-px w-12 bg-gradient-to-r from-transparent via-amber-400 to-transparent mb-4 mx-auto"></div>
            <span className="text-xs font-light tracking-[0.3em] text-amber-200 uppercase">Our Story</span>
            <div className="h-px w-12 bg-gradient-to-r from-transparent via-amber-400 to-transparent mt-4 mx-auto"></div>
          </div>
          <h1 className="text-5xl md:text-6xl font-light mb-6 text-neutral-content tracking-wide font-playfair">
            Where <span className="italic">Brilliance</span>
            <br />
            Meets <span className="italic text-amber-200">Artistry</span>
          </h1>
          <p className="text-lg text-neutral-content/80 max-w-3xl mx-auto leading-relaxed font-light">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
          </p>
        </div>

        {/* Our Story Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-32">
          <div>
            <h2 className="text-4xl font-light text-neutral-content mb-6 tracking-wide font-playfair">
              The Aurora <span className="italic text-amber-200">Legacy</span>
            </h2>
            <div className="h-px w-16 bg-gradient-to-r from-amber-300/50 to-transparent mb-6"></div>
            <p className="text-neutral-content/70 mb-6 font-light leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
            </p>
            <p className="text-neutral-content/70 mb-8 font-light leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-amber-200">
                <span className="text-2xl">→</span>
                <span className="font-light">Handcrafted Excellence</span>
              </div>
              <div className="flex items-center gap-3 text-amber-200">
                <span className="text-2xl">→</span>
                <span className="font-light">Ethically Sourced Materials</span>
              </div>
              <div className="flex items-center gap-3 text-amber-200">
                <span className="text-2xl">→</span>
                <span className="font-light">Timeless Design Philosophy</span>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 p-2">
              <img 
                src="/hero-image.png" 
                alt="Aurora & Co Craftsmanship" 
                className="w-full h-[500px] object-cover"
                onError={(e)=>{e.target.src='/hero-image.png'}}
              />
              <div className="absolute top-0 left-0 w-24 h-24 border-t border-l border-amber-300/30"></div>
              <div className="absolute bottom-0 right-0 w-24 h-24 border-b border-r border-amber-300/30"></div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-neutral-content mb-4 tracking-wide font-playfair">
              Our <span className="italic text-amber-200">Values</span>
            </h2>
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-amber-300 to-transparent mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <ValueCard key={index} {...value} />
            ))}
          </div>
        </div>

        {/* Journey Timeline */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-neutral-content mb-4 tracking-wide font-playfair">
              Our <span className="italic text-amber-200">Journey</span>
            </h2>
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-amber-300 to-transparent mx-auto"></div>
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex gap-6 items-start group">
                  <div className="backdrop-blur-xl bg-white/5 border border-amber-300/30 px-6 py-3 transition-all duration-500 group-hover:border-amber-300/60 group-hover:bg-amber-400/10">
                    <span className="text-2xl font-light text-amber-200 font-playfair">{milestone.year}</span>
                  </div>
                  <div className="flex-1 pt-2">
                    <p className="text-lg text-neutral-content font-light">{milestone.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-neutral-content mb-4 tracking-wide font-playfair">
              Meet the <span className="italic text-amber-200">Artisans</span>
            </h2>
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-amber-300 to-transparent mx-auto mb-6"></div>
            <p className="text-neutral-content/70 max-w-2xl mx-auto font-light">
              Behind every piece of Aurora & Co jewelry is a team of passionate individuals dedicated to perfection and artistry.
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
          <div className="inline-block backdrop-blur-xl bg-white/5 border border-white/10 px-12 py-12 max-w-3xl">
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-amber-300 to-transparent mb-6 mx-auto"></div>
            <h3 className="text-3xl font-light text-neutral-content mb-4 tracking-wide font-playfair">
              Begin Your <span className="italic text-amber-200">Journey</span>
            </h3>
            <p className="text-neutral-content/70 mb-8 font-light leading-relaxed">
              Discover our curated collections and find the piece that speaks to your soul. Each creation is waiting to become part of your story.
            </p>
            <button className="backdrop-blur-xl bg-amber-400/10 border border-amber-300/50 text-amber-200 px-8 py-3 font-light tracking-wider uppercase text-sm transition-all duration-500 hover:bg-amber-400/20 hover:border-amber-300/80 hover:scale-105">
              Explore Collections
            </button>
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-amber-300 to-transparent mt-6 mx-auto"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;