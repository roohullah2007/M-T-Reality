import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import PropertyCard from '@/Components/PropertyCard';
import AuthModal from '@/Components/AuthModal';

// Sample properties for fallback
const sampleProperties = [
  {
    id: 'sample-1',
    photos: ['https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=800'],
    price: 299000,
    address: '1234 Oak Tree Lane',
    city: 'Oklahoma City',
    state: 'OK',
    zip_code: '73120',
    bedrooms: 4,
    bathrooms: 3,
    sqft: 2500
  },
  {
    id: 'sample-2',
    photos: ['https://images.pexels.com/photos/1643389/pexels-photo-1643389.jpeg?auto=compress&cs=tinysrgb&w=800'],
    price: 425000,
    address: '5678 Riverside Drive',
    city: 'Tulsa',
    state: 'OK',
    zip_code: '74114',
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1800
  },
  {
    id: 'sample-3',
    photos: ['https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=800'],
    price: 350000,
    address: '910 University Boulevard',
    city: 'Norman',
    state: 'OK',
    zip_code: '73019',
    bedrooms: 5,
    bathrooms: 4,
    sqft: 3200
  },
  {
    id: 'sample-4',
    photos: ['https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg?auto=compress&cs=tinysrgb&w=800'],
    price: 275000,
    address: '2345 Covell Road',
    city: 'Edmond',
    state: 'OK',
    zip_code: '73034',
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1500
  },
  {
    id: 'sample-5',
    photos: ['https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800'],
    price: 520000,
    address: '8901 Aspen Creek Court',
    city: 'Broken Arrow',
    state: 'OK',
    zip_code: '74012',
    bedrooms: 6,
    bathrooms: 5,
    sqft: 4000
  },
  {
    id: 'sample-6',
    photos: ['https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=800'],
    price: 195000,
    address: '456 Cache Road',
    city: 'Lawton',
    state: 'OK',
    zip_code: '73505',
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1200
  }
];

const PropertiesSection = ({ properties = [] }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Use real properties if available, otherwise fall back to sample data
  const displayProperties = properties.length > 0 ? properties : sampleProperties;

  const propertiesPerSlide = 4;
  const totalSlides = Math.ceil(displayProperties.length / propertiesPerSlide);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const getCurrentProperties = () => {
    const start = currentSlide * propertiesPerSlide;
    return displayProperties.slice(start, start + propertiesPerSlide);
  };

  return (
    <section className="bg-[#EEEDEA] py-20">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-14">
          <h2 className="text-[40px] md:text-[48px] font-medium text-[#111] mb-4" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
            Featured Properties
          </h2>
          <p className="text-[16px] text-[#666] font-medium max-w-2xl mx-auto" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
            Browse our For Sale By Owner properties across Oklahoma
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Arrows */}
          {totalSlides > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 md:-translate-x-7 bg-[#413936] hover:bg-[#312926] p-3.5 rounded-full shadow-lg z-10 transition-all duration-300"
                aria-label="Previous properties"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 md:translate-x-7 bg-[#413936] hover:bg-[#312926] p-3.5 rounded-full shadow-lg z-10 transition-all duration-300"
                aria-label="Next properties"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            </>
          )}

          {/* Property Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center">
            {getCurrentProperties().map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onAuthRequired={() => setShowAuthModal(true)}
              />
            ))}
          </div>

          {/* Carousel Dots */}
          {totalSlides > 1 && (
            <div className="flex justify-center gap-2 mt-12">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentSlide === index ? 'w-8 bg-[#413936]' : 'w-2 bg-[#D0CCC7] hover:bg-[#B0ACA7]'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            href="/properties"
            className="inline-flex items-center justify-center gap-2 bg-[#A41E34] text-white rounded-full px-8 py-3 font-medium transition-all duration-300 hover:bg-[#8B1A2C]"
            style={{ fontFamily: 'Instrument Sans, sans-serif' }}
          >
            View All Properties
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <mask id="mask0_home_props" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
                <rect width="20" height="20" transform="matrix(-1 0 0 1 20 0)" fill="#D9D9D9"/>
              </mask>
              <g mask="url(#mask0_home_props)">
                <path d="M13.459 10.8334L11.084 13.2084C10.9173 13.3751 10.8375 13.5695 10.8444 13.7918C10.8513 14.014 10.9312 14.2084 11.084 14.3751C11.2507 14.5418 11.4486 14.6286 11.6777 14.6355C11.9069 14.6425 12.1048 14.5626 12.2715 14.3959L16.084 10.5834C16.2507 10.4168 16.334 10.2223 16.334 10.0001C16.334 9.77787 16.2507 9.58343 16.084 9.41676L12.2715 5.60426C12.1048 5.43759 11.9069 5.35773 11.6777 5.36467C11.4486 5.37162 11.2507 5.45842 11.084 5.62509C10.9312 5.79176 10.8513 5.9862 10.8444 6.20842C10.8375 6.43065 10.9173 6.62509 11.084 6.79176L13.459 9.16676H4.16732C3.93121 9.16676 3.73329 9.24662 3.57357 9.40634C3.41385 9.56606 3.33398 9.76398 3.33398 10.0001C3.33398 10.2362 3.41385 10.4341 3.57357 10.5938C3.73329 10.7536 3.93121 10.8334 4.16732 10.8334H13.459Z" fill="white"/>
              </g>
            </svg>
          </Link>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </section>
  );
};

export default PropertiesSection;
