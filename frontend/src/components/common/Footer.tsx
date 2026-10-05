import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShieldCheck, Clock, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#FAF7EE] border-t border-sand-border mt-20">
      {/* Top Value Propositions */}
      <div className="border-b border-sand-border/70 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-sand/60 flex items-center justify-center text-olive shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif-title font-bold text-olive-dark">Curated Artisanal Kitchens</h4>
              <p className="text-xs text-olive-dark/70 mt-0.5">Only verified craft culinary makers & fresh recipes</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-sand/60 flex items-center justify-center text-olive shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif-title font-bold text-olive-dark">Swift Warm Delivery</h4>
              <p className="text-xs text-olive-dark/70 mt-0.5">Optimized routing keeps your meal fresh and warm</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-sand/60 flex items-center justify-center text-olive shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif-title font-bold text-olive-dark">Pure Ingredients Guarantee</h4>
              <p className="text-xs text-olive-dark/70 mt-0.5">Clear dietary markers and verified food safety</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="BiteFlow Logo"
                className="w-10 h-10 object-contain rounded-xl"
              />
              <span className="font-serif-title text-2xl font-bold tracking-tight text-olive-dark">
                Bite<span className="text-olive">Flow</span>
              </span>
            </div>
            <p className="text-xs text-olive-dark/70 leading-relaxed">
              Order. Prepare. Deliver. BiteFlow pairs food lovers with mindful culinary creators across the city.
            </p>
            <div className="pt-1 text-xs text-olive-dark/50">
              Palette: Olive & Sand Collection
            </div>
          </div>

          <div>
            <h5 className="font-semibold text-xs uppercase tracking-wider text-olive-dark/90 mb-4">
              Explore
            </h5>
            <ul className="space-y-2.5 text-sm text-olive-dark/75">
              <li>
                <Link to="/" className="hover:text-olive transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/restaurants" className="hover:text-olive transition-colors">
                  All Restaurants
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-olive transition-colors">
                  Active Cart
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold text-xs uppercase tracking-wider text-olive-dark/90 mb-4">
              Account & Profile
            </h5>
            <ul className="space-y-2.5 text-sm text-olive-dark/75">
              <li>
                <Link to="/profile" className="hover:text-olive transition-colors">
                  My Profile
                </Link>
              </li>
              <li>
                <Link to="/addresses" className="hover:text-olive transition-colors">
                  Saved Delivery Addresses
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-olive transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-olive transition-colors">
                  Create Account
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold text-xs uppercase tracking-wider text-olive-dark/90 mb-4">
              Culinary Standards
            </h5>
            <p className="text-xs text-olive-dark/70 leading-relaxed mb-4">
              Every kitchen on BiteFlow is held to rigorous standards for fresh preparation, packaging sustainability, and delivery temperature.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sand/60 text-xs font-semibold text-olive-dark">
              <span>🌱 100% Chef Verified</span>
            </div>
          </div>
        </div>

        <div className="border-t border-sand-border/70 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-olive-dark/60 gap-4">
          <p>© {new Date().getFullYear()} BiteFlow Inc. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-terracotta fill-terracotta" />
            <span>for food connoisseurs</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
