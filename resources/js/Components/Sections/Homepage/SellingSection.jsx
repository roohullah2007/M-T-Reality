import React from 'react';
import { Link } from '@inertiajs/react';
import { CheckCircle2 } from 'lucide-react';

const SellingSection = () => {
  const benefits = [
    'List your property completely FREE - No Hidden Fees!',
    'Keep your Leads - All property inquiries go directly to the seller, not to the agents who pay other sites for the inquiries.',
    'Share your listing on social media, post open houses, and print flyers.',
    'Upload your photos, virtual tours, and floor plans.',
    'Disclosures, Sales Contracts, and more are provided at no additional charge.'
  ];

  return (
    <section className="relative bg-white py-24 overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-gray-50 to-transparent"></div>

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Image */}
          <div className="relative order-2 lg:order-1">
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt="For Sale By Owner Sign in Oklahoma"
                className="w-full h-[500px] object-cover rounded-2xl shadow-xl"
              />

              {/* For Sale Sign Overlay */}
              <div className="absolute -bottom-6 -right-6 bg-white rounded-xl shadow-2xl border-4 border-white">
                <img
                  src="/images/for-sale.webp"
                  alt="For Sale By Owner Sign"
                  className="w-[180px] h-auto object-contain"
                />
              </div>
            </div>
          </div>

          {/* Right - Content */}
          <div className="order-1 lg:order-2">
            {/* Badge */}
            <div className="inline-flex items-center bg-[#E5E1DC] rounded-lg px-4 py-2 mb-6">
              <span className="text-[#666] text-sm font-medium" style={{ fontFamily: '"Instrument Sans", sans-serif' }}>
                Why Choose Us
              </span>
            </div>

            <h2
              className="text-[32px] md:text-[40px] font-semibold leading-[120%] text-[#111] mb-6"
              style={{ fontFamily: '"Instrument Sans", sans-serif' }}
            >
              Why market your property with us?
            </h2>

            <p
              style={{ fontFamily: '"Instrument Sans", sans-serif' }}
              className="text-[14px] font-medium text-[#666] mb-8 leading-relaxed"
            >
              Since 1997, OK By Owner has been providing sellers with the resources and tools needed to sell their property successfully. Why pay thousands in brokerage commissions when you can do it yourself? Take control of your property sale and keep more money in your pocket.
            </p>

            {/* Benefits List */}
            <div className="space-y-3.5 mb-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                  <span
                    style={{ fontFamily: '"Instrument Sans", sans-serif' }}
                    className="text-[14px] font-medium text-[#666]"
                  >
                    {benefit}
                  </span>
                </div>
              ))}
            </div>

            <Link
              href="/list-property"
              className="inline-flex items-center gap-[0.4rem] bg-[#A41E34] text-white rounded-full px-5 py-[0.875rem] font-medium leading-[120%] transition-all duration-[400ms] ease-[cubic-bezier(0.645,0.045,0.355,1)] hover:bg-[#8B1A2C]"
              style={{ fontFamily: '"Instrument Sans", sans-serif' }}
            >
              <span>List Your Property</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <mask id="mask0_selling_btn" maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20" style={{ maskType: 'alpha' }}>
                  <rect width="20" height="20" transform="matrix(-1 0 0 1 20 0)" fill="#D9D9D9"></rect>
                </mask>
                <g mask="url(#mask0_selling_btn)">
                  <path d="M13.459 10.8334L11.084 13.2084C10.9173 13.3751 10.8375 13.5695 10.8444 13.7918C10.8513 14.014 10.9312 14.2084 11.084 14.3751C11.2507 14.5418 11.4486 14.6286 11.6777 14.6355C11.9069 14.6425 12.1048 14.5626 12.2715 14.3959L16.084 10.5834C16.2507 10.4168 16.334 10.2223 16.334 10.0001C16.334 9.77787 16.2507 9.58343 16.084 9.41676L12.2715 5.60426C12.1048 5.43759 11.9069 5.35773 11.6777 5.36467C11.4486 5.37162 11.2507 5.45842 11.084 5.62509C10.9312 5.79176 10.8513 5.9862 10.8444 6.20842C10.8375 6.43065 10.9173 6.62509 11.084 6.79176L13.459 9.16676H4.16732C3.93121 9.16676 3.73329 9.24662 3.57357 9.40634C3.41385 9.56606 3.33398 9.76398 3.33398 10.0001C3.33398 10.2362 3.41385 10.4341 3.57357 10.5938C3.73329 10.7536 3.93121 10.8334 4.16732 10.8334H13.459Z" fill="white"></path>
                </g>
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SellingSection;
