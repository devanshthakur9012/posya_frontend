"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Search, Heart, ShoppingBag, Menu, X, LogOut } from "lucide-react";
import PosysLogo from "../public/images/l1.png";
import Link from "next/link";
import SearchPopUp from "./SearchPopUp";
import CartDrawer from "./CartDrawer";
import { useCart } from "./CartContext";
import WishlistDrawer from "./WishlistDrawer";
import { useWishlist } from "./WishlistContext";
import { usePathname } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

function parseJwt(token: string) {
  try { return JSON.parse(atob(token.split(".")[1])); }
  catch { return null; }
}

export default function Header() {
  const pathname = usePathname();
  const [mobileMenu, setMobileMenu] = useState(false);
  const [showSearchBar, setSearchbar] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const { cartItems } = useCart();
  const totalQty = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const { wishlistItems } = useWishlist();
  const totalWishlist = wishlistItems.length;

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    token ? parseJwt(token) : null
  );

  const [offerText, setOfferText] = useState("");

  useEffect(() => {
    fetch(`${BASE_URL}getOfferText`)
      .then(r => r.json())
      .then(j => setOfferText(j.data.text))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!token) return;
    fetch(`${BASE_URL}profile`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(d => setUser(d.user))
      .catch(() => setUser(null));
  }, [token]);

  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("token");
    setShowUserMenu(false);
  };

  const navLinks = [
    { href: "/our-story", label: "Brand Essence" },
    { href: "/shop", label: "Our Collection" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact Us" },
  ];

  return (
    <>
      <header className={`px-6 shadow-sm flex items-center z-50 bg-white transition-all duration-300 ease-in-out ${
        isSticky ? "fixed top-0 left-0 right-0 shadow-lg py-2" : "relative py-1"
      }`}>

        {/* LEFT — Logo */}
        <div className="flex items-center gap-4 flex-1">
          <button className="lg:hidden z-50" onClick={() => setMobileMenu(true)}>
            <Menu size={26} className="text-[#2b1a06]" />
          </button>
          <Link href="/">
            <Image
              src={PosysLogo}
              alt="Posya Logo"
              width={isSticky ? 45 : 65}
              height={isSticky ? 45 : 65}
              className="transition-all duration-300"
            />
          </Link>
        </div>

        {/* CENTER — Nav */}
        <nav className="hidden lg:flex flex-[2] justify-center gap-8 text-sm uppercase tracking-wide primary-nav">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition-colors nav-link ${
                pathname === link.href ? "hdr-nav-active" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* RIGHT — Icons */}
        <div className="flex items-center gap-3 lg:gap-5 flex-1 justify-end">

          {/* Desktop user dropdown */}
          <div className="relative hidden md:block">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="hdr-avatar"
                >
                  {user.name.charAt(0).toUpperCase()}
                </button>

                {showUserMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                    <div className="hdr-user-dropdown">
                      <div className="hdr-user-dropdown-top">
                        <p className="hdr-user-dropdown-name">{user.name}</p>
                        <p className="hdr-user-dropdown-email">{user.email}</p>
                      </div>
                      <Link
                        href="/dashboard"
                        className="hdr-user-dropdown-link"
                        onClick={() => setShowUserMenu(false)}
                      >
                        My Dashboard
                      </Link>
                      <button onClick={handleLogout} className="hdr-user-dropdown-logout">
                        <LogOut size={15} /> Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm font-semibold login-buttons">
                <Link href="/login" className="hover:underline">Login</Link>
                <span className="text-gray-400">|</span>
                <Link href="/register" className="hover:underline">Register</Link>
              </div>
            )}
          </div>

          <Search onClick={() => setSearchbar(true)} className="cursor-pointer" size={22} />

          <div className="relative cursor-pointer" onClick={() => setShowWishlist(true)}>
            <Heart size={22} />
            {totalWishlist > 0 && (
              <span className="absolute -top-2 -right-2 topBuddge text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalWishlist}
              </span>
            )}
          </div>

          <div className="relative cursor-pointer" onClick={() => setShowCart(true)}>
            <ShoppingBag size={22} />
            {totalQty > 0 && (
              <span className="absolute -top-2 -right-2 topBuddge text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalQty}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* ── Mobile Sidebar ── */}
      <div
        className={`hdr-mobile-overlay lg:hidden ${mobileMenu ? "hdr-mobile-overlay--open" : "hdr-mobile-overlay--closed"}`}
        onClick={() => setMobileMenu(false)}
      >
        <div
          className={`hdr-mobile-drawer ${mobileMenu ? "hdr-mobile-drawer--open" : ""}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Brand bar */}
          <div className="hdr-drawer-brand">
            <div>
              <span className="hdr-drawer-brand-name">POSYA</span>
              <span className="hdr-drawer-brand-tag">Pure from the Himalayas</span>
            </div>
            <button className="hdr-drawer-close" onClick={() => setMobileMenu(false)}>
              <X size={16} />
            </button>
          </div>

          {/* User card — logged in */}
          {user && (
            <div className="hdr-drawer-user">
              <div className="hdr-drawer-user-row">
                <div className="hdr-drawer-avatar">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="hdr-drawer-user-name">{user.name}</p>
                  <p className="hdr-drawer-user-email">{user.email}</p>
                </div>
              </div>
              <Link
                href="/dashboard"
                className="hdr-drawer-dashboard-btn"
                onClick={() => setMobileMenu(false)}
              >
                My Dashboard
              </Link>
              <button
                onClick={() => { handleLogout(); setMobileMenu(false); }}
                className="hdr-drawer-logout-btn"
              >
                <LogOut size={15} /> Logout
              </button>
            </div>
          )}

          {/* Nav links */}
          <nav className="hdr-drawer-nav">
            <div className="hdr-drawer-nav-divider" />
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`hdr-drawer-nav-link ${pathname === link.href ? "hdr-drawer-nav-link--active" : ""}`}
                onClick={() => setMobileMenu(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Bottom auth — not logged in */}
          {!user && (
            <div className="hdr-drawer-auth">
              <span className="hdr-drawer-auth-label">Join Posya Community</span>
              <Link
                href="/login"
                className="hdr-drawer-login-btn"
                onClick={() => setMobileMenu(false)}
              >
                Login to Your Account
              </Link>
              <Link
                href="/register"
                className="hdr-drawer-register-btn"
                onClick={() => setMobileMenu(false)}
              >
                Create New Account
              </Link>
            </div>
          )}
        </div>
      </div>

      {isSticky && <div className="h-[55px]" />}

      <WishlistDrawer isOpen={showWishlist} onClose={() => setShowWishlist(false)} />
      <CartDrawer isOpen={showCart} onClose={() => setShowCart(false)} />
      <SearchPopUp isOpen={showSearchBar} onClose={() => setSearchbar(false)} />
    </>
  );
}