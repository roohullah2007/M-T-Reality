import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { HelpCircle, ChevronDown, Home, DollarSign, Users, FileText, Key } from 'lucide-react';
import MainLayout from '@/Layouts/MainLayout';

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
        <div className="flex-shrink-0 transition-all duration-300">
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

function FAQs() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqCategories = [
    {
      title: 'Getting Started',
      icon: Home,
      faqs: [
        {
          question: "What is M&T Realty Group?",
          answer: "M&T Realty Group is a modern real estate brokerage in Oklahoma that provides full-service listing representation with an efficient, streamlined structure. We deliver expert strategy, professional marketing, and skilled negotiation while helping our clients keep more of their equity."
        },
        {
          question: "How do I get started selling my home?",
          answer: "Getting started is easy — simply visit our Sellers page or contact us to schedule a free consultation. An M&T agent will discuss your goals, evaluate your property, and create a customized selling strategy tailored to your timeline and needs."
        },
        {
          question: "Do I need real estate experience to work with M&T Realty Group?",
          answer: "Not at all. M&T Realty Group handles everything for you — from pricing strategy and professional marketing to showings, negotiation, and closing. We provide full-service representation so you can sell with confidence."
        },
        {
          question: "What areas does M&T Realty Group serve?",
          answer: "We serve all of Oklahoma, including major cities like Oklahoma City, Tulsa, Norman, Broken Arrow, Edmond, and all surrounding areas throughout the state."
        }
      ]
    },
    {
      title: 'Pricing & Fees',
      icon: DollarSign,
      faqs: [
        {
          question: "How much does it cost to list with M&T Realty Group?",
          answer: "We offer competitive, transparent commission rates that are clearly outlined before you sign a listing agreement. Our lean business model allows us to deliver full-service representation at rates that save you money compared to traditional brokerages."
        },
        {
          question: "Are there any hidden fees?",
          answer: "Absolutely not. We believe in complete transparency. Our fees are clearly outlined upfront in your listing agreement, with no surprise charges at closing. What we quote is what you pay."
        },
        {
          question: "How does M&T Realty Group save me money?",
          answer: "Our lean, efficient business model eliminates the unnecessary overhead of traditional brokerages. We pass those savings directly to our clients through competitive commission rates — without sacrificing the quality of service, marketing, or representation."
        },
        {
          question: "What's included in my listing fee?",
          answer: "Your listing includes professional photography, MLS listing with syndication to 100+ websites, digital marketing, showings management, expert negotiation, and full contract-to-close support. Everything you need for a successful sale is included."
        }
      ]
    },
    {
      title: 'Listings & Marketing',
      icon: FileText,
      faqs: [
        {
          question: "How will M&T Realty Group market my property?",
          answer: "We provide comprehensive marketing for every listing, including professional HDR photography, drone aerials, MLS listing with syndication to Zillow, Trulia, Realtor.com, and 100+ websites, targeted digital advertising, social media campaigns, and open house promotion."
        },
        {
          question: "Will my listing appear on Zillow, Trulia, and Realtor.com?",
          answer: "Yes! Every M&T listing is placed on the MLS and automatically syndicates to all major real estate websites including Zillow, Trulia, Realtor.com, and many more — ensuring your property gets maximum buyer exposure."
        },
        {
          question: "Does M&T provide professional photography?",
          answer: "Absolutely. Every listing includes professional HDR photography, and depending on your property, we may also include drone aerials, virtual twilight images, and 3D virtual tours to showcase your home at its best."
        },
        {
          question: "How long will my home be listed?",
          answer: "Listing agreements are typically 6 months, but we work with you on a timeline that fits your situation. Our goal is to sell your home as quickly as possible at the best price — most of our listings sell well within the agreement period."
        },
        {
          question: "Can I request changes to my listing after it goes live?",
          answer: "Of course. Your M&T agent handles all listing updates for you — price adjustments, photo changes, description updates, or any other modifications. Simply reach out to your agent and we'll take care of it promptly."
        }
      ]
    },
    {
      title: 'Selling Process',
      icon: Users,
      faqs: [
        {
          question: "How do buyers schedule showings on my property?",
          answer: "All showing requests come through M&T Realty Group. We coordinate scheduling with you, screen potential buyers, and can conduct showings on your behalf — so you don't have to manage inquiries or be present for every visit."
        },
        {
          question: "Does M&T handle showings and open houses?",
          answer: "Yes. Your M&T agent manages all showings and open house events. We handle buyer screening, scheduling, property presentation, and follow-up — giving you a hands-off experience while ensuring your home is professionally represented."
        },
        {
          question: "What happens when I receive an offer?",
          answer: "Your M&T agent will present every offer to you, explain the terms, and provide expert guidance on how to respond. We handle all negotiations on your behalf to secure the best possible price and terms, and manage counteroffers until we reach an agreement."
        },
        {
          question: "How long does it typically take to sell?",
          answer: "Sale timelines vary based on pricing, location, condition, and market conditions. Properties priced competitively with professional marketing typically sell within 30-90 days. Your M&T agent will provide a realistic timeline based on your specific market."
        },
        {
          question: "Does M&T handle the paperwork and closing process?",
          answer: "Yes — we manage the entire transaction from accepted offer to closing day. This includes coordinating inspections, appraisals, title work, and all required documentation. Your agent ensures every detail is handled so you can close with confidence."
        }
      ]
    },
    {
      title: 'Buying Process',
      icon: Key,
      faqs: [
        {
          question: "Can M&T Realty Group help me buy a home?",
          answer: "Yes! M&T Realty Group represents both buyers and sellers. Our buyer agents will help you find the right property, schedule showings, negotiate on your behalf, and guide you through every step of the purchasing process."
        },
        {
          question: "How do I start searching for homes?",
          answer: "Visit our Properties page to browse current listings, or contact us to connect with a buyer's agent who can set up custom searches based on your criteria, budget, and preferred neighborhoods."
        },
        {
          question: "Does M&T help with mortgage pre-approval?",
          answer: "We proudly partner with T&M Mortgages to provide our buyers with trusted lending solutions. Our agents can connect you with a lending specialist to get pre-approved, compare rates, and ensure a smooth financing process."
        },
        {
          question: "What does it cost to work with a buyer's agent?",
          answer: "In most transactions, the seller pays the buyer's agent commission, so our buyer representation comes at no direct cost to you. We'll explain exactly how compensation works before you begin your home search."
        }
      ]
    }
  ];

  return (
    <>
      <Head title="FAQs" />

      {/* Hero Section */}
      <div className="relative pt-0 md:pt-[77px]">
        <div className="relative min-h-[60vh] flex items-center py-16 md:py-20 overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.pexels.com/photos/2079234/pexels-photo-2079234.jpeg?auto=compress&cs=tinysrgb&w=1920"
              alt="FAQ"
              className="w-full h-full object-cover"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
          </div>

          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 relative z-10 w-full">
            <div className="max-w-3xl">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/30 rounded-lg px-4 py-2 mb-6">
                <HelpCircle className="w-4 h-4 text-white" />
                <span className="text-white text-sm font-medium" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  Help Center
                </span>
              </div>

              {/* Main Heading */}
              <h1
                className="text-white text-[40px] sm:text-[50px] md:text-[60px] font-medium leading-[1.1] mb-5 drop-shadow-2xl"
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                Frequently Asked Questions
              </h1>

              {/* Subheading */}
              <p
                className="text-white text-[14px] md:text-[16px] font-medium mb-8 leading-relaxed max-w-2xl drop-shadow-lg"
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                Find answers to common questions about buying and selling with M&T Realty Group. Can't find what you're looking for? Contact our team.
              </p>

              {/* CTA Button */}
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-[#2BBBAD] text-white rounded-full px-6 py-4 font-medium transition-all duration-300 hover:bg-[#249E93] hover:shadow-lg"
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                <span>Contact Support</span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <mask id="mask0_faq_hero" maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20" style={{ maskType: 'alpha' }}>
                    <rect width="20" height="20" transform="matrix(-1 0 0 1 20 0)" fill="#D9D9D9"></rect>
                  </mask>
                  <g mask="url(#mask0_faq_hero)">
                    <path d="M13.459 10.8334L11.084 13.2084C10.9173 13.3751 10.8375 13.5695 10.8444 13.7918C10.8513 14.014 10.9312 14.2084 11.084 14.3751C11.2507 14.5418 11.4486 14.6286 11.6777 14.6355C11.9069 14.6425 12.1048 14.5626 12.2715 14.3959L16.084 10.5834C16.2507 10.4168 16.334 10.2223 16.334 10.0001C16.334 9.77787 16.2507 9.58343 16.084 9.41676L12.2715 5.60426C12.1048 5.43759 11.9069 5.35773 11.6777 5.36467C11.4486 5.37162 11.2507 5.45842 11.084 5.62509C10.9312 5.79176 10.8513 5.9862 10.8444 6.20842C10.8375 6.43065 10.9173 6.62509 11.084 6.79176L13.459 9.16676H4.16732C3.93121 9.16676 3.73329 9.24662 3.57357 9.40634C3.41385 9.56606 3.33398 9.76398 3.33398 10.0001C3.33398 10.2362 3.41385 10.4341 3.57357 10.5938C3.73329 10.7536 3.93121 10.8334 4.16732 10.8334H13.459Z" fill="white"></path>
                  </g>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Categories Section */}
      {faqCategories.map((category, categoryIndex) => {
        const IconComponent = category.icon;
        return (
          <section
            key={categoryIndex}
            className={categoryIndex % 2 === 0 ? "bg-white py-16 md:py-20" : "bg-[#EEEDEA] py-16 md:py-20"}
          >
            <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
              {/* Category Header */}
              <div className="mb-10">
                <div className="inline-flex items-center gap-2 bg-[#E5E1DC] rounded-lg px-4 py-2 mb-6">
                  <IconComponent className="w-4 h-4 text-[#666]" />
                  <span className="text-[#666] text-sm font-medium" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                    {category.title}
                  </span>
                </div>
                <h2
                  className="text-[32px] md:text-[48px] font-medium text-[#111] leading-tight"
                  style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                >
                  {category.title}
                </h2>
              </div>

              {/* FAQ Items */}
              <div className="max-w-4xl">
                {category.faqs.map((faq, faqIndex) => {
                  const globalIndex = `${categoryIndex}-${faqIndex}`;
                  return (
                    <FAQItem
                      key={globalIndex}
                      question={faq.question}
                      answer={faq.answer}
                      isOpen={openIndex === globalIndex}
                      onClick={() => toggleFAQ(globalIndex)}
                    />
                  );
                })}
              </div>
            </div>
          </section>
        );
      })}

      {/* Still Have Questions CTA */}
      <section className="bg-[#2BBBAD] py-16 md:py-20">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 text-center">
          <h2
            className="text-white text-[32px] md:text-[48px] font-medium mb-4"
            style={{ fontFamily: 'Instrument Sans, sans-serif' }}
          >
            Still Have Questions?
          </h2>
          <p
            className="text-white/90 text-[16px] font-medium mb-8 max-w-2xl mx-auto"
            style={{ fontFamily: 'Instrument Sans, sans-serif' }}
          >
            Our team is here to help you every step of the way. Get in touch and we'll respond within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-white text-[#2BBBAD] rounded-full px-8 py-4 font-medium transition-all duration-300 hover:bg-white/90"
              style={{ fontFamily: 'Instrument Sans, sans-serif' }}
            >
              Contact Us
            </Link>
            <Link
              href="/sellers"
              className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white text-white rounded-full px-8 py-4 font-medium transition-all duration-300 hover:bg-white/10"
              style={{ fontFamily: 'Instrument Sans, sans-serif' }}
            >
              Sell With Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

FAQs.layout = (page) => <MainLayout>{page}</MainLayout>;

export default FAQs;
