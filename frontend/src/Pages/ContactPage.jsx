import React, { useState } from "react";
import { FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

const socials = [
  {
    name: "Instagram",
    handle: "@aurora.co",
    url: "#",
    description: "Peek behind the scenes and explore daily product highlights.",
    icon: FaInstagram,
  },
  {
    name: "Twitter",
    handle: "@auroraandco",
    url: "#",
    description: "Stay up to date with announcements, drops, and live Q&As.",
    icon: FaTwitter,
  },
  {
    name: "YouTube",
    handle: "Aurora & CO Studio",
    url: "#",
    description: "Watch styling guides, launch stories, and community spotlights.",
    icon: FaYoutube,
  },
];

const ContactPage = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <section 
      className="relative min-h-screen py-20 overflow-hidden"
      style={{
        backgroundImage: "url(/hero-image.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark overlay untuk elegant effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/85 via-amber-950/80 to-slate-900/90"></div>

      {/* Elegant overlay pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      {/* Luxury light effects - warm tones */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-600/15 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-yellow-600/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/8 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-6">
        {/* Elegant Header */}
        <div className="text-center mb-20">
          <div className="inline-block mb-6">
            <div className="h-px w-12 bg-gradient-to-r from-transparent via-amber-400 to-transparent mb-4 mx-auto"></div>
            <span className="text-xs font-light tracking-[0.3em] text-amber-200 uppercase">Connect With Excellence</span>
            <div className="h-px w-12 bg-gradient-to-r from-transparent via-amber-400 to-transparent mt-4 mx-auto"></div>
          </div>
          <h1 className="text-5xl md:text-6xl font-light mb-6 text-neutral-content tracking-wide font-playfair">
            Where <span className="italic">Elegance</span>
            <br />
            Meets <span className="italic text-amber-200">Connection</span>
          </h1>
          <p className="text-lg text-neutral-content/80 max-w-2xl mx-auto leading-relaxed font-light">
            At Aurora & Co, we believe in building meaningful relationships. Join our distinguished community and discover a world where sophistication meets modern luxury.
          </p>
        </div>

        {/* Luxury Social Cards */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-20">
          {socials.map((social, index) => {
            const Icon = social.icon;
            const isHovered = hoveredIndex === index;
            
            return (
              <a
                key={social.name}
                href={social.url}
                className="group relative block"
                target="_blank"
                rel="noreferrer"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Elegant card with border */}
                <div className={`
                  relative h-full backdrop-blur-xl bg-white/5 border border-white/10
                  p-8 transition-all duration-700 ease-out overflow-hidden
                  ${isHovered ? 'border-amber-400/50 shadow-2xl shadow-amber-500/20 scale-105' : ''}
                `}>
                  {/* Shimmer effect on hover */}
                  <div className={`
                    absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent
                    transition-transform duration-1000
                    ${isHovered ? 'translate-x-full' : '-translate-x-full'}
                  `}></div>
                  
                  {/* Content */}
                  <div className="relative z-10">
                    {/* Refined icon */}
                    <div className={`
                      inline-flex items-center justify-center w-14 h-14
                      border border-amber-300/30 bg-amber-400/5
                      transform transition-all duration-700
                      ${isHovered ? 'border-amber-300/60 bg-amber-400/10 rotate-6' : 'rotate-0'}
                      mb-6
                    `}>
                      <Icon className="w-6 h-6 text-amber-200" />
                    </div>

                    {/* Elegant divider */}
                    <div className="h-px w-16 bg-gradient-to-r from-amber-300/50 to-transparent mb-6"></div>

                    {/* Platform name with serif font */}
                    <h2 className="text-2xl font-light text-neutral-content mb-3 tracking-wide font-playfair">
                      {social.name}
                    </h2>

                    {/* Handle */}
                    <p className="text-sm font-light text-amber-200 mb-4 tracking-wide">
                      {social.handle}
                    </p>

                    {/* Description */}
                    <p className="text-neutral-content/70 leading-relaxed mb-6 font-light text-sm">
                      {social.description}
                    </p>

                    {/* Elegant CTA */}
                    <div className="inline-flex items-center gap-2 text-sm font-light text-amber-200 border-b border-amber-200/30 pb-1">
                      <span className="tracking-wider">Discover More</span>
                      <span className={`
                        transition-transform duration-500
                        ${isHovered ? 'translate-x-2' : 'translate-x-0'}
                      `}>→</span>
                    </div>
                  </div>

                  {/* Corner accent */}
                  <div className="absolute top-0 right-0 w-24 h-24 border-t border-r border-amber-300/20"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 border-b border-l border-amber-300/20"></div>
                </div>
              </a>
            );
          })}
        </div>

        {/* Refined CTA section */}
        <div className="text-center">
          <div className="inline-block backdrop-blur-xl bg-white/5 border border-white/10 px-12 py-10 max-w-2xl">
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-amber-300 to-transparent mb-6 mx-auto"></div>
            
            <h3 className="text-3xl font-light text-neutral-content mb-4 tracking-wide font-playfair">
              A Question of <span className="italic">Elegance?</span>
            </h3>
            <p className="text-neutral-content/70 mb-8 font-light leading-relaxed">
              Our distinguished team awaits your inquiry. Connect through your preferred channel, and experience the Aurora & Co difference.
            </p>
            
            <div className="flex justify-center gap-4">
              {socials.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    className="inline-flex items-center justify-center w-12 h-12 border border-amber-300/30 bg-amber-400/5 text-amber-200 transform transition-all duration-500 hover:border-amber-300/60 hover:bg-amber-400/10 hover:scale-110 hover:rotate-6"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
            
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-amber-300 to-transparent mt-6 mx-auto"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactPage;