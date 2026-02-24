import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { DollarSign, Users, ChevronRight, ChevronDown, Zap, BarChart3, Camera, FileText, Megaphone, Handshake, CheckCircle, Video, Box, Sun, Globe, Eye, TrendingUp, ArrowRight, Shield, Target, ClipboardList } from 'lucide-react';
import MainLayout from '@/Layouts/MainLayout';
import CompanyLogosGrid from '@/Components/Sections/CompanyLogosGrid';

function Sellers() {
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const howItWorks = [
    {
      step: '01',
      icon: ClipboardList,
      title: 'Strategic Consultation',
      description: 'We evaluate your property, review market data, and create a pricing strategy designed to attract strong offers and maximize your equity.'
    },
    {
      step: '02',
      icon: Camera,
      title: 'Professional Marketing',
      description: 'High-quality photography, MLS exposure, digital marketing, and targeted buyer outreach — your home presented at its absolute best.'
    },
    {
      step: '03',
      icon: Handshake,
      title: 'Negotiation & Offer Management',
      description: 'We negotiate strategically — not emotionally — to protect your position and get you the best price and terms.'
    },
    {
      step: '04',
      icon: FileText,
      title: 'Contract to Closing',
      description: 'From inspections to title coordination, we manage every step to ensure a smooth transaction and a successful close.'
    }
  ];

  const marketingServices = [
    {
      icon: Camera,
      title: 'Professional Photography',
      description: 'HDR photos that showcase your home in the best light and capture buyer attention online'
    },
    {
      icon: Video,
      title: 'Video Walkthrough',
      description: 'Cinematic video tours that bring your property to life and engage remote buyers'
    },
    {
      icon: Box,
      title: 'Matterport 3D Tours',
      description: 'Interactive 3D tours let buyers explore every room before scheduling a showing'
    },
    {
      icon: Sun,
      title: 'Virtual Twilight',
      description: 'Transform daytime photos into stunning twilight shots that make your listing stand out'
    },
    {
      icon: Camera,
      title: 'Drone Aerial Photos',
      description: 'Showcase your property, lot, and neighborhood from above with professional aerials'
    },
    {
      icon: FileText,
      title: 'Floor Plans',
      description: 'Professional floor plans help buyers visualize the layout and flow of your home'
    }
  ];

  const mlsBenefits = [
    {
      icon: Globe,
      title: 'Maximum Exposure',
      description: 'Your listing appears on Zillow, Realtor.com, Redfin, and hundreds of other sites automatically'
    },
    {
      icon: Users,
      title: 'Agent Network',
      description: 'Reach buyers working with agents across the entire Oklahoma market'
    },
    {
      icon: Eye,
      title: 'More Visibility',
      description: 'MLS listings receive significantly more views and generate stronger buyer interest'
    },
    {
      icon: TrendingUp,
      title: 'Stronger Offers',
      description: 'Broader exposure typically results in more competitive offers and faster sales'
    }
  ];

  const comparisonData = [
    {
      feature: 'Professional Representation',
      mandt: 'Full-service, experienced agents',
      discount: 'Limited or no support',
      traditional: 'Full-service agents'
    },
    {
      feature: 'Commission Structure',
      mandt: 'Competitive — reflects service, not overhead',
      discount: 'Low fee, minimal service',
      traditional: '5-6% ($15,000+ on $300K home)'
    },
    {
      feature: 'Marketing & MLS',
      mandt: 'Professional photos, MLS, digital marketing',
      discount: 'MLS only, no marketing',
      traditional: 'Varies by agent'
    },
    {
      feature: 'Negotiation Support',
      mandt: 'Strategic, data-driven negotiation',
      discount: 'DIY or none',
      traditional: 'Agent-handled'
    },
    {
      feature: 'Client Equity Retained',
      mandt: 'More — lean model means lower costs',
      discount: 'More — but at the cost of service',
      traditional: 'Less — high overhead passed to you'
    }
  ];

  const faqs = [
    {
      question: "How is M&T Realty Group different from a traditional brokerage?",
      answer: "We provide full-service representation — strategic pricing, professional marketing, expert negotiation, and closing management — without the inflated cost structure of traditional firms. No large offices, no franchise fees, no unnecessary overhead. You get the same quality service while keeping more of your equity."
    },
    {
      question: "What does your commission structure look like?",
      answer: "Our commission reflects the actual service and value we deliver — not outdated industry norms. We're transparent about our fees from day one, and our lean operations mean you retain more equity at closing. Contact us for a personalized consultation."
    },
    {
      question: "What marketing do you provide for my listing?",
      answer: "We offer comprehensive marketing including professional HDR photography, MLS syndication to 100+ websites, video walkthroughs, 3D virtual tours, drone aerials, digital advertising, and targeted buyer outreach. Every listing gets the exposure it deserves."
    },
    {
      question: "How do you determine the right listing price?",
      answer: "We conduct a thorough comparative market analysis using current market data, recent sales, neighborhood trends, and property-specific factors. Our pricing strategy is designed to attract strong offers — not just any offers."
    },
    {
      question: "How long does it typically take to sell?",
      answer: "Timeline varies by market conditions, location, and pricing strategy. Our goal is to position your property for maximum interest from day one. We'll provide realistic expectations during your consultation based on current market data."
    },
    {
      question: "Do I need to do anything to prepare my home for sale?",
      answer: "During our initial consultation, we'll walk through your property and provide specific recommendations to maximize its appeal. This might include staging tips, minor repairs, or curb appeal improvements — all tailored to your situation and budget."
    }
  ];

  const testimonials = [
    {
      id: 1,
      quote: "M&T Realty Group delivered everything a traditional brokerage promises — professional marketing, expert negotiation, seamless closing — but at a fraction of the cost. We kept thousands more in equity and never felt like we were missing anything.",
      name: "Sarah Mitchell",
      role: "Sold home in Oklahoma City"
    },
    {
      id: 2,
      quote: "Terry and Michele truly understand the market. Their pricing strategy attracted multiple offers within the first week, and their negotiation skills got us well above asking price. This is how real estate should work.",
      name: "Michael Torres",
      role: "Sold home in Tulsa"
    },
    {
      id: 3,
      quote: "The professionalism was outstanding from start to finish. The photography made our home look incredible, the MLS exposure brought in serious buyers, and the entire process was managed flawlessly. Highly recommend M&T.",
      name: "Jennifer Adams",
      role: "Sold home in Norman"
    }
  ];

  return (
    <>
      <Head title="Sellers" />

      {/* Hero Section */}
      <section className="relative">
        <div className="relative min-h-[85vh] flex items-center overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.pexels.com/photos/5997993/pexels-photo-5997993.jpeg?auto=compress&cs=tinysrgb&w=1920"
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
                  For Sellers
                </span>
              </div>

              <h1
                className="text-white text-[40px] sm:text-[50px] md:text-[60px] font-medium leading-[1.1] mb-6 drop-shadow-2xl"
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                Sell Smarter.<br />Keep More of Your Equity.
              </h1>
              <p
                className="text-white/90 text-[16px] sm:text-[18px] font-medium mb-8 leading-relaxed max-w-2xl drop-shadow-lg"
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                Full-service representation with professional marketing, expert negotiation, and a modern brokerage model that eliminates unnecessary costs — not service.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-[0.4rem]">
                <Link
                  href="/contact"
                  className="button inline-flex items-center gap-[0.4rem] bg-[#2BBBAD] text-white rounded-full px-5 py-[0.875rem] font-medium leading-[120%] transition-all duration-[400ms] ease-[cubic-bezier(0.645,0.045,0.355,1)] hover:bg-[#249E93]"
                  style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                >
                  <span>Schedule a Consultation</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="#services"
                  className="button inline-flex items-center gap-[0.4rem] bg-white/10 backdrop-blur-md border border-white/30 text-white rounded-full px-5 py-[0.875rem] font-medium leading-[120%] transition-all duration-[400ms] ease-[cubic-bezier(0.645,0.045,0.355,1)] hover:bg-white/20"
                  style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                >
                  <span>View Our Services</span>
                  <ChevronRight className="w-5 h-5" />
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
                <Camera className="w-5 h-5 text-[#3D3D3D]" />
              </div>
              <div className="text-left whitespace-nowrap">
                <div className="text-[#111] font-semibold text-base" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Pro Marketing</div>
                <div className="text-[#666] text-sm" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Photos & Media</div>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white rounded-xl px-6 py-4 hover:shadow-md transition-all duration-300">
              <div className="bg-[#E5E1DC] p-3 rounded-lg flex-shrink-0">
                <BarChart3 className="w-5 h-5 text-[#3D3D3D]" />
              </div>
              <div className="text-left whitespace-nowrap">
                <div className="text-[#111] font-semibold text-base" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>MLS Exposure</div>
                <div className="text-[#666] text-sm" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>100+ Websites</div>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white rounded-xl px-6 py-4 hover:shadow-md transition-all duration-300">
              <div className="bg-[#E5E1DC] p-3 rounded-lg flex-shrink-0">
                <Target className="w-5 h-5 text-[#3D3D3D]" />
              </div>
              <div className="text-left whitespace-nowrap">
                <div className="text-[#111] font-semibold text-base" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Expert Pricing</div>
                <div className="text-[#666] text-sm" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Data-Driven</div>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white rounded-xl px-6 py-4 hover:shadow-md transition-all duration-300">
              <div className="bg-[#E5E1DC] p-3 rounded-lg flex-shrink-0">
                <Handshake className="w-5 h-5 text-[#3D3D3D]" />
              </div>
              <div className="text-left whitespace-nowrap">
                <div className="text-[#111] font-semibold text-base" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Negotiation</div>
                <div className="text-[#666] text-sm" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Strategic Approach</div>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white rounded-xl px-6 py-4 hover:shadow-md transition-all duration-300">
              <div className="bg-[#E5E1DC] p-3 rounded-lg flex-shrink-0">
                <DollarSign className="w-5 h-5 text-[#3D3D3D]" />
              </div>
              <div className="text-left whitespace-nowrap">
                <div className="text-[#111] font-semibold text-base" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>More Equity</div>
                <div className="text-[#666] text-sm" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Lean Model</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why Sell With Us Section */}
      <section className="bg-[#EEEDEA] py-20 md:py-28">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Left Side - Content */}
            <div>
              {/* Badge */}
              <div className="inline-flex items-center bg-[#E5E1DC] rounded-lg px-4 py-2 mb-6">
                <span className="text-[#666] text-sm font-medium" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  Why Sell With Us
                </span>
              </div>

              <h2
                className="text-[24px] md:text-[28px] text-[#111] font-medium leading-tight mb-6"
                style={{ fontFamily: 'Instrument Sans, sans-serif', fontWeight: 500 }}
              >
                Selling your home is one of the most significant financial transactions you'll make. You deserve professional representation that delivers results — without funding outdated overhead.
              </h2>

              <p
                className="text-[14px] text-[#666] font-medium mb-8 leading-relaxed"
                style={{ fontFamily: 'Instrument Sans, sans-serif', fontWeight: 500 }}
              >
                M&T Realty Group combines experienced agents, strategic marketing, and expert negotiation with a lean brokerage model — so you keep more of what your home is worth.
              </p>

              {/* Button */}
              <Link
                href="/contact"
                className="inline-flex items-center gap-[0.4rem] bg-[#2BBBAD] text-white rounded-full px-5 py-[0.875rem] font-medium leading-[120%] transition-all duration-[400ms] ease-[cubic-bezier(0.645,0.045,0.355,1)] hover:bg-[#249E93]"
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                <span>Get a Free Consultation</span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <mask id="mask0_sellers_1" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
                    <rect width="20" height="20" transform="matrix(-1 0 0 1 20 0)" fill="#D9D9D9"/>
                  </mask>
                  <g mask="url(#mask0_sellers_1)">
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
                    src="https://images.pexels.com/photos/2816323/pexels-photo-2816323.jpeg?auto=compress&cs=tinysrgb&w=600"
                    alt="Modern home exterior"
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="overflow-hidden rounded-2xl h-[195px]">
                  <img
                    src="https://images.pexels.com/photos/8134820/pexels-photo-8134820.jpeg?auto=compress&cs=tinysrgb&w=600"
                    alt="Luxury property"
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="overflow-hidden rounded-2xl h-[195px]">
                  <img
                    src="https://images.pexels.com/photos/2062426/pexels-photo-2062426.jpeg?auto=compress&cs=tinysrgb&w=600"
                    alt="Beautiful home interior"
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="overflow-hidden rounded-2xl h-[195px]">
                  <img
                    src="https://images.pexels.com/photos/5524308/pexels-photo-5524308.jpeg?auto=compress&cs=tinysrgb&w=600"
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
      <section id="services" className="bg-white py-20 md:py-28">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-[#E5E1DC] rounded-lg px-4 py-2 mb-8">
              <span className="text-[#666] text-sm font-medium" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                Our Process
              </span>
            </div>
            <h2 className="text-[32px] md:text-[48px] font-medium text-[#111] mb-4" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
              Four Steps to a Successful Sale
            </h2>
            <p className="text-[16px] text-[#666] font-medium max-w-2xl mx-auto" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
              From initial consultation to closing day, we manage the entire process so you don't have to.
            </p>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div key={index} className="relative">
                  <div className="bg-[#EEEDEA] rounded-2xl p-6 h-full hover:shadow-lg transition-all duration-300">
                    <div className="bg-[#E5E1DC] p-3 rounded-xl w-fit mb-4">
                      <IconComponent className="w-6 h-6 text-[#3D3D3D]" />
                    </div>
                    <div className="text-[#2BBBAD] text-sm font-medium mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                      STEP {item.step}
                    </div>
                    <h3 className="text-xl font-medium text-[#111] mb-3" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                      {item.title}
                    </h3>
                    <p className="text-sm text-[#666] font-medium leading-relaxed" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Professional Marketing Section */}
      <section className="bg-[#EEEDEA] py-20 md:py-28">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-[#E5E1DC] rounded-lg px-4 py-2 mb-8">
              <span className="text-[#666] text-sm font-medium" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                Our Marketing Services
              </span>
            </div>
            <h2 className="text-[32px] md:text-[48px] font-medium text-[#111] mb-4" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
              Your Home, Presented at Its Best
            </h2>
            <p className="text-[16px] text-[#666] font-medium max-w-2xl mx-auto" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
              Professional marketing sells homes faster and for more money. Every listing gets the attention and exposure it deserves.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {marketingServices.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <div key={index} className="bg-white rounded-2xl p-8 hover:shadow-xl transition-all duration-300 group">
                  <div className="w-14 h-14 bg-[#EEEDEA] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#2BBBAD]/10 transition-colors">
                    <IconComponent className="w-7 h-7 text-[#2BBBAD]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#111] mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                    {service.title}
                  </h3>
                  <p className="text-sm text-[#666] font-medium leading-relaxed" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                    {service.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <Link
              href="/our-packages"
              className="inline-flex items-center gap-2 bg-[#2BBBAD] text-white rounded-full px-6 py-3 font-medium transition-all duration-300 hover:bg-[#249E93]"
              style={{ fontFamily: 'Instrument Sans, sans-serif' }}
            >
              View Our Services
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* MLS Access Section */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Syndication Card */}
            <div className="order-2 lg:order-1">
              <div className="relative bg-[#EEEDEA] rounded-2xl p-8 shadow-lg">
                <div className="text-center mb-6">
                  <div className="bg-white rounded-2xl p-4 mb-4 inline-block">
                    <img src="/images/m&t_logo.png" alt="M&T Realty Group" className="h-12 w-auto" />
                  </div>
                  <h4 className="text-lg font-semibold text-[#111]" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                    Your MLS Listing
                  </h4>
                  <p className="text-sm text-[#666]" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                    Syndicates to 100+ sites automatically
                  </p>
                </div>

                <CompanyLogosGrid variant="cards" />

                <div className="mt-6 pt-6 border-t border-[#D0CCC7] text-center">
                  <p className="text-sm text-[#666]" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                    <span className="font-semibold text-[#2BBBAD]">+100 more</span> real estate websites
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side - Content */}
            <div className="order-1 lg:order-2">
              {/* Badge */}
              <div className="inline-flex items-center bg-[#E5E1DC] rounded-lg px-4 py-2 mb-6">
                <span className="text-[#666] text-sm font-medium" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  MLS Exposure
                </span>
              </div>

              <h2
                className="text-[32px] md:text-[40px] text-[#111] font-medium leading-tight mb-6"
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                Maximum Exposure on Every Platform
              </h2>

              <p
                className="text-[16px] text-[#666] font-medium mb-8 leading-relaxed"
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                Your listing gets full MLS syndication — appearing on Zillow, Realtor.com, Redfin, and hundreds of other platforms where serious buyers are searching. Combined with our targeted marketing strategy, your property gets the attention it deserves.
              </p>

              {/* Benefits */}
              <div className="space-y-4 mb-8">
                {mlsBenefits.map((benefit, index) => {
                  const IconComponent = benefit.icon;
                  return (
                    <div key={index} className="flex items-start gap-4">
                      <div className="bg-[#EEEDEA] p-2 rounded-lg flex-shrink-0">
                        <IconComponent className="w-5 h-5 text-[#2BBBAD]" />
                      </div>
                      <div>
                        <h4 className="text-[#111] font-medium mb-1" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                          {benefit.title}
                        </h4>
                        <p className="text-sm text-[#666]" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="bg-[#EEEDEA] py-20 md:py-28">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          {/* Section Header */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center bg-[#E5E1DC] rounded-lg px-4 py-2 mb-6">
              <span className="text-[#666] text-sm font-medium" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                Compare
              </span>
            </div>
            <h2 className="text-[32px] md:text-[48px] font-medium text-[#111] mb-4" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
              How We Compare
            </h2>
            <p className="text-[16px] text-[#666] font-medium max-w-2xl mx-auto" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
              Full-service representation at a smarter cost — see how M&T stacks up
            </p>
          </div>

          {/* Comparison Table */}
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
              {/* Header */}
              <div className="grid grid-cols-4 gap-4 p-6 bg-[#1a1a1a]">
                <div className="text-white font-medium" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  Feature
                </div>
                <div className="text-[#2BBBAD] font-semibold text-center" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  M&T Realty Group
                </div>
                <div className="text-white/70 font-medium text-center" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  Discount Broker
                </div>
                <div className="text-white/70 font-medium text-center" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  Traditional Agent
                </div>
              </div>

              {/* Rows */}
              {comparisonData.map((row, index) => (
                <div
                  key={index}
                  className={`grid grid-cols-4 gap-4 p-6 ${index % 2 === 0 ? 'bg-white' : 'bg-[#F8F7F5]'}`}
                >
                  <div className="text-[#111] font-medium text-sm" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                    {row.feature}
                  </div>
                  <div className="text-[#2BBBAD] font-medium text-center text-sm" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                    {row.mandt}
                  </div>
                  <div className="text-[#666] text-center text-sm" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                    {row.discount}
                  </div>
                  <div className="text-[#666] text-center text-sm" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                    {row.traditional}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-12">
            <div>
              {/* Badge */}
              <div className="inline-flex items-center bg-[#E5E1DC] rounded-lg px-4 py-2 mb-6">
                <span className="text-[#666] text-sm font-medium" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  Testimonials
                </span>
              </div>

              {/* Heading */}
              <h2
                className="text-[32px] md:text-[48px] font-medium text-[#111] leading-tight"
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                What Our Clients Are Saying
              </h2>
            </div>
          </div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-[#EEEDEA] rounded-2xl p-8 border border-gray-300 flex flex-col justify-between"
                style={{ minHeight: '400px' }}
              >
                <div>
                  <p
                    className="text-[#111] text-[18px] font-medium leading-relaxed"
                    style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                  >
                    "{testimonial.quote}"
                  </p>
                </div>

                {/* Author Info */}
                <div className="mt-8">
                  <h4
                    className="text-[#111] text-[18px] font-medium mb-1"
                    style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                  >
                    {testimonial.name}
                  </h4>
                  <p
                    className="text-[#111] text-[14px] font-medium opacity-70"
                    style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                  >
                    {testimonial.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-[#EEEDEA] py-20 md:py-28">
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
                Have questions about selling with M&T Realty Group? We believe in transparency — here are answers to what sellers ask most.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-[0.4rem] bg-[#2BBBAD] text-white rounded-full px-5 py-[0.875rem] font-medium leading-[120%] transition-all duration-[400ms] ease-[cubic-bezier(0.645,0.045,0.355,1)] hover:bg-[#249E93]"
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                <span>Ask Us Anything</span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <mask id="mask0_sellers_faq" maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20" style={{ maskType: 'alpha' }}>
                    <rect width="20" height="20" transform="matrix(-1 0 0 1 20 0)" fill="#D9D9D9"/>
                  </mask>
                  <g mask="url(#mask0_sellers_faq)">
                    <path d="M13.459 10.8334L11.084 13.2084C10.9173 13.3751 10.8375 13.5695 10.8444 13.7918C10.8513 14.014 10.9312 14.2084 11.084 14.3751C11.2507 14.5418 11.4486 14.6286 11.6777 14.6355C11.9069 14.6425 12.1048 14.5626 12.2715 14.3959L16.084 10.5834C16.2507 10.4168 16.334 10.2223 16.334 10.0001C16.334 9.77787 16.2507 9.58343 16.084 9.41676L12.2715 5.60426C12.1048 5.43759 11.9069 5.35773 11.6777 5.36467C11.4486 5.37162 11.2507 5.45842 11.084 5.62509C10.9312 5.79176 10.8513 5.9862 10.8444 6.20842C10.8375 6.43065 10.9173 6.62509 11.084 6.79176L13.459 9.16676H4.16732C3.93121 9.16676 3.73329 9.24662 3.57357 9.40634C3.41385 9.56606 3.33398 9.76398 3.33398 10.0001C3.33398 10.2362 3.41385 10.4341 3.57357 10.5938C3.73329 10.7536 3.93121 10.8334 4.16732 10.8334H13.459Z" fill="white"/>
                  </g>
                </svg>
              </Link>
            </div>

            {/* Right Side - FAQ Accordion */}
            <div>
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-2xl mb-4 overflow-hidden transition-all duration-300">
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

      {/* Bottom CTA Section */}
      <section className="bg-white py-16 md:py-20">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="bg-[#1a1a1a] rounded-2xl p-10 md:p-16 text-center">
            <Shield className="w-12 h-12 text-[#2BBBAD] mx-auto mb-6" />
            <h2
              className="text-white text-[28px] md:text-[40px] font-medium mb-4 leading-[1.15]"
              style={{ fontFamily: 'Instrument Sans, sans-serif' }}
            >
              Ready to sell smarter?
            </h2>
            <p
              className="text-[#2BBBAD] text-[20px] md:text-[28px] font-medium mb-8"
              style={{ fontFamily: 'Instrument Sans, sans-serif' }}
            >
              Let's create a strategy that works for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-[#2BBBAD] text-white rounded-full px-8 py-3.5 font-semibold text-[15px] transition-all duration-300 hover:bg-[#249E93] hover:shadow-lg hover:shadow-[#2BBBAD]/25"
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                Schedule a Consultation
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <mask id="mask_sellers_cta" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
                    <rect width="20" height="20" transform="matrix(-1 0 0 1 20 0)" fill="#D9D9D9"/>
                  </mask>
                  <g mask="url(#mask_sellers_cta)">
                    <path d="M13.459 10.8334L11.084 13.2084C10.9173 13.3751 10.8375 13.5695 10.8444 13.7918C10.8513 14.014 10.9312 14.2084 11.084 14.3751C11.2507 14.5418 11.4486 14.6286 11.6777 14.6355C11.9069 14.6425 12.1048 14.5626 12.2715 14.3959L16.084 10.5834C16.2507 10.4168 16.334 10.2223 16.334 10.0001C16.334 9.77787 16.2507 9.58343 16.084 9.41676L12.2715 5.60426C12.1048 5.43759 11.9069 5.35773 11.6777 5.36467C11.4486 5.37162 11.2507 5.45842 11.084 5.62509C10.9312 5.79176 10.8513 5.9862 10.8444 6.20842C10.8375 6.43065 10.9173 6.62509 11.084 6.79176L13.459 9.16676H4.16732C3.93121 9.16676 3.73329 9.24662 3.57357 9.40634C3.41385 9.56606 3.33398 9.76398 3.33398 10.0001C3.33398 10.2362 3.41385 10.4341 3.57357 10.5938C3.73329 10.7536 3.93121 10.8334 4.16732 10.8334H13.459Z" fill="white"/>
                  </g>
                </svg>
              </Link>
              <Link
                href="/why-our-model-works"
                className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/30 text-white rounded-full px-8 py-3.5 font-semibold text-[15px] transition-all duration-300 hover:bg-white/20"
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                Why Our Model Works
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// Specify MainLayout for this page to include Header and Footer
Sellers.layout = (page) => <MainLayout>{page}</MainLayout>;

export default Sellers;
