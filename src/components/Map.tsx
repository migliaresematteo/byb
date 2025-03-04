import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Property } from '../types';

interface MapProps {
  properties?: Property[];
  onMarkerClick?: (property: Property) => void;
  center?: [number, number];
  zoom?: number;
}

export function Map({ properties = [], onMarkerClick, center = [45.24151478420603, 7.557142854507506], zoom = 11 }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  // Create custom marker icon
  const customIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  useEffect(() => {
    if (!mapRef.current) return;

    try {
      if (!mapInstanceRef.current) {
        // Initialize map
        mapInstanceRef.current = L.map(mapRef.current).setView(center, zoom);

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: ' OpenStreetMap contributors'
        }).addTo(mapInstanceRef.current);
      }

      // Clear existing markers
      if (markersRef.current) {
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];
      }

      // Add markers for each property
      if (mapInstanceRef.current && properties) {
        properties.forEach(property => {
          if (property.coordinates) {
            try {
              const marker = L.marker(
                [property.coordinates.lat, property.coordinates.lng],
                { icon: customIcon }
              ).addTo(mapInstanceRef.current!);

              // Add a popup with property title
              marker.bindPopup(`
                <div class="font-semibold">${property.title}</div>
                <div>
                  {property.price && Number(property.price) !== 0
                    ? property.price.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })
                    : 'Prezzo su richiesta'}
                </div>
              `);

              if (onMarkerClick) {
                marker.on('click', () => onMarkerClick(property));
              }

              markersRef.current.push(marker);
            } catch (markerError) {
              console.error(`Error creating marker for property ${property.id}:`, markerError);
            }
          }
        });
      }

      // Update center and zoom if provided
      mapInstanceRef.current.setView(center, zoom);
    } catch (error) {
      console.error('Error initializing map:', error);
    }

    // Cleanup on unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [properties, center, zoom, onMarkerClick]);

  return <div ref={mapRef} className="w-full h-full relative" style={{ zIndex: 1 }} />;
}
