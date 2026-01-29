import React, { useEffect, useRef, useState } from 'react';
import { ZoomIn, ZoomOut, Navigation } from 'lucide-react';

const SinglePropertyMap = ({ property }) => {
  const mapRef = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);
  const mapInstanceRef = useRef(null);

  // Oklahoma default center
  const defaultLat = 35.5;
  const defaultLng = -97.5;
  const defaultZoom = 7;

  const hasCoordinates = property?.latitude && property?.longitude;
  const lat = hasCoordinates ? parseFloat(property.latitude) : defaultLat;
  const lng = hasCoordinates ? parseFloat(property.longitude) : defaultLng;
  const zoom = hasCoordinates ? 15 : defaultZoom;

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

    const map = L.map(mapRef.current, {
      zoomControl: false,
    }).setView([lat, lng], zoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    // Add marker if we have coordinates
    if (hasCoordinates) {
      const markerIcon = L.divIcon({
        className: 'custom-single-marker',
        html: `
          <div style="position:relative;">
            <div style="background:#A41E34;width:32px;height:32px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;box-shadow:0 2px 6px rgba(0,0,0,0.3);">
              <svg style="transform:rotate(45deg);width:16px;height:16px;color:white;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>
          </div>
        `,
        iconSize: [32, 40],
        iconAnchor: [16, 40],
      });

      const address = `${property.address || ''}, ${property.city || ''}, ${property.state || 'OK'} ${property.zip_code || ''}`;

      const marker = L.marker([lat, lng], { icon: markerIcon })
        .addTo(map)
        .bindPopup(`
          <div style="padding:8px;font-family:'Instrument Sans',sans-serif;">
            <p style="font-weight:600;color:#111;margin:0 0 4px 0;">${property.property_title || 'Property Location'}</p>
            <p style="color:#666;font-size:13px;margin:0;">${address}</p>
          </div>
        `, { maxWidth: 250 });
    }

    mapInstanceRef.current = map;
    setMapInstance(map);
  };

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden">
      <div ref={mapRef} className="w-full h-full" style={{ minHeight: '300px' }} />

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
          onClick={() => mapInstance?.setView([lat, lng], zoom)}
        >
          <Navigation className="w-4 h-4 text-gray-700" />
        </button>
      </div>

      {/* Loading */}
      {!mapInstance && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#A41E34] mx-auto mb-3"></div>
            <p className="text-gray-500 text-sm">Loading map...</p>
          </div>
        </div>
      )}

      {/* No coordinates message */}
      {mapInstance && !hasCoordinates && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-lg z-[1000]">
          <p className="text-sm text-gray-600" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
            Exact location not available
          </p>
        </div>
      )}

      <style>{`
        .custom-single-marker {
          background: transparent !important;
          border: none !important;
        }
        .leaflet-popup-content-wrapper {
          border-radius: 12px !important;
          padding: 0 !important;
          overflow: hidden;
        }
        .leaflet-popup-content {
          margin: 8px !important;
        }
        .leaflet-popup-close-button {
          top: 4px !important;
          right: 4px !important;
        }
      `}</style>
    </div>
  );
};

export default SinglePropertyMap;
