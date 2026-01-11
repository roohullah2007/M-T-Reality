import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Target, Heart, Shield, Users, TrendingUp, Award, Zap, CheckCircle, Star, Home, DollarSign, Clock, Mail, Phone, MapPin } from 'lucide-react';
import MainLayout from '@/Layouts/MainLayout';

function About() {
  const values = [
    {
      icon: Heart,
      title: 'Customer First',
      description: 'We put our customers at the heart of everything we do. Your success is our success.'
    },
    {
      icon: Shield,
      title: 'Trust & Transparency',
      description: 'No hidden fees, no surprises. We believe in honest, transparent relationships.'
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'We continuously improve our platform to provide the best experience possible.'
    },
    {
      icon: Target,
      title: 'Results Driven',
      description: 'We focus on delivering real results - helping you buy or sell quickly and profitably.'
    }
  ];

  const testimonials = [
    {
      name: 'Jennifer Martinez',
      location: 'Oklahoma City, OK',
      rating: 5,
      text: 'I saved over $18,000 in commission fees by using OKByOwner. The platform was incredibly easy to use, and I had my home sold in just 3 weeks!'
    },
    {
      name: 'Robert Thompson',
      location: 'Tulsa, OK',
      rating: 5,
      text: 'Best decision I ever made! The MLS listing gave me maximum exposure, and I maintained complete control over the selling process. Highly recommend!'
    },
    {
      name: 'Lisa Anderson',
      location: 'Norman, OK',
      rating: 5,
      text: 'The support team was amazing throughout the entire process. They answered all my questions and made selling by owner stress-free.'
    }
  ];

  const features = [
    'Zero commission fees',
    'MLS syndication available',
    'Professional photography services',
    'Virtual tour integration',
    'Direct buyer connections',
    'Legal document templates',
    'Customer Support (not 24/7)',
    'Mobile-friendly platform'
  ];

  return (
    <>
      <Head title="About Us - OKBYOWNER" />

      {/* Hero Section */}
      <div className="relative pt-0 md:pt-[77px]">
        <div className="relative min-h-[60vh] flex items-center py-16 md:py-20 overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1920"
              alt="Oklahoma neighborhood"
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
                Empowering Homeowners Across Oklahoma
              </h1>

              {/* Subheading */}
              <p
                className="text-white text-[14px] sm:text-[16px] font-medium mb-8 leading-relaxed max-w-2xl drop-shadow-lg"
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                We're on a mission to revolutionize real estate by putting control back in the hands of homeowners. No agents, no commissions, just direct connections between buyers and sellers.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-[0.4rem] mb-12">
                <Link
                  href="/list-property"
                  className="button inline-flex items-center justify-center gap-[0.4rem] bg-[#A41E34] text-white rounded-full px-5 py-[0.875rem] font-medium leading-[120%] transition-all duration-[400ms] ease-[cubic-bezier(0.645,0.045,0.355,1)] hover:bg-[#8B1A2C]"
                  style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                >
                  <span>Start Listing Free</span>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <mask id="mask0_56_2205" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
                      <rect width="20" height="20" transform="matrix(-1 0 0 1 20 0)" fill="#D9D9D9"/>
                    </mask>
                    <g mask="url(#mask0_56_2205)">
                      <path d="M13.459 10.8334L11.084 13.2084C10.9173 13.3751 10.8375 13.5695 10.8444 13.7918C10.8513 14.014 10.9312 14.2084 11.084 14.3751C11.2507 14.5418 11.4486 14.6286 11.6777 14.6355C11.9069 14.6425 12.1048 14.5626 12.2715 14.3959L16.084 10.5834C16.2507 10.4168 16.334 10.2223 16.334 10.0001C16.334 9.77787 16.2507 9.58343 16.084 9.41676L12.2715 5.60426C12.1048 5.43759 11.9069 5.35773 11.6777 5.36467C11.4486 5.37162 11.2507 5.45842 11.084 5.62509C10.9312 5.79176 10.8513 5.9862 10.8444 6.20842C10.8375 6.43065 10.9173 6.62509 11.084 6.79176L13.459 9.16676H4.16732C3.93121 9.16676 3.73329 9.24662 3.57357 9.40634C3.41385 9.56606 3.33398 9.76398 3.33398 10.0001C3.33398 10.2362 3.41385 10.4341 3.57357 10.5938C3.73329 10.7536 3.93121 10.8334 4.16732 10.8334H13.459Z" fill="white"/>
                    </g>
                  </svg>
                </Link>
                <Link
                  href="/contact"
                  className="button inline-flex items-center justify-center gap-[0.4rem] bg-white/10 backdrop-blur-md border border-white/30 text-white rounded-full px-5 py-[0.875rem] font-medium leading-[120%] transition-all duration-[400ms] ease-[cubic-bezier(0.645,0.045,0.355,1)] hover:bg-white/20"
                  style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                >
                  <span>Contact Us</span>
                  <Mail className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <section className="bg-[#EEEDEA] py-12 md:py-20">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left Side - Content */}
            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-[#E5E1DC] rounded-lg px-4 py-2 mb-6">
                <Heart className="w-4 h-4 text-[#666]" />
                <span className="text-[#666] text-sm font-medium" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  Our Story
                </span>
              </div>

              {/* Main Heading */}
              <h2
                className="text-[28px] md:text-[40px] text-[#111] font-medium leading-tight mb-6"
                style={{ fontFamily: 'Instrument Sans, sans-serif', fontWeight: 500 }}
              >
                Changing the Way Oklahoma Buys & Sells
              </h2>

              {/* Story Text */}
              <div className="space-y-4 mb-8">
                <p
                  className="text-[14px] md:text-[16px] text-[#666] font-medium leading-relaxed"
                  style={{ fontFamily: 'Instrument Sans, sans-serif', fontWeight: 500 }}
                >
                  OKByOwner was founded in 1997 with a simple belief: homeowners deserve to keep their hard-earned equity. After watching countless friends and family members pay tens of thousands in broker commissions, we knew there had to be a better way.
                </p>
                <p
                  className="text-[14px] md:text-[16px] text-[#666] font-medium leading-relaxed"
                  style={{ fontFamily: 'Instrument Sans, sans-serif', fontWeight: 500 }}
                >
                  Today, we're proud to be Oklahoma's leading For Sale By Owner website, helping thousands of homeowners save money and take control of their real estate journey. From free listings to premium marketing services, we provide everything you need to succeed.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/properties"
                  className="inline-flex items-center gap-[0.4rem] bg-[#413936] text-white rounded-full px-5 py-[0.875rem] font-medium leading-[120%] transition-all duration-[400ms] ease-[cubic-bezier(0.645,0.045,0.355,1)] hover:bg-[#312926]"
                  style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                >
                  <span>Browse Properties</span>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <mask id="mask0_56_2206" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
                      <rect width="20" height="20" transform="matrix(-1 0 0 1 20 0)" fill="#D9D9D9"/>
                    </mask>
                    <g mask="url(#mask0_56_2206)">
                      <path d="M13.459 10.8334L11.084 13.2084C10.9173 13.3751 10.8375 13.5695 10.8444 13.7918C10.8513 14.014 10.9312 14.2084 11.084 14.3751C11.2507 14.5418 11.4486 14.6286 11.6777 14.6355C11.9069 14.6425 12.1048 14.5626 12.2715 14.3959L16.084 10.5834C16.2507 10.4168 16.334 10.2223 16.334 10.0001C16.334 9.77787 16.2507 9.58343 16.084 9.41676L12.2715 5.60426C12.1048 5.43759 11.9069 5.35773 11.6777 5.36467C11.4486 5.37162 11.2507 5.45842 11.084 5.62509C10.9312 5.79176 10.8513 5.9862 10.8444 6.20842C10.8375 6.43065 10.9173 6.62509 11.084 6.79176L13.459 9.16676H4.16732C3.93121 9.16676 3.73329 9.24662 3.57357 9.40634C3.41385 9.56606 3.33398 9.76398 3.33398 10.0001C3.33398 10.2362 3.41385 10.4341 3.57357 10.5938C3.73329 10.7536 3.93121 10.8334 4.16732 10.8334H13.459Z" fill="white"/>
                    </g>
                  </svg>
                </Link>
              </div>
            </div>

            {/* Right Side - Features List */}
            <div className="bg-white rounded-2xl p-6 md:p-8">
              <h3 className="text-[20px] md:text-[24px] font-medium text-[#111] mb-6" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                What We Offer
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-[#A41E34] flex-shrink-0" />
                    <span className="text-sm text-[#666]" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

    </>
  );
}

// Specify MainLayout for this page to include Header and Footer
About.layout = (page) => <MainLayout>{page}</MainLayout>;

export default About;
