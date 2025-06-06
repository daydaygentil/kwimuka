import { useState, useEffect } from "react";
import { ArrowLeft, Calculator, Plus, Minus, Clock, CheckCircle } from "lucide-react";
import { Order } from "@/pages/Index";
import RwandaLocationSelector, { LocationSelection } from "./RwandaLocationSelector";
import ConfirmOrderButton from "./ConfirmOrderButton";
import VipServiceSelector from "./VipServiceSelector";

interface OrderFormProps {
  onOrderSubmit: (order: Order) => void;
  setCurrentView: (view: ViewType) => void;
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
  });

  // Rwanda location states
  const [pickupLocation, setPickupLocation] = useState<LocationSelection>({
    province: '',
    district: '',
    sector: '',
    cell: '',
    village: ''
  });

  const [deliveryLocation, setDeliveryLocation] = useState<LocationSelection>({
    province: '',
    district: '',
    sector: '',
    cell: '',
    village: ''
  });

  const [services, setServices] = useState({
    transport: false,
    helpers: 0,
    cleaning: false,
    keyDelivery: false,
    vip: false,
  });

  const [specialItems, setSpecialItems] = useState("");
  const [distance, setDistance] = useState<number | null>(null);
  const [isCalculatingDistance, setIsCalculatingDistance] = useState(false);
  const [showOrderHistory, setShowOrderHistory] = useState(false);

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

  const getFullAddress = (location: LocationSelection): string => {
    const parts = [location.village, location.cell, location.sector, location.district, location.province].filter(Boolean);
    return parts.join(', ');
  };

  const calculateDistance = async () => {
    const pickupAddress = getFullAddress(pickupLocation);
    const deliveryAddress = getFullAddress(deliveryLocation);
    
    if (!pickupAddress || !deliveryAddress) return;

    setIsCalculatingDistance(true);
    try {
      // Using Google Gemini API to get location coordinates and calculate distance
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyCZ8XQ61lEI0mOm1eQd-6zYkjxGO4R0rQ8`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Calculate the driving distance in kilometers between these two locations in Rwanda:
              From: ${pickupAddress}
              To: ${deliveryAddress}
              
              Please respond with only a number representing the distance in kilometers. If you cannot determine the exact distance, provide a reasonable estimate based on the locations mentioned.`
            }]
          }]
        })
      });

      const data = await response.json();
      const distanceText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      const extractedDistance = parseFloat(distanceText?.match(/\d+(\.\d+)?/)?.[0] || "10");
      
      setDistance(extractedDistance);
    } catch (error) {
      console.error('Error calculating distance:', error);
      // Fallback to a default distance
      setDistance(10);
    } finally {
      setIsCalculatingDistance(false);
    }
  };

  const calculateTotal = () => {
    let baseTotal = 15000; // Service fee
    
    if (services.transport) baseTotal += 40000;
    if (services.helpers > 0) baseTotal += services.helpers * 10000;
    if (services.cleaning) baseTotal += 5000;
    if (services.keyDelivery) baseTotal += 5000;
    
    // Apply VIP premium (50% extra)
    return services.vip ? baseTotal * 1.5 : baseTotal;
  };

  const handleSubmit = async () => {
    const pickupAddress = getFullAddress(pickupLocation);
    const deliveryAddress = getFullAddress(deliveryLocation);
    
    if (!pickupAddress || !deliveryAddress) {
      alert('Please select complete pickup and delivery locations');
      return;
    }
    
    const order: Order = {
      id: Math.random().toString(36).substr(2, 6).toUpperCase(),
      customerName: formData.customerName,
      phoneNumber: formData.phoneNumber,
      pickupAddress,
      deliveryAddress,
      services,
      distance: distance || 0,
      totalCost: calculateTotal(),
      status: 'pending',
      createdAt: new Date(),
      isVip: services.vip,
      specialItemsDescription: services.vip ? specialItems : undefined
    };

    await onOrderSubmit(order);
  };

  const handleVipToggle = (isVip: boolean, items?: string) => {
    setServices(prev => ({ ...prev, vip: isVip }));
    setSpecialItems(items || "");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'assigned': return 'text-blue-600 bg-blue-100';
      case 'in-progress': return 'text-orange-600 bg-orange-100';
      case 'completed': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'assigned': return <Clock className="h-4 w-4" />;
      case 'in-progress': return <Clock className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">          <button
              onClick={() => setCurrentView('home')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600 group-hover:text-green-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-900 ml-4">Place Your Order</h1>
          </div>
          
          {isAuthenticated && userOrders.length > 0 && (
            <button
              onClick={() => setShowOrderHistory(!showOrderHistory)}
              className="text-green-600 hover:text-green-700 text-sm font-medium"
            >
              {showOrderHistory ? 'Hide History' : 'View Order History'}
            </button>
          )}
        </div>

        {/* Order History */}
        {showOrderHistory && isAuthenticated && (
          <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Order History</h2>
            
            {userOrders.length === 0 ? (
              <p className="text-gray-600">No previous orders found.</p>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {userOrders.slice().reverse().map((order) => (
                  <div key={order.id} className="border rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">Order #{order.id}</p>
                        <p className="text-sm text-gray-600">
                          {order.pickupAddress} → {order.deliveryAddress}
                        </p>
                      </div>
                      <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1">{order.status}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">
                        {order.createdAt.toLocaleDateString()}
                      </span>
                      <span className="font-medium text-green-600">
                        {order.totalCost.toLocaleString()} RWF
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <form onSubmit={(e) => { e.preventDefault(); }} className="space-y-6">
          {/* Customer Information */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.customerName}
                  onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter your full name"
                  readOnly={isAuthenticated && !!currentUserName}
                />
                {isAuthenticated && currentUserName && (
                  <p className="text-xs text-green-600 mt-1">Auto-filled from your account</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="+250 7XX XXX XXX"
                  readOnly={isAuthenticated && !!currentUserPhone}
                />
                {isAuthenticated && currentUserPhone && (
                  <p className="text-xs text-green-600 mt-1">Auto-filled from your account</p>
                )}
              </div>
            </div>
          </div>

          {/* Rwanda Location Selection */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Pickup & Delivery Locations</h2>
            
            <div className="space-y-6">
              {/* Pickup Location */}
              <RwandaLocationSelector
                label="Pickup Location"
                value={pickupLocation}
                onChange={setPickupLocation}
                required
              />

              {/* Delivery Location */}
              <RwandaLocationSelector
                label="Delivery Location"
                value={deliveryLocation}
                onChange={setDeliveryLocation}
                required
              />

              <button
                type="button"
                onClick={calculateDistance}
                disabled={!getFullAddress(pickupLocation) || !getFullAddress(deliveryLocation) || isCalculatingDistance}
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

          {/* Services */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Services</h2>
            
            <div className="space-y-4">
              {/* VIP Service Selector */}
              <VipServiceSelector
                onVipToggle={handleVipToggle}
                isVip={services.vip}
                specialItems={specialItems}
              />

              {/* Transport */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">Truck Transport</h3>
                  <p className="text-sm text-gray-600">Professional moving truck</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="font-bold text-green-600">40,000 RWF</span>
                  <input
                    type="checkbox"
                    checked={services.transport}
                    onChange={(e) => setServices(prev => ({ ...prev, transport: e.target.checked }))}
                    className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                </div>
              </div>

              {/* Helpers */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">Moving Helpers</h3>
                  <p className="text-sm text-gray-600">10,000 RWF per person</p>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => setServices(prev => ({ ...prev, helpers: Math.max(0, prev.helpers - 1) }))}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center font-medium">{services.helpers}</span>
                  <button
                    type="button"
                    onClick={() => setServices(prev => ({ ...prev, helpers: Math.min(4, prev.helpers + 1) }))}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Cleaning */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">Cleaning Service</h3>
                  <p className="text-sm text-gray-600">Deep cleaning service</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="font-bold text-green-600">5,000 RWF</span>
                  <input
                    type="checkbox"
                    checked={services.cleaning}
                    onChange={(e) => setServices(prev => ({ ...prev, cleaning: e.target.checked }))}
                    className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                </div>
              </div>

              {/* Key Delivery */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">Key Delivery</h3>
                  <p className="text-sm text-gray-600">Secure key handover</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="font-bold text-green-600">5,000 RWF</span>
                  <input
                    type="checkbox"
                    checked={services.keyDelivery}
                    onChange={(e) => setServices(prev => ({ ...prev, keyDelivery: e.target.checked }))}
                    className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Total Section */}
          <div className="bg-green-50 p-6 rounded-xl">
            <div className="space-y-2">
              {/* Service Items */}
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
              {services.vip && (
                <div className="flex justify-between items-center text-amber-800 mb-2">
                  <span>VIP Service Premium (50%)</span>
                  <span className="font-medium">{(calculateTotal() * 0.5).toLocaleString()} RWF</span>
                </div>
              )}

              {/* Total */}
              <div className="border-t pt-2 mt-2 flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-lg font-bold text-green-600">{calculateTotal().toLocaleString()} RWF</span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <ConfirmOrderButton
            onConfirm={handleSubmit}
            disabled={!formData.customerName || !formData.phoneNumber || !getFullAddress(pickupLocation) || !getFullAddress(deliveryLocation)}
            className="shadow-lg hover:shadow-xl transition-all duration-200 py-4 text-lg"
          />
        </form>
      </div>
    </div>
  );
};

export default OrderForm;
