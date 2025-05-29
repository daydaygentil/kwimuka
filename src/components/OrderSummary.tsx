
import { Services } from "./ServiceSelector";

interface OrderSummaryProps {
  services: Services;
}

const OrderSummary = ({ services }: OrderSummaryProps) => {
  const calculateTotal = () => {
    let total = 15000; // Service fee
    
    if (services.transport) total += 40000;
    if (services.helpers > 0) total += services.helpers * 10000;
    if (services.cleaning) total += 5000;
    if (services.keyDelivery) total += 5000;
    
    return total;
  };

  return (
    <div className="bg-green-50 p-6 rounded-xl">
      <div className="flex justify-between items-center mb-2">
        <span className="text-gray-600">Service Fee</span>
        <span className="font-medium">15,000 RWF</span>
      </div>
      {services.transport && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">Truck Transport</span>
          <span className="font-medium">40,000 RWF</span>
        </div>
      )}
      {services.helpers > 0 && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">Helpers ({services.helpers})</span>
          <span className="font-medium">{services.helpers * 10000} RWF</span>
        </div>
      )}
      {services.cleaning && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">Cleaning</span>
          <span className="font-medium">5,000 RWF</span>
        </div>
      )}
      {services.keyDelivery && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">Key Delivery</span>
          <span className="font-medium">5,000 RWF</span>
        </div>
      )}
      <div className="border-t pt-2 mt-2">
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-gray-900">Total</span>
          <span className="text-lg font-bold text-green-600">{calculateTotal().toLocaleString()} RWF</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
