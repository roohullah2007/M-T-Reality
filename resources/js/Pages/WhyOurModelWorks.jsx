import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Building2, DollarSign, Users, Monitor, CheckCircle, ArrowRight } from 'lucide-react';

export default function WhyOurModelWorks() {
  const legacyCosts = [
    { icon: Building2, label: 'Large office spaces' },
    { icon: DollarSign, label: 'Franchise royalty fees' },
    { icon: Users, label: 'Multi-layered management' },
    { icon: Monitor, label: 'Legacy systems' }
  ];

  const benefits = [
    'Full-service representation',
    'Experienced negotiation',
    'Professional marketing',
    'More equity retained at closing'
  ];

  return (
    <>
      <Head title="Why Our Model Works" />

      {/* Hero Section */}
      <section className="relative">
        <div className="relative min-h-[85vh] flex items-center overflow-hidden">
          {/* Background Image */}
          <img
            src="https://images.pexels.com/photos/1546168/pexels-photo-1546168.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40"></div>

          {/* Content */}
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 relative z-10 w-full py-20 pt-[120px]">
            <div className="max-w-3xl">
              {/* Badge */}
              <div className="inline-flex items-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2 mb-6">
                <span className="text-white/90 text-sm font-medium" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  Why Our Model Works
                </span>
              </div>

              <h1
                className="text-white text-[40px] sm:text-[50px] md:text-[60px] font-medium leading-[1.1] mb-6 drop-shadow-2xl"
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                A Smarter Structure<br />for Today's Market
              </h1>
              <p
                className="text-white/90 text-[16px] sm:text-[18px] font-medium leading-relaxed max-w-2xl drop-shadow-lg"
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                The real estate industry has not meaningfully reduced its cost structure in decades.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Legacy Model Section */}
      <section className="bg-[#EEEDEA] py-20 md:py-28">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left - Text */}
            <div>
              <h2
                className="text-[32px] md:text-[44px] font-medium text-[#111] leading-[1.15] mb-6"
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                Many firms still<br />operate on:
              </h2>
              <p
                className="text-[16px] text-[#666] font-medium leading-relaxed"
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                These legacy structures add cost — not value — to your transaction. As a seller, you end up paying for overhead that has nothing to do with selling your home.
              </p>
            </div>

            {/* Right - Legacy Cost Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {legacyCosts.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={index}
                    className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-4">
                      <IconComponent className="w-6 h-6 text-[#2BBBAD]" />
                    </div>
                    <p
                      className="text-[16px] font-semibold text-[#111]"
                      style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                    >
                      {item.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Built Differently Section */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center bg-[#E5E1DC] rounded-lg px-4 py-2 mb-8">
              <span className="text-[#666] text-sm font-medium" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                Our Approach
              </span>
            </div>
            <h2
              className="text-[32px] md:text-[48px] font-medium text-[#111] leading-[1.15] mb-6"
              style={{ fontFamily: 'Instrument Sans, sans-serif' }}
            >
              M&T Realty Group was<br />built differently.
            </h2>
            <p
              className="text-[16px] md:text-[18px] text-[#666] font-medium leading-relaxed max-w-2xl mx-auto"
              style={{ fontFamily: 'Instrument Sans, sans-serif' }}
            >
              We use technology, streamlined systems, and direct communication to eliminate unnecessary overhead — not service.
            </p>
          </div>
        </div>
      </section>

      {/* What That Means For You Section */}
      <section className="bg-[#EEEDEA] py-20 md:py-28">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left - Title */}
            <div>
              <h2
                className="text-[32px] md:text-[48px] font-medium text-[#111] leading-[1.15] mb-6"
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                What That Means<br />For You
              </h2>
              <p
                className="text-[16px] text-[#666] font-medium leading-relaxed mb-8"
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                Our lean structure translates directly into better outcomes for our clients. You get the same professional service — with a smarter cost structure.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-[#2BBBAD] text-white rounded-full px-6 py-3.5 font-semibold text-[15px] transition-all duration-300 hover:bg-[#249E93] hover:shadow-lg hover:shadow-[#2BBBAD]/25"
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                <span>Schedule a Consultation</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Right - Benefits List */}
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 flex items-center gap-4 border border-gray-200 hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-10 h-10 bg-[#2BBBAD]/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-[#2BBBAD]" />
                  </div>
                  <p
                    className="text-[18px] font-semibold text-[#111]"
                    style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                  >
                    {benefit}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-white py-16 md:py-20">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="bg-[#1a1a1a] rounded-2xl p-10 md:p-16 text-center">
            <h2
              className="text-white text-[28px] md:text-[40px] font-medium mb-4 leading-[1.15]"
              style={{ fontFamily: 'Instrument Sans, sans-serif' }}
            >
              Efficiency is not a compromise.
            </h2>
            <p
              className="text-[#2BBBAD] text-[24px] md:text-[32px] font-medium mb-8"
              style={{ fontFamily: 'Instrument Sans, sans-serif' }}
            >
              It's an advantage.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-[#2BBBAD] text-white rounded-full px-8 py-3.5 font-semibold text-[15px] transition-all duration-300 hover:bg-[#249E93] hover:shadow-lg hover:shadow-[#2BBBAD]/25"
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                Schedule a Consultation
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <mask id="mask_wom_cta" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
                    <rect width="20" height="20" transform="matrix(-1 0 0 1 20 0)" fill="#D9D9D9"/>
                  </mask>
                  <g mask="url(#mask_wom_cta)">
                    <path d="M13.459 10.8334L11.084 13.2084C10.9173 13.3751 10.8375 13.5695 10.8444 13.7918C10.8513 14.014 10.9312 14.2084 11.084 14.3751C11.2507 14.5418 11.4486 14.6286 11.6777 14.6355C11.9069 14.6425 12.1048 14.5626 12.2715 14.3959L16.084 10.5834C16.2507 10.4168 16.334 10.2223 16.334 10.0001C16.334 9.77787 16.2507 9.58343 16.084 9.41676L12.2715 5.60426C12.1048 5.43759 11.9069 5.35773 11.6777 5.36467C11.4486 5.37162 11.2507 5.45842 11.084 5.62509C10.9312 5.79176 10.8513 5.9862 10.8444 6.20842C10.8375 6.43065 10.9173 6.62509 11.084 6.79176L13.459 9.16676H4.16732C3.93121 9.16676 3.73329 9.24662 3.57357 9.40634C3.41385 9.56606 3.33398 9.76398 3.33398 10.0001C3.33398 10.2362 3.41385 10.4341 3.57357 10.5938C3.73329 10.7536 3.93121 10.8334 4.16732 10.8334H13.459Z" fill="white"/>
                  </g>
                </svg>
              </Link>
              <Link
                href="/how-it-works"
                className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/30 text-white rounded-full px-8 py-3.5 font-semibold text-[15px] transition-all duration-300 hover:bg-white/20"
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                See How It Works
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
