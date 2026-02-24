import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Star, Quote, ArrowRight } from 'lucide-react';
import MainLayout from '@/Layouts/MainLayout';

function Testimonials() {
  const [activeFilter, setActiveFilter] = useState('All');

  const testimonials = [
    {
      id: 1,
      quote: 'Terry and Michele did an outstanding job assisting me with the sale of my house and the purchase of another home. Their market expertise was instrumental in determining a competitive selling price. They were very involved throughout the entire process and easy to work with. I would highly recommend M&T Realty if you are looking to buy or sell.',
      name: 'Jenny B.',
      location: 'Broken Arrow',
      category: 'Sellers',
      rating: 5
    },
    {
      id: 2,
      quote: 'Terry was great to work with! His expertise, dedication, and professionalism made the entire home-buying/selling process smooth and stress-free. I would recommend this company.',
      name: 'Kim Myers',
      location: 'Tulsa',
      category: 'Sellers',
      rating: 5
    },
    {
      id: 3,
      quote: 'Michele and Terry are both Amazing Realtors! I cannot recommend M&T Realty enough! They were absolutely fantastic in both the sale of our old home and the purchase of our new one. The team at M&T Realty truly cares about their clients and goes above and beyond to ensure a smooth and seamless transaction. We received A+ care throughout the entire process and could not be happier with the outcome. Five stars all the way for Michele and Terry.',
      name: 'Anthony Barber',
      location: 'Owasso',
      category: 'Sellers',
      rating: 5
    },
    {
      id: 4,
      quote: 'Terry is a great listener, does a lot of homework to find a buyer, and always responds quickly to questions. Terry and his staff got right to work, showing us a new home very efficiently. Terry and his staff made this a very enjoyable experience, selling and buying a new home. If I could give them a 10-star rating, I would.',
      name: 'Steve Self',
      location: 'Grove',
      category: 'Sellers',
      rating: 5
    },
    {
      id: 5,
      quote: 'Terry saw us through all the challenges we faced when selling our home in an unfavorable market. He helped us navigate showings, offers, the appraisal, survey, and closing. I am so grateful to him and Michele for all their work, patience, and support!',
      name: 'Dena Pace',
      location: 'Eufaula Lake',
      category: 'Sellers',
      rating: 5
    },
    {
      id: 6,
      quote: 'Terry was very knowledgeable about the whole process, and he did a great job of communicating and responding quickly to all our questions. He provided a comprehensive review of all offers, showing the costs and the net dollars to us. He communicated well with the buyer\'s agents and negotiated a fair settlement of inspection items and appraisals. We highly recommend his services!',
      name: 'Randy',
      location: 'Broken Arrow',
      category: 'Sellers',
      rating: 5
    },
    {
      id: 7,
      quote: 'Terry and Michele are excellent realtors. From start to finish, they kept me informed and comfortable with the home-selling experience. I\'m old school, so I needed help with the contract verbiage and processing everything online. They came through for me. From when the sign went in my yard to when the funds were wired to my account, they ensured everything was handled professionally and on time. Hands down, the best experience I\'ve ever had!',
      name: 'Joel V.',
      location: 'Tulsa',
      category: 'Sellers',
      rating: 5
    },
    {
      id: 8,
      quote: 'Terry did a great job for us. Very promptly got our property listed with awesome professional photos. He really streamlined the process to get our property to the closing table.',
      name: 'Linda W.',
      location: 'Checotah',
      category: 'Sellers',
      rating: 5
    },
    {
      id: 9,
      quote: 'Michele and Terry were a fantastic team and helped us sell our home for top dollar in our neighborhood! They were both great about communicating with us and answering the MANY questions we had along the way. M&T offers a very desirable service. That\'s a game changer in my opinion! We are forever grateful for their help and will definitely be using them in the future!',
      name: 'Candice T.',
      location: 'Broken Arrow',
      category: 'Sellers',
      rating: 5
    },
    {
      id: 10,
      quote: 'Terry did an outstanding job helping us prepare our house for sale. He is a Real Estate Professional! He was excellent at photography and knew which pictures to submit. Terry was very knowledgeable about comps in the area and advised us on the listing price. He did a tremendous job walking us through the entire process. Most of all, Terry communicated with us in a very timely manner and kept us informed every step of the process.',
      name: 'Lelia M.',
      location: 'Tulsa',
      category: 'Sellers',
      rating: 5
    },
    {
      id: 11,
      quote: 'My wife and I decided rather suddenly to list our house because we found a new home that we really wanted. I called Terry one evening, and the next day, he and Michele met us at the property. Within two days, our contingent offer was accepted, and three days later, our house was staged and on the market. On top of that, it sold in four days! We couldn\'t have done any of this without the patience and professionalism that make Michele and Terry the best team in Tulsa.',
      name: 'Richard C.',
      location: 'Tulsa',
      category: 'Buyers',
      rating: 5
    },
    {
      id: 12,
      quote: 'Michele and Terry were simply amazing to work with! This was my very first time owning and selling a home, and they helped me every step of the way. They are both always very responsive and there to help you at any time. I would recommend this team to anyone! Was able to get the job done pretty quickly. I couldn\'t be more thankful for their help through this process!',
      name: 'Amanda Unick',
      location: 'OKC',
      category: 'Sellers',
      rating: 5
    },
    {
      id: 13,
      quote: 'Terry is awesome to work with, and we have now sold 3 properties with him. Terry responds quickly to all questions, posts, takes professional pictures, and negotiates. We had several offers, and he helped us through the entire process. Selling homes can be stressful, but Terry made it easier with his quick responsiveness and knowledge.',
      name: 'The Borlands',
      location: 'Tulsa',
      category: 'Sellers',
      rating: 5
    }
  ];

  const filters = ['All', 'Sellers', 'Buyers'];

  const filteredTestimonials = activeFilter === 'All'
    ? testimonials
    : testimonials.filter(t => t.category === activeFilter);

  return (
    <>
      <Head title="Testimonials" />

      {/* Hero Section */}
      <section className="relative">
        <div className="relative min-h-[85vh] flex items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.pexels.com/photos/2988860/pexels-photo-2988860.jpeg?auto=compress&cs=tinysrgb&w=1920"
              alt=""
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/35"></div>
          </div>

          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 relative z-10 w-full py-20 pt-[120px]">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2 mb-6">
                <span className="text-white/90 text-sm font-medium" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  Testimonials
                </span>
              </div>

              <h1
                className="text-white text-[40px] sm:text-[50px] md:text-[60px] font-medium leading-[1.1] mb-6 drop-shadow-2xl"
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                What Our<br />Clients Say
              </h1>
              <p
                className="text-white/90 text-[16px] sm:text-[18px] font-medium leading-relaxed max-w-2xl mx-auto drop-shadow-lg"
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                Real stories from real clients. Professionalism, smooth process, and results that speak for themselves.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Quotes */}
      <section className="bg-[#1a1a1a] py-16 md:py-20">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Quote className="w-8 h-8 text-[#2BBBAD] mx-auto mb-4 rotate-180" />
              <p
                className="text-white text-[18px] font-medium leading-relaxed mb-4"
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                "Professional, responsive, and strategic from start to finish."
              </p>
              <p className="text-white/50 text-[14px] font-medium" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                — Kim Myers, Tulsa
              </p>
            </div>
            <div className="text-center">
              <Quote className="w-8 h-8 text-[#2BBBAD] mx-auto mb-4 rotate-180" />
              <p
                className="text-white text-[18px] font-medium leading-relaxed mb-4"
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                "Clear communication and strong negotiation. The entire process felt seamless."
              </p>
              <p className="text-white/50 text-[14px] font-medium" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                — Randy, Broken Arrow
              </p>
            </div>
            <div className="text-center">
              <Quote className="w-8 h-8 text-[#2BBBAD] mx-auto mb-4 rotate-180" />
              <p
                className="text-white text-[18px] font-medium leading-relaxed mb-4"
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                "Hands down, the best experience I've ever had!"
              </p>
              <p className="text-white/50 text-[14px] font-medium" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                — Joel V., Tulsa
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-white py-16 md:py-20">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-center gap-10">
            <div className="flex items-center gap-5">
              <img
                src="/images/men-img.jpg"
                alt="Terry"
                className="w-24 h-24 rounded-2xl object-cover shadow-lg"
              />
              <div>
                <h3 className="text-[20px] font-semibold text-[#111]" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  Terry
                </h3>
                <p className="text-[14px] text-[#666] font-medium" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  Broker / Owner
                </p>
              </div>
            </div>
            <div className="hidden md:block w-px h-16 bg-gray-200"></div>
            <div className="flex items-center gap-5">
              <img
                src="/images/women-img.jpg"
                alt="Michele"
                className="w-24 h-24 rounded-2xl object-cover shadow-lg"
              />
              <div>
                <h3 className="text-[20px] font-semibold text-[#111]" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  Michele
                </h3>
                <p className="text-[14px] text-[#666] font-medium" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  Associate Broker
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="bg-[#EEEDEA] py-20 md:py-28">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-[#E5E1DC] rounded-lg px-4 py-2 mb-8">
              <span className="text-[#666] text-sm font-medium" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                Client Stories
              </span>
            </div>
            <h2
              className="text-[32px] md:text-[48px] font-medium text-[#111] leading-[1.15] mb-4"
              style={{ fontFamily: 'Instrument Sans, sans-serif' }}
            >
              Trusted by Homeowners<br className="hidden md:block" /> Across Oklahoma
            </h2>
            <p
              className="text-[16px] text-[#666] font-medium max-w-2xl mx-auto mb-10"
              style={{ fontFamily: 'Instrument Sans, sans-serif' }}
            >
              Our clients' experiences reflect our commitment to professionalism, transparency, and results.
            </p>

            {/* Filter Buttons */}
            <div className="flex items-center justify-center gap-3">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-5 py-2.5 rounded-full text-[14px] font-semibold transition-all duration-300 ${
                    activeFilter === filter
                      ? 'bg-[#1a1a1a] text-white'
                      : 'bg-white text-[#666] hover:bg-gray-100'
                  }`}
                  style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTestimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Stars */}
                  <div className="flex items-center gap-1 mb-5">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>

                  {/* Quote */}
                  <p
                    className="text-[#111] text-[15px] font-medium leading-relaxed mb-6"
                    style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                  >
                    "{testimonial.quote}"
                  </p>
                </div>

                {/* Author */}
                <div className="flex items-center gap-3 pt-5 border-t border-gray-100">
                  <div className="w-10 h-10 bg-[#2BBBAD] rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4
                      className="text-[15px] font-semibold text-[#111]"
                      style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                    >
                      {testimonial.name}
                    </h4>
                    <p
                      className="text-[13px] text-[#666] font-medium"
                      style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                    >
                      {testimonial.location}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Zillow Reviews CTA */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center bg-[#E5E1DC] rounded-lg px-4 py-2 mb-8">
                <span className="text-[#666] text-sm font-medium" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  Reviews
                </span>
              </div>
              <h2
                className="text-[32px] md:text-[44px] font-medium text-[#111] leading-[1.15] mb-6"
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                See Our Reviews<br />on Zillow
              </h2>
              <p
                className="text-[15px] text-[#666] font-medium leading-relaxed mb-8"
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                We're proud of our reputation and the trust our clients place in us. Check out our verified reviews on Zillow to hear directly from homeowners we've helped.
              </p>
              <a
                href="https://www.zillow.com/profile/mntrealty"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#2BBBAD] text-white rounded-full px-6 py-3.5 font-semibold text-[15px] transition-all duration-300 hover:bg-[#249E93] hover:shadow-lg hover:shadow-[#2BBBAD]/25"
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                <span>View Zillow Reviews</span>
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-[#EEEDEA] rounded-2xl p-8 text-center">
                <p className="text-[48px] font-bold text-[#2BBBAD] mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  5.0
                </p>
                <div className="flex items-center justify-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-[14px] text-[#666] font-medium" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  Average Rating
                </p>
              </div>
              <div className="bg-[#EEEDEA] rounded-2xl p-8 text-center">
                <p className="text-[48px] font-bold text-[#2BBBAD] mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  13+
                </p>
                <p className="text-[14px] text-[#666] font-medium" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  Happy Clients
                </p>
              </div>
              <div className="bg-[#EEEDEA] rounded-2xl p-8 text-center col-span-2">
                <p className="text-[48px] font-bold text-[#2BBBAD] mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  100%
                </p>
                <p className="text-[14px] text-[#666] font-medium" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  Client Satisfaction
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-[#EEEDEA] py-16 md:py-20">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="bg-[#1a1a1a] rounded-2xl p-10 md:p-16 text-center">
            <h2
              className="text-white text-[28px] md:text-[36px] font-medium mb-4"
              style={{ fontFamily: 'Instrument Sans, sans-serif' }}
            >
              Ready to Experience the<br className="hidden md:block" /> M&T Difference?
            </h2>
            <p
              className="text-white/70 text-[16px] font-medium mb-8 max-w-2xl mx-auto"
              style={{ fontFamily: 'Instrument Sans, sans-serif' }}
            >
              Join the growing list of satisfied clients who chose professional representation with a modern approach.
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
                href="/properties"
                className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/30 text-white rounded-full px-8 py-3.5 font-semibold text-[15px] transition-all duration-300 hover:bg-white/20"
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                Browse Our Listings
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

Testimonials.layout = (page) => <MainLayout>{page}</MainLayout>;

export default Testimonials;
