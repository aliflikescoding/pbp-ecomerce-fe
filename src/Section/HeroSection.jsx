import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { checkUserAuth } from "../api";

const HeroSection = () => {
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    let active = true;

    const verifyAuth = async () => {
      try {
        const res = await checkUserAuth();
        if (!active) return;

        if (res?.status === "success" && res?.user) {
          setIsAuth(true);
        } else {
          setIsAuth(false);
        }
      } catch (error) {
        if (active) {
          setIsAuth(false);
        }
      }
    };

    verifyAuth();

    return () => {
      active = false;
    };
  }, []);

  const showRegisterCta = isAuth === false;

  return (
    <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="custom-container py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6">
            <span className="text-sm font-medium tracking-wide text-blue-600 uppercase">
              Welcome To Our Store
            </span>
          </div>
          <div className="bg-white rounded-2xl px-10 py-16 shadow-xl">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6 text-gray-900">
              Shop The Best Products <span className="text-blue-600">Online</span>
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              Discover our wide selection of quality products at great prices. 
              Fast shipping, easy returns, and excellent customer service.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {showRegisterCta && (
                <NavLink
                  to="/register"
                  className="w-full sm:w-auto"
                  aria-label="Register"
                >
                  <span className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-3 text-sm font-medium bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 transition-all duration-300 rounded-lg">
                    Get Started
                  </span>
                </NavLink>
              )}
              <NavLink
                to="/store"
                className="w-full sm:w-auto"
                aria-label="Shop now"
              >
                <span className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-3 text-sm font-medium bg-blue-600 border-2 border-blue-600 text-white hover:bg-blue-700 transition-all duration-300 rounded-lg">
                  Shop Now
                </span>
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
