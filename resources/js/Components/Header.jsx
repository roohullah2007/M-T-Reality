import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Menu, X, User, Settings, LogOut, LayoutDashboard, ChevronDown, Shield } from 'lucide-react';

const Header = () => {
  const { auth, url } = usePage().props;
  const currentUrl = usePage().url;
  const user = auth?.user;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Pages with hero sections where header should be transparent
  const heroPages = ['/', '/how-it-works', '/why-our-model-works', '/about', '/testimonials', '/contact'];
  const isHeroPage = heroPages.includes(currentUrl.split('?')[0]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 h-[77px] transition-all duration-300 ${isHeroPage && !scrolled ? 'bg-transparent' : 'bg-[#1a1a1a] border-b border-white/10 shadow-lg'}`}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-[40px] h-full">
          <div className="flex items-center justify-between h-full">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <img
                src="/images/white-logo.png"
                alt="M&T Realty Group"
                className="h-[24px] sm:h-[28px] w-auto"
              />
            </Link>

            {/* Center Navigation - Desktop */}
            <nav className="hidden lg:flex items-center gap-8">
              <Link href="/" className="text-[14px] font-instrument font-semibold text-white/90 hover:text-[#2BBBAD] transition-colors relative group">
                Home
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#2BBBAD] group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link href="/properties" className="text-[14px] font-instrument font-semibold text-white/90 hover:text-[#2BBBAD] transition-colors relative group">
                Our Listings
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#2BBBAD] group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link href="/buyers" className="text-[14px] font-instrument font-semibold text-white/90 hover:text-[#2BBBAD] transition-colors relative group">
                Buyers
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#2BBBAD] group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link href="/sellers" className="text-[14px] font-instrument font-semibold text-white/90 hover:text-[#2BBBAD] transition-colors relative group">
                Sellers
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#2BBBAD] group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link href="/our-packages" className="text-[14px] font-instrument font-semibold text-white/90 hover:text-[#2BBBAD] transition-colors relative group">
                Our Services
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#2BBBAD] group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link href="/mortgages" className="text-[14px] font-instrument font-semibold text-white/90 hover:text-[#2BBBAD] transition-colors relative group">
                Mortgage
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#2BBBAD] group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link href="/about" className="text-[14px] font-instrument font-semibold text-white/90 hover:text-[#2BBBAD] transition-colors relative group">
                About Us
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#2BBBAD] group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link href="/contact" className="text-[14px] font-instrument font-semibold text-white/90 hover:text-[#2BBBAD] transition-colors relative group">
                Contact
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#2BBBAD] group-hover:w-full transition-all duration-300"></span>
              </Link>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {user ? (
                /* Logged In - Profile Dropdown */
                <div className="relative">
                  <button
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-full hover:bg-white/10 transition-colors"
                  >
                    <div className="w-9 h-9 bg-[#2BBBAD] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <ChevronDown className={`w-4 h-4 text-white/60 hidden md:block transition-transform ${profileMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Profile Dropdown Menu */}
                  {profileMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setProfileMenuOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 z-20 py-2">
                        {/* User Info */}
                        <div className="px-4 py-3 border-b border-gray-100">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#2BBBAD] rounded-full flex items-center justify-center text-white font-semibold">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                              <p className="text-xs text-gray-500 truncate">{user.email}</p>
                            </div>
                          </div>
                          {user.role === 'admin' && (
                            <span className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 bg-[#2BBBAD]/10 text-[#2BBBAD] text-xs font-medium rounded-full">
                              <Shield className="w-3 h-3" />
                              Admin
                            </span>
                          )}
                        </div>

                        {/* Menu Items */}
                        <div className="py-1">
                          <Link
                            href={route('dashboard')}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => setProfileMenuOpen(false)}
                          >
                            <LayoutDashboard className="w-4 h-4 text-gray-400" />
                            Dashboard
                          </Link>
                          <Link
                            href={route('profile.edit')}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => setProfileMenuOpen(false)}
                          >
                            <User className="w-4 h-4 text-gray-400" />
                            Profile Settings
                          </Link>
                          {user.role === 'admin' && (
                            <Link
                              href={route('admin.dashboard')}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#2BBBAD] hover:bg-red-50 transition-colors"
                              onClick={() => setProfileMenuOpen(false)}
                            >
                              <Shield className="w-4 h-4" />
                              Admin Panel
                            </Link>
                          )}
                        </div>

                        {/* Logout */}
                        <div className="border-t border-gray-100 pt-1">
                          <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => setProfileMenuOpen(false)}
                          >
                            <LogOut className="w-4 h-4 text-gray-400" />
                            Sign Out
                          </Link>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                /* Not Logged In - Login Button */
                <Link
                  href="/login"
                  className="hidden md:block text-[14px] font-instrument font-semibold text-white/90 hover:text-[#2BBBAD] transition-colors"
                >
                  Login
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-white hover:text-[#2BBBAD] transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          ></div>

          {/* Menu Panel */}
          <div className="fixed top-[77px] left-0 right-0 bg-[#1a1a1a] border-b border-white/10 shadow-xl max-h-[calc(100vh-77px)] overflow-y-auto">
            <nav className="max-w-[1400px] mx-auto px-4 py-6 space-y-4">
              <Link
                href="/"
                className="block text-[16px] font-semibold text-white/90 hover:text-[#2BBBAD] transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/properties"
                className="block text-[16px] font-semibold text-white/90 hover:text-[#2BBBAD] transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Our Listings
              </Link>
              <Link
                href="/buyers"
                className="block text-[16px] font-semibold text-white/90 hover:text-[#2BBBAD] transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Buyers
              </Link>
              <Link
                href="/sellers"
                className="block text-[16px] font-semibold text-white/90 hover:text-[#2BBBAD] transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sellers
              </Link>
              <Link
                href="/our-packages"
                className="block text-[16px] font-semibold text-white/90 hover:text-[#2BBBAD] transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Our Services
              </Link>
              <Link
                href="/mortgages"
                className="block text-[16px] font-semibold text-white/90 hover:text-[#2BBBAD] transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Mortgage
              </Link>
              <Link
                href="/about"
                className="block text-[16px] font-semibold text-white/90 hover:text-[#2BBBAD] transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                About Us
              </Link>
              <Link
                href="/contact"
                className="block text-[16px] font-semibold text-white/90 hover:text-[#2BBBAD] transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>

              <div className="pt-4 border-t border-white/10">
                {user ? (
                  <>
                    {/* Logged in mobile user */}
                    <div className="flex items-center gap-3 py-3">
                      <div className="w-10 h-10 bg-[#2BBBAD] rounded-full flex items-center justify-center text-white font-semibold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{user.name}</p>
                        <p className="text-sm text-white/60">{user.email}</p>
                      </div>
                    </div>
                    <Link
                      href={route('dashboard')}
                      className="flex items-center gap-3 text-[16px] font-semibold text-white/90 hover:text-[#2BBBAD] transition-colors py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <LayoutDashboard className="w-5 h-5" />
                      Dashboard
                    </Link>
                    <Link
                      href={route('profile.edit')}
                      className="flex items-center gap-3 text-[16px] font-semibold text-white/90 hover:text-[#2BBBAD] transition-colors py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <User className="w-5 h-5" />
                      Profile Settings
                    </Link>
                    {user.role === 'admin' && (
                      <Link
                        href={route('admin.dashboard')}
                        className="flex items-center gap-3 text-[16px] font-semibold text-[#2BBBAD] hover:text-[#249E93] transition-colors py-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Shield className="w-5 h-5" />
                        Admin Panel
                      </Link>
                    )}
                    <Link
                      href={route('logout')}
                      method="post"
                      as="button"
                      className="flex items-center gap-3 text-[16px] font-semibold text-white/60 hover:text-red-400 transition-colors py-2 w-full"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <LogOut className="w-5 h-5" />
                      Sign Out
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="block text-[16px] font-semibold text-white/90 hover:text-[#2BBBAD] transition-colors py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      className="block text-[16px] font-semibold text-white/90 hover:text-[#2BBBAD] transition-colors py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </>
                )}
                <Link
                  href="/contact"
                  className="block sm:hidden mt-2 text-center bg-[#2BBBAD] text-white rounded-full py-3 px-6 font-medium transition-all duration-300 hover:bg-[#249E93]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Schedule a Consultation
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
