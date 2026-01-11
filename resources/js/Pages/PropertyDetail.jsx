import React, { useState, useEffect, useRef } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { MapPin, BedDouble, Bath, Maximize2, Calendar, Home, Heart, Share2, ArrowLeft, Phone, Mail, CheckCircle2, ChevronLeft, ChevronRight, Copy, Check, BadgeCheck, Calculator, DollarSign, Printer, Video, ExternalLink } from 'lucide-react';
import MainLayout from '@/Layouts/MainLayout';

function PropertyDetail({ property }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(() => {
    if (typeof window !== 'undefined') {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      return favorites.includes(property.id);
    }
    return false;
  });
  const [showContactForm, setShowContactForm] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const [showShareDropdown, setShowShareDropdown] = useState(false);
  const [copied, setCopied] = useState(false);
  const shareDropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (shareDropdownRef.current && !shareDropdownRef.current.contains(event.target)) {
        setShowShareDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    email: '',
    phone: '',
    question: '',
    message: `I'm interested in this property at ${property.address}, ${property.city}.`,
    property_id: property.id,
  });

  const photos = property.photos && property.photos.length > 0
    ? property.photos
    : ['https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800'];

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  const handleFavorite = () => {
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

  const handleShare = () => {
    setShowShareDropdown(!showShareDropdown);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      setShowShareDropdown(false);
    }, 2000);
  };

  const shareOnFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank', 'width=600,height=400');
    setShowShareDropdown(false);
  };

  const shareOnTwitter = () => {
    const text = `Check out this property: ${property.property_title}`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank', 'width=600,height=400');
    setShowShareDropdown(false);
  };

  const shareViaEmail = () => {
    const subject = `Property: ${property.property_title}`;
    const body = `Check out this property I found:\n\n${property.property_title}\n${property.address}, ${property.city}, ${property.state}\nPrice: ${formatPrice(property.price)}\n\n${window.location.href}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setShowShareDropdown(false);
  };

  const shareOnWhatsApp = () => {
    const text = `Check out this property: ${property.property_title} - ${window.location.href}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    setShowShareDropdown(false);
  };

  const handlePrintFlyer = () => {
    const flyerWindow = window.open('', '_blank');
    flyerWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${property.property_title} - Property Flyer</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #A41E34; padding-bottom: 20px; }
          .logo { font-size: 24px; font-weight: bold; color: #A41E34; margin-bottom: 10px; }
          .price { font-size: 36px; font-weight: bold; color: #A41E34; margin: 20px 0; }
          .address { font-size: 18px; color: #333; }
          .photo { width: 100%; height: 300px; object-fit: cover; border-radius: 10px; margin: 20px 0; }
          .details { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin: 20px 0; }
          .detail-box { text-align: center; padding: 15px; background: #f5f5f5; border-radius: 8px; }
          .detail-label { font-size: 12px; color: #666; text-transform: uppercase; }
          .detail-value { font-size: 20px; font-weight: bold; color: #111; }
          .description { margin: 20px 0; line-height: 1.6; color: #444; }
          .features { margin: 20px 0; }
          .features h3 { margin-bottom: 10px; color: #111; }
          .features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
          .feature-item { font-size: 14px; color: #666; }
          .feature-item:before { content: "✓ "; color: #A41E34; }
          .contact { margin-top: 30px; padding: 20px; background: #A41E34; color: white; border-radius: 10px; text-align: center; }
          .contact-name { font-size: 18px; font-weight: bold; margin-bottom: 5px; }
          .contact-phone { font-size: 24px; font-weight: bold; }
          .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #999; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">OKBYOWNER</div>
          <div>For Sale By Owner</div>
        </div>
        <div class="price">${formatPrice(property.price)}</div>
        <h1 style="font-size: 24px; margin-bottom: 10px;">${property.property_title}</h1>
        <div class="address">${property.address}, ${property.city}, ${property.state} ${property.zip_code}</div>
        ${photos[0] ? `<img src="${photos[0]}" class="photo" alt="Property Photo">` : ''}
        <div class="details">
          <div class="detail-box">
            <div class="detail-label">Bedrooms</div>
            <div class="detail-value">${property.bedrooms}</div>
          </div>
          <div class="detail-box">
            <div class="detail-label">Bathrooms</div>
            <div class="detail-value">${property.bathrooms}</div>
          </div>
          <div class="detail-box">
            <div class="detail-label">Sq. Ft.</div>
            <div class="detail-value">${property.sqft ? property.sqft.toLocaleString() : 'N/A'}</div>
          </div>
          <div class="detail-box">
            <div class="detail-label">Year Built</div>
            <div class="detail-value">${property.year_built || 'N/A'}</div>
          </div>
        </div>
        <div class="description">
          <h3 style="margin-bottom: 10px;">Description</h3>
          ${property.description}
        </div>
        ${property.features && property.features.length > 0 ? `
          <div class="features">
            <h3>Features & Amenities</h3>
            <div class="features-grid">
              ${property.features.map(f => `<div class="feature-item">${f}</div>`).join('')}
            </div>
          </div>
        ` : ''}
        <div class="contact">
          <div class="contact-name">${property.contact_name}</div>
          <div class="contact-phone">${property.contact_phone}</div>
        </div>
        <div class="footer">
          Listed on OKBYOWNER.com | Scan QR code or visit: ${window.location.href}
        </div>
        <script>window.onload = function() { window.print(); }</script>
      </body>
      </html>
    `);
    flyerWindow.document.close();
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    post(route('inquiry.store'), {
      onSuccess: () => {
        setMessageSent(true);
        reset();
        setData('message', `I'm interested in this property at ${property.address}, ${property.city}.`);
        setData('property_id', property.id);
        setTimeout(() => {
          setMessageSent(false);
          setShowContactForm(false);
        }, 3000);
      },
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const propertyTypeLabels = {
    'single-family-home': 'Single Family Home',
    'condos-townhomes-co-ops': 'Condo / Townhome',
    'multi-family': 'Multi-Family',
    'land': 'Land',
    'commercial': 'Commercial',
  };

  return (
    <>
      <Head title={`${property.property_title} - OKBYOWNER`} />

      {/* Back Button */}
      <div className="bg-[#EEEDEA] pt-[77px]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-4">
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 text-[#666] hover:text-[#111] transition-colors"
            style={{ fontFamily: 'Instrument Sans, sans-serif' }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Properties
          </Link>
        </div>
      </div>

      {/* Property Header */}
      <section className="bg-[#EEEDEA] pb-8">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div>
              <h1
                className="text-[32px] md:text-[40px] font-medium text-[#111] mb-2"
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                {property.property_title}
              </h1>
              <p className="text-lg text-[#666] flex items-center gap-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                <MapPin className="w-5 h-5" />
                {property.address}, {property.city}, {property.state} {property.zip_code}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span
                className="text-[32px] md:text-[40px] font-bold text-[#A41E34]"
                style={{ fontFamily: 'Instrument Sans, sans-serif' }}
              >
                {formatPrice(property.price)}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Image Gallery */}
      <section className="bg-white py-8">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="relative rounded-2xl overflow-hidden">
            <img
              src={photos[currentImageIndex]}
              alt={`${property.property_title} - Image ${currentImageIndex + 1}`}
              className="w-full h-[400px] md:h-[500px] object-cover"
              onError={(e) => e.target.src = 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800'}
            />

            {/* Image Navigation */}
            {photos.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full transition-all"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full transition-all"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
                  {currentImageIndex + 1} / {photos.length}
                </div>
              </>
            )}

            {/* Action Buttons */}
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={handlePrintFlyer}
                className="bg-white/90 hover:bg-white p-3 rounded-full transition-all"
                title="Print Flyer"
              >
                <Printer className="w-5 h-5 text-gray-800" />
              </button>
              <button
                onClick={handleFavorite}
                className="bg-white/90 hover:bg-white p-3 rounded-full transition-all"
                title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-800'}`} />
              </button>
              <div className="relative" ref={shareDropdownRef}>
                <button
                  onClick={handleShare}
                  className="bg-white/90 hover:bg-white p-3 rounded-full transition-all"
                  title="Share property"
                >
                  <Share2 className="w-5 h-5 text-gray-800" />
                </button>

                {/* Share Dropdown */}
                {showShareDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                    <button
                      onClick={copyToClipboard}
                      className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left"
                    >
                      {copied ? (
                        <Check className="w-5 h-5 text-green-500" />
                      ) : (
                        <Copy className="w-5 h-5 text-gray-600" />
                      )}
                      <span className="text-gray-700" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                        {copied ? 'Copied!' : 'Copy Link'}
                      </span>
                    </button>
                    <button
                      onClick={shareOnFacebook}
                      className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left"
                    >
                      <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      <span className="text-gray-700" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                        Facebook
                      </span>
                    </button>
                    <button
                      onClick={shareOnTwitter}
                      className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left"
                    >
                      <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                      <span className="text-gray-700" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                        X (Twitter)
                      </span>
                    </button>
                    <button
                      onClick={shareOnWhatsApp}
                      className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left"
                    >
                      <svg className="w-5 h-5 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      <span className="text-gray-700" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                        WhatsApp
                      </span>
                    </button>
                    <button
                      onClick={shareViaEmail}
                      className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left"
                    >
                      <Mail className="w-5 h-5 text-gray-600" />
                      <span className="text-gray-700" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                        Email
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Status Badge */}
            <div className="absolute top-4 left-4 bg-[#A41E34] text-white px-4 py-2 rounded-full text-sm font-semibold">
              {property.status === 'for-rent' ? 'FOR RENT' : 'FOR SALE'}
            </div>
          </div>

          {/* Thumbnail Gallery */}
          {photos.length > 1 && (
            <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
              {photos.map((photo, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-all ${
                    index === currentImageIndex ? 'border-[#A41E34]' : 'border-transparent'
                  }`}
                >
                  <img
                    src={photo}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => e.target.src = 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800'}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Mobile Sticky CTA Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50 shadow-lg safe-bottom">
        <div className="flex gap-3">
          <a
            href={`tel:${property.contact_phone}`}
            className="flex-1 flex items-center justify-center gap-2 bg-[#A41E34] text-white py-3 px-4 rounded-xl font-semibold hover:bg-[#8B1A2C] transition-colors"
            style={{ fontFamily: 'Instrument Sans, sans-serif' }}
          >
            <Phone className="w-5 h-5" />
            Call Now
          </a>
          <button
            onClick={() => setShowContactForm(true)}
            className="flex-1 flex items-center justify-center gap-2 bg-[#111] text-white py-3 px-4 rounded-xl font-semibold hover:bg-[#333] transition-colors"
            style={{ fontFamily: 'Instrument Sans, sans-serif' }}
          >
            <Mail className="w-5 h-5" />
            Message
          </button>
        </div>
      </div>

      {/* Property Details */}
      <section className="bg-[#EEEDEA] py-12 pb-32 lg:pb-12">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Quick Stats */}
              <div className="bg-white rounded-2xl p-6 mb-6">
                <h2 className="text-xl font-semibold text-[#111] mb-4" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  Property Details
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-[#EEEDEA] p-3 rounded-lg">
                      <BedDouble className="w-5 h-5 text-[#A41E34]" />
                    </div>
                    <div>
                      <p className="text-sm text-[#666]">Bedrooms</p>
                      <p className="font-semibold text-[#111]">{property.bedrooms}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-[#EEEDEA] p-3 rounded-lg">
                      <Bath className="w-5 h-5 text-[#A41E34]" />
                    </div>
                    <div>
                      <p className="text-sm text-[#666]">Bathrooms</p>
                      <p className="font-semibold text-[#111]">{property.bathrooms}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-[#EEEDEA] p-3 rounded-lg">
                      <Maximize2 className="w-5 h-5 text-[#A41E34]" />
                    </div>
                    <div>
                      <p className="text-sm text-[#666]">Square Feet</p>
                      <p className="font-semibold text-[#111]">{property.sqft ? property.sqft.toLocaleString() : 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-[#EEEDEA] p-3 rounded-lg">
                      <Calendar className="w-5 h-5 text-[#A41E34]" />
                    </div>
                    <div>
                      <p className="text-sm text-[#666]">Year Built</p>
                      <p className="font-semibold text-[#111]">{property.year_built || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Additional Details */}
                <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-[#666]">Property Type</p>
                    <p className="font-semibold text-[#111]">{propertyTypeLabels[property.property_type] || property.property_type}</p>
                  </div>
                  {property.lot_size && (
                    <div>
                      <p className="text-sm text-[#666]">Lot Size</p>
                      <p className="font-semibold text-[#111]">{property.lot_size.toLocaleString()} sqft</p>
                    </div>
                  )}
                  {property.subdivision && (
                    <div>
                      <p className="text-sm text-[#666]">Subdivision</p>
                      <p className="font-semibold text-[#111]">{property.subdivision}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="bg-white rounded-2xl p-6 mb-6">
                <h2 className="text-xl font-semibold text-[#111] mb-4" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  Description
                </h2>
                <p className="text-[#666] leading-relaxed whitespace-pre-line" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  {property.description}
                </p>
              </div>

              {/* Features */}
              {property.features && property.features.length > 0 && (
                <div className="bg-white rounded-2xl p-6">
                  <h2 className="text-xl font-semibold text-[#111] mb-4" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                    Features & Amenities
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {property.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span className="text-[#666]" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Multimedia Links */}
              {(property.video_tour_url || property.virtual_tour_url || property.floor_plan_url) && (
                <div className="bg-white rounded-2xl p-6 mt-6">
                  <h2 className="text-xl font-semibold text-[#111] mb-4" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                    Virtual Tours & Media
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {property.virtual_tour_url && (
                      <a
                        href={property.virtual_tour_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-4 bg-[#EEEDEA] rounded-xl hover:bg-[#E5E1DC] transition-colors group"
                      >
                        <div className="bg-[#A41E34] p-3 rounded-lg">
                          <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                            <polyline points="7.5 4.21 12 6.81 16.5 4.21" />
                            <polyline points="7.5 19.79 7.5 14.6 3 12" />
                            <polyline points="21 12 16.5 14.6 16.5 19.79" />
                            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                            <line x1="12" y1="22.08" x2="12" y2="12" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-[#111]" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>3D Virtual Tour</p>
                          <p className="text-sm text-[#666]">Explore in 3D</p>
                        </div>
                        <ExternalLink className="w-4 h-4 text-[#666] group-hover:text-[#A41E34] transition-colors" />
                      </a>
                    )}
                    {property.video_tour_url && (
                      <a
                        href={property.video_tour_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-4 bg-[#EEEDEA] rounded-xl hover:bg-[#E5E1DC] transition-colors group"
                      >
                        <div className="bg-[#A41E34] p-3 rounded-lg">
                          <Video className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-[#111]" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Video Tour</p>
                          <p className="text-sm text-[#666]">Watch walkthrough</p>
                        </div>
                        <ExternalLink className="w-4 h-4 text-[#666] group-hover:text-[#A41E34] transition-colors" />
                      </a>
                    )}
                    {property.floor_plan_url && (
                      <a
                        href={property.floor_plan_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-4 bg-[#EEEDEA] rounded-xl hover:bg-[#E5E1DC] transition-colors group"
                      >
                        <div className="bg-[#A41E34] p-3 rounded-lg">
                          <Maximize2 className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-[#111]" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Floor Plan</p>
                          <p className="text-sm text-[#666]">View layout</p>
                        </div>
                        <ExternalLink className="w-4 h-4 text-[#666] group-hover:text-[#A41E34] transition-colors" />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar - Contact */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 sticky top-24">
                <h2 className="text-xl font-semibold text-[#111] mb-4" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  Contact Seller
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-[#EEEDEA] p-3 rounded-full">
                      <Home className="w-5 h-5 text-[#A41E34]" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#111]">{property.contact_name}</p>
                      <p className="text-sm text-[#666]">Property Owner</p>
                    </div>
                  </div>

                  <a
                    href={`tel:${property.contact_phone}`}
                    className="flex items-center gap-3 p-3 bg-[#EEEDEA] rounded-xl hover:bg-[#E5E1DC] transition-colors"
                  >
                    <Phone className="w-5 h-5 text-[#A41E34]" />
                    <span className="text-[#111]" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>{property.contact_phone}</span>
                  </a>
                </div>

                <button
                  onClick={() => setShowContactForm(!showContactForm)}
                  className="w-full bg-[#A41E34] text-white py-3 rounded-xl font-medium hover:bg-[#8B1A2C] transition-colors"
                  style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                >
                  {showContactForm ? 'Hide Form' : 'Send Message'}
                </button>

                {/* Contact Form */}
                {showContactForm && (
                  <form onSubmit={handleContactSubmit} className="mt-6 space-y-4">
                    {messageSent && (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
                        Message sent successfully!
                      </div>
                    )}
                    <div>
                      <input
                        type="text"
                        placeholder="Your Name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#A41E34]"
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        placeholder="Your Email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#A41E34]"
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="tel"
                        placeholder="Your Phone"
                        value={data.phone}
                        onChange={(e) => setData('phone', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#A41E34]"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Your Question (e.g., Is the price negotiable?)"
                        value={data.question}
                        onChange={(e) => setData('question', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#A41E34]"
                      />
                    </div>
                    <div>
                      <textarea
                        placeholder="Additional Message (Optional)"
                        value={data.message}
                        onChange={(e) => setData('message', e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#A41E34] resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={processing}
                      className="w-full bg-[#111] text-white py-3 rounded-xl font-medium hover:bg-[#333] transition-colors disabled:opacity-50"
                      style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                    >
                      {processing ? 'Sending...' : 'Send Message'}
                    </button>
                  </form>
                )}
              </div>

              {/* Mortgage Pre-Approval CTA */}
              <div className="bg-gradient-to-br from-[#A41E34] to-[#7A1628] rounded-2xl p-6 mt-6 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <BadgeCheck className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-semibold" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                    Need Financing?
                  </h3>
                </div>
                <p className="text-sm text-white/80 mb-4 leading-relaxed" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                  Get pre-approved in 15 minutes with T&M Mortgages. Compare rates from 25+ lenders.
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-white/90">
                    <CheckCircle2 className="w-4 h-4 text-green-300" />
                    <span style={{ fontFamily: 'Instrument Sans, sans-serif' }}>No credit score impact</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/90">
                    <CheckCircle2 className="w-4 h-4 text-green-300" />
                    <span style={{ fontFamily: 'Instrument Sans, sans-serif' }}>100% online application</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/90">
                    <CheckCircle2 className="w-4 h-4 text-green-300" />
                    <span style={{ fontFamily: 'Instrument Sans, sans-serif' }}>Competitive rates</span>
                  </div>
                </div>
                <a
                  href="https://tandmmortgages.morty.com/get-started/mortgage?loan_officer=terry-hassell"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-white text-[#A41E34] text-center py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
                  style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                >
                  Get Pre-Approved
                </a>
              </div>

              {/* Monthly Payment Estimate */}
              <div className="bg-white rounded-2xl p-6 mt-6 border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-[#EEEDEA] p-2 rounded-lg">
                    <Calculator className="w-5 h-5 text-[#A41E34]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#111]" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                    Est. Monthly Payment
                  </h3>
                </div>
                <div className="text-center py-4">
                  <p className="text-3xl font-bold text-[#A41E34]" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(Math.round((property.price * 0.8 * (0.065/12) * Math.pow(1 + 0.065/12, 360)) / (Math.pow(1 + 0.065/12, 360) - 1)))}
                    <span className="text-lg text-[#666] font-normal">/mo</span>
                  </p>
                  <p className="text-xs text-[#666] mt-2" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                    Based on 20% down, 6.5% rate, 30-year fixed
                  </p>
                </div>
                <Link
                  href="/mortgages"
                  className="block w-full text-center text-[#A41E34] py-2 text-sm font-medium hover:underline"
                  style={{ fontFamily: 'Instrument Sans, sans-serif' }}
                >
                  Calculate with your terms →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

PropertyDetail.layout = (page) => <MainLayout>{page}</MainLayout>;

export default PropertyDetail;
