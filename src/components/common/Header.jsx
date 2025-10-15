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
  const darkPages = ["/", "/contact", "/about", "/store", "/my-orders"];
  const isDarkPage = darkPages.includes(pathname);

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
    const myOrdersShortcut = showMyOrdersShortcut ? (
      <NavLink
        to="/my-orders"
        className={`
          inline-flex items-center justify-center w-10 h-10 
          border transition-all duration-500
          ${isDarkPage 
            ? 'border-amber-300/30 bg-amber-400/5 text-amber-200 hover:border-amber-300/60 hover:bg-amber-400/10 hover:scale-110' 
            : 'border-slate-300 bg-slate-100 text-slate-700 hover:border-amber-400 hover:bg-amber-50 hover:scale-110'}
        `}
        aria-label="My Orders"
      >
        <FaClipboardList className="w-4 h-4" />
      </NavLink>
    ) : null;

    if (authLoading) {
      return (
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded animate-pulse ${isDarkPage ? 'bg-amber-400/20' : 'bg-slate-200'}`}></div>
          <div className={`w-20 h-10 rounded animate-pulse ${isDarkPage ? 'bg-amber-400/20' : 'bg-slate-200'}`}></div>
        </div>
      );
    }

    if (isAuth && user) {
      return (
        <>
          {myOrdersShortcut}
          <NavLink
            to="/cart"
            className={`
              inline-flex items-center justify-center w-10 h-10 
              border transition-all duration-500
              ${isDarkPage 
                ? 'border-amber-300/30 bg-amber-400/5 text-amber-200 hover:border-amber-300/60 hover:bg-amber-400/10 hover:scale-110' 
                : 'border-slate-300 bg-slate-100 text-slate-700 hover:border-amber-400 hover:bg-amber-50 hover:scale-110'}
            `}
            aria-label="Cart"
          >
            <FaShoppingCart className="w-4 h-4" />
          </NavLink>
          <button 
            onClick={handleLogout}
            className={`
              px-5 py-2 font-light tracking-wider uppercase text-sm 
              transition-all duration-500
              ${isDarkPage
                ? 'bg-amber-400/10 border border-amber-300/50 text-amber-200 hover:bg-amber-400/20 hover:border-amber-300/80 hover:scale-105'
                : 'bg-slate-800 border border-slate-800 text-white hover:bg-slate-900 hover:scale-105'}
            `}
          >
            Logout
          </button>
        </>
      );
    }

    return (
      <>
        {myOrdersShortcut}
        <NavLink 
          to="/login" 
          className={`
            px-5 py-2 font-light tracking-wider uppercase text-sm 
            transition-all duration-500
            ${isDarkPage
              ? 'border border-amber-300/50 text-amber-200 hover:bg-amber-400/10 hover:border-amber-300/80 hover:scale-105'
              : 'border border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 hover:scale-105'}
          `}
        >
          Login
        </NavLink>
        <NavLink 
          to="/register" 
          className={`
            px-5 py-2 font-light tracking-wider uppercase text-sm 
            transition-all duration-500
            ${isDarkPage
              ? 'bg-amber-400/10 border border-amber-300/50 text-amber-200 hover:bg-amber-400/20 hover:border-amber-300/80 hover:scale-105'
              : 'bg-slate-800 border border-slate-800 text-white hover:bg-slate-900 hover:scale-105'}
          `}
        >
          Register
        </NavLink>
      </>
    );
  };

  const MobileAuthActions = () => {
    if (authLoading) {
      return (
        <li className="mt-4 px-2">
          <div className="flex gap-2">
            <div className="flex-1 h-12 bg-slate-200 animate-pulse rounded"></div>
            <div className="flex-1 h-12 bg-slate-200 animate-pulse rounded"></div>
          </div>
        </li>
      );
    }
    
    if (isAuth && user) {
      return (
        <li className="mt-4 px-2">
          <div className="flex gap-2">
            {showMyOrdersShortcut && (
              <NavLink
                to="/my-orders"
                className="flex-1 py-3 text-center border border-amber-300/50 text-amber-600 hover:bg-amber-50 transition-colors rounded"
                aria-label="My Orders"
              >
                <FaClipboardList className="inline w-5 h-5" />
              </NavLink>
            )}
            <NavLink
              to="/cart"
              className="flex-1 py-3 text-center border border-amber-300/50 text-amber-600 hover:bg-amber-50 transition-colors rounded"
            >
              <FaShoppingCart className="inline w-5 h-5" />
            </NavLink>
            <button 
              onClick={handleLogout}
              className="flex-1 py-3 bg-slate-800 text-white hover:bg-slate-900 transition-colors rounded font-light tracking-wider uppercase text-sm"
            >
              Logout
            </button>
          </div>
        </li>
      );
    }
    
    return (
      <li className="mt-4 px-2">
        <div className="flex gap-2">
          {showMyOrdersShortcut && (
            <NavLink
              to="/my-orders"
              className="flex-none w-12 h-12 inline-flex items-center justify-center border border-slate-300 text-slate-600 hover:bg-slate-50 transition-colors rounded"
              aria-label="My Orders"
            >
              <FaClipboardList className="w-5 h-5" />
            </NavLink>
          )}
          <NavLink 
            to="/login" 
            className="flex-1 py-3 text-center border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors rounded font-light tracking-wider uppercase text-sm"
          >
            Login
          </NavLink>
          <NavLink 
            to="/register" 
            className="flex-1 py-3 text-center bg-slate-800 text-white hover:bg-slate-900 transition-colors rounded font-light tracking-wider uppercase text-sm"
          >
            Register
          </NavLink>
        </div>
      </li>
    );
  };

  return (
    <>
      {isFixed && <div style={{ height: height }} aria-hidden="true" />}
      
      <div
        ref={headerRef}
        className={`
          w-full transition-all duration-300 z-50
          ${isDarkPage 
            ? isFixed 
              ? 'fixed top-0 left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-b border-amber-300/20 shadow-lg' 
              : 'absolute bg-transparent'
            : isFixed 
              ? 'fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-xl shadow-md' 
              : 'bg-white border-b border-slate-200'
          }
        `}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <NavLink to="/" aria-label="Home" className="transition-transform duration-300 hover:scale-105">
            <img
              src="/logo-horizontal-white.svg"
              className="h-10 w-auto"
              style={{ filter: isDarkPage ? "none" : "invert(1)" }}
              alt="Aurora & Co"
            />
          </NavLink>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <NavLink
              to="/"
              className={({ isActive }) => `
                relative font-light tracking-wide transition-all duration-300 group
                ${isActive ? "font-medium" : ""}
                ${isDarkPage ? "text-white" : "text-slate-700"}
              `}
            >
              Home
              <span
                className={`
                  absolute left-0 -bottom-1 h-px transition-all duration-300
                  ${isDarkPage ? "bg-amber-300" : "bg-slate-800"}
                  ${pathname === "/" ? "w-full" : "w-0 group-hover:w-full"}
                `}
              ></span>
            </NavLink>
            {links.map((link) => (
              <NavLink
                key={link}
                to={`/${link}`}
                className={({ isActive }) => `
                  relative capitalize font-light tracking-wide transition-all duration-300 group
                  ${isActive ? "font-medium" : ""}
                  ${isDarkPage ? "text-white" : "text-slate-700"}
                `}
              >
                {link}
                <span
                  className={`
                    absolute left-0 -bottom-1 h-px transition-all duration-300
                    ${isDarkPage ? "bg-amber-300" : "bg-slate-800"}
                    ${pathname === `/${link}` ? "w-full" : "w-0 group-hover:w-full"}
                  `}
                ></span>
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
            className={`
              md:hidden inline-flex items-center justify-center w-10 h-10
              transition-all duration-300
              ${isDarkPage ? "text-white" : "text-slate-700"}
            `}
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
          ${mobileMenuOpen ? 'visible' : 'invisible'}
        `}
      >
        {/* Backdrop */}
        <div 
          className={`
            absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300
            ${mobileMenuOpen ? 'opacity-100' : 'opacity-0'}
          `}
          onClick={() => setMobileMenuOpen(false)}
        />
        
        {/* Drawer */}
        <div 
          className={`
            absolute right-0 top-0 bottom-0 w-80 bg-white shadow-2xl
            transform transition-transform duration-300
            ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
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
                    block px-4 py-3 rounded transition-colors font-light tracking-wide
                    ${isActive 
                      ? "bg-amber-50 text-amber-600 font-medium" 
                      : "text-slate-700 hover:bg-slate-50"}
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
                      block px-4 py-3 rounded capitalize transition-colors font-light tracking-wide
                      ${isActive 
                        ? "bg-amber-50 text-amber-600 font-medium" 
                        : "text-slate-700 hover:bg-slate-50"}
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
