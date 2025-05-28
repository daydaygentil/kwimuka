
import { useState } from 'react';
import { Crown, Truck, Users, Sparkles, MapPin, Shield, Clock } from 'lucide-react';

interface VipServiceSelectorProps {
  isVip: boolean;
  onVipChange: (isVip: boolean) => void;
  onServiceChange: (serviceType: 'standard' | 'vip') => void;
}

const VipServiceSelector = ({ isVip, onVipChange, onServiceChange }: VipServiceSelectorProps) => {
  const [selectedService, setSelectedService] = useState<'standard' | 'vip'>('standard');

  const handleServiceSelect = (serviceType: 'standard' | 'vip') => {
    setSelectedService(serviceType);
    onVipChange(serviceType === 'vip');
    onServiceChange(serviceType);
  };

  const vipFeatures = [
    {
      icon: Crown,
      title: "VIP Certified Drivers",
      description: "Hand-picked, highly trained professional drivers"
    },
    {
      icon: Shield,
      title: "Premium Insurance",
      description: "Enhanced coverage for your valuable items"
    },
    {
      icon: Clock,
      title: "Priority Scheduling",
      description: "Guaranteed time slots and faster response"
    },
    {
      icon: MapPin,
      title: "Real-time GPS Tracking",
      description: "Live tracking with driver contact details"
    }
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Choose Your Service Level</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Standard Service */}
        <div
          className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${
            selectedService === 'standard'
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => handleServiceSelect('standard')}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Truck className="h-8 w-8 text-blue-600" />
              <div>
                <h4 className="font-semibold text-gray-900">Standard Moving</h4>
                <p className="text-sm text-gray-600">Professional moving service</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Starting from</p>
              <p className="text-2xl font-bold text-blue-600">40,000 RWF</p>
            </div>
          </div>
          
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Professional drivers and helpers
            </li>
            <li className="flex items-center">
              <Sparkles className="h-4 w-4 mr-2" />
              Basic cleaning service available
            </li>
            <li className="flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              Standard tracking and updates
            </li>
          </ul>
        </div>

        {/* VIP Service */}
        <div
          className={`border-2 rounded-xl p-6 cursor-pointer transition-all relative ${
            selectedService === 'vip'
              ? 'border-yellow-500 bg-yellow-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => handleServiceSelect('vip')}
        >
          <div className="absolute -top-2 -right-2">
            <div className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
              PREMIUM
            </div>
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Crown className="h-8 w-8 text-yellow-600" />
              <div>
                <h4 className="font-semibold text-gray-900">VIP Moving Service</h4>
                <p className="text-sm text-gray-600">Premium experience</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Starting from</p>
              <p className="text-2xl font-bold text-yellow-600">140,000 RWF</p>
            </div>
          </div>
          
          <ul className="space-y-2 text-sm text-gray-600 mb-4">
            {vipFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <li key={index} className="flex items-start">
                  <Icon className="h-4 w-4 mr-2 mt-0.5 text-yellow-600" />
                  <div>
                    <span className="font-medium">{feature.title}</span>
                    <br />
                    <span className="text-xs">{feature.description}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {selectedService === 'vip' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h5 className="font-semibold text-yellow-800 mb-2">🌟 VIP Service Includes:</h5>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Dedicated VIP-certified driver and helpers</li>
            <li>• White-glove packing and handling service</li>
            <li>• Premium moving supplies and equipment</li>
            <li>• Real-time GPS tracking with live updates</li>
            <li>• Priority customer support hotline</li>
            <li>• Full insurance coverage for valuable items</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default VipServiceSelector;
