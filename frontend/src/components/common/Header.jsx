import React, { useEffect, useRef, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaSearch, FaShoppingCart } from "react-icons/fa";
import { useLocation, NavLink } from "react-router-dom";
import { checkUserAuth } from "../../api";
import Logout from "../Logout";

const Header = () => {
  const links = ["about", "store", "contact"];
  const location = useLocation();
  const pathname = location.pathname;

  const headerRef = useRef(null);
  const [isFixed, setIsFixed] = useState(false);
  const [height, setHeight] = useState(0);

  // Auth state
  const [isAuth, setIsAuth] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const onScroll = () => setIsFixed(window.scrollY > 20);
    const updateHeight = () =>
      setHeight(headerRef.current ? headerRef.current.offsetHeight : 0);

    updateHeight();
    window.addEventListener("scroll", onScroll);
    window.addEventListener("resize", updateHeight);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await checkUserAuth(); // expected: { status: "success", user: {...} } OR { status: "error", message: "Not authenticated" }
        if (!mounted) return;
        setIsAuth(res?.status === "success");
      } catch {
        if (!mounted) return;
        setIsAuth(false);
      } finally {
        if (mounted) setAuthLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const AuthActions = () => {
    // While checking auth, render nothing to prevent flicker
    if (authLoading) return null;

    // Authenticated: show Search + Cart
    if (isAuth) {
      return (
        <>
          <NavLink
            to="/cart"
            className="btn btn-ghost btn-square"
            aria-label="Cart"
          >
            <FaShoppingCart />
          </NavLink>
          <Logout />
        </>
      );
    }

    // Not authenticated: show Login + Register
    return (
      <>
        <NavLink to="/login" className="btn btn-sm btn-primary ml-2">
          Login
        </NavLink>
        <NavLink to="/register" className="btn btn-sm btn-outline ml-2">
          Register
        </NavLink>
      </>
    );
  };

  // For mobile drawer, mirror the same conditional actions at the bottom of the menu
  const MobileAuthActions = () => {
    if (authLoading) return null;
    if (isAuth) {
      return (
        <li className="mt-2">
          <div className="flex gap-2">
            <button className="btn btn-ghost btn-square" aria-label="Search">
              <FaSearch />
            </button>
            <NavLink
              to="/cart"
              className="btn btn-ghost btn-square"
              aria-label="Cart"
            >
              <FaShoppingCart />
            </NavLink>
          </div>
        </li>
      );
    }
    return (
      <li className="mt-2">
        <div className="flex gap-2">
          <NavLink to="/login" className="btn btn-primary btn-sm">
            Login
          </NavLink>
          <NavLink to="/register" className="btn btn-outline btn-sm">
            Register
          </NavLink>
        </div>
      </li>
    );
  };

  return pathname === "/" ? (
    <>
      {isFixed && <div style={{ height: height }} aria-hidden />}
      <div
        ref={headerRef}
        className={
          "w-full text-base-100 " +
          (isFixed
            ? "fixed top-0 left-0 right-0 z-40 bg-black/95 shadow-md"
            : "absolute")
        }
      >
        <div className="custom-container p-4 flex justify-between items-center">
          <NavLink to="/" aria-label="Home">
            <img
              src="/logo-vertical-white.svg"
              className="h-auto w-15"
              alt="company logo"
            />
          </NavLink>

          <nav className="hidden sm:flex gap-6 items-center">
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
                    pathname === `/${link}`
                      ? "w-full"
                      : "w-0 group-hover:w-full"
                  }`}
                ></span>
              </div>
            ))}
          </nav>

          <div className="hidden sm:flex items-center gap-4">
            <AuthActions />
          </div>

          <div className="sm:hidden">
            <div className="drawer">
              <input id="my-drawer" type="checkbox" className="drawer-toggle" />
              <div className="drawer-content">
                <label
                  htmlFor="my-drawer"
                  className="drawer-button"
                  aria-label="Open menu"
                >
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
                  <MobileAuthActions />
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  ) : (
    <>
      {isFixed && <div style={{ height: height }} aria-hidden />}
      <div
        ref={headerRef}
        className={
          "w-full bg-transparent " +
          (isFixed ? "fixed top-0 left-0 right-0 z-40 bg-white shadow-sm" : "")
        }
      >
        <div className="custom-container p-4 flex justify-between items-center">
          <NavLink to="/" aria-label="Home">
            <img
              src="/logo-vertical.svg"
              className="h-auto w-15"
              alt="company logo"
            />
          </NavLink>

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
                    pathname === `/${link}`
                      ? "w-full"
                      : "w-0 group-hover:w-full"
                  }`}
                ></span>
              </div>
            ))}
          </nav>

          <div className="hidden sm:flex items-center gap-4">
            <AuthActions />
          </div>

          <div className="sm:hidden">
            <div className="drawer">
              <input id="my-drawer" type="checkbox" className="drawer-toggle" />
              <div className="drawer-content">
                <label
                  htmlFor="my-drawer"
                  className="drawer-button"
                  aria-label="Open menu"
                >
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
                  <MobileAuthActions />
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
