import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { MapPin, Home, DollarSign, BedDouble, Bath, ChevronLeft, ChevronRight } from 'lucide-react';
import MainLayout from '@/Layouts/MainLayout';
import PropertyCard from '@/Components/PropertyCard';
import AuthModal from '@/Components/AuthModal';

function Properties({ properties = { data: [] }, filters = {} }) {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [searchParams, setSearchParams] = useState({
    keyword: filters.keyword || '',
    location: filters.location || '',
    status: filters.status || 'for-sale',
    propertyType: filters.propertyType || '',
    priceMin: filters.priceMin || '',
    priceMax: filters.priceMax || '',
    bedrooms: filters.bedrooms || '',
    bathrooms: filters.bathrooms || '',
    sort: filters.sort || 'newest',
  });

  // Get properties data from pagination
  const propertyList = properties.data || properties || [];
  const pagination = properties.data ? properties : null;

  const handleSearchChange = (field, value) => {
    setSearchParams({ ...searchParams, [field]: value });
  };

  const handleSearch = (e) => {
    e?.preventDefault();
    router.get('/properties', searchParams, { preserveState: true });
  };

  const handleSortChange = (value) => {
    const newParams = { ...searchParams, sort: value };
    setSearchParams(newParams);
    router.get('/properties', newParams, { preserveState: true });
  };

  return (
    <>
      <Head title="Properties - OKBYOWNER" />

      {/* Hero Section */}
      <div className="relative bg-[#EEEDEA] pt-0 md:pt-[77px]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-16">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center bg-white rounded-lg px-4 py-2 mb-6">
              <span className="text-[#666] text-sm font-medium" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                Browse Properties
              </span>
            </div>

            {/* Page Title */}
            <h1
              className="text-[#111] text-[48px] md:text-[60px] font-medium leading-[1.1] mb-4"
              style={{ fontFamily: 'Instrument Sans, sans-serif' }}
            >
              Find Your Dream Property
            </h1>

            {/* Subtitle */}
            <p
              className="text-[#666] text-[14px] md:text-[16px] font-medium leading-relaxed max-w-2xl mx-auto"
              style={{ fontFamily: 'Instrument Sans, sans-serif' }}
            >
              Browse thousands of For Sale by Owner properties across Oklahoma.
            </p>
          </div>
        </div>

        {/* Bottom border */}
        <div className="border-b border-[#D0CCC7]"></div>
      </div>

      {/* Filters Panel */}
      <div className="bg-[#E5E1DC] border-b border-[#D0CCC7] py-6">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-[#111] mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" />
                  <input
                    type="text"
                    placeholder="City or ZIP"
                    className="w-full pl-10 pr-4 py-2.5 border border-[#D0CCC7] rounded-xl text-sm outline-none focus:border-[#A41E34] transition-colors"
                    style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                    value={searchParams.location}
                    onChange={(e) => handleSearchChange('location', e.target.value)}
                  />
                </div>
              </div>

              {/* Property Type */}
              <div>
                <label className="block text-sm font-medium text-[#111] mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  Property Type
                </label>
                <div className="relative">
                  <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" />
                  <select
                    className="w-full pl-10 pr-4 py-2.5 border border-[#D0CCC7] rounded-xl text-sm outline-none focus:border-[#A41E34] transition-colors appearance-none bg-white"
                    style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                    value={searchParams.propertyType}
                    onChange={(e) => handleSearchChange('propertyType', e.target.value)}
                  >
                    <option value="">All Types</option>
                    <option value="house">House</option>
                    <option value="apartment">Apartment</option>
                    <option value="condo">Condo</option>
                    <option value="townhouse">Townhouse</option>
                    <option value="land">Land</option>
                  </select>
                </div>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-[#111] mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  Price Range
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" />
                    <input
                      type="text"
                      placeholder="Min"
                      className="w-full pl-10 pr-2 py-2.5 border border-[#D0CCC7] rounded-xl text-sm outline-none focus:border-[#A41E34] transition-colors"
                      style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                      value={searchParams.priceMin}
                      onChange={(e) => handleSearchChange('priceMin', e.target.value)}
                    />
                  </div>
                  <div className="relative flex-1">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" />
                    <input
                      type="text"
                      placeholder="Max"
                      className="w-full pl-10 pr-2 py-2.5 border border-[#D0CCC7] rounded-xl text-sm outline-none focus:border-[#A41E34] transition-colors"
                      style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                      value={searchParams.priceMax}
                      onChange={(e) => handleSearchChange('priceMax', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Beds & Baths */}
              <div>
                <label className="block text-sm font-medium text-[#111] mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  Beds & Baths
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <BedDouble className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" />
                    <select
                      className="w-full pl-10 pr-2 py-2.5 border border-[#D0CCC7] rounded-xl text-sm outline-none focus:border-[#A41E34] transition-colors appearance-none bg-white"
                      style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                      value={searchParams.bedrooms}
                      onChange={(e) => handleSearchChange('bedrooms', e.target.value)}
                    >
                      <option value="">Beds</option>
                      <option value="1">1+</option>
                      <option value="2">2+</option>
                      <option value="3">3+</option>
                      <option value="4">4+</option>
                      <option value="5">5+</option>
                    </select>
                  </div>
                  <div className="relative flex-1">
                    <Bath className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" />
                    <select
                      className="w-full pl-10 pr-2 py-2.5 border border-[#D0CCC7] rounded-xl text-sm outline-none focus:border-[#A41E34] transition-colors appearance-none bg-white"
                      style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                      value={searchParams.bathrooms}
                      onChange={(e) => handleSearchChange('bathrooms', e.target.value)}
                    >
                      <option value="">Baths</option>
                      <option value="1">1+</option>
                      <option value="2">2+</option>
                      <option value="3">3+</option>
                      <option value="4">4+</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Dropdown & Action Buttons */}
            <div className="flex justify-between items-center mt-4 gap-3">
              {/* Status Dropdown */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-[#111]" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  Status:
                </label>
                <div className="relative">
                  <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" />
                  <select
                    value={searchParams.status}
                    onChange={(e) => {
                      const newParams = { ...searchParams, status: e.target.value };
                      setSearchParams(newParams);
                      router.get('/properties', newParams, { preserveState: true });
                    }}
                    className="min-w-[160px] pl-10 pr-4 py-2.5 border border-[#D0CCC7] rounded-xl text-sm outline-none focus:border-[#999] transition-colors appearance-none bg-white cursor-pointer"
                    style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                  >
                    <option value="for-sale">For Sale</option>
                    <option value="for-rent">For Rent</option>
                    <option value="sold">Sold</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setSearchParams({
                      keyword: '',
                      location: '',
                      status: 'for-sale',
                      propertyType: '',
                      priceMin: '',
                      priceMax: '',
                      bedrooms: '',
                      bathrooms: '',
                      sort: 'newest',
                    });
                    router.get('/properties');
                  }}
                  className="px-6 py-2.5 border border-[#D0CCC7] rounded-xl text-sm font-medium text-[#111] hover:bg-white transition-colors"
                  style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                >
                  Clear All
                </button>
                <button
                  onClick={handleSearch}
                  className="px-6 py-2.5 bg-[#A41E34] text-white rounded-xl text-sm font-medium hover:bg-[#8B1A2C] transition-colors"
                  style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>

      {/* Properties Section */}
      <section className="bg-[#EEEDEA] py-16 md:py-20">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          {/* Results Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl md:text-[32px] font-medium text-[#111] mb-1" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                {searchParams.status === 'sold' ? 'Recently Sold' : searchParams.status === 'for-rent' ? 'For Rent' : 'For Sale'}
              </h2>
              <p className="text-sm text-[#666]" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                {pagination ? (
                  <>Showing {pagination.from || 0} - {pagination.to || 0} of {pagination.total || 0} properties</>
                ) : (
                  <>Showing {propertyList.length} properties</>
                )}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-[#666] hidden sm:inline" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                Sort by:
              </span>
              <select
                className="px-4 py-2 border border-[#D0CCC7] rounded-xl text-sm outline-none focus:border-[#A41E34] transition-colors bg-white"
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                value={searchParams.sort}
                onChange={(e) => handleSortChange(e.target.value)}
              >
                <option value="newest">Newest</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="bedrooms">Bedrooms</option>
                <option value="sqft">Square Feet</option>
              </select>
            </div>
          </div>

          {/* Property Grid */}
          {propertyList.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
              {propertyList.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onAuthRequired={() => setShowAuthModal(true)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center">
              <Home className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-semibold text-[#111] mb-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                No Properties Found
              </h3>
              <p className="text-[#666] mb-6" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                {searchParams.keyword || searchParams.location
                  ? 'Try adjusting your search criteria or filters'
                  : 'Check back soon for new listings'}
              </p>
              {(searchParams.keyword || searchParams.location) && (
                <button
                  onClick={() => {
                    setSearchParams({
                      keyword: '',
                      location: '',
                      status: 'for-sale',
                      propertyType: '',
                      priceMin: '',
                      priceMax: '',
                      bedrooms: '',
                      bathrooms: '',
                      sort: 'newest',
                    });
                    router.get('/properties');
                  }}
                  className="inline-flex items-center gap-2 bg-[#A41E34] text-white px-6 py-3 rounded-full font-medium hover:bg-[#8B1A2C] transition-colors"
                  style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.last_page > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              {/* Previous Button */}
              {pagination.prev_page_url ? (
                <Link
                  href={pagination.prev_page_url}
                  className="px-4 py-2 border border-[#D0CCC7] rounded-xl text-sm font-medium text-[#111] hover:bg-white transition-colors flex items-center gap-1"
                  style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Link>
              ) : (
                <button
                  disabled
                  className="px-4 py-2 border border-[#D0CCC7] rounded-xl text-sm font-medium text-gray-400 cursor-not-allowed flex items-center gap-1"
                  style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
              )}

              {/* Page Numbers */}
              {Array.from({ length: pagination.last_page }, (_, i) => i + 1)
                .filter(page => {
                  // Show first, last, current, and adjacent pages
                  return page === 1 ||
                    page === pagination.last_page ||
                    Math.abs(page - pagination.current_page) <= 1;
                })
                .map((page, index, array) => {
                  // Add ellipsis if there's a gap
                  const showEllipsisBefore = index > 0 && page - array[index - 1] > 1;

                  return (
                    <React.Fragment key={page}>
                      {showEllipsisBefore && (
                        <span className="px-2 text-gray-400">...</span>
                      )}
                      <Link
                        href={`/properties?page=${page}${searchParams.keyword ? `&keyword=${searchParams.keyword}` : ''}${searchParams.sort !== 'newest' ? `&sort=${searchParams.sort}` : ''}`}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                          page === pagination.current_page
                            ? 'bg-[#A41E34] text-white'
                            : 'border border-[#D0CCC7] text-[#111] hover:bg-white'
                        }`}
                        style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                      >
                        {page}
                      </Link>
                    </React.Fragment>
                  );
                })}

              {/* Next Button */}
              {pagination.next_page_url ? (
                <Link
                  href={pagination.next_page_url}
                  className="px-4 py-2 border border-[#D0CCC7] rounded-xl text-sm font-medium text-[#111] hover:bg-white transition-colors flex items-center gap-1"
                  style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Link>
              ) : (
                <button
                  disabled
                  className="px-4 py-2 border border-[#D0CCC7] rounded-xl text-sm font-medium text-gray-400 cursor-not-allowed flex items-center gap-1"
                  style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
}

// Specify MainLayout for this page to include Footer
Properties.layout = (page) => <MainLayout>{page}</MainLayout>;

export default Properties;
