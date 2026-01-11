import React, { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { Maximize2, Heart, Info } from 'lucide-react';

const PropertyCard = ({ property, onAuthRequired }) => {
  const { auth } = usePage().props;
  const [isFavorite, setIsFavorite] = useState(() => {
    if (typeof window !== 'undefined' && auth?.user) {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      return favorites.includes(property.id);
    }
    return false;
  });

  // Get the first photo or use placeholder
  const propertyImage = property.photos && property.photos.length > 0
    ? property.photos[0]
    : 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800';

  const getStatusLabel = () => {
    switch (property.status) {
      case 'sold':
        return 'SOLD';
      case 'for-rent':
        return 'FOR RENT';
      default:
        return 'FOR SALE';
    }
  };
  const statusLabel = getStatusLabel();

  // Handle maximize - open in new tab
  const handleMaximize = (e) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(`/properties/${property.slug || property.id}`, '_blank');
  };

  // Handle favorite toggle - requires auth
  const handleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Check if user is logged in
    if (!auth?.user) {
      if (onAuthRequired) {
        onAuthRequired();
      }
      return;
    }

    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    if (isFavorite) {
      const newFavorites = favorites.filter(id => id !== property.id);
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      setIsFavorite(false);
    } else {
      favorites.push(property.id);
      localStorage.setItem('favorites', JSON.stringify(favorites));
      setIsFavorite(true);
    }
  };

  // Handle info - navigate to property detail
  const handleInfo = (e) => {
    e.preventDefault();
    e.stopPropagation();
    router.visit(`/properties/${property.slug || property.id}`);
  };

  return (
    <Link href={`/properties/${property.slug || property.id}`} className="block">
      <div className="bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 group w-[300px] h-[330px] flex flex-col">
        {/* Property Image */}
        <div className="relative h-[180px] overflow-hidden flex-shrink-0">
          <img
            src={propertyImage}
            alt={property.property_title || property.address}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => e.target.src = 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800'}
          />
          {/* Status Badge */}
          <div className="absolute top-4 right-4 bg-[#A41E34] text-white px-3 py-1.5 text-xs font-semibold rounded-full" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
            {statusLabel}
          </div>

          {/* MLS Badge */}
          {property.is_mls_listed && (
            <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1.5 text-xs font-semibold rounded-full" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
              MLS
            </div>
          )}

          {/* Action Buttons */}
          <div className="absolute bottom-4 right-4 flex gap-2">
            <button
              onClick={handleMaximize}
              className="bg-white/90 hover:bg-white p-2 rounded-lg transition-all duration-300 hover:scale-105"
              title="Open in new tab"
            >
              <Maximize2 className="w-4 h-4 text-gray-800" />
            </button>
            <button
              onClick={handleFavorite}
              className="bg-white/90 hover:bg-white p-2 rounded-lg transition-all duration-300 hover:scale-105"
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-[#413936]'}`} />
            </button>
            <button
              onClick={handleInfo}
              className="bg-white/90 hover:bg-white p-2 rounded-lg transition-all duration-300 hover:scale-105"
              title="View details"
            >
              <Info className="w-4 h-4 text-gray-800" />
            </button>
          </div>
        </div>

        {/* Property Details */}
        <div className="px-3 pt-2.5 pb-4 h-[150px] flex flex-col">
          {/* Price */}
          <div className="pb-2 mb-2 border-b border-gray-200">
            <span className="font-bold text-base text-[#293056]" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
              ${Number(property.price).toLocaleString()}
            </span>
          </div>

          {/* Address */}
          <div className="pb-2 mb-2 border-b border-gray-200">
            <p className="text-sm text-[#293056] line-clamp-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
              {property.address}, {property.city}, {property.state || 'Oklahoma'} {property.zip_code}
            </p>
          </div>

          {/* Property Stats */}
          <div>
            <p className="text-sm text-[#293056]" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
              {property.bedrooms}BD | {property.bathrooms}BA | {property.sqft ? `${Number(property.sqft).toLocaleString()} sqft` : 'Area N/A'}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
