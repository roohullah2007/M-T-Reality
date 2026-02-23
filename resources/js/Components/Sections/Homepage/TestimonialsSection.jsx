import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const TestimonialsSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const testimonials = [
    {
      id: 1,
      company: "Tulsa Homeowner",
      quote: "M&T Realty Group made selling our home seamless. They handled everything — pricing strategy, professional photos, MLS listing, negotiations — and we saved thousands compared to a traditional brokerage. We couldn't be happier with the results.",
      name: "Sarah M.",
      role: "Sold home in Tulsa"
    },
    {
      id: 2,
      company: "Oklahoma City Seller",
      quote: "Terry and Michele are true professionals. They were always available, transparent about every step, and their marketing was top-notch. Our home sold quickly and for more than we expected. Highly recommend M&T Realty Group.",
      name: "Michael T.",
      role: "Sold home in Oklahoma City"
    },
    {
      id: 3,
      company: "Broken Arrow Seller",
      quote: "We were impressed by how hands-on and knowledgeable the M&T team was throughout the entire process. From listing to closing, they kept us informed and made smart decisions that protected our investment. Five stars all the way.",
      name: "Jennifer A.",
      role: "Sold home in Broken Arrow"
    }
  ];

  const maxSlide = testimonials.length - 1;

  const nextSlide = () => {
    setCurrentSlide((prev) => Math.min(prev + 1, maxSlide));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
  };

  return (
    <section className="bg-white py-20">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-12">
          <div>
            {/* Badge */}
            <div className="inline-flex items-center bg-[#E5E1DC] rounded-lg px-4 py-2 mb-6">
              <span className="text-[#666] text-sm font-medium" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                Testimonials
              </span>
            </div>

            {/* Heading */}
            <h2
              className="text-[40px] md:text-[48px] font-medium text-[#111] leading-tight"
              style={{ fontFamily: 'Instrument Sans, sans-serif' }}
            >
              What Our Clients Are Saying
            </h2>
          </div>

          {/* Navigation Arrows */}
          <div className="flex gap-3">
            <button
              onClick={prevSlide}
              className="bg-white hover:bg-gray-100 p-3 rounded-full shadow transition-all duration-300"
              aria-label="Previous testimonials"
            >
              <ChevronLeft className="w-5 h-5 text-gray-800" />
            </button>
            <button
              onClick={nextSlide}
              className="bg-white hover:bg-gray-100 p-3 rounded-full shadow transition-all duration-300"
              aria-label="Next testimonials"
            >
              <ChevronRight className="w-5 h-5 text-gray-800" />
            </button>
          </div>
        </div>

        {/* Testimonials Slider */}
        <div className="overflow-hidden">
          <div
            className="flex gap-6 transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * (518 + 24)}px)` }}
          >
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-[#EEEDEA] rounded-2xl p-8 border border-gray-300 flex-shrink-0"
                style={{ width: '518px', height: '500px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
              >
                <div>
                  {/* Quote */}
                  <p
                    className="text-[#111] text-[20px] font-medium leading-relaxed"
                    style={{ fontFamily: 'Instrument Sans, sans-serif', fontWeight: 500 }}
                  >
                    "{testimonial.quote}"
                  </p>
                </div>

                {/* Author Info */}
                <div className="mt-8">
                  <h4
                    className="text-[#111] text-[20px] font-medium mb-1"
                    style={{ fontFamily: 'Instrument Sans, sans-serif', fontWeight: 500 }}
                  >
                    {testimonial.name}
                  </h4>
                  <p
                    className="text-[#111] text-[16px] font-medium opacity-70"
                    style={{ fontFamily: 'Instrument Sans, sans-serif', fontWeight: 500 }}
                  >
                    {testimonial.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
