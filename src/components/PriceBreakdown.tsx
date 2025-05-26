
import { DollarSign } from "lucide-react";

interface PriceBreakdownProps {
  services: {
    transport: boolean;
    helpers: number;
    cleaning: boolean;
    keyDelivery: boolean;
  };
  distance?: number;
}

const PriceBreakdown = ({ services, distance }: PriceBreakdownProps) => {
  const baseFee = 15000;
  const transportFee = 40000;
  const helperFee = 10000;
  const cleaningFee = 5000;
  const keyDeliveryFee = 5000;

  const calculateTotal = () => {
    let total = baseFee;
    
    if (services.transport) total += transportFee;
    if (services.helpers > 0) total += services.helpers * helperFee;
    if (services.cleaning) total += cleaningFee;
    if (services.keyDelivery) total += keyDeliveryFee;
    
    return total;
  };

  const total = calculateTotal();

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex items-center mb-4">
        <DollarSign className="h-5 w-5 text-green-600 mr-2" />
        <h3 className="font-semibold text-gray-900">Price Breakdown</h3>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Service Fee</span>
          <span className="font-medium">{baseFee.toLocaleString()} RWF</span>
        </div>
        
        {services.transport && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Truck Transport</span>
            <span className="font-medium">{transportFee.toLocaleString()} RWF</span>
          </div>
        )}
        
        {services.helpers > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Moving Helpers ({services.helpers})</span>
            <span className="font-medium">{(services.helpers * helperFee).toLocaleString()} RWF</span>
          </div>
        )}
        
        {services.cleaning && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Cleaning Service</span>
            <span className="font-medium">{cleaningFee.toLocaleString()} RWF</span>
          </div>
        )}
        
        {services.keyDelivery && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Key Delivery</span>
            <span className="font-medium">{keyDeliveryFee.toLocaleString()} RWF</span>
          </div>
        )}

        {distance && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Distance</span>
            <span className="font-medium">{distance} km</span>
          </div>
        )}
      </div>
      
      <div className="border-t mt-4 pt-4">
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-gray-900">Total</span>
          <span className="text-lg font-bold text-green-600">{total.toLocaleString()} RWF</span>
        </div>
      </div>
    </div>
  );
};

export default PriceBreakdown;
