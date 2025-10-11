import React from "react";
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
  return (
    <section className="bg-base-100 py-16">
      <div className="custom-container max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-playfair font-bold text-primary">Contact Aurora &amp; CO</h1>
          <p className="mt-3 text-neutral/70 text-lg">
            We love hearing from our community. Connect with us on social media and join the conversation.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {socials.map(({ name, handle, url, description, icon: Icon }) => (
            <a
              key={name}
              href={url}
              className="group rounded-xl border border-neutral/20 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
              target="_blank"
              rel="noreferrer"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-neutral/60">Follow us on</p>
                  <h2 className="text-lg font-semibold">{name}</h2>
                </div>
              </div>
              <p className="mt-4 text-sm font-medium text-neutral">{handle}</p>
              <p className="mt-3 text-sm text-neutral/70">{description}</p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                Visit channel
                <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContactPage;
