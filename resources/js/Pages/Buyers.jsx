import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Search, Home, DollarSign, Shield, Clock, CheckCircle, Users, ChevronRight, FileCheck, Building, Calculator, ClipboardCheck, Key, BadgeCheck, Percent, Handshake, FileText } from 'lucide-react';
import MainLayout from '@/Layouts/MainLayout';

function Buyers() {
  const howItWorks = [
    {
      step: '01',
      title: 'Browse Properties',
      description: 'Search our database of properties for sale by owner across Oklahoma. Or create an account to save favorites or be notified of new listings that fit your criteria.'
    },
    {
      step: '02',
      title: 'Contact Owners',
      description: 'Connect directly with property owners to schedule viewings and ask questions.'
    },
    {
      step: '03',
      title: 'Make an Offer',
      description: 'Negotiate directly with owners and make your offer. If you\'re financing the property, make sure you\'re Pre-approved.'
    },
    {
      step: '04',
      title: 'Close the Deal',
      description: 'Work with a closing attorney or title company to finalize your purchase.'
    }
  ];

  const faqs = [
    {
      question: 'Do I need a real estate agent to buy?',
      answer: 'No! You can buy directly from owners and save on agent commissions. However, you may want to hire a real estate attorney for legal guidance.'
    },
    {
      question: 'Are the properties on your site verified?',
      answer: 'Yes, we verify all property listings and ensure owners provide accurate information and photos.'
    },
    {
      question: 'How do I schedule a viewing?',
      answer: 'Contact the property owner directly through the listing page. To arrange a viewing, message or call the seller directly. A real estate agent will never contact you.'
    },
    {
      question: 'Can I get financing for these properties?',
      answer: 'Absolutely! Most properties are eligible for traditional mortgages, FHA, VA, and other financing options.'
    }
  ];

  const buyerTips = [
    {
      icon: FileCheck,
      title: 'Get Pre-Approved First',
      description: 'Before you start house hunting, get pre-approved with T&M Mortgages. It takes 15 minutes online and tells sellers you\'re a serious buyer.'
    },
    {
      icon: Calculator,
      title: 'Know Your True Budget',
      description: 'Factor in property taxes, insurance, HOA fees, and maintenance costs. Your monthly housing payment should be no more than 28% of your gross income.'
    },
    {
      icon: ClipboardCheck,
      title: 'Always Get an Inspection',
      description: 'Never skip the home inspection, even for new construction. It can reveal hidden issues that could cost thousands to repair.'
    },
    {
      icon: Building,
      title: 'Research the Neighborhood',
      description: 'Visit at different times of day, check school ratings, crime statistics, and future development plans. Talk to neighbors if possible.'
    },
    {
      icon: DollarSign,
      title: 'Don\'t Max Out Your Budget',
      description: 'Leave room for unexpected expenses and life changes. A slightly smaller home with financial breathing room is better than being house-poor.'
    },
    {
      icon: Key,
      title: 'Understand the Contract',
      description: 'Read every line of the purchase agreement. Consider hiring a real estate attorney to review documents before signing.'
    }
  ];

  const preApprovalSteps = [
    {
      step: '01',
      title: 'Check Your Credit Score',
      description: 'Review your credit report and score. Most lenders require a minimum score of 620 for conventional loans, though FHA loans may accept lower scores.'
    },
    {
      step: '02',
      title: 'Gather Your Documents',
      description: 'Collect pay stubs, W-2s, tax returns, bank statements, and identification.'
    },
    {
      step: '03',
      title: 'Compare Lenders',
      description: 'Shop around and compare rates from at least 3 lenders. Consider banks, credit unions, and mortgage brokers for the best terms.'
    },
    {
      step: '04',
      title: 'Get Your Pre-Approval Letter',
      description: 'Once approved, you\'ll receive a letter stating your maximum loan amount. This letter is typically valid for 60-90 days.'
    }
  ];

  return (
    <>
      <Head title="Buyers - OKBYOWNER" />

      {/* Hero Section */}
      <div className="relative pt-0 md:pt-[77px]">
        <div className="relative min-h-[60vh] flex items-center py-16 md:py-20 overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg?auto=compress&cs=tinysrgb&w=1920"
              alt="Beautiful home interior"
              className="w-full h-full object-cover"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
          </div>

          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 relative z-10 w-full">
            <div className="max-w-3xl">
              {/* Main Heading */}
              <h1
                className="text-white text-[40px] sm:text-[50px] md:text-[60px] font-medium leading-[1.1] mb-5 drop-shadow-2xl"
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                Find Your Dream Home Save Thousands
              </h1>

              {/* Subheading */}
              <p
                className="text-white text-[14px] md:text-[16px] font-medium mb-8 leading-relaxed max-w-2xl drop-shadow-lg"
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                Browse properties for sale by owner across Oklahoma. Negotiate your best deal, and save on commissions.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-[0.4rem] mb-12">
                <Link
                  href="/properties"
                  className="button inline-flex items-center gap-[0.4rem] bg-[#A41E34] text-white rounded-full px-5 py-[0.875rem] font-medium leading-[120%] transition-all duration-[400ms] ease-[cubic-bezier(0.645,0.045,0.355,1)] hover:bg-[#8B1A2C]"
                  style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                >
                  <Search className="w-5 h-5" />
                  <span>Browse Properties</span>
                </Link>
                <Link
                  href="#how-it-works"
                  className="button inline-flex items-center gap-[0.4rem] bg-white/10 backdrop-blur-md border border-white/30 text-white rounded-full px-5 py-[0.875rem] font-medium leading-[120%] transition-all duration-[400ms] ease-[cubic-bezier(0.645,0.045,0.355,1)] hover:bg-white/20"
                  style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                >
                  <span>How It Works</span>
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section - After Hero */}
      <div className="bg-[#EEEDEA] border-b border-gray-300">
        <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 py-8 md:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
            <div className="flex items-start gap-3 bg-white rounded-xl px-6 py-4 hover:shadow-md transition-all duration-300">
              <div className="bg-[#E5E1DC] p-3 rounded-lg flex-shrink-0">
                <DollarSign className="w-5 h-5 text-[#3D3D3D]" />
              </div>
              <div className="text-left">
                <div className="text-[#111] font-semibold text-base" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Lower Prices</div>
                <div className="text-[#666] text-sm" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>No Commissions</div>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white rounded-xl px-6 py-4 hover:shadow-md transition-all duration-300">
              <div className="bg-[#E5E1DC] p-3 rounded-lg flex-shrink-0">
                <Shield className="w-5 h-5 text-[#3D3D3D]" />
              </div>
              <div className="text-left">
                <div className="text-[#111] font-semibold text-base" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Verified Listings</div>
                <div className="text-[#666] text-sm" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>100% Authentic</div>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white rounded-xl px-6 py-4 hover:shadow-md transition-all duration-300">
              <div className="bg-[#E5E1DC] p-3 rounded-lg flex-shrink-0">
                <Users className="w-5 h-5 text-[#3D3D3D]" />
              </div>
              <div className="text-left">
                <div className="text-[#111] font-semibold text-base" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Direct Contact</div>
                <div className="text-[#666] text-sm" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>No Middleman</div>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white rounded-xl px-6 py-4 hover:shadow-md transition-all duration-300">
              <div className="bg-[#E5E1DC] p-3 rounded-lg flex-shrink-0">
                <Search className="w-5 h-5 text-[#3D3D3D]" />
              </div>
              <div className="text-left">
                <div className="text-[#111] font-semibold text-base" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Easy Search</div>
                <div className="text-[#666] text-sm" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Find Homes Fast</div>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white rounded-xl px-6 py-4 hover:shadow-md transition-all duration-300">
              <div className="bg-[#E5E1DC] p-3 rounded-lg flex-shrink-0">
                <Clock className="w-5 h-5 text-[#3D3D3D]" />
              </div>
              <div className="text-left">
                <div className="text-[#111] font-semibold text-base" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Quick Process</div>
                <div className="text-[#666] text-sm" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Fast & Simple</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <section className="bg-[#EEEDEA] py-16 md:py-20">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Side - Content */}
            <div>
              {/* Main Heading */}
              <h2
                className="text-[24px] md:text-[28px] text-[#111] font-medium leading-tight mb-6"
                style={{ fontFamily: 'Instrument Sans, sans-serif', fontWeight: 500 }}
              >
                Buying a home directly from the owner saves you money and gives you more control over the process. OKByOwner connects you with sellers across Oklahoma.
              </h2>

              {/* Subheading */}
              <p
                className="text-[14px] text-[#666] font-medium mb-8 leading-relaxed"
                style={{ fontFamily: 'Instrument Sans, sans-serif', fontWeight: 500 }}
              >
                Join other buyers who have found their dream homes and saved thousands by buying homes By Owner.
              </p>

              {/* Button */}
              <Link
                href="/properties"
                className="inline-flex items-center gap-[0.4rem] bg-[#A41E34] text-white rounded-full px-5 py-[0.875rem] font-medium leading-[120%] transition-all duration-[400ms] ease-[cubic-bezier(0.645,0.045,0.355,1)] hover:bg-[#8B1A2C]"
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                <span>View Properties</span>
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

            {/* Right Side - Image Grid */}
            <div>
              <div className="grid grid-cols-2 gap-4">
                <div className="overflow-hidden rounded-2xl h-[195px]">
                  <img
                    src="https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=600"
                    alt="Modern home exterior"
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="overflow-hidden rounded-2xl h-[195px]">
                  <img
                    src="https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=600"
                    alt="Luxury property"
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="overflow-hidden rounded-2xl h-[195px]">
                  <img
                    src="https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=600"
                    alt="Beautiful home interior"
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="overflow-hidden rounded-2xl h-[195px]">
                  <img
                    src="https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg?auto=compress&cs=tinysrgb&w=600"
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
      <section id="how-it-works" className="bg-white py-16 md:py-20">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          {/* Section Header */}
          <div className="text-center mb-14">
            <h2 className="text-[32px] md:text-[48px] font-medium text-[#111] mb-4" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
              How It Works
            </h2>
            <p className="text-[16px] text-[#666] font-medium max-w-2xl mx-auto" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
              Your journey to finding the perfect home in four simple steps
            </p>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-[#EEEDEA] rounded-2xl p-6 h-full hover:shadow-lg transition-all duration-300">
                  <div className="text-[#A41E34] text-5xl font-medium mb-4 opacity-20" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
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

      {/* Pre-Approval Section - T&M Mortgages Integration */}
      <section className="bg-[#EEEDEA] py-16 md:py-20">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          {/* Section Header */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center bg-[#E5E1DC] rounded-lg px-4 py-2 mb-6">
              <span className="text-[#666] text-sm font-medium" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                Get Ready to Buy
              </span>
            </div>
            <h2 className="text-[32px] md:text-[48px] font-medium text-[#111] mb-4" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
              Get Pre-Approved with T&M Mortgage
            </h2>
            <p className="text-[16px] text-[#666] font-medium max-w-2xl mx-auto" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
              Pre-approval is the first step to becoming a competitive buyer.<br />
              It shows sellers you're serious and ready to close.
            </p>
          </div>

          {/* Pre-Approval Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {preApprovalSteps.map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-2xl p-6 h-full hover:shadow-lg transition-all duration-300">
                  <div className="text-[#A41E34] text-5xl font-medium mb-4 opacity-20" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
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

          {/* Pre-Approval CTA Box */}
          <div className="bg-gradient-to-br from-[#A41E34] to-[#7A1628] rounded-3xl p-8 md:p-12 text-white">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl md:text-3xl font-medium mb-4" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  Ready to Get Pre-Approved?
                </h3>
                <p className="text-white/80 mb-6 leading-relaxed" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  Take the first step toward homeownership. Our simple online application takes just 15 minutes and won't impact your credit score.
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-300 flex-shrink-0" />
                    <span className="text-white/90" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Know your exact budget before you shop</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-300 flex-shrink-0" />
                    <span className="text-white/90" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Show sellers you're a serious buyer</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-300 flex-shrink-0" />
                    <span className="text-white/90" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Lock in your rate before it changes</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-300 flex-shrink-0" />
                    <span className="text-white/90" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Close faster when you find your home</span>
                  </li>
                </ul>
                <a
                  href="https://tandmmortgages.morty.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white text-[#A41E34] rounded-full px-8 py-4 font-semibold hover:bg-gray-100 transition-all duration-300"
                  style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                >
                  Get Pre-Approved Now
                  <ChevronRight className="w-5 h-5" />
                </a>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4 bg-white/10 rounded-xl p-5">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-medium text-lg" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Simple Online Application</p>
                    <p className="text-white/70 text-sm" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Complete from your phone or computer - no paperwork</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-white/10 rounded-xl p-5">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-medium text-lg" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>No Credit Score Impact</p>
                    <p className="text-white/70 text-sm" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Soft pull for pre-qualification, no hard inquiry</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-white/10 rounded-xl p-5">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-medium text-lg" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Personal Support</p>
                    <p className="text-white/70 text-sm" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Real loan officers ready to answer your questions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Buyer Tips Section */}
      <section className="bg-white py-16 md:py-20">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          {/* Section Header */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-[#E5E1DC] rounded-lg px-4 py-2 mb-6">
              <span className="text-[#666] text-sm font-medium" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                Buyer Tips
              </span>
            </div>
            <h2 className="text-[32px] md:text-[48px] font-medium text-[#111] mb-4" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
              Smart Home Buying Tips
            </h2>
            <p className="text-[16px] text-[#666] font-medium max-w-2xl mx-auto" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
              Expert advice to help you make the best decision when purchasing your next home
            </p>
          </div>

          {/* Tips Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {buyerTips.map((tip, index) => {
              const IconComponent = tip.icon;
              return (
                <div key={index} className="bg-[#EEEDEA] rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                  <div className="bg-[#E5E1DC] p-3 rounded-xl w-fit mb-4">
                    <IconComponent className="w-6 h-6 text-[#3D3D3D]" />
                  </div>
                  <h3 className="text-xl font-medium text-[#111] mb-3" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                    {tip.title}
                  </h3>
                  <p className="text-sm text-[#666] font-medium leading-relaxed" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                    {tip.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-[#EEEDEA] py-16 md:py-20">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left Side - Header */}
            <div>
              <div className="inline-flex items-center bg-[#E5E1DC] rounded-lg px-4 py-2 mb-6">
                <span className="text-[#666] text-sm font-medium" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  FAQs
                </span>
              </div>
              <h2 className="text-[32px] md:text-[40px] font-medium text-[#111] mb-4" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                Frequently Asked<br />Questions
              </h2>
              <p className="text-[16px] text-[#666] font-medium leading-relaxed" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                Have questions? We've got answers. Learn more about buying properties through OKByOwner.
              </p>
            </div>

            {/* Right Side - FAQs */}
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                  <h3 className="text-lg font-medium text-[#111] mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                    {faq.question}
                  </h3>
                  <p className="text-sm text-[#666] leading-relaxed" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                    {faq.answer}
                  </p>
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
