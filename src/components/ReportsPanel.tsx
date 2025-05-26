
import { useState } from "react";
import { 
  FileText, 
  TrendingUp, 
  Package, 
  MapPin, 
  DollarSign, 
  CheckCircle,
  CreditCard,
  Truck,
  Users,
  Sparkles,
  Key
} from "lucide-react";
import { Order, JobApplication } from "@/pages/Index";
import { JobAssignment } from "@/types/worker";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ReportsPanelProps {
  orders: Order[];
  jobApplications: JobApplication[];
  jobAssignments: JobAssignment[];
}

const ReportsPanel = ({ orders, jobApplications, jobAssignments }: ReportsPanelProps) => {
  const [activeReport, setActiveReport] = useState<string>('overview');

  const reports = [
    { id: 'overview', name: 'Overview', icon: FileText },
    { id: 'service', name: 'Service Report', icon: Package },
    { id: 'orders', name: 'Order Report', icon: TrendingUp },
    { id: 'keyDelivery', name: 'Key Delivery', icon: Key },
    { id: 'cleaning', name: 'Cleaning Report', icon: Sparkles },
    { id: 'transport', name: 'Transport Report', icon: Truck },
    { id: 'pricing', name: 'Price Report', icon: DollarSign },
    { id: 'distance', name: 'Distance Report', icon: MapPin },
    { id: 'confirmation', name: 'Confirmation Report', icon: CheckCircle },
    { id: 'payment', name: 'Payment Report', icon: CreditCard },
  ];

  const getServiceStats = () => {
    const stats = {
      transport: orders.filter(o => o.services.transport).length,
      helpers: orders.reduce((sum, o) => sum + o.services.helpers, 0),
      cleaning: orders.filter(o => o.services.cleaning).length,
      keyDelivery: orders.filter(o => o.services.keyDelivery).length,
    };
    return stats;
  };

  const getOrdersByStatus = () => {
    return {
      pending: orders.filter(o => o.status === 'pending').length,
      assigned: orders.filter(o => o.status === 'assigned').length,
      inProgress: orders.filter(o => o.status === 'in-progress').length,
      completed: orders.filter(o => o.status === 'completed').length,
    };
  };

  const getTotalRevenue = () => {
    return orders.reduce((sum, order) => sum + order.totalCost, 0);
  };

  const getRevenueByService = () => {
    let transportRevenue = 0;
    let helpersRevenue = 0;
    let cleaningRevenue = 0;
    let keyDeliveryRevenue = 0;
    let serviceFeeRevenue = 0;

    orders.forEach(order => {
      serviceFeeRevenue += 15000; // Base service fee
      if (order.services.transport) transportRevenue += 40000;
      if (order.services.helpers > 0) helpersRevenue += order.services.helpers * 10000;
      if (order.services.cleaning) cleaningRevenue += 5000;
      if (order.services.keyDelivery) keyDeliveryRevenue += 5000;
    });

    return {
      serviceFee: serviceFeeRevenue,
      transport: transportRevenue,
      helpers: helpersRevenue,
      cleaning: cleaningRevenue,
      keyDelivery: keyDeliveryRevenue,
    };
  };

  const getAverageDistance = () => {
    const ordersWithDistance = orders.filter(o => o.distance && o.distance > 0);
    if (ordersWithDistance.length === 0) return 0;
    return ordersWithDistance.reduce((sum, o) => sum + (o.distance || 0), 0) / ordersWithDistance.length;
  };

  const renderOverviewReport = () => {
    const serviceStats = getServiceStats();
    const orderStats = getOrdersByStatus();
    const revenue = getTotalRevenue();

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Total Orders</p>
                <p className="text-2xl font-bold text-blue-900">{orders.length}</p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Completed</p>
                <p className="text-2xl font-bold text-green-900">{orderStats.completed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 text-sm font-medium">In Progress</p>
                <p className="text-2xl font-bold text-orange-900">{orderStats.inProgress}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Total Revenue</p>
                <p className="text-2xl font-bold text-purple-900">{revenue.toLocaleString()} RWF</p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-4">Service Usage</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Transport Service</span>
                <span className="font-semibold">{serviceStats.transport}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Helpers</span>
                <span className="font-semibold">{serviceStats.helpers}</span>
              </div>
              <div className="flex justify-between">
                <span>Cleaning Service</span>
                <span className="font-semibold">{serviceStats.cleaning}</span>
              </div>
              <div className="flex justify-between">
                <span>Key Delivery</span>
                <span className="font-semibold">{serviceStats.keyDelivery}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-4">Order Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-yellow-600">Pending</span>
                <span className="font-semibold">{orderStats.pending}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-600">Assigned</span>
                <span className="font-semibold">{orderStats.assigned}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-orange-600">In Progress</span>
                <span className="font-semibold">{orderStats.inProgress}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-600">Completed</span>
                <span className="font-semibold">{orderStats.completed}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderOrdersTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order ID</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Services</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell className="font-mono">{order.id}</TableCell>
            <TableCell>{order.customerName}</TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {order.services.transport && <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Transport</span>}
                {order.services.helpers > 0 && <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">{order.services.helpers} Helpers</span>}
                {order.services.cleaning && <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">Cleaning</span>}
                {order.services.keyDelivery && <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Key Delivery</span>}
              </div>
            </TableCell>
            <TableCell>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                order.status === 'completed' ? 'bg-green-100 text-green-800' :
                order.status === 'in-progress' ? 'bg-orange-100 text-orange-800' :
                order.status === 'assigned' ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {order.status}
              </span>
            </TableCell>
            <TableCell className="font-semibold">{order.totalCost.toLocaleString()} RWF</TableCell>
            <TableCell>{order.createdAt.toLocaleDateString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const renderPricingReport = () => {
    const revenue = getRevenueByService();
    const total = Object.values(revenue).reduce((sum, val) => sum + val, 0);

    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Revenue Breakdown</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span>Service Fees (15,000 RWF × {orders.length})</span>
              <span className="font-semibold">{revenue.serviceFee.toLocaleString()} RWF</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Transport Service (40,000 RWF each)</span>
              <span className="font-semibold">{revenue.transport.toLocaleString()} RWF</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Moving Helpers (10,000 RWF each)</span>
              <span className="font-semibold">{revenue.helpers.toLocaleString()} RWF</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Cleaning Service (5,000 RWF each)</span>
              <span className="font-semibold">{revenue.cleaning.toLocaleString()} RWF</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Key Delivery (5,000 RWF each)</span>
              <span className="font-semibold">{revenue.keyDelivery.toLocaleString()} RWF</span>
            </div>
            <div className="border-t pt-3 mt-3">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total Revenue</span>
                <span className="text-green-600">{total.toLocaleString()} RWF</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderDistanceReport = () => {
    const avgDistance = getAverageDistance();
    const ordersWithDistance = orders.filter(o => o.distance && o.distance > 0);

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Average Distance</p>
                <p className="text-2xl font-bold text-blue-900">{avgDistance.toFixed(1)} km</p>
              </div>
              <MapPin className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Orders with Distance</p>
                <p className="text-2xl font-bold text-green-900">{ordersWithDistance.length}</p>
              </div>
              <Package className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Total Distance</p>
                <p className="text-2xl font-bold text-purple-900">{ordersWithDistance.reduce((sum, o) => sum + (o.distance || 0), 0).toFixed(1)} km</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>From</TableHead>
              <TableHead>To</TableHead>
              <TableHead>Distance</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ordersWithDistance.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-mono">{order.id}</TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell className="max-w-xs truncate">{order.pickupAddress}</TableCell>
                <TableCell className="max-w-xs truncate">{order.deliveryAddress}</TableCell>
                <TableCell className="font-semibold">{order.distance} km</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    order.status === 'completed' ? 'bg-green-100 text-green-800' :
                    order.status === 'in-progress' ? 'bg-orange-100 text-orange-800' :
                    order.status === 'assigned' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeReport) {
      case 'overview':
        return renderOverviewReport();
      case 'orders':
        return renderOrdersTable();
      case 'pricing':
        return renderPricingReport();
      case 'distance':
        return renderDistanceReport();
      case 'service':
        return (
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-4">All Services Provided</h3>
            {renderOrdersTable()}
          </div>
        );
      case 'keyDelivery':
        const keyDeliveryOrders = orders.filter(o => o.services.keyDelivery);
        return (
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-4">Key Delivery Orders ({keyDeliveryOrders.length})</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Delivery Address</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {keyDeliveryOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono">{order.id}</TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell>{order.phoneNumber}</TableCell>
                    <TableCell className="max-w-xs truncate">{order.deliveryAddress}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        order.status === 'completed' ? 'bg-green-100 text-green-800' :
                        order.status === 'in-progress' ? 'bg-orange-100 text-orange-800' :
                        order.status === 'assigned' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status}
                      </span>
                    </TableCell>
                    <TableCell>{order.createdAt.toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        );
      default:
        return renderOverviewReport();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {reports.map((report) => {
          const Icon = report.icon;
          return (
            <button
              key={report.id}
              onClick={() => setActiveReport(report.id)}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeReport === report.id
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border'
              }`}
            >
              <Icon className="h-4 w-4 mr-2" />
              {report.name}
            </button>
          );
        })}
      </div>

      {renderContent()}
    </div>
  );
};

export default ReportsPanel;
