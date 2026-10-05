import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  UtensilsCrossed,
  Layers,
  Store,
  Users,
  BarChart3,
  LogOut,
  ExternalLink,
  Menu as MenuIcon,
  X,
  Bell,
  Shield,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';

const ADMIN_NAV = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { path: '/admin/menu', label: 'Menu Items', icon: UtensilsCrossed },
  { path: '/admin/categories', label: 'Categories', icon: Layers },
  { path: '/admin/restaurant', label: 'Restaurant', icon: Store },
  { path: '/admin/customers', label: 'Customers', icon: Users },
  { path: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
];

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const { success } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    success('Logged out from Admin portal');
    navigate('/');
  };

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin' || location.pathname === '/admin/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-[#FFFDF5] flex flex-col md:flex-row text-olive-dark">
      {/* Sidebar for Desktop & Tablet */}
      <aside className="hidden md:flex flex-col w-64 bg-[#3F4933] text-[#FFFDF5] shrink-0 border-r border-[#2D3524] select-none">
        {/* Brand Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <Link to="/admin" className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="BiteFlow Logo"
              className="w-9 h-9 object-contain rounded-xl bg-white/10 p-0.5"
            />
            <div>
              <span className="font-serif-title text-xl font-bold tracking-tight text-white block leading-tight">
                Bite<span className="text-sand">Flow</span>
              </span>
              <span className="text-[10px] tracking-widest uppercase font-semibold text-sand/70">
                Store Admin
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {ADMIN_NAV.map((item) => {
            const active = isActive(item.path);
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  active
                    ? 'bg-olive text-[#FFFDF5] shadow-sm'
                    : 'text-sand/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </div>
                {active && <ChevronRight className="w-3.5 h-3.5 opacity-80" />}
              </Link>
            );
          })}
        </nav>

        {/* Storefront View Shortcut & Admin Sign Out */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-sand/80 hover:bg-white/10 hover:text-white transition-colors"
          >
            <div className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Customer Storefront</span>
            </div>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-300 hover:bg-rose-500/20 transition-colors text-left"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Admin</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-30 bg-[#FFFDF5]/95 backdrop-blur-md border-b border-sand-border/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile Sidebar Hamburger */}
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="md:hidden p-2 rounded-xl text-olive-dark hover:bg-sand/40"
              aria-label="Toggle admin menu"
            >
              {mobileSidebarOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-olive-dark/60 uppercase tracking-wider hidden sm:inline">
                Admin Console
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Customer storefront quick link */}
            <Link
              to="/"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-sand-border bg-[#FFFDF5] text-xs font-semibold text-olive-dark hover:bg-sand/30 transition-all shadow-subtle"
            >
              <ExternalLink className="w-3.5 h-3.5 text-olive" />
              <span>Storefront View</span>
            </Link>

            {/* Admin Profile Pill */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-sand/40 border border-sand-border text-xs">
              <div className="w-6 h-6 rounded-lg bg-olive text-[#FFFDF5] flex items-center justify-center font-bold text-[10px]">
                {user?.name?.charAt(0).toUpperCase() || 'A'}
              </div>
              <span className="font-bold text-olive-deep hidden sm:inline">
                {user?.name?.split(' ')[0] || 'Administrator'}
              </span>
            </div>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileSidebarOpen && (
          <div className="md:hidden bg-[#3F4933] text-[#FFFDF5] p-4 space-y-1.5 border-b border-[#2D3524] animate-in fade-in duration-200">
            {ADMIN_NAV.map((item) => {
              const active = isActive(item.path);
              const Icon = item.icon;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    active ? 'bg-olive text-[#FFFDF5]' : 'text-sand/80 hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
              <Link
                to="/"
                onClick={() => setMobileSidebarOpen(false)}
                className="flex items-center gap-2 text-xs text-sand/80 px-3.5 py-2"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Customer Storefront</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-xs text-rose-300 px-3.5 py-2 text-left"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
