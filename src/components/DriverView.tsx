
import { MapPin, Clock, DollarSign, CheckCircle } from "lucide-react";
import { Order, OrderStatus } from "@/pages/Index";

interface DriverViewProps {
  orders: Order[];
  onUpdateOrder: (orderId: string, status: OrderStatus) => void;
}

const DriverView = ({ orders, onUpdateOrder }: DriverViewProps) => {
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'assigned': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getNextStatus = (currentStatus: OrderStatus): OrderStatus => {
    switch (currentStatus) {
      case 'assigned': return 'in-progress';
      case 'in-progress': return 'completed';
      default: return currentStatus;
    }
  };

  const getActionButtonText = (status: OrderStatus) => {
    switch (status) {
      case 'assigned': return 'Start Job';
      case 'in-progress': return 'Mark Complete';
      default: return 'No Action';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Jobs</h1>
          <p className="text-gray-600">Manage your assigned moving jobs</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow-sm text-center">
            <div className="mb-4">
              <Clock className="h-12 w-12 text-gray-400 mx-auto" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">No Jobs Assigned</h2>
            <p className="text-gray-600">You don't have any jobs assigned yet. Check back later!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Order #{order.id}</h3>
                    <p className="text-gray-600">{order.customerName}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                    <span className="text-lg font-bold text-green-600">
                      {order.totalCost.toLocaleString()} RWF
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="flex items-start space-x-2 mb-2">
                      <MapPin className="h-4 w-4 text-green-600 mt-1" />
                      <div>
                        <p className="text-sm text-gray-600">Pickup</p>
                        <p className="font-medium">{order.pickupAddress}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-start space-x-2 mb-2">
                      <MapPin className="h-4 w-4 text-red-600 mt-1" />
                      <div>
                        <p className="text-sm text-gray-600">Delivery</p>
                        <p className="font-medium">{order.deliveryAddress}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Phone: {order.phoneNumber}</span>
                  </div>
                  {order.distance && (
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Distance: {order.distance} km</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {order.createdAt.toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Services Required:</h4>
                  <div className="flex flex-wrap gap-2">
                    {order.services.transport && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                        Truck Transport
                      </span>
                    )}
                    {order.services.helpers > 0 && (
                      <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-sm">
                        {order.services.helpers} Helper(s)
                      </span>
                    )}
                    {order.services.cleaning && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-sm">
                        Cleaning
                      </span>
                    )}
                    {order.services.keyDelivery && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                        Key Delivery
                      </span>
                    )}
                  </div>
                </div>

                {(order.status === 'assigned' || order.status === 'in-progress') && (
                  <button
                    onClick={() => onUpdateOrder(order.id, getNextStatus(order.status))}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {getActionButtonText(order.status)}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverView;
