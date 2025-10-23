// src/components/common/Header.jsx
import React, { useEffect, useRef, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaShoppingCart, FaClipboardList } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { useLocation, NavLink } from "react-router-dom";
import { checkUserAuth, logoutUser } from "../../api";

const Header = () => {
  const links = ["about", "store", "contact"];
  const location = useLocation();
  const pathname = location.pathname;
  const showMyOrdersShortcut = pathname === "/" || pathname === "/store";

  const headerRef = useRef(null);
  const [isFixed, setIsFixed] = useState(false);
  const [height, setHeight] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Auth state
  const [isAuth, setIsAuth] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Check which pages should have dark header
  const lightPages = ["/", "/contact", "/about", "/store", "/my-orders", "/cart"];
  const isLightPage = lightPages.includes(pathname);

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

  // Check auth on mount
  useEffect(() => {
    let mounted = true;

    const fetchAuth = async () => {
      try {
        const res = await checkUserAuth();
        if (!mounted) return;

        if (res?.status === "success" && res?.user) {
          setIsAuth(true);
          setUser(res.user);
        } else {
          setIsAuth(false);
          setUser(null);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        if (mounted) {
          setIsAuth(false);
          setUser(null);
        }
      } finally {
        if (mounted) {
          setAuthLoading(false);
        }
      }
    };

    fetchAuth();

    return () => {
      mounted = false;
    };
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      const res = await logoutUser();
      if (res?.status === "success") {
        setIsAuth(false);
        setUser(null);
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const AuthActions = () => {
    // 🔒 Only render the My Orders shortcut when the user is authenticated
    const myOrdersShortcut =
      showMyOrdersShortcut && isAuth && user ? (
        <NavLink
          to="/my-orders"
          className="inline-flex items-center justify-center w-10 h-10 border-2 border-gray-300 bg-white text-gray-700 hover:border-blue-500 hover:bg-blue-50 hover:scale-110 transition-all duration-300 rounded-lg"
          aria-label="My Orders"
        >
          <FaClipboardList className="w-4 h-4" />
        </NavLink>
      ) : null;

    if (authLoading) {
      return (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-gray-200 animate-pulse"></div>
          <div className="w-20 h-10 rounded bg-gray-200 animate-pulse"></div>
        </div>
      );
    }

    if (isAuth && user) {
      return (
        <>
          {myOrdersShortcut}
          <NavLink
            to="/cart"
            className="inline-flex items-center justify-center w-10 h-10 border-2 border-gray-300 bg-white text-gray-700 hover:border-blue-500 hover:bg-blue-50 hover:scale-110 transition-all duration-300 rounded-lg"
            aria-label="Cart"
          >
            <FaShoppingCart className="w-4 h-4" />
          </NavLink>
          <button
            onClick={handleLogout}
            className="px-5 py-2 font-medium text-sm bg-blue-600 border-2 border-blue-600 text-white hover:bg-blue-700 hover:scale-105 transition-all duration-300 rounded-lg"
          >
            Logout
          </button>
        </>
      );
    }

    // Not authenticated (no My Orders shortcut here)
    return (
      <>
        <NavLink
          to="/login"
          className="px-5 py-2 font-medium text-sm border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 hover:scale-105 transition-all duration-300 rounded-lg"
        >
          Login
        </NavLink>
      </>
    );
  };

  const MobileAuthActions = () => {
    if (authLoading) {
      return (
        <li className="mt-4 px-2">
          <div className="flex gap-2">
            <div className="flex-1 h-12 bg-gray-200 animate-pulse rounded"></div>
            <div className="flex-1 h-12 bg-gray-200 animate-pulse rounded"></div>
          </div>
        </li>
      );
    }

    if (isAuth && user) {
      return (
        <li className="mt-4 px-2">
          <div className="flex gap-2">
            {/* 🔒 Only show My Orders on mobile if authenticated */}
            {showMyOrdersShortcut && (
              <NavLink
                to="/my-orders"
                className="flex-1 py-3 text-center border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors rounded-lg"
                aria-label="My Orders"
              >
                <FaClipboardList className="inline w-5 h-5" />
              </NavLink>
            )}
            <NavLink
              to="/cart"
              className="flex-1 py-3 text-center border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors rounded-lg"
            >
              <FaShoppingCart className="inline w-5 h-5" />
            </NavLink>
            <button
              onClick={handleLogout}
              className="flex-1 py-3 bg-blue-600 text-white hover:bg-blue-700 transition-colors rounded-lg font-medium text-sm"
            >
              Logout
            </button>
          </div>
        </li>
      );
    }

    // Not authenticated (no My Orders shortcut here)
    return (
      <li className="mt-4 px-2">
        <div className="flex justify-center">
          <NavLink
            to="/login"
            className="w-full py-3 text-center border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors rounded-lg font-medium text-sm"
          >
            Login
          </NavLink>
        </div>
      </li>
    );
  };  return (
    <>
      {isFixed && <div style={{ height: height }} aria-hidden="true" />}

      <div
        ref={headerRef}
        className={`w-full transition-all duration-300 z-50 ${
          isFixed
            ? "fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-md"
            : "bg-white border-b border-gray-200"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <NavLink
            to="/"
            aria-label="Home"
            className="transition-transform duration-300 hover:scale-105"
          >
            <img
              src="/logo-horizontal.svg"
              className="h-10 w-auto"
              alt="Store Logo"
            />
          </NavLink>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <NavLink
              to="/"
              className={({ isActive }) => `
                relative font-medium transition-all duration-300 group text-gray-700
                ${isActive ? "text-blue-600" : ""}
              `}
            >
              Home
              <span
                className={`absolute left-0 -bottom-1 h-0.5 bg-blue-600 transition-all duration-300 ${
                  pathname === "/" ? "w-full" : "w-0 group-hover:w-full"
                }`}
              />
            </NavLink>
            {links.map((link) => (
              <NavLink
                key={link}
                to={`/${link}`}
                className={({ isActive }) => `
                  relative capitalize font-medium transition-all duration-300 group text-gray-700
                  ${isActive ? "text-blue-600" : ""}
                `}
              >
                {link}
                <span
                  className={`absolute left-0 -bottom-1 h-0.5 bg-blue-600 transition-all duration-300 ${
                    pathname === `/${link}` ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </NavLink>
            ))}
          </nav>

          {/* Desktop Auth Actions */}
          <div className="hidden md:flex items-center gap-3">
            <AuthActions />
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 transition-all duration-300 text-gray-700"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <IoClose className="text-2xl" />
            ) : (
              <GiHamburgerMenu className="text-2xl" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`
          fixed inset-0 z-40 md:hidden transition-all duration-300
          ${mobileMenuOpen ? "visible" : "invisible"}
        `}
      >
        {/* Backdrop */}
        <div
          className={`
            absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300
            ${mobileMenuOpen ? "opacity-100" : "opacity-0"}
          `}
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Drawer */}
        <div
          className={`
            absolute right-0 top-0 bottom-0 w-80 bg-white shadow-2xl
            transform transition-transform duration-300
            ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"}
          `}
        >
          <div className="p-6">
            {/* Mobile Logo & Close */}
            <div className="flex justify-between items-center mb-8">
              <img
                src="/logo-horizontal.svg"
                className="h-8 w-auto"
                alt="Aurora & Co"
              />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center justify-center w-10 h-10 text-slate-700 hover:bg-slate-100 rounded transition-colors"
                aria-label="Close menu"
              >
                <IoClose className="text-2xl" />
              </button>
            </div>

            {/* Mobile Navigation */}
            <ul className="space-y-2">
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) => `
                    block px-4 py-3 rounded-lg transition-colors font-medium
                    ${
                      isActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-700 hover:bg-gray-50"
                    }
                  `}
                >
                  Home
                </NavLink>
              </li>
              {links.map((link) => (
                <li key={link}>
                  <NavLink
                    to={`/${link}`}
                    className={({ isActive }) => `
                      block px-4 py-3 rounded-lg capitalize transition-colors font-medium
                      ${
                        isActive
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-700 hover:bg-gray-50"
                      }
                    `}
                  >
                    {link}
                  </NavLink>
                </li>
              ))}
            </ul>

            {/* Mobile Auth Actions */}
            <ul>
              <MobileAuthActions />
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
