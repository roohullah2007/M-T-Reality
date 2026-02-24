import React from 'react';
import { Head, Link } from '@inertiajs/react';
import {
  TrendingUp, Camera, Globe, Megaphone, Home, Handshake,
  FileCheck, Eye, CheckCircle, ChevronRight, ArrowRight,
  Phone, Shield, Star
} from 'lucide-react';
import MainLayout from '@/Layouts/MainLayout';

function Packages() {
  const services = [
    {
      icon: TrendingUp,
      title: 'Strategic Market Analysis',
      description: 'Data-driven pricing strategy based on local market trends, comparable sales, and property-specific factors to position your home competitively.'
    },
    {
      icon: Camera,
      title: 'Professional Photography',
      description: 'High-quality HDR photography, aerial drone shots, and virtual twilight images that make your listing stand out from the competition.'
    },
    {
      icon: Globe,
      title: 'MLS & Syndication',
      description: 'Full MLS listing with automatic syndication to Zillow, Trulia, Realtor.com, and 100+ real estate websites for maximum buyer exposure.'
    },
    {
      icon: Megaphone,
      title: 'Digital Marketing',
      description: 'Targeted social media campaigns, email marketing, and digital advertising to reach qualified buyers actively searching in your area.'
    },
    {
      icon: Home,
      title: 'Showings & Open Houses',
      description: 'Professionally managed showings and open house events. We handle scheduling, buyer screening, and follow-up so you don\'t have to.'
    },
    {
      icon: Handshake,
      title: 'Expert Negotiation',
      description: 'Skilled negotiation on your behalf to secure the best possible price and terms. We protect your interests at every step.'
    },
    {
      icon: FileCheck,
      title: 'Contract-to-Close Management',
      description: 'Full transaction coordination from accepted offer through closing — inspections, appraisals, title work, and paperwork handled for you.'
    },
    {
      icon: Eye,
      title: 'Virtual Tours',
      description: '3D Matterport tours, HD video walkthroughs, and interactive floor plans that let buyers explore your property from anywhere in the world.'
    }
  ];

  const steps = [
    {
      number: '01',
      title: 'Schedule a Consultation',
      description: 'Connect with an M&T agent to discuss your goals, timeline, and property details.'
    },
    {
      number: '02',
      title: 'Get a Market Analysis',
      description: 'We prepare a comprehensive market analysis to determine the optimal listing price for your property.'
    },
    {
      number: '03',
      title: 'We Market Your Home',
      description: 'Professional photos, MLS listing, digital marketing, and targeted advertising — we handle it all.'
    },
    {
      number: '04',
      title: 'Sell With Confidence',
      description: 'From showings to negotiations to closing, your M&T agent guides you every step of the way.'
    }
  ];

  const differentiators = [
    'Full-service representation at competitive rates',
    'Professional photography and virtual tours included',
    'MLS listing with 100+ site syndication',
    'Expert negotiation and contract management',
    'No hidden fees — transparent pricing upfront',
    'Dedicated agent from listing to closing',
    'Targeted digital marketing campaigns',
    'Lean operations mean more savings for you'
  ];

  return (
    <>
      <Head title="Our Services" />

      {/* Hero Section */}
      <section className="relative">
        <div className="relative min-h-[85vh] flex items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.pexels.com/photos/3184416/pexels-photo-3184416.jpeg?auto=compress&cs=tinysrgb&w=1920"
              alt=""
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/35"></div>
          </div>

          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 relative z-10 w-full py-20 pt-[120px]">
            <div className="max-w-3xl">
              <div className="inline-flex items-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2 mb-6">
                <span className="text-white/90 text-sm font-medium" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  Our Services
                </span>
              </div>

              <h1
                className="text-white text-[40px] sm:text-[50px] md:text-[60px] font-medium leading-[1.1] mb-6 drop-shadow-2xl"
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                Full-Service<br />Listing Solutions
              </h1>
              <p
                className="text-white/90 text-[16px] sm:text-[18px] font-medium leading-relaxed max-w-2xl drop-shadow-lg"
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                Everything you need to sell your home — professional marketing, expert negotiation, and dedicated support from listing to closing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Bar */}
      <section className="bg-white py-12 border-b border-[#E5E1DC]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {[
              { icon: Camera, label: 'Professional Photography' },
              { icon: Globe, label: 'MLS & Syndication' },
              { icon: Megaphone, label: 'Digital Marketing' },
              { icon: Handshake, label: 'Expert Negotiation' },
              { icon: FileCheck, label: 'Full Transaction Support' },
            ].map((item, index) => (
              <div key={index} className="flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 bg-[#EEEDEA] rounded-xl flex items-center justify-center">
                  <item.icon className="w-6 h-6 text-[#2BBBAD]" />
                </div>
                <span
                  className="text-[13px] font-medium text-[#666]"
                  style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's Included Section */}
      <section className="bg-[#EEEDEA] py-20 md:py-28">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="mb-12">
            <div className="inline-flex items-center bg-[#E5E1DC] rounded-lg px-4 py-2 mb-6">
              <span className="text-[#666] text-sm font-medium" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                What's Included
              </span>
            </div>
            <h2
              className="text-[32px] md:text-[48px] font-medium text-[#111] leading-tight"
              style={{ fontFamily: 'Instrument Sans, sans-serif' }}
            >
              Comprehensive Listing Services
            </h2>
            <p
              className="text-[16px] text-[#666] font-medium mt-4 max-w-2xl"
              style={{ fontFamily: 'Instrument Sans, sans-serif' }}
            >
              Every listing with M&T Realty Group includes a full suite of professional services designed to sell your home faster and for the best possible price.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 transition-all duration-300 hover:shadow-lg"
                >
                  <div className="w-12 h-12 bg-[#EEEDEA] rounded-xl flex items-center justify-center mb-4">
                    <IconComponent className="w-6 h-6 text-[#2BBBAD]" />
                  </div>
                  <h3
                    className="text-[18px] font-semibold text-[#111] mb-2"
                    style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                  >
                    {service.title}
                  </h3>
                  <p
                    className="text-sm text-[#666] font-medium leading-relaxed"
                    style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                  >
                    {service.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="mb-12">
            <div className="inline-flex items-center bg-[#E5E1DC] rounded-lg px-4 py-2 mb-6">
              <span className="text-[#666] text-sm font-medium" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                How It Works
              </span>
            </div>
            <h2
              className="text-[32px] md:text-[48px] font-medium text-[#111] leading-tight"
              style={{ fontFamily: 'Instrument Sans, sans-serif' }}
            >
              Four Simple Steps
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <span
                  className="text-[64px] font-bold text-[#EEEDEA] leading-none"
                  style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                >
                  {step.number}
                </span>
                <h3
                  className="text-[20px] font-semibold text-[#111] mt-2 mb-3"
                  style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                >
                  {step.title}
                </h3>
                <p
                  className="text-sm text-[#666] font-medium leading-relaxed"
                  style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                >
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The M&T Difference Section */}
      <section className="bg-[#EEEDEA] py-20 md:py-28">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center bg-[#E5E1DC] rounded-lg px-4 py-2 mb-6">
                <span className="text-[#666] text-sm font-medium" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  Why M&T
                </span>
              </div>
              <h2
                className="text-[32px] md:text-[48px] font-medium text-[#111] leading-tight mb-6"
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                The M&T Difference
              </h2>
              <p
                className="text-[16px] text-[#666] font-medium leading-relaxed mb-8"
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                We combine full-service expertise with a lean, efficient model — so you get professional representation without the inflated costs of traditional brokerages.
              </p>

              <div className="space-y-4">
                {differentiators.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#2BBBAD] flex-shrink-0 mt-0.5" />
                    <span
                      className="text-[15px] text-[#444] font-medium"
                      style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                    >
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <img
                src="https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="M&T Realty Group team"
                className="rounded-2xl shadow-xl w-full object-cover h-[500px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="bg-[#2BBBAD] py-16 md:py-20">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 text-center">
          <h2
            className="text-white text-[32px] md:text-[48px] font-medium mb-4"
            style={{ fontFamily: 'Instrument Sans, sans-serif' }}
          >
            Ready to Sell Your Home?
          </h2>
          <p
            className="text-white/90 text-[16px] font-medium mb-8 max-w-2xl mx-auto"
            style={{ fontFamily: 'Instrument Sans, sans-serif' }}
          >
            Schedule a free consultation with an M&T agent and discover how our full-service approach can help you sell faster and for more.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sellers"
              className="inline-flex items-center justify-center gap-2 bg-white text-[#2BBBAD] rounded-full px-8 py-4 font-medium transition-all duration-300 hover:bg-white/90"
              style={{ fontFamily: 'Instrument Sans, sans-serif' }}
            >
              Sell With Us
              <ChevronRight className="w-5 h-5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white text-white rounded-full px-8 py-4 font-medium transition-all duration-300 hover:bg-white/10"
              style={{ fontFamily: 'Instrument Sans, sans-serif' }}
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

Packages.layout = (page) => <MainLayout>{page}</MainLayout>;

export default Packages;
