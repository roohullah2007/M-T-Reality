import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { MessageCircle, TrendingUp, Zap, Shield, CheckCircle, ArrowRight, Phone, Mail, MapPin } from 'lucide-react';
import MainLayout from '@/Layouts/MainLayout';

function About() {
  const beliefs = [
    {
      icon: MessageCircle,
      title: 'Communication builds trust',
      description: 'We keep you informed at every stage — no guesswork, no waiting, no runaround. Direct access to experienced professionals who know your transaction inside and out.'
    },
    {
      icon: TrendingUp,
      title: 'Strategy drives outcomes',
      description: 'Every listing decision — from pricing to marketing to negotiation — is backed by data and market expertise. We don\'t guess. We plan.'
    },
    {
      icon: Zap,
      title: 'Efficiency creates value',
      description: 'By eliminating unnecessary overhead, we pass real savings to our clients. Lean operations mean you keep more of your equity at closing.'
    }
  ];

  return (
    <>
      <Head title="About Us" />

      {/* Hero Section */}
      <section className="relative">
        <div className="relative min-h-[85vh] flex items-center overflow-hidden">
          {/* Background Image */}
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
              {/* Badge */}
              <div className="inline-flex items-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2 mb-6">
                <span className="text-white/90 text-sm font-medium" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  About Us
                </span>
              </div>

              <h1
                className="text-white text-[40px] sm:text-[50px] md:text-[60px] font-medium leading-[1.1] mb-6 drop-shadow-2xl"
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                About M&T<br />Realty Group
              </h1>
              <p
                className="text-white/90 text-[16px] sm:text-[18px] font-medium leading-relaxed max-w-2xl drop-shadow-lg"
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                Professional representation without funding outdated business models.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Founding Principle Section */}
      <section className="bg-[#EEEDEA] py-20 md:py-28">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left - Content */}
            <div>
              {/* Badge */}
              <div className="inline-flex items-center bg-[#E5E1DC] rounded-lg px-4 py-2 mb-8">
                <span className="text-[#666] text-sm font-medium" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  Our Story
                </span>
              </div>

              <h2
                className="text-[32px] md:text-[44px] font-medium text-[#111] leading-[1.15] mb-6"
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                Founded on a<br />simple principle
              </h2>

              <div className="space-y-5">
                <p
                  className="text-[16px] md:text-[18px] text-[#111] font-semibold leading-relaxed"
                  style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                >
                  Clients deserve professional representation without funding outdated business models.
                </p>
                <p
                  className="text-[15px] text-[#666] font-medium leading-relaxed"
                  style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                >
                  As experienced real estate professionals, we saw an opportunity to modernize how a brokerage operates — reducing unnecessary expenses while maintaining high standards of service and results.
                </p>
                <p
                  className="text-[15px] text-[#666] font-medium leading-relaxed"
                  style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                >
                  Our approach is strategic, transparent, and client-focused.
                </p>
              </div>
            </div>

            {/* Right - Team Photos */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src="/images/men-img.jpg"
                    alt="Terry - Broker / Owner"
                    className="w-full h-[300px] object-cover"
                  />
                  <div className="bg-white p-4 text-center">
                    <h3 className="text-[16px] font-semibold text-[#111]" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Terry</h3>
                    <p className="text-[13px] text-[#666] font-medium" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Broker / Owner</p>
                  </div>
                </div>
                <div className="rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src="/images/women-img.jpg"
                    alt="Michele - Associate Broker"
                    className="w-full h-[300px] object-cover"
                  />
                  <div className="bg-white p-4 text-center">
                    <h3 className="text-[16px] font-semibold text-[#111]" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Michele</h3>
                    <p className="text-[13px] text-[#666] font-medium" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Associate Broker</p>
                  </div>
                </div>
              </div>
              {/* Accent card */}
              <div className="absolute -bottom-6 -left-6 bg-[#1a1a1a] rounded-2xl p-6 shadow-xl hidden md:block">
                <p
                  className="text-[#2BBBAD] text-[36px] font-bold leading-none mb-1"
                  style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                >
                  M&T
                </p>
                <p
                  className="text-white/70 text-sm font-medium"
                  style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                >
                  Realty Group
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* We Believe Section */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-[#E5E1DC] rounded-lg px-4 py-2 mb-8">
              <span className="text-[#666] text-sm font-medium" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                Our Values
              </span>
            </div>
            <h2
              className="text-[32px] md:text-[48px] font-medium text-[#111] leading-[1.15] mb-4"
              style={{ fontFamily: 'Instrument Sans, sans-serif' }}
            >
              We believe
            </h2>
            <p
              className="text-[16px] text-[#666] font-medium max-w-2xl mx-auto"
              style={{ fontFamily: 'Instrument Sans, sans-serif' }}
            >
              Our core values guide every decision we make and every client we serve.
            </p>
          </div>

          {/* Belief Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {beliefs.map((belief, index) => {
              const IconComponent = belief.icon;
              return (
                <div
                  key={index}
                  className="bg-[#EEEDEA] rounded-2xl p-8 hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#2BBBAD]/10 transition-colors">
                    <IconComponent className="w-7 h-7 text-[#2BBBAD]" />
                  </div>
                  <h3
                    className="text-[22px] font-semibold text-[#111] mb-3"
                    style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                  >
                    {belief.title}
                  </h3>
                  <p
                    className="text-[15px] text-[#666] font-medium leading-relaxed"
                    style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                  >
                    {belief.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Statement Section */}
      <section className="bg-[#EEEDEA] py-20 md:py-28">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="bg-[#1a1a1a] rounded-2xl p-10 md:p-16">
            <div className="max-w-3xl mx-auto text-center">
              <Shield className="w-12 h-12 text-[#2BBBAD] mx-auto mb-6" />
              <h2
                className="text-white text-[24px] md:text-[36px] font-medium mb-6 leading-[1.2]"
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                Real estate is one of the largest financial transactions most people make.
              </h2>
              <p
                className="text-[#2BBBAD] text-[20px] md:text-[28px] font-medium mb-10"
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                It deserves professionalism — not excess overhead.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 bg-[#2BBBAD] text-white rounded-full px-8 py-3.5 font-semibold text-[15px] transition-all duration-300 hover:bg-[#249E93] hover:shadow-lg hover:shadow-[#2BBBAD]/25"
                  style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                >
                  Schedule a Consultation
                  <ArrowRight className="w-5 h-5" />
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
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2
              className="text-[32px] md:text-[44px] font-medium text-[#111] mb-4"
              style={{ fontFamily: 'Instrument Sans, sans-serif' }}
            >
              Get in Touch
            </h2>
            <p
              className="text-[16px] text-[#666] font-medium"
              style={{ fontFamily: 'Instrument Sans, sans-serif' }}
            >
              Ready to learn more? We'd love to hear from you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <a
              href="tel:918-884-7653"
              className="bg-[#EEEDEA] rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300 group"
            >
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-[#2BBBAD]/10 transition-colors">
                <Phone className="w-6 h-6 text-[#2BBBAD]" />
              </div>
              <h3
                className="text-[18px] font-semibold text-[#111] mb-2"
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                Call Us
              </h3>
              <p
                className="text-[15px] text-[#666] font-medium"
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                918-884-7653 (SOLD)
              </p>
            </a>

            <a
              href="mailto:info@mandtrealty.com"
              className="bg-[#EEEDEA] rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300 group"
            >
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-[#2BBBAD]/10 transition-colors">
                <Mail className="w-6 h-6 text-[#2BBBAD]" />
              </div>
              <h3
                className="text-[18px] font-semibold text-[#111] mb-2"
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                Email Us
              </h3>
              <p
                className="text-[15px] text-[#666] font-medium"
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                info@mandtrealty.com
              </p>
            </a>

            <div className="bg-[#EEEDEA] rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300 group">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-[#2BBBAD]/10 transition-colors">
                <MapPin className="w-6 h-6 text-[#2BBBAD]" />
              </div>
              <h3
                className="text-[18px] font-semibold text-[#111] mb-2"
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                Visit Us
              </h3>
              <p
                className="text-[15px] text-[#666] font-medium leading-relaxed"
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                3701-A South Harvard Ave #320<br />Tulsa, OK 74135
              </p>
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
