import { useState } from "react";
import { ArrowLeft, Printer, Search, CheckCircle, Star } from "lucide-react";
import { Order } from "@/pages/Index";
import OrderStatusTracker from "@/components/OrderStatusTracker";

interface OrderReceiptProps {
  order: Order;
  setCurrentView: (view: ViewType) => void;
}

const OrderReceipt = ({ order, onBack, onTrackOrder }: OrderReceiptProps) => {
  const [trackingCode, setTrackingCode] = useState("");

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">            <button
              onClick={() => setCurrentView('home')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600 group-hover:text-green-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-900 ml-4">Order Confirmed</h1>
          </div>
          
          <button
            onClick={handlePrint}
            className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Printer className="h-4 w-4 mr-2" />
            Print
          </button>
        </div>

        {/* Success Message */}
        <div className="bg-green-50 border border-green-200 p-6 rounded-xl mb-6">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <h2 className="text-lg font-semibold text-green-800">Order Placed Successfully!</h2>
              <p className="text-green-700">
                {order.assignedDriverName 
                  ? `Driver ${order.assignedDriverName} has been assigned to your order.`
                  : "We'll contact you shortly to confirm details."
                }
              </p>
            </div>
          </div>
        </div>

        {/* Order Status Tracker */}
        <div className="mb-6">
          <OrderStatusTracker 
            status={order.status}
            assignedDriver={order.assignedDriverName}
            driverPhone={order.assignedDriverPhone}
          />
        </div>

        {/* Receipt */}
        <div className="bg-white p-6 rounded-xl shadow-sm print:shadow-none mb-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">EasyMove</h2>
            <p className="text-gray-600">Moving Services Receipt</p>
          </div>

          {/* Order ID */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Order ID</p>
              <p className="text-2xl font-bold text-green-600">{order.id}</p>
            </div>
          </div>

          {/* Customer Details */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Customer Information</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium">{order.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phone:</span>
                <span className="font-medium">{order.phoneNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">{formatDate(order.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Addresses */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Pickup & Delivery</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">From:</p>
                <p className="font-medium">{order.pickupAddress}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">To:</p>
                <p className="font-medium">{order.deliveryAddress}</p>
              </div>
              {order.distance && (
                <div>
                  <p className="text-sm text-gray-600">Distance:</p>
                  <p className="font-medium">{order.distance} km</p>
                </div>
              )}
            </div>
          </div>

          {/* Services */}
          <div className="mb-6">            <h3 className="font-semibold text-gray-900 mb-3">Services</h3>
            {order.isVip && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Star className="h-4 w-4 text-amber-500" />
                  <span className="font-medium text-amber-800">VIP Moving Service</span>
                </div>
                {order.specialItemsDescription && (
                  <div className="text-sm text-amber-700 mb-2">
                    <span className="font-medium">Special Items:</span> {order.specialItemsDescription}
                  </div>
                )}
                <div className="text-xs text-amber-600">
                  Includes premium handling, priority service, and full insurance coverage
                </div>
              </div>
            )}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Service Fee</span>
                <span className="font-medium">15,000 RWF</span>
              </div>
              
              {order.services.transport && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Truck Transport</span>
                  <span className="font-medium">40,000 RWF</span>
                </div>
              )}
              
              {order.services.helpers > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Moving Helpers ({order.services.helpers})</span>
                  <span className="font-medium">{order.services.helpers * 10000} RWF</span>
                </div>
              )}
              
              {order.services.cleaning && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Cleaning Service</span>
                  <span className="font-medium">5,000 RWF</span>
                </div>
              )}
              
              {order.services.keyDelivery && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Key Delivery</span>
                  <span className="font-medium">5,000 RWF</span>
                </div>
              )}
            </div>
          </div>

          {/* Total */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold text-gray-900">Total Amount</span>
              <span className="text-xl font-bold text-green-600">{order.totalCost.toLocaleString()} RWF</span>
            </div>
          </div>
        </div>

        {/* Order Tracking */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Track Your Order</h3>
          <div className="flex space-x-3">
            <input
              type="text"
              value={trackingCode}
              onChange={(e) => setTrackingCode(e.target.value)}
              placeholder="Enter order code"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />            <button
              onClick={() => setCurrentView('track')}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center"
            >
              <Search className="h-4 w-4 mr-2" />
              Track Order
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Use order code <strong>{order.id}</strong> to track this order
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderReceipt;
