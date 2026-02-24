import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from '@inertiajs/react';

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      image: 'https://images.pexels.com/photos/2581922/pexels-photo-2581922.jpeg?auto=compress&cs=tinysrgb&w=1920',
      title: 'Your Home.',
      subtitle: 'Our Expertise.',
      description: 'Full-service real estate representation backed by strategy, professionalism, and results. Sell your Oklahoma property with confidence.'
    },
    {
      id: 2,
      image: 'https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=1920',
      title: 'Buy or Sell',
      subtitle: 'With Confidence',
      description: 'Professional marketing, expert negotiation, and dedicated support from listing to closing — all at competitive rates.'
    },
    {
      id: 3,
      image: 'https://images.pexels.com/photos/2287310/pexels-photo-2287310.jpeg?auto=compress&cs=tinysrgb&w=1920',
      title: 'Smart Strategy.',
      subtitle: 'Real Savings.',
      description: 'Our lean, efficient model means you get full-service expertise while keeping more of your equity at closing.'
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative w-full py-20 bg-[#EEEDEA]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        {/* Slider Container */}
        <div className="relative h-[750px]">
          {/* Slides */}
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ${
                index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              {/* Rounded Image Card */}
              <div className="relative w-full h-full rounded-2xl overflow-hidden">
                {/* Background Image */}
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />

                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>

                {/* Content - Bottom Aligned */}
                <div className="absolute bottom-0 left-0 right-0 px-12 md:px-16 pb-12">
                  <div className="flex items-end justify-between">
                    {/* Left Side - Title and Buttons */}
                    <div className="max-w-3xl">
                      {/* Title */}
                      <h1
                        className="text-[#EEEDEA] text-[36px] font-medium leading-tight mb-4"
                        style={{ fontFamily: 'Instrument Sans, sans-serif', fontWeight: 500 }}
                      >
                        {slide.title}
                        <br />
                        {slide.subtitle}
                      </h1>

                      {/* Description */}
                      <p
                        className="text-[#EEEDEA]/90 text-[16px] font-medium mb-8 max-w-2xl leading-relaxed"
                        style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                      >
                        {slide.description}
                      </p>

                      {/* Buttons */}
                      <div className="flex flex-wrap gap-3">
                        <Link
                          href="/sellers"
                          className="inline-flex items-center gap-[0.4rem] bg-white text-[#111] rounded-full px-5 py-[0.875rem] font-medium leading-[120%] transition-all duration-[400ms] ease-[cubic-bezier(0.645,0.045,0.355,1)] hover:bg-[#F5F1ED]"
                          style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                        >
                          <span>Sell With Us</span>
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <mask id={`mask_slide_${index}`} style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
                              <rect width="20" height="20" transform="matrix(-1 0 0 1 20 0)" fill="#D9D9D9"/>
                            </mask>
                            <g mask={`url(#mask_slide_${index})`}>
                              <path d="M13.459 10.8334L11.084 13.2084C10.9173 13.3751 10.8375 13.5695 10.8444 13.7918C10.8513 14.014 10.9312 14.2084 11.084 14.3751C11.2507 14.5418 11.4486 14.6286 11.6777 14.6355C11.9069 14.6425 12.1048 14.5626 12.2715 14.3959L16.084 10.5834C16.2507 10.4168 16.334 10.2223 16.334 10.0001C16.334 9.77787 16.2507 9.58343 16.084 9.41676L12.2715 5.60426C12.1048 5.43759 11.9069 5.35773 11.6777 5.36467C11.4486 5.37162 11.2507 5.45842 11.084 5.62509C10.9312 5.79176 10.8513 5.9862 10.8444 6.20842C10.8375 6.43065 10.9173 6.62509 11.084 6.79176L13.459 9.16676H4.16732C3.93121 9.16676 3.73329 9.24662 3.57357 9.40634C3.41385 9.56606 3.33398 9.76398 3.33398 10.0001C3.33398 10.2362 3.41385 10.4341 3.57357 10.5938C3.73329 10.7536 3.93121 10.8334 4.16732 10.8334H13.459Z" fill="currentColor"/>
                            </g>
                          </svg>
                        </Link>
                        <Link
                          href="/properties"
                          className="inline-flex items-center gap-[0.4rem] bg-transparent border border-white text-white rounded-full px-5 py-[0.875rem] font-medium leading-[120%] transition-all duration-[400ms] ease-[cubic-bezier(0.645,0.045,0.355,1)] hover:bg-white/10"
                          style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                        >
                          <span>Browse Properties</span>
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <mask id={`mask_browse_${index}`} style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
                              <rect width="20" height="20" transform="matrix(-1 0 0 1 20 0)" fill="#D9D9D9"/>
                            </mask>
                            <g mask={`url(#mask_browse_${index})`}>
                              <path d="M13.459 10.8334L11.084 13.2084C10.9173 13.3751 10.8375 13.5695 10.8444 13.7918C10.8513 14.014 10.9312 14.2084 11.084 14.3751C11.2507 14.5418 11.4486 14.6286 11.6777 14.6355C11.9069 14.6425 12.1048 14.5626 12.2715 14.3959L16.084 10.5834C16.2507 10.4168 16.334 10.2223 16.334 10.0001C16.334 9.77787 16.2507 9.58343 16.084 9.41676L12.2715 5.60426C12.1048 5.43759 11.9069 5.35773 11.6777 5.36467C11.4486 5.37162 11.2507 5.45842 11.084 5.62509C10.9312 5.79176 10.8513 5.9862 10.8444 6.20842C10.8375 6.43065 10.9173 6.62509 11.084 6.79176L13.459 9.16676H4.16732C3.93121 9.16676 3.73329 9.24662 3.57357 9.40634C3.41385 9.56606 3.33398 9.76398 3.33398 10.0001C3.33398 10.2362 3.41385 10.4341 3.57357 10.5938C3.73329 10.7536 3.93121 10.8334 4.16732 10.8334H13.459Z" fill="currentColor"/>
                            </g>
                          </svg>
                        </Link>
                      </div>
                    </div>

                    {/* Right Side - Navigation Arrows */}
                    <div className="hidden md:flex gap-4 mb-2">
                      <button
                        onClick={prevSlide}
                        className="bg-white hover:bg-gray-100 p-4 rounded-full shadow-lg transition-all duration-300"
                        aria-label="Previous slide"
                      >
                        <ChevronLeft className="w-6 h-6 text-gray-800" />
                      </button>

                      <button
                        onClick={nextSlide}
                        className="bg-white hover:bg-gray-100 p-4 rounded-full shadow-lg transition-all duration-300"
                        aria-label="Next slide"
                      >
                        <ChevronRight className="w-6 h-6 text-gray-800" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Slide Indicators */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide ? 'bg-white w-8' : 'bg-white/50'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSlider;
