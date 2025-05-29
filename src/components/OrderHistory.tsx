
import { Order } from "@/types";
import { Clock, CheckCircle } from "lucide-react";

interface OrderHistoryProps {
  orders: Order[];
  isVisible: boolean;
  onToggle: () => void;
}

const OrderHistory = ({ orders, isVisible, onToggle }: OrderHistoryProps) => {
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
    <>
      {orders.length > 0 && (
        <button
          onClick={onToggle}
          className="text-green-600 hover:text-green-700 text-sm font-medium"
        >
          {isVisible ? 'Hide History' : 'View Order History'}
        </button>
      )}

      {isVisible && (
        <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Order History</h2>
          
          {orders.length === 0 ? (
            <p className="text-gray-600">No previous orders found.</p>
          ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {orders.slice().reverse().map((order) => (
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
    </>
  );
};

export default OrderHistory;
