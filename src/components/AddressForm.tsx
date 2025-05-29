
import { Calculator } from "lucide-react";
import HierarchicalAddressSelector from "./HierarchicalAddressSelector";

interface AddressFormProps {
  pickupAddress: string;
  deliveryAddress: string;
  distance: number | null;
  isCalculatingDistance: boolean;
  onPickupAddressSelect: (address: string, locationInfo: any) => void;
  onDeliveryAddressSelect: (address: string, locationInfo: any) => void;
  onCalculateDistance: () => void;
}

const AddressForm = ({
  pickupAddress,
  deliveryAddress,
  distance,
  isCalculatingDistance,
  onPickupAddressSelect,
  onDeliveryAddressSelect,
  onCalculateDistance
}: AddressFormProps) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Pickup & Delivery</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pickup Address *
          </label>
          <div className="relative">
            <HierarchicalAddressSelector
              onAddressSelect={onPickupAddressSelect}
              placeholder="Select pickup location"
              value={pickupAddress}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Delivery Address *
          </label>
          <div className="relative">
            <HierarchicalAddressSelector
              onAddressSelect={onDeliveryAddressSelect}
              placeholder="Select delivery location"
              value={deliveryAddress}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={onCalculateDistance}
          disabled={!pickupAddress || !deliveryAddress || isCalculatingDistance}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
        >
          <Calculator className="h-5 w-5 mr-2" />
          {isCalculatingDistance ? 'Calculating...' : 'Calculate Distance'}
        </button>

        {distance && (
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-blue-800 font-medium">Distance: {distance} km</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressForm;
