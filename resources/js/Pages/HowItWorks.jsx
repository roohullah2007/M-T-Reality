import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { ClipboardList, Camera, Handshake, FileCheck } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      number: '01',
      icon: ClipboardList,
      title: 'Strategic Consultation',
      description: 'We evaluate your property, review market data, and create a pricing strategy designed to attract strong offers.',
      color: '#2BBBAD'
    },
    {
      number: '02',
      icon: Camera,
      title: 'Professional Marketing',
      description: 'High-quality photography, MLS exposure, digital marketing, and buyer outreach.',
      color: '#3B82F6'
    },
    {
      number: '03',
      icon: Handshake,
      title: 'Negotiation & Offer Management',
      description: 'We negotiate strategically — not emotionally — to protect your position and maximize your outcome.',
      color: '#10B981'
    },
    {
      number: '04',
      icon: FileCheck,
      title: 'Contract to Closing',
      description: 'From inspections to title coordination, we manage every step to ensure a smooth transaction.',
      color: '#8B5CF6'
    }
  ];

  return (
    <>
      <Head title="How It Works" />

      {/* Hero Section */}
      <section className="relative">
        <div className="relative min-h-[85vh] flex items-center overflow-hidden">
          {/* Background Image */}
          <img
            src="https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/55 to-black/35"></div>

          {/* Content */}
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 relative z-10 w-full py-20 pt-[120px]">
            <div className="max-w-3xl">
              {/* Badge */}
              <div className="inline-flex items-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2 mb-6">
                <span className="text-white/90 text-sm font-medium" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  How It Works
                </span>
              </div>

              <h1
                className="text-white text-[40px] sm:text-[50px] md:text-[60px] font-medium leading-[1.1] mb-5 drop-shadow-2xl"
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                Selling With<br />M&T Realty Group
              </h1>
              <p
                className="text-white/90 text-[16px] sm:text-[18px] font-medium leading-relaxed max-w-2xl drop-shadow-lg"
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                Our model is efficient behind the scenes — but comprehensive where it matters.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="bg-[#EEEDEA] py-20 md:py-28">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2
              className="text-[32px] md:text-[48px] font-medium text-[#111] mb-4"
              style={{ fontFamily: 'Instrument Sans, sans-serif' }}
            >
              Four Steps to a Successful Sale
            </h2>
            <p
              className="text-[14px] md:text-[16px] text-[#666] font-medium max-w-2xl mx-auto"
              style={{ fontFamily: 'Instrument Sans, sans-serif' }}
            >
              From initial consultation to closing day, we manage the entire process so you don't have to.
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-8">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              const isEven = index % 2 === 1;

              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <div className={`flex flex-col ${isEven ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-stretch`}>
                    {/* Number & Icon Side */}
                    <div
                      className="lg:w-[280px] flex-shrink-0 p-8 lg:p-10 flex flex-col items-center justify-center text-center"
                      style={{ backgroundColor: `${step.color}08` }}
                    >
                      <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                        style={{ backgroundColor: `${step.color}15` }}
                      >
                        <IconComponent className="w-8 h-8" style={{ color: step.color }} />
                      </div>
                      <span
                        className="text-[56px] font-bold leading-none opacity-15"
                        style={{ color: step.color, fontFamily: 'Instrument Sans, sans-serif' }}
                      >
                        {step.number}
                      </span>
                    </div>

                    {/* Content Side */}
                    <div className="flex-1 p-8 lg:p-10 flex flex-col justify-center">
                      <div
                        className="text-sm font-semibold mb-2"
                        style={{ color: step.color, fontFamily: 'Instrument Sans, sans-serif' }}
                      >
                        STEP {step.number}
                      </div>
                      <h3
                        className="text-[24px] md:text-[28px] font-medium text-[#111] mb-4"
                        style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                      >
                        {step.title}
                      </h3>
                      <p
                        className="text-[16px] text-[#666] leading-relaxed max-w-xl"
                        style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                      >
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom Tagline */}
      <section className="bg-white py-16 md:py-20">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="bg-[#1a1a1a] rounded-2xl p-10 md:p-16 text-center">
            <h2
              className="text-white text-[28px] md:text-[36px] font-medium mb-4"
              style={{ fontFamily: 'Instrument Sans, sans-serif' }}
            >
              Our model is efficient behind the scenes —<br className="hidden md:block" /> but comprehensive where it matters.
            </h2>
            <p
              className="text-white/70 text-[16px] font-medium mb-8 max-w-2xl mx-auto"
              style={{ fontFamily: 'Instrument Sans, sans-serif' }}
            >
              Ready to sell smarter? Let's talk about your property and create a plan that works for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-[#2BBBAD] text-white rounded-full px-8 py-3.5 font-semibold text-[15px] transition-all duration-300 hover:bg-[#249E93] hover:shadow-lg hover:shadow-[#2BBBAD]/25"
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                Schedule a Consultation
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <mask id="mask_hiw_cta" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
                    <rect width="20" height="20" transform="matrix(-1 0 0 1 20 0)" fill="#D9D9D9"/>
                  </mask>
                  <g mask="url(#mask_hiw_cta)">
                    <path d="M13.459 10.8334L11.084 13.2084C10.9173 13.3751 10.8375 13.5695 10.8444 13.7918C10.8513 14.014 10.9312 14.2084 11.084 14.3751C11.2507 14.5418 11.4486 14.6286 11.6777 14.6355C11.9069 14.6425 12.1048 14.5626 12.2715 14.3959L16.084 10.5834C16.2507 10.4168 16.334 10.2223 16.334 10.0001C16.334 9.77787 16.2507 9.58343 16.084 9.41676L12.2715 5.60426C12.1048 5.43759 11.9069 5.35773 11.6777 5.36467C11.4486 5.37162 11.2507 5.45842 11.084 5.62509C10.9312 5.79176 10.8513 5.9862 10.8444 6.20842C10.8375 6.43065 10.9173 6.62509 11.084 6.79176L13.459 9.16676H4.16732C3.93121 9.16676 3.73329 9.24662 3.57357 9.40634C3.41385 9.56606 3.33398 9.76398 3.33398 10.0001C3.33398 10.2362 3.41385 10.4341 3.57357 10.5938C3.73329 10.7536 3.93121 10.8334 4.16732 10.8334H13.459Z" fill="white"/>
                  </g>
                </svg>
              </Link>
              <Link
                href="/sellers"
                className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/30 text-white rounded-full px-8 py-3.5 font-semibold text-[15px] transition-all duration-300 hover:bg-white/20"
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                Learn More for Sellers
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
