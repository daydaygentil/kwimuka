
import { useEffect, useRef, useState } from 'react';
import { Order } from '@/pages/Index';

interface MapComponentProps {
  order: Order;
  onStartNavigation: () => void;
}

const MapComponent = ({ order, onStartNavigation }: MapComponentProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService | null>(null);
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null);
  const [driverPosition, setDriverPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [distance, setDistance] = useState<string>('');
  const [duration, setDuration] = useState<string>('');

  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google) {
        initializeMap();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDWr-rU3jCkkXpd5B5fL2XO-x8zCAPerAA&libraries=geometry`;
      script.async = true;
      script.defer = true;
      script.onload = initializeMap;
      document.head.appendChild(script);
    };

    loadGoogleMaps();
  }, []);

  const initializeMap = () => {
    if (!mapRef.current) return;

    const mapInstance = new google.maps.Map(mapRef.current, {
      zoom: 13,
      center: { lat: -1.9441, lng: 30.0619 }, // Kigali center
    });

    const dirService = new google.maps.DirectionsService();
    const dirRenderer = new google.maps.DirectionsRenderer({
      suppressMarkers: false,
      markerOptions: {
        icon: {
          url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
          scaledSize: new google.maps.Size(32, 32)
        }
      }
    });

    dirRenderer.setMap(mapInstance);

    setMap(mapInstance);
    setDirectionsService(dirService);
    setDirectionsRenderer(dirRenderer);

    getCurrentLocation();
    calculateRoute(dirService, dirRenderer);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setDriverPosition(pos);
          
          if (map) {
            new google.maps.Marker({
              position: pos,
              map: map,
              title: 'Your Location',
              icon: {
                url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                scaledSize: new google.maps.Size(32, 32)
              }
            });
            map.setCenter(pos);
          }
        },
        () => {
          console.log('Error: The Geolocation service failed.');
        }
      );
    }
  };

  const calculateRoute = (dirService: google.maps.DirectionsService, dirRenderer: google.maps.DirectionsRenderer) => {
    dirService.route(
      {
        origin: order.pickupAddress,
        destination: order.deliveryAddress,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === 'OK' && result) {
          dirRenderer.setDirections(result);
          
          const route = result.routes[0];
          if (route && route.legs[0]) {
            setDistance(route.legs[0].distance?.text || '');
            setDuration(route.legs[0].duration?.text || '');
          }

          // Add custom markers
          if (map) {
            new google.maps.Marker({
              position: result.routes[0].legs[0].start_location,
              map: map,
              title: 'Pickup Location',
              icon: {
                url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
                scaledSize: new google.maps.Size(40, 40)
              }
            });

            new google.maps.Marker({
              position: result.routes[0].legs[0].end_location,
              map: map,
              title: 'Delivery Location',
              icon: {
                url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
                scaledSize: new google.maps.Size(40, 40)
              }
            });
          }
        } else {
          console.error('Directions request failed due to ' + status);
        }
      }
    );
  };

  return (
    <div className="space-y-4">
      <div ref={mapRef} className="w-full h-64 rounded-lg border"></div>
      
      {(distance || duration) && (
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="flex justify-between text-sm">
            {distance && <span className="font-medium">Distance: {distance}</span>}
            {duration && <span className="font-medium">Duration: {duration}</span>}
          </div>
        </div>
      )}

      <button
        onClick={onStartNavigation}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors"
      >
        Start Navigation
      </button>
    </div>
  );
};

export default MapComponent;
