import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, ZoomIn, ZoomOut, X, ChevronUp, BedDouble, Bath, Maximize2 } from 'lucide-react';

const PropertyMap = ({ properties = [], onPropertyClick }) => {
  const mapRef = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [showListingsPanel, setShowListingsPanel] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.L) {
      initializeMap();
    } else {
      loadLeaflet();
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers when properties change
  useEffect(() => {
    if (mapInstance && window.L) {
      updateMarkers();
    }
  }, [properties, mapInstance]);

  const loadLeaflet = () => {
    // Check if already loading
    if (document.querySelector('link[href*="leaflet"]')) {
      const checkLeaflet = setInterval(() => {
        if (window.L) {
          clearInterval(checkLeaflet);
          initializeMap();
        }
      }, 100);
      return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => initializeMap();
    document.body.appendChild(script);
  };

  const initializeMap = () => {
    if (!mapRef.current || mapInstance) return;

    const L = window.L;

    // Default center: Oklahoma
    const map = L.map(mapRef.current, {
      zoomControl: false,
    }).setView([35.5, -97.5], 7);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;
    setMapInstance(map);
  };

  const updateMarkers = () => {
    const L = window.L;
    if (!L || !mapInstance) return;

    // Clear existing markers
    markersRef.current.forEach(m => mapInstance.removeLayer(m));
    markersRef.current = [];

    const validProperties = properties.filter(p => p.latitude && p.longitude);

    if (validProperties.length === 0) return;

    const bounds = L.latLngBounds();

    validProperties.forEach((property) => {
      const lat = parseFloat(property.latitude);
      const lng = parseFloat(property.longitude);

      if (isNaN(lat) || isNaN(lng)) return;

      bounds.extend([lat, lng]);

      const priceLabel = property.price >= 1000000
        ? `$${(property.price / 1000000).toFixed(1)}M`
        : `$${(property.price / 1000).toFixed(0)}K`;

      const statusColor = property.listing_status === 'sold' ? '#374151'
        : property.listing_status === 'pending' ? '#CA8A04'
        : property.listing_status === 'inactive' ? '#6B7280'
        : '#A41E34';

      const markerIcon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="position:relative;cursor:pointer;">
            <div style="background:${statusColor};color:white;padding:4px 10px;border-radius:20px;font-size:12px;font-weight:700;white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,0.3);">
              ${priceLabel}
            </div>
            <div style="position:absolute;bottom:-6px;left:50%;transform:translateX(-50%);width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:6px solid ${statusColor};"></div>
          </div>
        `,
        iconSize: [80, 40],
        iconAnchor: [40, 40],
      });

      const photo = property.photos && property.photos.length > 0
        ? property.photos[0]
        : '/images/property-placeholder.svg';

      const baths = (property.full_bathrooms || 0) + (property.half_bathrooms ? property.half_bathrooms * 0.5 : 0);

      const popupContent = `
        <div style="padding:0;min-width:220px;font-family:'Instrument Sans',sans-serif;">
          <a href="/properties/${property.slug || property.id}" style="text-decoration:none;color:inherit;">
            <img src="${photo}" alt="${property.property_title || ''}" style="width:100%;height:120px;object-fit:cover;border-radius:8px 8px 0 0;" onerror="this.src='/images/property-placeholder.svg'" />
            <div style="padding:10px;">
              <div style="font-weight:700;font-size:16px;color:#A41E34;margin-bottom:4px;">$${Number(property.price).toLocaleString()}</div>
              <div style="font-size:13px;color:#111;margin-bottom:4px;line-height:1.3;">${property.address || ''}</div>
              <div style="font-size:12px;color:#666;">${property.city || ''}, ${property.state || 'OK'} ${property.zip_code || ''}</div>
              <div style="font-size:12px;color:#555;margin-top:6px;">${property.bedrooms || 0} BD | ${baths} BA | ${property.sqft ? Number(property.sqft).toLocaleString() + ' sqft' : 'N/A'}</div>
            </div>
          </a>
        </div>
      `;

      const marker = L.marker([lat, lng], { icon: markerIcon })
        .addTo(mapInstance)
        .bindPopup(popupContent, { maxWidth: 260, minWidth: 220 });

      if (onPropertyClick) {
        marker.on('click', () => onPropertyClick(property));
      }

      markersRef.current.push(marker);
    });

    // Fit map to bounds
    if (bounds.isValid()) {
      mapInstance.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
    }
  };

  const propertiesWithCoords = properties.filter(p => p.latitude && p.longitude);

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden">
      <div ref={mapRef} className="w-full h-full" style={{ minHeight: '400px' }} />

      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-[1000]">
        <button
          className="bg-white p-2 rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
          title="Zoom In"
          onClick={() => mapInstance?.zoomIn()}
        >
          <ZoomIn className="w-4 h-4 text-gray-700" />
        </button>
        <button
          className="bg-white p-2 rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
          title="Zoom Out"
          onClick={() => mapInstance?.zoomOut()}
        >
          <ZoomOut className="w-4 h-4 text-gray-700" />
        </button>
        <button
          className="bg-white p-2 rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
          title="Reset View"
          onClick={() => mapInstance?.setView([35.5, -97.5], 7)}
        >
          <Navigation className="w-4 h-4 text-gray-700" />
        </button>
      </div>

      {/* Property Count - Clickable */}
      <button
        onClick={() => setShowListingsPanel(!showListingsPanel)}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-lg z-[1000] hover:bg-gray-50 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#A41E34]" />
          <span className="font-semibold text-sm text-gray-700" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
            {propertiesWithCoords.length} on map
          </span>
          <ChevronUp className={`w-4 h-4 text-gray-500 transition-transform ${showListingsPanel ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {/* Listings Panel */}
      {showListingsPanel && propertiesWithCoords.length > 0 && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-[340px] max-h-[300px] bg-white rounded-xl shadow-2xl z-[1001] overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
            <span className="font-semibold text-sm text-gray-700" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
              Properties on Map ({propertiesWithCoords.length})
            </span>
            <button
              onClick={() => setShowListingsPanel(false)}
              className="p-1 hover:bg-gray-200 rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
          <div className="overflow-y-auto max-h-[250px]">
            {propertiesWithCoords.map((property) => {
              const photo = property.photos && property.photos.length > 0
                ? property.photos[0]
                : '/images/property-placeholder.svg';
              const baths = (property.full_bathrooms || 0) + (property.half_bathrooms ? property.half_bathrooms * 0.5 : 0);

              return (
                <a
                  key={property.id}
                  href={`/properties/${property.slug || property.id}`}
                  className="flex gap-3 p-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                  onClick={(e) => {
                    if (onPropertyClick) {
                      e.preventDefault();
                      onPropertyClick(property);
                      // Center map on this property
                      if (mapInstance) {
                        mapInstance.setView([parseFloat(property.latitude), parseFloat(property.longitude)], 15);
                        // Find and open the marker popup
                        markersRef.current.forEach(marker => {
                          const markerLatLng = marker.getLatLng();
                          if (markerLatLng.lat === parseFloat(property.latitude) && markerLatLng.lng === parseFloat(property.longitude)) {
                            marker.openPopup();
                          }
                        });
                      }
                      setShowListingsPanel(false);
                    }
                  }}
                >
                  <img
                    src={photo}
                    alt={property.property_title || ''}
                    className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                    onError={(e) => e.target.src = '/images/property-placeholder.svg'}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[#A41E34] text-sm" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                      ${Number(property.price).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-600 truncate" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                      {property.address}
                    </p>
                    <p className="text-xs text-gray-500" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                      {property.city}, {property.state || 'OK'}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                      <span className="flex items-center gap-0.5">
                        <BedDouble className="w-3 h-3" />
                        {property.bedrooms}
                      </span>
                      <span className="flex items-center gap-0.5">
                        <Bath className="w-3 h-3" />
                        {baths}
                      </span>
                      {property.sqft && (
                        <span className="flex items-center gap-0.5">
                          <Maximize2 className="w-3 h-3" />
                          {Number(property.sqft).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      )}

      {/* Loading */}
      {!mapInstance && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#A41E34] mx-auto mb-3"></div>
            <p className="text-gray-500 text-sm">Loading map...</p>
          </div>
        </div>
      )}

      <style>{`
        .custom-marker {
          background: transparent !important;
          border: none !important;
        }
        .leaflet-popup-content-wrapper {
          border-radius: 12px !important;
          padding: 0 !important;
          overflow: hidden;
        }
        .leaflet-popup-content {
          margin: 0 !important;
        }
        .leaflet-popup-close-button {
          top: 6px !important;
          right: 6px !important;
          z-index: 10;
          background: white !important;
          border-radius: 50% !important;
          width: 22px !important;
          height: 22px !important;
          line-height: 22px !important;
          text-align: center !important;
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
};

export default PropertyMap;
