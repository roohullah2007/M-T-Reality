import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { ChevronDown } from 'lucide-react';

const FAQItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className="bg-[#DCD8D5] rounded-2xl mb-4 overflow-hidden transition-all duration-300">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between p-6 text-left transition-colors group"
      >
        <span
          style={{ fontFamily: '"Instrument Sans", sans-serif' }}
          className="text-[18px] font-medium text-[#111] pr-4 transition-colors"
        >
          {question}
        </span>
        <div className={`flex-shrink-0 transition-all duration-300`}>
          <ChevronDown
            className={`w-6 h-6 text-[#111] transition-transform duration-300 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </div>
      </button>

      {isOpen && (
        <div className="px-6 pb-6 pt-0 animate-fadeIn">
          <p
            style={{ fontFamily: '"Instrument Sans", sans-serif' }}
            className="text-[14px] font-medium text-[#666] leading-relaxed"
          >
            {answer}
          </p>
        </div>
      )}
    </div>
  );
};

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      category: "Listing Services",
      question: "What makes M&T Realty Group different from a traditional brokerage?",
      answer: "M&T Realty Group was intentionally designed to eliminate unnecessary overhead — large offices, franchise fees, and layered management structures — while maintaining full-service representation. The result is professional service, proven results, and smarter pricing for our clients."
    },
    {
      category: "Listing Services",
      question: "What services do you provide when listing my home?",
      answer: "We provide full-service representation including strategic pricing and market analysis, professional photography and marketing, full MLS exposure and syndication, skilled offer negotiation, contract-to-close transaction management, and direct communication with experienced professionals."
    },
    {
      category: "Listing Services",
      question: "How does your commission structure work?",
      answer: "We believe commission should reflect service and performance — not outdated business models. Because our brokerage is built on efficiency, our clients typically pay significantly less than traditional listing structures — without sacrificing expertise or support. Contact us for a consultation to discuss your specific situation."
    },
    {
      category: "Buying",
      question: "Can M&T Realty Group help me find a home to buy?",
      answer: "Yes! Browse our in-house listings on the website and contact us about any property that interests you. We're here to help buyers find the right property and guide you through the purchase process."
    },
    {
      category: "Selling Process",
      question: "How do I get started with listing my property?",
      answer: "Simply schedule a consultation through our website or call us at 918-884-7653. We'll discuss your property, review the local market, and create a customized plan to get your home sold for the best possible price."
    },
    {
      category: "Selling Process",
      question: "What areas do you serve?",
      answer: "M&T Realty Group is licensed in Oklahoma and primarily serves the Tulsa metropolitan area and surrounding communities. Contact us to discuss your specific location."
    },
    {
      category: "Mortgage",
      question: "Do you offer mortgage services?",
      answer: "M&T Realty proudly partners with T&M Mortgages to provide our buyers with trusted lending solutions, competitive rates, and a smooth, stress-free financing experience."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-[#EEEDEA] py-20 md:py-28">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        {/* Badge */}
        <div className="inline-flex items-center bg-[#E5E1DC] rounded-lg px-4 py-2 mb-8">
          <span style={{ fontFamily: '"Instrument Sans", sans-serif' }} className="text-[#666] text-sm font-medium">
            FAQs
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left Side - Title and CTA */}
          <div>
            <h2
              className="text-[48px] font-semibold leading-[120%] text-[#111] mb-6"
              style={{ fontFamily: '"Instrument Sans", sans-serif' }}
            >
              Frequently Asked<br />Questions
            </h2>
            <p
              style={{ fontFamily: '"Instrument Sans", sans-serif' }}
              className="text-[14px] font-medium text-[#666] mb-10 leading-relaxed"
            >
              Have questions about working with M&T Realty Group? We've provided answers to the most common questions about our listing services, the selling process, and how our modern brokerage model benefits you. Can't find an answer? Contact us and we'll be happy to help.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-[0.4rem] bg-[#2BBBAD] text-white rounded-full px-5 py-[0.875rem] font-medium leading-[120%] transition-all duration-[400ms] ease-[cubic-bezier(0.645,0.045,0.355,1)] hover:bg-[#249E93]"
              style={{ fontFamily: '"Instrument Sans", sans-serif' }}
            >
              <span>Ask Questions</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <mask id="mask0_faq_btn" maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20" style={{ maskType: 'alpha' }}>
                  <rect width="20" height="20" transform="matrix(-1 0 0 1 20 0)" fill="#D9D9D9"></rect>
                </mask>
                <g mask="url(#mask0_faq_btn)">
                  <path d="M13.459 10.8334L11.084 13.2084C10.9173 13.3751 10.8375 13.5695 10.8444 13.7918C10.8513 14.014 10.9312 14.2084 11.084 14.3751C11.2507 14.5418 11.4486 14.6286 11.6777 14.6355C11.9069 14.6425 12.1048 14.5626 12.2715 14.3959L16.084 10.5834C16.2507 10.4168 16.334 10.2223 16.334 10.0001C16.334 9.77787 16.2507 9.58343 16.084 9.41676L12.2715 5.60426C12.1048 5.43759 11.9069 5.35773 11.6777 5.36467C11.4486 5.37162 11.2507 5.45842 11.084 5.62509C10.9312 5.79176 10.8513 5.9862 10.8444 6.20842C10.8375 6.43065 10.9173 6.62509 11.084 6.79176L13.459 9.16676H4.16732C3.93121 9.16676 3.73329 9.24662 3.57357 9.40634C3.41385 9.56606 3.33398 9.76398 3.33398 10.0001C3.33398 10.2362 3.41385 10.4341 3.57357 10.5938C3.73329 10.7536 3.93121 10.8334 4.16732 10.8334H13.459Z" fill="white"></path>
                </g>
              </svg>
            </Link>
          </div>

          {/* Right Side - FAQ Accordion */}
          <div>
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === index}
                onClick={() => toggleFAQ(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
