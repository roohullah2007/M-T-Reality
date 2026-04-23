import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Search, DollarSign, Shield, ChevronDown, Handshake, TrendingUp, Target } from 'lucide-react';
import MainLayout from '@/Layouts/MainLayout';

function Buyers() {
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const howItWorks = [
    {
      step: '01',
      title: 'Initial Consultation',
      description: 'We talk with you to understand your goals, budget, timeline, and what matters most in your next home. No pressure — just a clear plan.'
    },
    {
      step: '02',
      title: 'Property Search & Showings',
      description: 'We identify properties that match your criteria, schedule showings, and provide market insights on every home you consider.'
    },
    {
      step: '03',
      title: 'Strategic Offer & Negotiation',
      description: 'When you find the right home, we craft a competitive offer backed by market data and negotiate strategically to protect your position.'
    },
    {
      step: '04',
      title: 'Contract to Closing',
      description: 'From inspections to appraisals to title coordination, we manage every detail through closing day so nothing falls through the cracks.'
    }
  ];

  const faqs = [
    {
      question: 'Do I need to get pre-approved before looking at homes?',
      answer: 'We strongly recommend it. Pre-approval gives you a clear budget, strengthens your offer in competitive situations, and shows sellers you\'re a serious buyer. We partner with T&M Mortgages to make the process simple and fast.'
    },
    {
      question: 'What does buyer representation include?',
      answer: 'Everything from property search and market analysis to showings, offer strategy, negotiation, inspection coordination, and closing management. You get a dedicated professional guiding you through every step.'
    },
    {
      question: 'Can I buy new construction or investment properties with M&T?',
      answer: 'Absolutely. Whether it\'s your first home, a new build, an investment property, or a luxury purchase, our team has the experience and market knowledge to represent you effectively.'
    },
    {
      question: 'What areas do you serve?',
      answer: 'M&T Realty Group is licensed in Oklahoma and serves the Tulsa, Oklahoma City, and Northeastern Oklahoma area, but we can serve all of Oklahoma.'
    }
  ];

  return (
    <>
      <Head title="Buyers" />

      {/* Hero Section */}
      <section className="relative">
        <div className="relative min-h-[85vh] flex items-center overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.pexels.com/photos/3935350/pexels-photo-3935350.jpeg?auto=compress&cs=tinysrgb&w=1920"
              alt=""
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/35"></div>
          </div>

          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 relative z-10 w-full py-20 pt-[120px]">
            <div className="max-w-3xl">
              {/* Badge */}
              <div className="inline-flex items-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2 mb-6">
                <span className="text-white/90 text-sm font-medium" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  For Buyers
                </span>
              </div>

              <h1
                className="text-white text-[40px] sm:text-[50px] md:text-[60px] font-medium leading-[1.1] mb-6 drop-shadow-2xl"
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                Buy With Confidence.
              </h1>
              <p
                className="text-white/90 text-[16px] sm:text-[18px] font-medium mb-8 leading-relaxed max-w-2xl drop-shadow-lg"
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                Professional buyer representation backed by market expertise.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-[0.4rem]">
                <Link
                  href="/properties"
                  className="button inline-flex items-center gap-[0.4rem] bg-white/10 backdrop-blur-md border border-white/30 text-white rounded-full px-5 py-[0.875rem] font-medium leading-[120%] transition-all duration-[400ms] ease-[cubic-bezier(0.645,0.045,0.355,1)] hover:bg-white/20"
                  style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                >
                  <Search className="w-5 h-5" />
                  <span>Browse Properties</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <div className="bg-[#EEEDEA] border-b border-gray-300">
        <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 py-8 md:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
            <div className="flex items-start gap-3 bg-white rounded-xl px-6 py-4 hover:shadow-md transition-all duration-300">
              <div className="bg-[#E5E1DC] p-3 rounded-lg flex-shrink-0">
                <Target className="w-5 h-5 text-[#3D3D3D]" />
              </div>
              <div className="text-left">
                <div className="text-[#111] font-semibold text-base" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Expert Guidance</div>
                <div className="text-[#666] text-sm" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Market Expertise</div>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white rounded-xl px-6 py-4 hover:shadow-md transition-all duration-300">
              <div className="bg-[#E5E1DC] p-3 rounded-lg flex-shrink-0">
                <Handshake className="w-5 h-5 text-[#3D3D3D]" />
              </div>
              <div className="text-left">
                <div className="text-[#111] font-semibold text-base" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Negotiation</div>
                <div className="text-[#666] text-sm" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Strategic Offers</div>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white rounded-xl px-6 py-4 hover:shadow-md transition-all duration-300">
              <div className="bg-[#E5E1DC] p-3 rounded-lg flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-[#3D3D3D]" />
              </div>
              <div className="text-left">
                <div className="text-[#111] font-semibold text-base" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Market Insights</div>
                <div className="text-[#666] text-sm" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Data-Driven</div>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white rounded-xl px-6 py-4 hover:shadow-md transition-all duration-300">
              <div className="bg-[#E5E1DC] p-3 rounded-lg flex-shrink-0">
                <DollarSign className="w-5 h-5 text-[#3D3D3D]" />
              </div>
              <div className="text-left">
                <div className="text-[#111] font-semibold text-base" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Save More</div>
                <div className="text-[#666] text-sm" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Buy Direct</div>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white rounded-xl px-6 py-4 hover:shadow-md transition-all duration-300">
              <div className="bg-[#E5E1DC] p-3 rounded-lg flex-shrink-0">
                <Shield className="w-5 h-5 text-[#3D3D3D]" />
              </div>
              <div className="text-left">
                <div className="text-[#111] font-semibold text-base" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Full Service</div>
                <div className="text-[#666] text-sm" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Start to Close</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why Buy With M&T Section */}
      <section className="bg-[#EEEDEA] py-20 md:py-28">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Left Side - Content */}
            <div>
              {/* Badge */}
              <div className="inline-flex items-center bg-[#E5E1DC] rounded-lg px-4 py-2 mb-6">
                <span className="text-[#666] text-sm font-medium" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  Why Buy With Us
                </span>
              </div>

              <h2
                className="text-[24px] md:text-[28px] text-[#111] font-medium leading-tight mb-6"
                style={{ fontFamily: 'Instrument Sans, sans-serif', fontWeight: 500 }}
              >
                Buying a home is one of the biggest financial decisions you'll make. You deserve an experienced advocate who puts your interests first.
              </h2>

              <p
                className="text-[14px] text-[#666] font-medium mb-8 leading-relaxed"
                style={{ fontFamily: 'Instrument Sans, sans-serif', fontWeight: 500 }}
              >
                M&T Realty Group provides full-service buyer representation powered by market data, strategic negotiation, and a modern approach.
              </p>

              {/* Button */}
              <Link
                href="/contact"
                className="inline-flex items-center gap-[0.4rem] bg-[#2BBBAD] text-white rounded-full px-5 py-[0.875rem] font-medium leading-[120%] transition-all duration-[400ms] ease-[cubic-bezier(0.645,0.045,0.355,1)] hover:bg-[#249E93]"
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                <span>Get Started</span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <mask id="mask0_buyers_1" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
                    <rect width="20" height="20" transform="matrix(-1 0 0 1 20 0)" fill="#D9D9D9"/>
                  </mask>
                  <g mask="url(#mask0_buyers_1)">
                    <path d="M13.459 10.8334L11.084 13.2084C10.9173 13.3751 10.8375 13.5695 10.8444 13.7918C10.8513 14.014 10.9312 14.2084 11.084 14.3751C11.2507 14.5418 11.4486 14.6286 11.6777 14.6355C11.9069 14.6425 12.1048 14.5626 12.2715 14.3959L16.084 10.5834C16.2507 10.4168 16.334 10.2223 16.334 10.0001C16.334 9.77787 16.2507 9.58343 16.084 9.41676L12.2715 5.60426C12.1048 5.43759 11.9069 5.35773 11.6777 5.36467C11.4486 5.37162 11.2507 5.45842 11.084 5.62509C10.9312 5.79176 10.8513 5.9862 10.8444 6.20842C10.8375 6.43065 10.9173 6.62509 11.084 6.79176L13.459 9.16676H4.16732C3.93121 9.16676 3.73329 9.24662 3.57357 9.40634C3.41385 9.56606 3.33398 9.76398 3.33398 10.0001C3.33398 10.2362 3.41385 10.4341 3.57357 10.5938C3.73329 10.7536 3.93121 10.8334 4.16732 10.8334H13.459Z" fill="white"/>
                  </g>
                </svg>
              </Link>
            </div>

            {/* Right Side - Image Grid */}
            <div>
              <div className="grid grid-cols-2 gap-4">
                <div className="overflow-hidden rounded-2xl h-[195px]">
                  <img
                    src="https://images.pexels.com/photos/4469146/pexels-photo-4469146.jpeg?auto=compress&cs=tinysrgb&w=600"
                    alt="Suburban brick home"
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="overflow-hidden rounded-2xl h-[195px]">
                  <img
                    src="https://images.pexels.com/photos/4469158/pexels-photo-4469158.jpeg?auto=compress&cs=tinysrgb&w=600"
                    alt="Two-story brick home with garage"
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="overflow-hidden rounded-2xl h-[195px]">
                  <img
                    src="https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=600"
                    alt="Beautiful home interior"
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="overflow-hidden rounded-2xl h-[195px]">
                  <img
                    src="https://images.pexels.com/photos/2287310/pexels-photo-2287310.jpeg?auto=compress&cs=tinysrgb&w=600"
                    alt="Dream home"
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-[#E5E1DC] rounded-lg px-4 py-2 mb-8">
              <span className="text-[#666] text-sm font-medium" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                Our Process
              </span>
            </div>
            <h2 className="text-[32px] md:text-[48px] font-medium text-[#111] mb-4" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
              How Buying With Us Works
            </h2>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-[#EEEDEA] rounded-2xl p-6 h-full hover:shadow-lg transition-all duration-300">
                  <div className="text-[#2BBBAD] text-5xl font-medium mb-4 opacity-20" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                    {item.step}
                  </div>
                  <h3 className="text-xl font-medium text-[#111] mb-3" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#666] font-medium leading-relaxed" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          {/* Badge */}
          <div className="inline-flex items-center bg-[#E5E1DC] rounded-lg px-4 py-2 mb-8">
            <span className="text-[#666] text-sm font-medium" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
              FAQs
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Left Side - Title and CTA */}
            <div>
              <h2
                className="text-[40px] md:text-[48px] font-semibold leading-[120%] text-[#111] mb-6"
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                Frequently Asked<br />Questions
              </h2>
              <p
                className="text-[14px] font-medium text-[#666] mb-10 leading-relaxed"
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                Have questions about buying with M&T Realty Group? We've got answers.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-[0.4rem] bg-[#2BBBAD] text-white rounded-full px-5 py-[0.875rem] font-medium leading-[120%] transition-all duration-[400ms] ease-[cubic-bezier(0.645,0.045,0.355,1)] hover:bg-[#249E93]"
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                <span>Ask Us Anything</span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <mask id="mask0_buyers_faq" maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20" style={{ maskType: 'alpha' }}>
                    <rect width="20" height="20" transform="matrix(-1 0 0 1 20 0)" fill="#D9D9D9"/>
                  </mask>
                  <g mask="url(#mask0_buyers_faq)">
                    <path d="M13.459 10.8334L11.084 13.2084C10.9173 13.3751 10.8375 13.5695 10.8444 13.7918C10.8513 14.014 10.9312 14.2084 11.084 14.3751C11.2507 14.5418 11.4486 14.6286 11.6777 14.6355C11.9069 14.6425 12.1048 14.5626 12.2715 14.3959L16.084 10.5834C16.2507 10.4168 16.334 10.2223 16.334 10.0001C16.334 9.77787 16.2507 9.58343 16.084 9.41676L12.2715 5.60426C12.1048 5.43759 11.9069 5.35773 11.6777 5.36467C11.4486 5.37162 11.2507 5.45842 11.084 5.62509C10.9312 5.79176 10.8513 5.9862 10.8444 6.20842C10.8375 6.43065 10.9173 6.62509 11.084 6.79176L13.459 9.16676H4.16732C3.93121 9.16676 3.73329 9.24662 3.57357 9.40634C3.41385 9.56606 3.33398 9.76398 3.33398 10.0001C3.33398 10.2362 3.41385 10.4341 3.57357 10.5938C3.73329 10.7536 3.93121 10.8334 4.16732 10.8334H13.459Z" fill="white"/>
                  </g>
                </svg>
              </Link>
            </div>

            {/* Right Side - FAQ Accordion */}
            <div>
              {faqs.map((faq, index) => (
                <div key={index} className="bg-[#EEEDEA] rounded-2xl mb-4 overflow-hidden transition-all duration-300">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between p-6 text-left transition-colors group"
                  >
                    <span
                      className="text-[18px] font-medium text-[#111] pr-4 transition-colors"
                      style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                    >
                      {faq.question}
                    </span>
                    <div className="flex-shrink-0 transition-all duration-300">
                      <ChevronDown
                        className={`w-6 h-6 text-[#111] transition-transform duration-300 ${
                          openFaqIndex === index ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                  </button>

                  {openFaqIndex === index && (
                    <div className="px-6 pb-6 pt-0">
                      <p
                        className="text-[14px] font-medium text-[#666] leading-relaxed"
                        style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                      >
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </>
  );
}

// Specify MainLayout for this page to include Header and Footer
Buyers.layout = (page) => <MainLayout>{page}</MainLayout>;

export default Buyers;
