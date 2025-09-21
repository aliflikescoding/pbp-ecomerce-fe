import React from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { useLocation, NavLink } from "react-router-dom";

const Header = () => {
  const links = ["about", "store", "contact"];
  const location = useLocation();
  const pathname = location.pathname;

  return pathname === "/" ? (
    <div className="w-full text-base-100 absolute">
      <div className="custom-container p-4 flex justify-between items-center">
        <img
          src="/logo-vertical-white.svg"
          className="h-auto w-15"
          alt="company logo"
        />
        <nav className="hidden sm:flex gap-6 ">
          <div className="group relative">
            <NavLink
              className={`capitalize transition-colors duration-300 ${
                pathname === "/" ? "font-semibold text-white" : ""
              }`}
              to="/"
            >
              home
            </NavLink>
            <span
              className={`absolute left-0 -bottom-1 h-[2px] bg-white transition-all duration-300 ${
                pathname === "/" ? "w-full" : "w-0 group-hover:w-full"
              }`}
            ></span>
          </div>
          {links.map((link) => (
            <div key={link} className="group relative">
              <NavLink
                className={`transition-colors duration-300 ${
                  pathname === `/${link}` ? "font-bold" : ""
                } ${link === "faq" ? "uppercase" : "capitalize"}`}
                to={`/${link}`}
              >
                {link}
              </NavLink>
              <span
                className={`absolute left-0 -bottom-1 h-[2px] bg-white transition-all duration-300 ${
                  pathname === `/${link}` ? "w-full" : "w-0 group-hover:w-full"
                }`}
              ></span>
            </div>
          ))}
        </nav>
        <div className="sm:hidden">
          <div className="drawer">
            <input id="my-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
              {/* Page content here */}
              <label htmlFor="my-drawer" className="drawer-button">
                <GiHamburgerMenu className="text-2xl" />
              </label>
            </div>
            <div className="drawer-side">
              <label
                htmlFor="my-drawer"
                aria-label="close sidebar"
                className="drawer-overlay"
              ></label>
              <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
                <li className={pathname === "/" ? "bg-base-300" : ""}>
                  <NavLink to="/" className="text-xl capitalize">
                    home
                  </NavLink>
                </li>
                {links.map((link) => (
                  <li
                    key={link}
                    className={pathname === `/${link}` ? "bg-base-300" : ""}
                  >
                    <NavLink
                      to={`/${link}`}
                      className={`text-xl ${
                        link === "faq" ? "uppercase" : "capitalize"
                      }`}
                    >
                      {link}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="custom-container p-4 flex justify-between items-center">
      <img
        src="/logo-vertical.svg"
        className="h-auto w-15"
        alt="company logo"
      />
      <nav className="hidden sm:flex gap-6 ">
        <div className="group relative">
          <NavLink
            className={`capitalize transition-colors duration-300 ${
              pathname === "/" ? "font-semibold text-primary" : ""
            }`}
            to="/"
          >
            home
          </NavLink>
          <span
            className={`absolute left-0 -bottom-1 h-[2px] bg-black transition-all duration-300 ${
              pathname === "/" ? "w-full" : "w-0 group-hover:w-full"
            }`}
          ></span>
        </div>
        {links.map((link) => (
          <div key={link} className="group relative">
            <NavLink
              className={`transition-colors duration-300 ${
                pathname === `/${link}` ? "font-bold" : ""
              } ${link === "faq" ? "uppercase" : "capitalize"}`}
              to={`/${link}`}
            >
              {link}
            </NavLink>
            <span
              className={`absolute left-0 -bottom-1 h-[2px] bg-black transition-all duration-300 ${
                pathname === `/${link}` ? "w-full" : "w-0 group-hover:w-full"
              }`}
            ></span>
          </div>
        ))}
      </nav>
      <div className="sm:hidden">
        <div className="drawer">
          <input id="my-drawer" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
            {/* Page content here */}
            <label htmlFor="my-drawer" className="drawer-button">
              <GiHamburgerMenu className="text-2xl" />
            </label>
          </div>
          <div className="drawer-side">
            <label
              htmlFor="my-drawer"
              aria-label="close sidebar"
              className="drawer-overlay"
            ></label>
            <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
              <li className={pathname === "/" ? "bg-base-300" : ""}>
                <NavLink to="/" className="text-xl capitalize">
                  home
                </NavLink>
              </li>
              {links.map((link) => (
                <li
                  key={link}
                  className={pathname === `/${link}` ? "bg-base-300" : ""}
                >
                  <NavLink
                    to={`/${link}`}
                    className={`text-xl ${
                      link === "faq" ? "uppercase" : "capitalize"
                    }`}
                  >
                    {link}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
