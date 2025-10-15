import React, { useState } from "react";

const Footer = () => {
  const [hoveredSocial, setHoveredSocial] = useState(null);

  const socialLinks = [
    {
      name: "Twitter",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" className="fill-current">
          <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
        </svg>
      ),
      url: "#"
    },
    {
      name: "YouTube",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" className="fill-current">
          <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
        </svg>
      ),
      url: "#"
    },
    {
      name: "Facebook",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" className="fill-current">
          <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
        </svg>
      ),
      url: "#"
    }
  ];

  const navSections = [
    {
      title: "Navigate",
      links: [
        { name: "Home", to: "/" },
        { name: "About", to: "/about" },
        { name: "Store", to: "/store" },
        { name: "Contact", to: "/contact" }
      ]
    },
    {
      title: "Collections",
      links: [
        { name: "Necklaces", to: "/store" },
        { name: "Rings", to: "/store" },
        { name: "Earrings", to: "/store" },
        { name: "Bracelets", to: "/store" }
      ]
    },
    {
      title: "Support",
      links: [
        { name: "Care Guide", to: "/contact" },
        { name: "Shipping", to: "/contact" },
        { name: "Returns", to: "/contact" },
        { name: "FAQ", to: "/contact" }
      ]
    }
  ];

  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-amber-950/40 to-slate-900">
      {/* Subtle texture overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      {/* Elegant light accents - warm tones */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-600/8 rounded-full blur-3xl"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/8 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-yellow-700/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative">
        {/* Top decorative line */}
        <div className="h-px bg-gradient-to-r from-transparent via-amber-300/30 to-transparent"></div>

        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <img
                src="/logo-horizontal-white.svg"
                alt="Aurora & Co"
                className="w-48 h-auto mb-6 opacity-90"
              />
              <div className="h-px w-16 bg-gradient-to-r from-amber-300/50 to-transparent mb-4"></div>
              <p className="text-lg text-white/90 italic mb-6 font-light" style={{ fontFamily: 'Playfair Display, serif' }}>
                Where Elegance Meets Brilliance.
              </p>
              <p className="text-sm text-white/60 font-light leading-relaxed mb-6 max-w-sm">
                Crafting timeless luxury jewelry with exceptional artistry and dedication to perfection since 2020.
              </p>
              
              {/* Social Links */}
              <div className="flex gap-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={social.name}
                    href={social.url}
                    className={`
                      inline-flex items-center justify-center w-10 h-10 
                      border border-amber-300/30 bg-amber-400/5 text-amber-200
                      transition-all duration-500
                      ${hoveredSocial === index ? 'border-amber-300/60 bg-amber-400/10 scale-110 rotate-6' : ''}
                    `}
                    onMouseEnter={() => setHoveredSocial(index)}
                    onMouseLeave={() => setHoveredSocial(null)}
                    aria-label={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Navigation Sections */}
            {navSections.map((section, index) => (
              <div key={index}>
                <h6 className="text-sm font-light tracking-widest text-amber-200 uppercase mb-6">
                  {section.title}
                </h6>
                <div className="h-px w-12 bg-gradient-to-r from-amber-300/30 to-transparent mb-4"></div>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a 
                        href={link.to}
                        className="group inline-flex items-center gap-2 text-white/70 font-light text-sm transition-all duration-300 hover:text-amber-200 hover:translate-x-1"
                      >
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-amber-200">→</span>
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-amber-300/20 to-transparent my-8"></div>

          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-white/60 text-sm font-light text-center md:text-left">
              <p>© {new Date().getFullYear()} Aurora & Co. All rights reserved.</p>
              <p className="text-xs mt-1">Crafted with passion and precision.</p>
            </div>
            
            <div className="flex gap-6 text-xs">
              <a href="#" className="text-white/60 hover:text-amber-200 transition-colors duration-300 font-light">
                Privacy Policy
              </a>
              <span className="text-white/30">•</span>
              <a href="#" className="text-white/60 hover:text-amber-200 transition-colors duration-300 font-light">
                Terms of Service
              </a>
              <span className="text-white/30">•</span>
              <a href="#" className="text-white/60 hover:text-amber-200 transition-colors duration-300 font-light">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>

        {/* Bottom decorative line */}
        <div className="h-px bg-gradient-to-r from-transparent via-amber-300/30 to-transparent"></div>
      </div>
    </footer>
  );
};

export default Footer;