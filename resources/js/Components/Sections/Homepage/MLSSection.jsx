import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Users, TrendingUp, DollarSign, Clock } from 'lucide-react';

const MLSSection = () => {
  const { companyLogos = [] } = usePage().props;
  const companyNames = companyLogos.length > 0
    ? companyLogos.filter(l => l.name !== 'MLS').map(l => l.name).join(', ')
    : 'Zillow, Realtor.com, Trulia, Redfin, and more';

  const stats = [
    {
      icon: Users,
      value: '96.5%',
      label: 'Agent Referrals',
      description: 'of MLS sales came from buyer agents'
    },
    {
      icon: TrendingUp,
      value: '32%',
      label: 'Faster Sales',
      description: 'when listed on MLS'
    },
    {
      icon: DollarSign,
      value: '$5,500+',
      label: 'Average Savings',
      description: 'vs traditional 6% commission'
    },
    {
      icon: Clock,
      value: '48hrs',
      label: 'Quick Listing',
      description: 'live on MLS within two days'
    }
  ];

  const benefits = [
    {
      title: 'Maximum Exposure',
      description: `Your listing syndicates to ${companyNames}, and hundreds more sites.`
    },
    {
      title: 'Buyer Agent Access',
      description: 'Agents actively searching for properties for their clients will find your home.'
    },
    {
      title: 'Save Thousands',
      description: 'Our efficient brokerage model means you keep more of your equity at closing.'
    },
    {
      title: 'Expert Guidance',
      description: 'We handle pricing, showings, and negotiations with skilled, experienced professionals.'
    },
    {
      title: 'Professional Credibility',
      description: 'Full brokerage representation gives buyers and agents confidence in your listing.'
    }
  ];

  const steps = [
    {
      number: '01',
      title: 'Schedule a Consultation',
      description: 'Meet with us to discuss your property, review the local market, and create a customized selling plan.'
    },
    {
      number: '02',
      title: 'Professional Marketing Launch',
      description: 'We handle photos, listing preparation, and launch your property on the MLS and hundreds of syndicated sites.'
    },
    {
      number: '03',
      title: 'Maximum Buyer Exposure',
      description: 'Your listing reaches thousands of active buyers and agents through full MLS syndication and targeted marketing.'
    },
    {
      number: '04',
      title: 'Expert Negotiation',
      description: 'We review all offers and negotiate skillfully on your behalf to secure the best possible terms and price.'
    },
    {
      number: '05',
      title: 'Close with Confidence',
      description: 'We manage the entire contract-to-close process, ensuring a smooth transaction from accepted offer to closing day.'
    }
  ];

  return (
    <section className="bg-[#EEEDEA] py-20">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          {/* Badge */}
          <div className="inline-flex items-center bg-[#E5E1DC] rounded-lg px-4 py-2 mb-6">
            <span className="text-[#666] text-sm font-medium" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
              MLS Listing
            </span>
          </div>

          <h2
            className="text-[32px] md:text-[40px] font-medium text-[#111] mb-4"
            style={{ fontFamily: 'Instrument Sans, sans-serif' }}
          >
            Full MLS Exposure & Syndication
          </h2>
          <p
            className="text-[14px] md:text-[16px] text-[#666] font-medium max-w-3xl mx-auto leading-relaxed"
            style={{ fontFamily: 'Instrument Sans, sans-serif' }}
          >
            Every M&T Realty Group listing gets full MLS exposure — reaching thousands of buyers and agents across Oklahoma.
          </p>
          <p
            className="text-[14px] md:text-[16px] text-[#666] font-medium max-w-3xl mx-auto leading-relaxed"
            style={{ fontFamily: 'Instrument Sans, sans-serif' }}
          >
            Your property syndicated to hundreds of real estate websites for maximum visibility.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-[#2BBBAD]/10 rounded-xl mb-4">
                  <IconComponent className="w-6 h-6 text-[#2BBBAD]" />
                </div>
                <h4
                  className="text-[32px] md:text-[40px] text-[#111] font-semibold mb-1"
                  style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                >
                  {stat.value}
                </h4>
                <p
                  className="text-[14px] text-[#111] font-medium"
                  style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                >
                  {stat.label}
                </p>
                <p
                  className="text-[12px] text-[#666]"
                  style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                >
                  {stat.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Why List on MLS */}
          <div className="bg-white rounded-2xl p-8">
            <h3
              className="text-[24px] font-medium text-[#111] mb-6"
              style={{ fontFamily: 'Instrument Sans, sans-serif' }}
            >
              Why List on the MLS?
            </h3>
            <p
              className="text-[14px] md:text-[16px] text-[#666] mb-6 leading-relaxed"
              style={{ fontFamily: 'Instrument Sans, sans-serif' }}
            >
              The MLS is the most powerful tool for selling your property. Every M&T Realty Group listing is placed on the MLS, giving your home maximum exposure to active buyers and their agents across Oklahoma.
            </p>
            <ul className="space-y-4 mb-8">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#2BBBAD] rounded-full mt-2 flex-shrink-0"></div>
                  <p
                    className="text-[14px] text-[#666]"
                    style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                  >
                    <strong className="text-[#111]">{benefit.title}:</strong> {benefit.description}
                  </p>
                </li>
              ))}
            </ul>
            <Link
              href="/our-packages"
              className="inline-flex items-center gap-[0.4rem] bg-[#2BBBAD] text-white rounded-full px-5 py-[0.875rem] font-medium leading-[120%] transition-all duration-[400ms] ease-[cubic-bezier(0.645,0.045,0.355,1)] hover:bg-[#249E93]"
              style={{ fontFamily: 'Instrument Sans, sans-serif' }}
            >
              <span>View Our Services</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <mask id="mask0_stats" maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20" style={{ maskType: 'alpha' }}>
                  <rect width="20" height="20" transform="matrix(-1 0 0 1 20 0)" fill="#D9D9D9"></rect>
                </mask>
                <g mask="url(#mask0_stats)">
                  <path d="M13.459 10.8334L11.084 13.2084C10.9173 13.3751 10.8375 13.5695 10.8444 13.7918C10.8513 14.014 10.9312 14.2084 11.084 14.3751C11.2507 14.5418 11.4486 14.6286 11.6777 14.6355C11.9069 14.6425 12.1048 14.5626 12.2715 14.3959L16.084 10.5834C16.2507 10.4168 16.334 10.2223 16.334 10.0001C16.334 9.77787 16.2507 9.58343 16.084 9.41676L12.2715 5.60426C12.1048 5.43759 11.9069 5.35773 11.6777 5.36467C11.4486 5.37162 11.2507 5.45842 11.084 5.62509C10.9312 5.79176 10.8513 5.9862 10.8444 6.20842C10.8375 6.43065 10.9173 6.62509 11.084 6.79176L13.459 9.16676H4.16732C3.93121 9.16676 3.73329 9.24662 3.57357 9.40634C3.41385 9.56606 3.33398 9.76398 3.33398 10.0001C3.33398 10.2362 3.41385 10.4341 3.57357 10.5938C3.73329 10.7536 3.93121 10.8334 4.16732 10.8334H13.459Z" fill="white"></path>
                </g>
              </svg>
            </Link>
          </div>

          {/* Right Column - How It Works */}
          <div>
            <h3
              className="text-[24px] font-medium text-[#111] mb-6"
              style={{ fontFamily: 'Instrument Sans, sans-serif' }}
            >
              How It Works
            </h3>
            <div className="space-y-4">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-5 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#2BBBAD] rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-semibold">{step.number}</span>
                    </div>
                    <div>
                      <h4
                        className="text-[16px] font-medium text-[#111] mb-1"
                        style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                      >
                        {step.title}
                      </h4>
                      <p
                        className="text-[14px] text-[#666]"
                        style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                      >
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Highlight Text */}
            <div className="mt-6 bg-[#2BBBAD]/10 rounded-xl p-4 border border-[#2BBBAD]/20">
              <p
                className="text-[14px] md:text-[16px] text-[#2BBBAD] font-semibold text-center"
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                Professional service. Proven results. Smarter pricing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MLSSection;
