
import { Calculator, Star, Truck, Users, Sparkles, Key } from 'lucide-react';

interface PriceBreakdownProps {
  services: {
    transport: boolean;
    helpers: number;
    cleaning: boolean;
    keyDelivery: boolean;
  };
  distance?: number;
  isVip?: boolean;
  totalCost: number;
}

const PriceBreakdown = ({ services, distance, isVip, totalCost }: PriceBreakdownProps) => {
  const baseTransportCost = 40000;
  const helperCost = 10000;
  const cleaningCost = 5000;
  const keyDeliveryCost = 5000;
  const distanceRate = 1000; // RWF per km

  const calculateBaseCost = () => {
    let cost = 0;
    
    if (services.transport) {
      cost += baseTransportCost;
      if (distance && distance > 10) {
        cost += (distance - 10) * distanceRate;
      }
    }
    
    cost += services.helpers * helperCost;
    
    if (services.cleaning) {
      cost += cleaningCost;
    }
    
    if (services.keyDelivery) {
      cost += keyDeliveryCost;
    }
    
    return cost;
  };

  const baseCost = calculateBaseCost();
  const vipPremium = isVip ? baseCost * 0.5 : 0;
  const finalCost = baseCost + vipPremium;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Calculator className="h-6 w-6 text-gray-600" />
        <h3 className="text-xl font-semibold text-gray-900">Price Breakdown</h3>
      </div>

      <div className="space-y-3">
        {services.transport && (
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <Truck className="h-4 w-4 text-blue-500" />
              <span className="text-gray-700">Transport Service</span>
            </div>
            <span className="font-medium">{baseTransportCost.toLocaleString()} RWF</span>
          </div>
        )}

        {distance && distance > 10 && services.transport && (
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <Truck className="h-4 w-4 text-blue-400" />
              <span className="text-gray-700">Extra Distance ({(distance - 10).toFixed(1)} km)</span>
            </div>
            <span className="font-medium">{((distance - 10) * distanceRate).toLocaleString()} RWF</span>
          </div>
        )}

        {services.helpers > 0 && (
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <Users className="h-4 w-4 text-green-500" />
              <span className="text-gray-700">Helpers ({services.helpers})</span>
            </div>
            <span className="font-medium">{(services.helpers * helperCost).toLocaleString()} RWF</span>
          </div>
        )}

        {services.cleaning && (
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <Sparkles className="h-4 w-4 text-purple-500" />
              <span className="text-gray-700">Cleaning Service</span>
            </div>
            <span className="font-medium">{cleaningCost.toLocaleString()} RWF</span>
          </div>
        )}

        {services.keyDelivery && (
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <Key className="h-4 w-4 text-orange-500" />
              <span className="text-gray-700">Key Delivery</span>
            </div>
            <span className="font-medium">{keyDeliveryCost.toLocaleString()} RWF</span>
          </div>
        )}

        {isVip && (          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg p-4 mb-2">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <Star className="h-5 w-5 text-amber-500" />
                <span className="font-medium text-amber-800">VIP Service Premium</span>
              </div>
              <span className="font-bold text-amber-600">+{vipPremium.toLocaleString()} RWF</span>
            </div>
            <ul className="text-xs text-amber-700 space-y-1 ml-8">
              <li>• Premium handling & equipment</li>
              <li>• Priority scheduling</li>
              <li>• Up to 5M RWF insurance</li>
              <li>• Dedicated support team</li>
            </ul>
          </div>
        )}
      </div>

      <div className="mt-6 pt-4 border-t-2 border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-gray-900">Total Cost</span>
          <span className="text-2xl font-bold text-green-600">{totalCost.toLocaleString()} RWF</span>
        </div>
        
        {isVip && (
          <div className="mt-2 flex items-center space-x-2">
            <Star className="h-4 w-4 text-amber-500" />
            <span className="text-sm text-amber-600 font-medium">VIP Service Included</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PriceBreakdown;
