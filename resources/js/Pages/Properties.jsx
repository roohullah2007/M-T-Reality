import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { MapPin, Home, DollarSign, BedDouble, Bath, ChevronLeft, ChevronRight, Map, LayoutGrid, Calendar, Search, SlidersHorizontal, X } from 'lucide-react';
import MainLayout from '@/Layouts/MainLayout';
import PropertyCard from '@/Components/PropertyCard';
import PropertyMap from '@/Components/Properties/PropertyMap';
import AuthModal from '@/Components/AuthModal';

function Properties({ properties = { data: [] }, filters = {}, isAdmin = false, allPropertiesForMap = [] }) {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [searchParams, setSearchParams] = useState({
    keyword: String(filters.keyword || ''),
    location: String(filters.location || ''),
    status: String(filters.status || 'for-sale'),
    propertyType: String(filters.propertyType || ''),
    priceMin: String(filters.priceMin || ''),
    priceMax: String(filters.priceMax || ''),
    bedrooms: String(filters.bedrooms || ''),
    bathrooms: String(filters.bathrooms || ''),
    schoolDistrict: String(filters.schoolDistrict || ''),
    hasOpenHouse: String(filters.hasOpenHouse || ''),
    sort: String(filters.sort || 'newest'),
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

  const clearFilters = () => {
    setSearchParams({
      keyword: '',
      location: '',
      status: 'for-sale',
      propertyType: '',
      priceMin: '',
      priceMax: '',
      bedrooms: '',
      bathrooms: '',
      schoolDistrict: '',
      hasOpenHouse: '',
      sort: 'newest',
    });
    router.get('/properties');
  };

  // Check if any filters are active
  const hasActiveFilters = searchParams.location || searchParams.propertyType || searchParams.priceMin || searchParams.priceMax || searchParams.bedrooms || searchParams.bathrooms || searchParams.schoolDistrict || searchParams.hasOpenHouse;

  return (
    <>
      <Head title="Our Listings" />

      {/* Hero Section */}
      <section className="relative">
        <div className="relative min-h-[60vh] flex items-end overflow-hidden">
          {/* Background Image */}
          <img
            src="https://images.pexels.com/photos/2119714/pexels-photo-2119714.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30"></div>

          {/* Content */}
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 relative z-10 w-full py-16 pt-[120px]">
            <div className="max-w-3xl">
              {/* Badge */}
              <div className="inline-flex items-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2 mb-6">
                <span className="text-white/90 text-sm font-medium" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  Our Listings
                </span>
              </div>

              <h1
                className="text-white text-[36px] sm:text-[46px] md:text-[56px] font-medium leading-[1.1] mb-4 drop-shadow-2xl"
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                Find Your Next Home
              </h1>
              <p
                className="text-white/80 text-[15px] sm:text-[17px] font-medium leading-relaxed max-w-2xl drop-shadow-lg"
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                Browse our curated collection of properties across Oklahoma — backed by experienced agents who put your goals first.
              </p>
            </div>

            {/* Search Bar */}
            <div className="mt-8">
              <form onSubmit={handleSearch} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Location Input */}
                  <div className="relative flex-1">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                    <input
                      type="text"
                      placeholder="Search by city, ZIP, or neighborhood..."
                      className="w-full pl-12 pr-4 py-3.5 bg-white/10 border border-white/15 rounded-xl text-white text-[15px] placeholder-white/40 outline-none focus:border-[#2BBBAD] focus:bg-white/15 transition-all"
                      style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                      value={searchParams.location}
                      onChange={(e) => handleSearchChange('location', e.target.value)}
                    />
                  </div>

                  {/* Property Type */}
                  <div className="relative sm:w-[200px]">
                    <Home className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                    <select
                      className="w-full pl-12 pr-4 py-3.5 bg-white/10 border border-white/15 rounded-xl text-white text-[15px] outline-none focus:border-[#2BBBAD] transition-all appearance-none cursor-pointer"
                      style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                      value={searchParams.propertyType}
                      onChange={(e) => handleSearchChange('propertyType', e.target.value)}
                    >
                      <option value="" className="text-[#111]">All Types</option>
                      <option value="single-family-home" className="text-[#111]">Single Family</option>
                      <option value="condos-townhomes-co-ops" className="text-[#111]">Condos/Townhomes</option>
                      <option value="multi-family" className="text-[#111]">Multi-Family</option>
                      <option value="land" className="text-[#111]">Lot/Land</option>
                      <option value="farms-ranches" className="text-[#111]">Farms/Ranches</option>
                      <option value="mfd-mobile-homes" className="text-[#111]">Mobile Homes</option>
                    </select>
                  </div>

                  {/* Status */}
                  <div className="relative sm:w-[160px]">
                    <select
                      className="w-full px-4 py-3.5 bg-white/10 border border-white/15 rounded-xl text-white text-[15px] outline-none focus:border-[#2BBBAD] transition-all appearance-none cursor-pointer"
                      style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                      value={searchParams.status}
                      onChange={(e) => handleSearchChange('status', e.target.value)}
                    >
                      <option value="all" className="text-[#111]">All Listings</option>
                      <option value="for-sale" className="text-[#111]">For Sale</option>
                      <option value="pending" className="text-[#111]">Pending</option>
                      <option value="sold" className="text-[#111]">Sold</option>
                      {isAdmin && <option value="inactive" className="text-[#111]">Inactive</option>}
                    </select>
                  </div>

                  {/* Search Button */}
                  <button
                    type="submit"
                    className="flex items-center justify-center gap-2 bg-[#2BBBAD] text-white rounded-xl px-6 py-3.5 font-semibold text-[15px] hover:bg-[#249E93] transition-all duration-300 whitespace-nowrap"
                    style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                  >
                    <Search className="w-5 h-5" />
                    <span className="hidden sm:inline">Search</span>
                  </button>
                </div>

                {/* More Filters Toggle */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setShowMoreFilters(!showMoreFilters)}
                    className="flex items-center gap-2 text-white/70 text-sm font-medium hover:text-white transition-colors"
                    style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                    {showMoreFilters ? 'Less Filters' : 'More Filters'}
                    {hasActiveFilters && (
                      <span className="w-2 h-2 bg-[#2BBBAD] rounded-full"></span>
                    )}
                  </button>

                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="flex items-center gap-1.5 text-white/50 text-sm font-medium hover:text-white transition-colors"
                      style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                    >
                      <X className="w-3.5 h-3.5" />
                      Clear All
                    </button>
                  )}
                </div>

                {/* Expanded Filters */}
                {showMoreFilters && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-3 pt-3 border-t border-white/10">
                    {/* Price Min */}
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                      <input
                        type="text"
                        placeholder="Min Price"
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/15 rounded-xl text-white text-sm placeholder-white/40 outline-none focus:border-[#2BBBAD] transition-all"
                        style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                        value={searchParams.priceMin}
                        onChange={(e) => handleSearchChange('priceMin', e.target.value)}
                      />
                    </div>

                    {/* Price Max */}
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                      <input
                        type="text"
                        placeholder="Max Price"
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/15 rounded-xl text-white text-sm placeholder-white/40 outline-none focus:border-[#2BBBAD] transition-all"
                        style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                        value={searchParams.priceMax}
                        onChange={(e) => handleSearchChange('priceMax', e.target.value)}
                      />
                    </div>

                    {/* Bedrooms */}
                    <div className="relative">
                      <BedDouble className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                      <select
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/15 rounded-xl text-white text-sm outline-none focus:border-[#2BBBAD] transition-all appearance-none cursor-pointer"
                        style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                        value={searchParams.bedrooms}
                        onChange={(e) => handleSearchChange('bedrooms', e.target.value)}
                      >
                        <option value="" className="text-[#111]">Bedrooms</option>
                        <option value="1" className="text-[#111]">1+ Beds</option>
                        <option value="2" className="text-[#111]">2+ Beds</option>
                        <option value="3" className="text-[#111]">3+ Beds</option>
                        <option value="4" className="text-[#111]">4+ Beds</option>
                        <option value="5" className="text-[#111]">5+ Beds</option>
                      </select>
                    </div>

                    {/* Bathrooms */}
                    <div className="relative">
                      <Bath className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                      <select
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/15 rounded-xl text-white text-sm outline-none focus:border-[#2BBBAD] transition-all appearance-none cursor-pointer"
                        style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                        value={searchParams.bathrooms}
                        onChange={(e) => handleSearchChange('bathrooms', e.target.value)}
                      >
                        <option value="" className="text-[#111]">Bathrooms</option>
                        <option value="1" className="text-[#111]">1+ Baths</option>
                        <option value="2" className="text-[#111]">2+ Baths</option>
                        <option value="3" className="text-[#111]">3+ Baths</option>
                        <option value="4" className="text-[#111]">4+ Baths</option>
                      </select>
                    </div>

                    {/* School District */}
                    <div className="relative">
                      <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                      </svg>
                      <input
                        type="text"
                        placeholder="School District"
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/15 rounded-xl text-white text-sm placeholder-white/40 outline-none focus:border-[#2BBBAD] transition-all"
                        style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                        value={searchParams.schoolDistrict}
                        onChange={(e) => handleSearchChange('schoolDistrict', e.target.value)}
                      />
                    </div>

                    {/* Open Houses */}
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                      <select
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/15 rounded-xl text-white text-sm outline-none focus:border-[#2BBBAD] transition-all appearance-none cursor-pointer"
                        style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                        value={searchParams.hasOpenHouse}
                        onChange={(e) => handleSearchChange('hasOpenHouse', e.target.value)}
                      >
                        <option value="" className="text-[#111]">Open Houses</option>
                        <option value="yes" className="text-[#111]">Has Open House</option>
                        <option value="this_weekend" className="text-[#111]">This Weekend</option>
                      </select>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Properties Section */}
      <section className="bg-[#EEEDEA] py-12 md:py-16">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          {/* Results Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl md:text-[32px] font-medium text-[#111] mb-1" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                {searchParams.status === 'all' ? 'All Listings' : searchParams.status === 'sold' ? 'Recently Sold' : searchParams.status === 'pending' ? 'Pending (Under Contract)' : searchParams.status === 'inactive' ? 'Inactive Listings' : 'For Sale'}
              </h2>
              <p className="text-sm text-[#666]" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                {pagination ? (
                  <>Showing {pagination.from || 0} - {pagination.to || 0} of {pagination.total || 0} properties</>
                ) : (
                  <>Showing {propertyList.length} properties</>
                )}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Map/Grid Toggle */}
              <div className="flex items-center bg-white border border-[#D0CCC7] rounded-xl overflow-hidden">
                <button
                  onClick={() => setShowMap(false)}
                  className={`px-3 py-2 flex items-center gap-1.5 text-sm transition-colors ${!showMap ? 'bg-[#2BBBAD] text-white' : 'text-[#666] hover:bg-gray-50'}`}
                  title="Grid View"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowMap(true)}
                  className={`px-3 py-2 flex items-center gap-1.5 text-sm transition-colors ${showMap ? 'bg-[#2BBBAD] text-white' : 'text-[#666] hover:bg-gray-50'}`}
                  title="Map View"
                >
                  <Map className="w-4 h-4" />
                </button>
              </div>

              <span className="text-sm text-[#666] hidden sm:inline" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                Sort by:
              </span>
              <select
                className="px-4 py-2 border border-[#D0CCC7] rounded-xl text-sm outline-none focus:border-[#2BBBAD] transition-colors bg-white"
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

          {/* Map View */}
          {showMap && (
            <div className="mb-8 h-[500px] rounded-2xl overflow-hidden shadow-sm relative" style={{ zIndex: 0, isolation: 'isolate' }}>
              <PropertyMap properties={allPropertiesForMap.length > 0 ? allPropertiesForMap : propertyList} />
            </div>
          )}

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
                  onClick={clearFilters}
                  className="inline-flex items-center gap-2 bg-[#2BBBAD] text-white px-6 py-3 rounded-full font-medium hover:bg-[#249E93] transition-colors"
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
                  return page === 1 ||
                    page === pagination.last_page ||
                    Math.abs(page - pagination.current_page) <= 1;
                })
                .map((page, index, array) => {
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
                            ? 'bg-[#2BBBAD] text-white'
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
