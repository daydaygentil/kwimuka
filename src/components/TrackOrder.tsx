import { useState } from "react";
import { Search, MapPin, Calendar, DollarSign, ArrowLeft, Package } from "lucide-react";
import { Order } from "@/pages/Index";
import ServiceStatusTracker from '@/components/ServiceStatusTracker';
import { JobAssignment } from '@/types/worker';

interface TrackOrderProps {
  orders: Order[];
  jobAssignments: JobAssignment[];
  onBack: () => void;
}

const TrackOrder = ({ orders, jobAssignments, onBack }: TrackOrderProps) => {
  const [orderId, setOrderId] = useState("");
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [foundOrder, setFoundOrder] = useState<Order | null>(null);
  const [searchAttempted, setSearchAttempted] = useState(false);

  const handleSearch = () => {
    const order = orders.find(o => o.id === orderId.trim());
    if (order) {
      setSearchedOrder(order);
      setNotFound(false);
      setFoundOrder(order);
      setSearchAttempted(true);
    } else {
      setSearchedOrder(null);
      setNotFound(true);
      setFoundOrder(null);
      setSearchAttempted(true);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'assigned': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={onBack}
            className="flex items-center text-green-600 hover:text-green-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Home
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Track Your Order</h1>
          <p className="text-gray-600">Enter your Order ID to check status</p>
        </div>

        {/* Search Form */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Enter Order ID (e.g., 123456)"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <button
              onClick={handleSearch}
              disabled={!orderId.trim()}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
            >
              <Search className="h-4 w-4 mr-2" />
              Search
            </button>
          </div>
        </div>

        {/* Search Results */}
        {notFound && (
          <div className="bg-red-50 border border-red-200 p-6 rounded-xl text-center">
            <Package className="h-12 w-12 text-red-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-red-800 mb-2">Order Not Found</h3>
            <p className="text-red-600">Please check your Order ID and try again.</p>
          </div>
        )}

        {foundOrder ? (
          <div className="space-y-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Order #{foundOrder.id}</h3>
                <p className="text-gray-600">{foundOrder.customerName}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(foundOrder.status)}`}>
                {foundOrder.status.charAt(0).toUpperCase() + foundOrder.status.slice(1)}
              </span>
            </div>

            <div className="space-y-4">
              {/* Addresses */}
              <div>
                <div className="flex items-start space-x-2 mb-3">
                  <MapPin className="h-4 w-4 text-green-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Pickup Address</p>
                    <p className="font-medium">{foundOrder.pickupAddress}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <MapPin className="h-4 w-4 text-red-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Delivery Address</p>
                    <p className="font-medium">{foundOrder.deliveryAddress}</p>
                  </div>
                </div>
              </div>

              {/* Order Details */}
              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-3">Order Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Order Date</p>
                      <p className="font-medium">{foundOrder.createdAt.toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Total Cost</p>
                      <p className="font-medium">{foundOrder.totalCost.toLocaleString()} RWF</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Services */}
              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-3">Services</h4>
                <div className="flex flex-wrap gap-2">
                  {foundOrder.services.transport && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                      Truck Transport
                    </span>
                  )}
                  {foundOrder.services.helpers > 0 && (
                    <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-sm">
                      {foundOrder.services.helpers} Helper(s)
                    </span>
                  )}
                  {foundOrder.services.cleaning && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-sm">
                      Cleaning
                    </span>
                  )}
                  {foundOrder.services.keyDelivery && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                      Key Delivery
                    </span>
                  )}
                </div>
              </div>

              {/* Assigned Driver */}
              {foundOrder.assignedDriver && (
                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-900 mb-2">Assigned Driver</h4>
                  <p className="text-gray-600">{foundOrder.assignedDriver}</p>
                </div>
              )}
            </div>

            <ServiceStatusTracker 
              jobAssignments={jobAssignments}
              orderId={foundOrder.id}
            />
          </div>
        ) : searchAttempted && (
          <div className="bg-red-50 border border-red-200 p-6 rounded-xl text-center">
            <Package className="h-12 w-12 text-red-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-red-800 mb-2">Order Not Found</h3>
            <p className="text-red-600">Please check your Order ID and try again.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrder;
