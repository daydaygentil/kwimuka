
import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Order } from "@/types";
import CustomerInfoForm from "./CustomerInfoForm";
import AddressForm from "./AddressForm";
import ServiceSelector, { Services } from "./ServiceSelector";
import OrderSummary from "./OrderSummary";
import OrderHistory from "./OrderHistory";
import { useDistanceCalculator } from "@/hooks/useDistanceCalculator";

interface OrderFormProps {
  onOrderSubmit: (order: Order) => void;
  onBack: () => void;
  isAuthenticated?: boolean;
  currentUserName?: string;
  currentUserPhone?: string;
  userOrders?: Order[];
}

const OrderForm = ({ 
  onOrderSubmit, 
  onBack, 
  isAuthenticated = false, 
  currentUserName = "", 
  currentUserPhone = "",
  userOrders = []
}: OrderFormProps) => {
  const [formData, setFormData] = useState({
    customerName: "",
    phoneNumber: "",
    pickupAddress: "",
    deliveryAddress: "",
  });

  const [locationData, setLocationData] = useState({
    pickup: {},
    delivery: {}
  });

  const [services, setServices] = useState<Services>({
    transport: false,
    helpers: 0,
    cleaning: false,
    keyDelivery: false,
  });

  const [showOrderHistory, setShowOrderHistory] = useState(false);

  const { distance, isCalculatingDistance, calculateDistance } = useDistanceCalculator();

  // Auto-fill user data when logged in
  useEffect(() => {
    if (isAuthenticated && currentUserName && currentUserPhone) {
      setFormData(prev => ({
        ...prev,
        customerName: currentUserName,
        phoneNumber: currentUserPhone
      }));
    }
  }, [isAuthenticated, currentUserName, currentUserPhone]);

  const handleCalculateDistance = () => {
    calculateDistance(formData.pickupAddress, formData.deliveryAddress);
  };

  const calculateTotal = () => {
    let total = 15000; // Service fee
    
    if (services.transport) total += 40000;
    if (services.helpers > 0) total += services.helpers * 10000;
    if (services.cleaning) total += 5000;
    if (services.keyDelivery) total += 5000;
    
    return total;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const order: Order = {
      id: Math.random().toString(36).substr(2, 6).toUpperCase(),
      ...formData,
      services,
      distance: distance || 0,
      totalCost: calculateTotal(),
      status: 'pending',
      createdAt: new Date(),
      locationData: locationData
    };

    onOrderSubmit(order);
  };

  const handlePickupAddressSelect = (address: string, locationInfo: any) => {
    setFormData(prev => ({ ...prev, pickupAddress: address }));
    setLocationData(prev => ({ ...prev, pickup: locationInfo }));
  };

  const handleDeliveryAddressSelect = (address: string, locationInfo: any) => {
    setFormData(prev => ({ ...prev, deliveryAddress: address }));
    setLocationData(prev => ({ ...prev, delivery: locationInfo }));
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-900 ml-4">Place Your Order</h1>
          </div>
          
          {isAuthenticated && (
            <OrderHistory 
              orders={userOrders}
              isVisible={showOrderHistory}
              onToggle={() => setShowOrderHistory(!showOrderHistory)}
            />
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Information */}
          <CustomerInfoForm
            customerName={formData.customerName}
            phoneNumber={formData.phoneNumber}
            onCustomerNameChange={(name) => setFormData(prev => ({ ...prev, customerName: name }))}
            onPhoneNumberChange={(phone) => setFormData(prev => ({ ...prev, phoneNumber: phone }))}
            isAuthenticated={isAuthenticated}
            isReadOnly={isAuthenticated && !!(currentUserName && currentUserPhone)}
          />

          {/* Addresses */}
          <AddressForm
            pickupAddress={formData.pickupAddress}
            deliveryAddress={formData.deliveryAddress}
            distance={distance}
            isCalculatingDistance={isCalculatingDistance}
            onPickupAddressSelect={handlePickupAddressSelect}
            onDeliveryAddressSelect={handleDeliveryAddressSelect}
            onCalculateDistance={handleCalculateDistance}
          />

          {/* Services */}
          <ServiceSelector
            services={services}
            onServicesChange={setServices}
          />

          {/* Total */}
          <OrderSummary services={services} />

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white text-lg font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Confirm Order
          </button>
        </form>
      </div>
    </div>
  );
};

export default OrderForm;
