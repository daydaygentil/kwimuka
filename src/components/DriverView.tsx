
import { MapPin, Clock, DollarSign, CheckCircle, Printer, LogOut } from "lucide-react";
import { Order, OrderStatus, UserRole } from "@/pages/Index";
import MapView from "./MapView";

interface DriverViewProps {
  orders: Order[];
  driverId: string;
  userName?: string;
  userRole?: UserRole;
  onUpdateOrder: (orderId: string, status: OrderStatus) => void;
  onLogout?: () => void;
}

const DriverView = ({ 
  orders, 
  driverId, 
  userName,
  userRole = 'driver',
  onUpdateOrder,
  onLogout
}: DriverViewProps) => {
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

  const getRoleTitle = () => {
    switch (userRole) {
      case 'driver': return 'Driver Dashboard';
      case 'helper': return 'Helper Dashboard';
      case 'cleaner': return 'Cleaner Dashboard';
      default: return 'My Jobs';
    }
  };

  const printDriverReport = () => {
    const completedOrders = orders.filter(order => order.status === 'completed');
    const totalEarnings = completedOrders.reduce((sum, order) => sum + order.totalCost, 0);
    
    const reportContent = `
      ${getRoleTitle()} - ${userName || driverId}
      Generated: ${new Date().toLocaleDateString()}
      
      Summary:
      - Total Jobs: ${orders.length}
      - Completed Jobs: ${completedOrders.length}
      - Total Earnings: ${totalEarnings.toLocaleString()} RWF
      
      Job Details:
      ${orders.map(order => `
      Order #${order.id}
      Customer: ${order.customerName}
      From: ${order.pickupAddress}
      To: ${order.deliveryAddress}
      Status: ${order.status}
      Amount: ${order.totalCost.toLocaleString()} RWF
      Date: ${order.createdAt.toLocaleDateString()}
      ---
      `).join('')}
    `;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`<pre>${reportContent}</pre>`);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-2 md:px-4 py-4 md:py-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">{getRoleTitle()}</h1>
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="flex items-center text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Logout
                </button>
              )}
            </div>
            <p className="text-gray-600 text-sm md:text-base">
              {userName && `Welcome ${userName} - `}
              Manage your assigned {userRole === 'driver' ? 'moving jobs' : `${userRole} tasks`}
            </p>
          </div>
          {orders.length > 0 && (
            <button
              onClick={printDriverReport}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center text-sm"
            >
              <Printer className="h-4 w-4 mr-2" />
              Print Report
            </button>
          )}
        </div>

        {orders.length === 0 ? (
          <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm text-center">
            <div className="mb-4">
              <Clock className="h-12 w-12 text-gray-400 mx-auto" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">No Jobs Assigned</h2>
            <p className="text-gray-600">
              You don't have any {userRole === 'driver' ? 'jobs' : 'tasks'} assigned yet. Check back later!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 md:p-6">
                  <div className="flex flex-col md:flex-row justify-between items-start mb-4 space-y-2 md:space-y-0">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Order #{order.id}</h3>
                      <p className="text-gray-600">{order.customerName}</p>
                    </div>
                    <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                      <span className="text-lg font-bold text-green-600">
                        {order.totalCost.toLocaleString()} RWF
                      </span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <MapView 
                      order={order}
                      onDistanceCalculated={(distance) => {
                        console.log(`Distance calculated for order ${order.id}: ${distance} km`);
                      }}
                    />
                  </div>

                  <div className="flex flex-wrap gap-4 mb-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">Phone: {order.phoneNumber}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverView;
