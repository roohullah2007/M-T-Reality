import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, ZoomIn, ZoomOut, Layers } from 'lucide-react';

const PropertyMap = ({ properties }) => {
  const mapRef = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);

  useEffect(() => {
    // Check if Leaflet is loaded
    if (typeof window !== 'undefined' && window.L) {
      initializeMap();
    } else {
      // Load Leaflet dynamically
      loadLeaflet();
    }

    return () => {
      if (mapInstance) {
        mapInstance.remove();
      }
    };
  }, []);

  const loadLeaflet = () => {
    // Load Leaflet CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    // Load Leaflet JS
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => {
      initializeMap();
    };
    document.body.appendChild(script);
  };

  const initializeMap = () => {
    if (!mapRef.current || mapInstance) return;

    const L = window.L;

    // Initialize map centered on Oklahoma
    const map = L.map(mapRef.current).setView([35.5, -97.5], 7);

    // Add tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    // Add markers for each property
    properties.forEach((property) => {
      const markerIcon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div class="relative">
            <div class="bg-[#A52A3D] text-white px-3 py-1.5 rounded-full shadow-lg font-poppins font-bold text-xs whitespace-nowrap">
              $${(property.price / 1000).toFixed(0)}K
            </div>
            <div class="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-[#A52A3D]"></div>
          </div>
        `,
        iconSize: [80, 40],
        iconAnchor: [40, 40],
      });

      const marker = L.marker([property.lat, property.lng], { icon: markerIcon })
        .addTo(map)
        .bindPopup(`
          <div class="p-2 min-w-[200px]">
            <img src="${property.image}" alt="${property.title}" class="w-full h-32 object-cover rounded-lg mb-2" />
            <h3 class="font-poppins font-bold text-gray-900 mb-1">${property.title}</h3>
            <p class="font-poppins text-sm text-gray-600 mb-2">${property.location}</p>
            <div class="flex items-center gap-3 text-sm font-poppins text-gray-700 mb-2">
              <span>${property.beds} Beds</span>
              <span>•</span>
              <span>${property.baths} Baths</span>
              <span>•</span>
              <span>${property.sqft.toLocaleString()} sqft</span>
            </div>
            <div class="text-xl font-poppins font-bold text-[#A52A3D]">
              $${property.price.toLocaleString()}
            </div>
          </div>
        `);

      marker.on('click', () => {
        setSelectedProperty(property);
      });
    });

    setMapInstance(map);
  };

  return (
    <div className="relative w-full h-full">
      {/* Map Container */}
      <div ref={mapRef} className="w-full h-full" />

      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-[1000]">
        <button
          className="bg-white p-2.5 rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
          title="Zoom In"
          onClick={() => mapInstance?.zoomIn()}
        >
          <ZoomIn className="w-5 h-5 text-gray-700" />
        </button>
        <button
          className="bg-white p-2.5 rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
          title="Zoom Out"
          onClick={() => mapInstance?.zoomOut()}
        >
          <ZoomOut className="w-5 h-5 text-gray-700" />
        </button>
        <button
          className="bg-white p-2.5 rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
          title="Center Map"
          onClick={() => mapInstance?.setView([35.5, -97.5], 7)}
        >
          <Navigation className="w-5 h-5 text-gray-700" />
        </button>
        <button
          className="bg-white p-2.5 rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
          title="Map Layers"
        >
          <Layers className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* Property Count Badge */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-lg z-[1000]">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#A52A3D]" />
          <span className="font-poppins font-semibold text-sm text-gray-700">
            {properties.length} Properties
          </span>
        </div>
      </div>

      {/* Loading State */}
      {!mapInstance && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A52A3D] mx-auto mb-3"></div>
            <p className="text-gray-600 font-poppins">Loading map...</p>
          </div>
        </div>
      )}

      <style jsx>{`
        .custom-marker {
          background: transparent;
          border: none;
        }
        .leaflet-popup-content-wrapper {
          border-radius: 12px;
          padding: 0;
        }
        .leaflet-popup-content {
          margin: 0;
        }
      `}</style>
    </div>
  );
};

export default PropertyMap;
