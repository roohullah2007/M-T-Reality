import React from 'react';

const HowItWorksSection = () => {
  const expectations = [
    {
      number: '01',
      title: 'Strategic Pricing & Market Analysis',
      description: 'Data-driven pricing strategy to position your property competitively and maximize your return.'
    },
    {
      number: '02',
      title: 'Professional Photography & Marketing',
      description: 'High-quality visuals and targeted marketing to showcase your property and attract serious buyers.'
    },
    {
      number: '03',
      title: 'Full MLS Exposure & Syndication',
      description: 'Your listing on Zillow, Realtor.com, Redfin, and hundreds of other sites for maximum visibility.'
    },
    {
      number: '04',
      title: 'Skilled Offer Negotiation',
      description: 'Expert negotiation to secure the best possible terms and price for your property.'
    },
    {
      number: '05',
      title: 'Contract-to-Close Management',
      description: 'Full transaction management from accepted offer through closing day — nothing falls through the cracks.'
    },
    {
      number: '06',
      title: 'Direct Communication',
      description: 'Work directly with experienced professionals — no assistants, no runarounds, no delays.'
    }
  ];

  return (
    <section className="bg-[#EEEDEA] py-16 md:py-20">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          {/* Badge */}
          <div className="inline-flex items-center bg-[#E5E1DC] rounded-lg px-4 py-2 mb-6">
            <span className="text-[#666] text-sm font-medium" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
              The Modern Brokerage Model
            </span>
          </div>

          <h2 className="text-[32px] md:text-[48px] font-medium text-[#111] mb-4" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
            What You Can Expect
          </h2>
          <p className="text-[14px] md:text-[16px] text-[#666] font-medium max-w-3xl mx-auto" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
            Most traditional brokerages still operate with high overhead — large offices, franchise fees, and layered management structures. We don't. M&T Realty Group was intentionally designed to eliminate unnecessary expenses while maintaining full-service representation from listing to closing.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {expectations.map((step, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 h-full hover:shadow-lg transition-all duration-300">
                {/* Step Number */}
                <div className="text-[#2BBBAD] text-sm font-semibold mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  {step.number}
                </div>

                {/* Title */}
                <h3 className="text-[18px] md:text-xl font-medium text-[#111] mb-3" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-[#666] leading-relaxed" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  {step.description}
                </p>
            </div>
          ))}
        </div>

        {/* Bottom tagline */}
        <div className="text-center mt-12">
          <p className="text-[18px] md:text-[20px] text-[#111] font-medium" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
            Same service. Streamlined structure. <span className="text-[#2BBBAD]">Smarter pricing.</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
