
import React, { useEffect, useRef, useState } from 'react';
import { Order } from '@/pages/Index';
import { MapPin, Navigation, DollarSign, Clock } from 'lucide-react';

interface MapViewProps {
  order: Order;
  onDistanceCalculated?: (distance: number) => void;
}

declare global {
  interface Window {
    google: any;
  }
}

const MapView = ({ order, onDistanceCalculated }: MapViewProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [directionsService, setDirectionsService] = useState<any>(null);
  const [directionsRenderer, setDirectionsRenderer] = useState<any>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [duration, setDuration] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeMap = () => {
      if (!window.google || !mapRef.current) return;

      const google = window.google;
      
      // Initialize map centered on Kigali
      const mapInstance = new google.maps.Map(mapRef.current, {
        zoom: 13,
        center: { lat: -1.9441, lng: 30.0619 }, // Kigali coordinates
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      });

      const directionsServiceInstance = new google.maps.DirectionsService();
      const directionsRendererInstance = new google.maps.DirectionsRenderer({
        suppressMarkers: false,
        polylineOptions: {
          strokeColor: '#10B981',
          strokeWeight: 4,
          strokeOpacity: 0.8,
        },
      });

      directionsRendererInstance.setMap(mapInstance);

      setMap(mapInstance);
      setDirectionsService(directionsServiceInstance);
      setDirectionsRenderer(directionsRendererInstance);
      setIsLoading(false);

      // Calculate route if addresses are available
      if (order.pickupAddress && order.deliveryAddress) {
        calculateRoute(directionsServiceInstance, directionsRendererInstance);
      }
    };

    if (window.google) {
      initializeMap();
    } else {
      const checkGoogleMaps = setInterval(() => {
        if (window.google) {
          clearInterval(checkGoogleMaps);
          initializeMap();
        }
      }, 100);

      return () => clearInterval(checkGoogleMaps);
    }
  }, [order]);

  const calculateRoute = (service: any, renderer: any) => {
    if (!service || !renderer) return;

    const request = {
      origin: order.pickupAddress,
      destination: order.deliveryAddress,
      travelMode: window.google.maps.TravelMode.DRIVING,
      unitSystem: window.google.maps.UnitSystem.METRIC,
      avoidHighways: false,
      avoidTolls: false,
    };

    service.route(request, (result: any, status: any) => {
      if (status === window.google.maps.DirectionsStatus.OK) {
        renderer.setDirections(result);
        
        const route = result.routes[0];
        const leg = route.legs[0];
        const distanceInKm = Math.round(leg.distance.value / 1000 * 100) / 100;
        
        setDistance(distanceInKm);
        setDuration(leg.duration.text);
        
        if (onDistanceCalculated) {
          onDistanceCalculated(distanceInKm);
        }
      } else {
        console.error('Directions request failed due to ' + status);
      }
    });
  };

  const transportCost = distance ? Math.round(distance * 3000) : 0;

  if (isLoading) {
    return (
      <div className="w-full h-64 md:h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 border-b bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Route Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          {distance && (
            <div className="flex items-center space-x-2">
              <Navigation className="h-4 w-4 text-blue-600" />
              <span className="text-gray-600">Distance:</span>
              <span className="font-medium">{distance} km</span>
            </div>
          )}
          {duration && (
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-orange-600" />
              <span className="text-gray-600">Duration:</span>
              <span className="font-medium">{duration}</span>
            </div>
          )}
          {transportCost > 0 && (
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span className="text-gray-600">Transport Cost:</span>
              <span className="font-medium text-green-600">{transportCost.toLocaleString()} RWF</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="flex items-start space-x-2">
            <MapPin className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Pickup Location</p>
              <p className="font-medium text-gray-900">{order.pickupAddress}</p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <MapPin className="h-4 w-4 text-red-600 mt-1 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Delivery Location</p>
              <p className="font-medium text-gray-900">{order.deliveryAddress}</p>
            </div>
          </div>
        </div>
      </div>

      <div 
        ref={mapRef} 
        className="w-full h-64 md:h-96"
        style={{ minHeight: '300px' }}
      />
    </div>
  );
};

export default MapView;
