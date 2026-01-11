import React from 'react';

const HowItWorksSection = () => {
  const steps = [
    {
      number: '01',
      title: 'Create Your FREE Listing',
      description: 'Sign up to list your property, upload photos, and post open houses. ALL buyer inquiries go directly to you.'
    },
    {
      number: '02',
      title: 'Market Your Property',
      description: 'We promote your listing across our platform and optional MLS syndications for maximum visibility. Share your listing on social media.'
    },
    {
      number: '03',
      title: 'Connect with Buyers',
      description: 'Receive inquiries directly from interested buyers. Communicate and schedule showings on your terms.'
    },
    {
      number: '04',
      title: 'Close the Deal',
      description: 'Accept an offer, execute the contract, and work with a closing company to close the deal. Keep more of your equity!'
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
              Simple Process
            </span>
          </div>

          <h2 className="text-[32px] md:text-[48px] font-medium text-[#111] mb-4" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
            How a FREE OKBYOWNER Listing Works
          </h2>
          <p className="text-[14px] md:text-[16px] text-[#666] font-medium max-w-2xl mx-auto" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
            Sell your Oklahoma property in four simple steps.
          </p>
          <p className="text-[14px] md:text-[16px] text-[#666] font-medium max-w-2xl mx-auto" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
            No agents, no commission, just direct results.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {steps.map((step, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 h-full hover:shadow-lg transition-all duration-300">
                {/* Step Number */}
                <div className="text-[#A41E34] text-sm font-semibold mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  STEP {step.number}
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
      </div>
    </section>
  );
};

export default HowItWorksSection;
