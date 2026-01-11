import React from 'react';
import { Head } from '@inertiajs/react';
import HeroSection from '@/Components/Sections/Homepage/HeroSection';
import HowItWorksSection from '@/Components/Sections/Homepage/HowItWorksSection';
import SellingSection from '@/Components/Sections/Homepage/SellingSection';
import ServicesSection from '@/Components/Sections/Homepage/ServicesSection';
import PropertiesSection from '@/Components/Sections/Homepage/PropertiesSection';
import MLSSection from '@/Components/Sections/Homepage/MLSSection';
import TestimonialsSection from '@/Components/Sections/Homepage/TestimonialsSection';
import FAQSection from '@/Components/Sections/Homepage/FAQSection';

export default function Home({ featuredProperties = [] }) {
  return (
    <>
      <Head title="Home - OKBYOWNER" />

      {/* Hero Section */}
      <HeroSection />

      {/* How It Works Section */}
      <HowItWorksSection />

      {/* Services Section - Multimedia */}
      <ServicesSection />

      {/* MLS Section */}
      <MLSSection />

      {/* Selling Section - Why Choose Us */}
      <SellingSection />

      {/* Properties Section */}
      <PropertiesSection properties={featuredProperties} />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* FAQ Section */}
      <FAQSection />
    </>
  );
}
