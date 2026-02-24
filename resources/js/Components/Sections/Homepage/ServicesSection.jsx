import React from 'react';
import { Link } from '@inertiajs/react';
import { Megaphone, Globe, TrendingUp, Home, Handshake, FileCheck } from 'lucide-react';

const ServicesSection = () => {
  const services = [
    {
      title: 'Professional Marketing',
      icon: Megaphone,
      description: 'HDR photography, drone aerials, virtual tours, and targeted digital campaigns that make your listing stand out.'
    },
    {
      title: 'MLS & Digital Exposure',
      icon: Globe,
      description: 'Full MLS listing with automatic syndication to Zillow, Trulia, Realtor.com, and 100+ real estate websites.'
    },
    {
      title: 'Strategic Pricing',
      icon: TrendingUp,
      description: 'Data-driven market analysis and pricing strategy to position your home competitively and maximize your return.'
    },
    {
      title: 'Showings & Open Houses',
      icon: Home,
      description: 'Professionally managed showings and open house events with buyer screening and follow-up handled for you.'
    },
    {
      title: 'Expert Negotiation',
      icon: Handshake,
      description: 'Skilled negotiation on your behalf to secure the best possible price and terms on every offer.'
    },
    {
      title: 'Closing Management',
      icon: FileCheck,
      description: 'Full transaction coordination from accepted offer through closing — inspections, appraisals, and paperwork handled.'
    },
  ];

  return (
    <section id="services" className="bg-white py-20">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        {/* Top Section - Badge, Heading, Description and Buttons */}
        <div className="grid lg:grid-cols-2 gap-12 items-start mb-12">
          {/* Left Side - Heading */}
          <div>
            {/* Badge */}
            <div className="inline-flex items-center bg-[#E5E1DC] rounded-lg px-4 py-2 mb-6">
              <span className="text-[#666] text-sm font-medium" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                Our Services
              </span>
            </div>
            {/* Main Heading */}
            <h2
              className="text-[40px] text-[#111] font-medium leading-tight uppercase"
              style={{ fontFamily: 'Instrument Sans, sans-serif', fontWeight: 500 }}
            >
              Full-Service Real Estate Solutions
            </h2>
          </div>

          {/* Right Side - Description and Buttons */}
          <div className="lg:pt-12">
            {/* Description */}
            <p
              className="text-[16px] text-[#666] font-medium mb-8 leading-relaxed"
              style={{ fontFamily: 'Instrument Sans, sans-serif', fontWeight: 500 }}
            >
              From professional marketing to expert negotiation and closing support, M&T Realty Group provides everything you need to sell your home with confidence.
            </p>

            {/* Button */}
            <Link
              href="/our-packages"
              className="inline-flex items-center gap-[0.4rem] bg-[#2BBBAD] text-white rounded-full px-5 py-[0.875rem] font-medium leading-[120%] transition-all duration-[400ms] ease-[cubic-bezier(0.645,0.045,0.355,1)] hover:bg-[#249E93]"
              style={{ fontFamily: 'Instrument Sans, sans-serif' }}
            >
              <span>View Our Services</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <mask id="mask0_56_2205" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
                  <rect width="20" height="20" transform="matrix(-1 0 0 1 20 0)" fill="#D9D9D9"/>
                </mask>
                <g mask="url(#mask0_56_2205)">
                  <path d="M13.459 10.8334L11.084 13.2084C10.9173 13.3751 10.8375 13.5695 10.8444 13.7918C10.8513 14.014 10.9312 14.2084 11.084 14.3751C11.2507 14.5418 11.4486 14.6286 11.6777 14.6355C11.9069 14.6425 12.1048 14.5626 12.2715 14.3959L16.084 10.5834C16.2507 10.4168 16.334 10.2223 16.334 10.0001C16.334 9.77787 16.2507 9.58343 16.084 9.41676L12.2715 5.60426C12.1048 5.43759 11.9069 5.35773 11.6777 5.36467C11.4486 5.37162 11.2507 5.45842 11.084 5.62509C10.9312 5.79176 10.8513 5.9862 10.8444 6.20842C10.8375 6.43065 10.9173 6.62509 11.084 6.79176L13.459 9.16676H4.16732C3.93121 9.16676 3.73329 9.24662 3.57357 9.40634C3.41385 9.56606 3.33398 9.76398 3.33398 10.0001C3.33398 10.2362 3.41385 10.4341 3.57357 10.5938C3.73329 10.7536 3.93121 10.8334 4.16732 10.8334H13.459Z" fill="white"/>
                </g>
              </svg>
            </Link>
          </div>
        </div>

        {/* Services Grid - Full Width Below */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <div
                key={index}
                className="group flex items-center gap-4 bg-[#EEEDEA] rounded-full px-8 py-6 transition-all duration-300 hover:shadow-lg"
              >
                <div className="bg-[#E5E1DC] rounded-full p-3 group-hover:bg-[#D5D1CC] transition-colors flex-shrink-0">
                  <IconComponent className="w-5 h-5 text-[#2BBBAD]" />
                </div>
                <div className="flex-1 min-w-0">
                  <span
                    className="text-[#111] text-lg font-medium block"
                    style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                  >
                    {service.title}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
