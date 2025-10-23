import React, { useState } from "react";
import { FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

const socials = [
  {
    name: "Instagram",
    handle: "@yourstore",
    url: "#",
    description: "Follow us for daily updates and product highlights.",
    icon: FaInstagram,
  },
  {
    name: "Twitter",
    handle: "@yourstore",
    url: "#",
    description: "Stay up to date with announcements and special offers.",
    icon: FaTwitter,
  },
  {
    name: "YouTube",
    handle: "Your Store",
    url: "#",
    description: "Watch product reviews, tutorials, and more.",
    icon: FaYoutube,
  },
];

const ContactPage = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <section className="min-h-screen py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="mb-4">
            <span className="text-sm font-medium tracking-wide text-blue-600 uppercase">
              Get In Touch
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            Contact Us
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            We're here to help! Connect with us through your preferred social media platform
            and we'll get back to you as soon as possible.
          </p>
        </div>

        {/* Social Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-16">
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
                <div
                  className={`
                  relative h-full bg-white border border-gray-200
                  p-6 rounded-xl transition-all duration-300
                  hover:shadow-lg hover:border-blue-300 hover:-translate-y-1
                `}
                >
                  {/* Content */}
                  <div className="relative z-10">
                    {/* Icon */}
                    <div
                      className={`
                      inline-flex items-center justify-center w-14 h-14
                      bg-blue-100 rounded-lg
                      transform transition-all duration-300
                      ${isHovered ? "bg-blue-600 scale-110" : ""}
                      mb-4
                    `}
                    >
                      <Icon className={`w-6 h-6 ${isHovered ? "text-white" : "text-blue-600"}`} />
                    </div>

                    {/* Platform name */}
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      {social.name}
                    </h2>

                    {/* Handle */}
                    <p className="text-sm text-blue-600 mb-3">
                      {social.handle}
                    </p>

                    {/* Description */}
                    <p className="text-gray-600 leading-relaxed text-sm">
                      {social.description}
                    </p>
                  </div>
                </div>
              </a>
            );
          })}
        </div>

        {/* CTA section */}
        <div className="text-center">
          <div className="inline-block bg-white border border-gray-200 rounded-xl px-12 py-10 max-w-2xl shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Have Questions?
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Our support team is ready to help. Connect through any of our social channels
              and experience our excellent customer service.
            </p>

            <div className="flex justify-center gap-3">
              {socials.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-lg transform transition-all duration-300 hover:bg-blue-600 hover:text-white hover:scale-110"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactPage;
