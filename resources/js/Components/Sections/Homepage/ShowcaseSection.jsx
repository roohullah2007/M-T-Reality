import React from 'react';
import { Link } from '@inertiajs/react';
import { Home, Users } from 'lucide-react';

const ShowcaseSection = () => {
  return (
    <section className="bg-[#EEEDEA] py-20">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        {/* Two Column Grid */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Image - For Sellers */}
          <div className="relative overflow-hidden rounded-3xl md:w-[443px] w-full flex-shrink-0">
            <img
              src="https://images.pexels.com/photos/1643389/pexels-photo-1643389.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="Beautiful Oklahoma home exterior"
              className="w-full h-[400px] md:h-[600px] object-cover"
            />

            {/* Overlay Content */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6 md:p-8">
              <div className="bg-white/10 backdrop-blur-sm p-2 rounded-lg w-fit mb-4">
                <Home className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-white text-[24px] md:text-[32px] font-medium mb-3" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                For Sellers
              </h3>
              <p className="text-white/90 text-sm md:text-base mb-4 leading-relaxed" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                List your property for FREE. No commissions, no hidden fees. Keep 100% of your home's value.
              </p>
              <Link
                href="/sellers"
                className="inline-flex items-center gap-2 bg-white text-[#111] rounded-full px-5 py-3 font-medium text-sm hover:bg-[#A41E34] hover:text-white transition-all duration-300 w-fit"
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                Learn More
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 10H15M15 10L10 5M15 10L10 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
          </div>

          {/* Right Image - For Buyers */}
          <div className="relative overflow-hidden rounded-3xl flex-1">
            <img
              src="https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg?auto=compress&cs=tinysrgb&w=1920"
              alt="Modern Oklahoma property interior"
              className="w-full h-[400px] md:h-[600px] object-cover"
            />

            {/* Overlay Content */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6 md:p-8">
              <div className="bg-white/10 backdrop-blur-sm p-2 rounded-lg w-fit mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-white text-[24px] md:text-[32px] font-medium mb-3" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                For Buyers
              </h3>
              <p className="text-white/90 text-sm md:text-base mb-4 leading-relaxed" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                Find your dream home directly from owners. Save thousands with no buyer agent commissions.
              </p>
              <Link
                href="/buyers"
                className="inline-flex items-center gap-2 bg-white text-[#111] rounded-full px-5 py-3 font-medium text-sm hover:bg-[#A41E34] hover:text-white transition-all duration-300 w-fit"
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                Learn More
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 10H15M15 10L10 5M15 10L10 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShowcaseSection;