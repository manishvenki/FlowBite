import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  User as UserIcon,
  MapPin,
  Menu,
  X,
  LogOut,
  ChevronDown,
  ShieldAlert,
  Compass,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { useToast } from '../../hooks/useToast';
import { useLocationArea } from '../../context/LocationContext';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { totals } = useCart();
  const { success } = useToast();
  const { area, openLocationModal } = useLocationArea();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    success('Logged out successfully');
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-[#FFFDF5]/95 backdrop-blur-md border-b border-sand-border/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-3 group">
              <img
                src="/logo.png"
                alt="BiteFlow Logo"
                className="w-10 h-10 object-contain rounded-xl shadow-subtle group-hover:scale-105 transition-transform"
              />
              <div className="flex flex-col">
                <span className="font-serif-title text-2xl font-bold tracking-tight text-olive-dark group-hover:text-olive transition-colors leading-none">
                  Bite<span className="text-olive">Flow</span>
                </span>
                <span className="text-[10px] tracking-widest uppercase font-semibold text-olive-dark/50 mt-1">
                  Order. Prepare. Deliver.
                </span>
              </div>
            </Link>

            {/* Interactive Bengaluru Location Selector Button */}
            <button
              type="button"
              onClick={openLocationModal}
              className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sand/50 hover:bg-sand/80 border border-sand-border/80 text-xs font-medium text-olive-dark transition-all duration-200 cursor-pointer shadow-subtle group"
              title="Click to change your delivery location"
            >
              <MapPin className="w-3.5 h-3.5 text-olive shrink-0 group-hover:scale-110 transition-transform" />
              <div className="flex items-center gap-1.5">
                <span className="text-olive-dark/65">📍</span>
                <span className="font-bold text-olive-deep">{area}</span>
                <span className="text-olive-dark/60">• Bengaluru</span>
              </div>
              <ChevronDown className="w-3 h-3 text-olive-dark/60 shrink-0 ml-0.5" />
            </button>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className={`text-sm font-semibold transition-colors hover:text-olive ${
                isActive('/') || isActive('/home')
                  ? 'text-olive underline underline-offset-8 decoration-2 decoration-olive'
                  : 'text-olive-dark/80'
              }`}
            >
              Home
            </Link>
            <Link
              to="/restaurants"
              className={`text-sm font-semibold transition-colors hover:text-olive flex items-center gap-1.5 ${
                isActive('/restaurants')
                  ? 'text-olive underline underline-offset-8 decoration-2 decoration-olive'
                  : 'text-olive-dark/80'
              }`}
            >
              <Compass className="w-4 h-4" />
              Restaurants
            </Link>
          </nav>

          {/* Right Actions: Cart & Auth */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Cart Button */}
            <Link
              to="/cart"
              className="relative flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-sand-border bg-[#FFFDF5] text-olive-dark hover:border-olive/50 hover:bg-sand/30 transition-all shadow-subtle active:scale-95"
              aria-label="View Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 text-olive" />
              <span className="hidden sm:inline text-xs font-semibold">Cart</span>
              {totals.itemCount > 0 && (
                <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold bg-olive text-[#FFFDF5] rounded-full">
                  {totals.itemCount}
                </span>
              )}
            </Link>

            {/* User Profile / Auth */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-2 rounded-xl border border-sand-border bg-[#FFFDF5] hover:border-olive/40 hover:bg-sand/30 transition-all shadow-subtle"
                >
                  <div className="w-8 h-8 rounded-lg bg-olive text-[#FFFDF5] flex items-center justify-center font-bold text-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline text-xs font-bold text-olive-dark leading-tight truncate max-w-[120px]">
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-olive-dark/60 hidden sm:block" />
                </button>

                {/* Profile Dropdown */}
                {profileDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-[#FFFDF5] border border-sand-border rounded-2xl shadow-modal py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                    onMouseLeave={() => setProfileDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-sand-border/60">
                      <p className="text-xs font-bold text-olive-dark truncate">{user.name}</p>
                      <p className="text-[11px] text-olive-dark/60 truncate">{user.email}</p>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-olive-dark hover:bg-sand/40 hover:text-olive font-medium transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-olive" />
                      My Profile
                    </Link>

                    <Link
                      to="/orders"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-olive-dark hover:bg-sand/40 hover:text-olive font-medium transition-colors"
                    >
                      <ShoppingBag className="w-4 h-4 text-olive" />
                      My Orders
                    </Link>

                    <Link
                      to="/addresses"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-olive-dark hover:bg-sand/40 hover:text-olive font-medium transition-colors"
                    >
                      <MapPin className="w-4 h-4 text-olive" />
                      Saved Addresses
                    </Link>

                    {user.role === 'ADMIN' && (
                      <Link
                        to="/admin"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-terracotta hover:bg-[#FFF5F2] font-semibold border-t border-b border-sand-border/50 transition-colors"
                      >
                        <ShieldAlert className="w-4 h-4 text-terracotta" />
                        Admin Interface
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-terracotta hover:bg-sand/30 font-medium transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4 text-terracotta" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-xs md:text-sm font-semibold text-olive-dark hover:text-olive transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-xs md:text-sm font-semibold rounded-xl bg-olive text-[#FFFDF5] hover:bg-[#566041] transition-all shadow-subtle active:scale-95"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="md:hidden p-2 rounded-xl text-olive-dark hover:bg-sand/40 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-sand-border/80 py-4 px-2 space-y-3 animate-in fade-in duration-200">
            {/* Mobile Location Selector */}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                openLocationModal();
              }}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-sand/40 border border-sand-border/80 text-xs font-semibold text-olive-dark mb-2"
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-olive shrink-0" />
                <span>📍 {area}, Bengaluru</span>
              </div>
              <span className="text-olive underline font-bold text-[11px]">Change Area</span>
            </button>

            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-semibold text-olive-dark hover:bg-sand/50"
            >
              Home
            </Link>
            <Link
              to="/restaurants"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-semibold text-olive-dark hover:bg-sand/50"
            >
              Restaurants
            </Link>
            <Link
              to="/cart"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2 rounded-xl text-sm font-semibold text-olive-dark hover:bg-sand/50"
            >
              <span>Shopping Cart</span>
              <span className="px-2 py-0.5 text-xs bg-olive text-white rounded-full">
                {totals.itemCount} items
              </span>
            </Link>

            {user ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl text-sm font-semibold text-olive-dark hover:bg-sand/50"
                >
                  My Profile
                </Link>
                <Link
                  to="/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl text-sm font-semibold text-olive-dark hover:bg-sand/50"
                >
                  My Orders
                </Link>
                <Link
                  to="/addresses"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl text-sm font-semibold text-olive-dark hover:bg-sand/50"
                >
                  Saved Addresses
                </Link>
                {user.role === 'ADMIN' && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-xl text-sm font-semibold text-terracotta hover:bg-[#FFF5F2]"
                  >
                    Admin Interface
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded-xl text-sm font-semibold text-terracotta hover:bg-sand/40"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="pt-2 flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 text-sm font-semibold rounded-xl border border-sand-border text-olive-dark"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 text-sm font-semibold rounded-xl bg-olive text-white"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
