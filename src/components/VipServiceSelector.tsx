
import { useState } from 'react';
import { Star, Package, Shield, Clock } from 'lucide-react';

interface VipServiceSelectorProps {
  onVipToggle: (isVip: boolean, specialItems?: string) => void;
  isVip: boolean;
  specialItems?: string;
}

const VipServiceSelector = ({ onVipToggle, isVip, specialItems }: VipServiceSelectorProps) => {
  const [localSpecialItems, setLocalSpecialItems] = useState(specialItems || '');

  const handleVipToggle = (vipEnabled: boolean) => {
    onVipToggle(vipEnabled, vipEnabled ? localSpecialItems : undefined);
  };

  const handleSpecialItemsChange = (value: string) => {
    setLocalSpecialItems(value);
    if (isVip) {
      onVipToggle(true, value);
    }
  };

  return (
    <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-6 border border-amber-200">
      <div className="flex items-center space-x-3 mb-4">
        <Star className="h-6 w-6 text-amber-500" />
        <h3 className="text-xl font-semibold text-gray-900">VIP Moving Service</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="flex items-center space-x-3 bg-white p-3 rounded-lg">
          <Package className="h-5 w-5 text-amber-500" />
          <span className="text-sm text-gray-700">Special Item Handling</span>
        </div>
        <div className="flex items-center space-x-3 bg-white p-3 rounded-lg">
          <Shield className="h-5 w-5 text-amber-500" />
          <span className="text-sm text-gray-700">Premium Insurance</span>
        </div>
        <div className="flex items-center space-x-3 bg-white p-3 rounded-lg">
          <Clock className="h-5 w-5 text-amber-500" />
          <span className="text-sm text-gray-700">Priority Service</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="vip-service"
            checked={isVip}
            onChange={(e) => handleVipToggle(e.target.checked)}
            className="h-4 w-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
          />
          <label htmlFor="vip-service" className="text-gray-900 font-medium">
            Enable VIP Service (+50% premium)
          </label>
        </div>

        {isVip && (
          <div className="mt-4">
            <label htmlFor="special-items" className="block text-sm font-medium text-gray-700 mb-2">
              Describe Special Items (optional)
            </label>
            <textarea
              id="special-items"
              value={localSpecialItems}
              onChange={(e) => handleSpecialItemsChange(e.target.value)}
              placeholder="Describe any fragile, valuable, or special items that need extra care..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              Examples: Piano, artwork, antiques, electronics, etc.
            </p>
          </div>
        )}

        <div className="bg-amber-100 p-3 rounded-lg">
          <p className="text-sm text-amber-800">
            <span className="font-medium">VIP Service includes:</span> Dedicated crew, extra careful handling, 
            premium insurance coverage, and priority scheduling.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VipServiceSelector;
