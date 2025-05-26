import React, { useState } from 'react';
import { Order, JobApplication } from '@/pages/Index';
import { JobAssignment } from '@/types/worker';
import { Worker, UserAccount } from '@/types/worker';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { FileText, Download, DollarSign, Package, Truck, MapPin, Key, Sparkles, CheckCircle, CreditCard } from 'lucide-react';

interface ReportsPanelProps {
  orders: Order[];
  jobAssignments: JobAssignment[];
  userAccounts: UserAccount[];
  workers: Worker[];
}

const ReportsPanel = ({ orders, jobAssignments, userAccounts, workers }: ReportsPanelProps) => {
  const [activeReport, setActiveReport] = useState<string>('overview');

  const calculateTotalRevenue = () => {
    return orders.reduce((sum, order) => sum + order.totalCost, 0);
  };

  const calculateCompletedOrders = () => {
    return orders.filter(order => order.status === 'completed').length;
  };

  const calculatePendingOrders = () => {
    return orders.filter(order => order.status === 'pending').length;
  };

  const calculateAverageOrderValue = () => {
    if (orders.length === 0) return 0;
    const totalRevenue = calculateTotalRevenue();
    return totalRevenue / orders.length;
  };

  const calculateServiceUsage = () => {
    const transportCount = orders.filter(o => o.services.transport).length;
    const helpersSum = orders.reduce((sum, o) => sum + o.services.helpers, 0);
    const cleaningCount = orders.filter(o => o.services.cleaning).length;
    const keyDeliveryCount = orders.filter(o => o.services.keyDelivery).length;

    return {
      transport: transportCount,
      helpers: helpersSum,
      cleaning: cleaningCount,
      keyDelivery: keyDeliveryCount,
    };
  };

  const calculateOrderStatusCounts = () => {
    const completedCount = orders.filter(o => o.status === 'completed').length;
    const assignedCount = orders.filter(o => o.status === 'assigned').length;
    const inProgressCount = orders.filter(o => o.status === 'in-progress').length;
    const pendingCount = orders.filter(o => o.status === 'pending').length;

    return {
      completed: completedCount,
      assigned: assignedCount,
      inProgress: inProgressCount,
      pending: pendingCount,
    };
  };

  const calculateWorkerPerformance = () => {
    const workerPerformance: { [workerId: string]: number } = {};

    jobAssignments.forEach(assignment => {
      if (assignment.assignedWorker) {
        const workerId = assignment.assignedWorker.id;
        workerPerformance[workerId] = (workerPerformance[workerId] || 0) + 1;
      }
    });

    return workerPerformance;
  };

  const generateServiceReport = () => {
    const serviceStats = {
      transport: orders.filter(o => o.services.transport).length,
      helpers: orders.reduce((sum, o) => sum + o.services.helpers, 0),
      cleaning: orders.filter(o => o.services.cleaning).length,
      keyDelivery: orders.filter(o => o.services.keyDelivery).length,
    };

    return [
      { name: 'Truck Transport', value: serviceStats.transport },
      { name: 'Helpers', value: serviceStats.helpers },
      { name: 'Cleaning', value: serviceStats.cleaning },
      { name: 'Key Delivery', value: serviceStats.keyDelivery },
    ];
  };

  const generateOrderReport = () => {
    return orders.map(order => ({
      id: order.id,
      customer: order.customerName,
      status: order.status,
      total: order.totalCost,
      date: order.createdAt.toLocaleDateString(),
    }));
  };

  const generateDistanceReport = () => {
    return orders
      .filter(order => order.distance)
      .map(order => ({
        id: order.id,
        customer: order.customerName,
        distance: order.distance,
        cost: order.distance ? order.distance * 3000 : 0,
      }));
  };

  const generatePaymentReport = () => {
    const completedOrders = orders.filter(o => o.status === 'completed');
    const pendingOrders = orders.filter(o => o.status !== 'completed');
    
    return [
      { name: 'Paid Orders', value: completedOrders.length, amount: completedOrders.reduce((sum, o) => sum + o.totalCost, 0) },
      { name: 'Pending Payment', value: pendingOrders.length, amount: pendingOrders.reduce((sum, o) => sum + o.totalCost, 0) },
    ];
  };

  const serviceData = generateServiceReport();
  const orderData = generateOrderReport();
  const distanceData = generateDistanceReport();
  const paymentData = generatePaymentReport();

  const COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B'];

  const downloadReport = (reportType: string) => {
    let data = '';
    let filename = '';

    switch (reportType) {
      case 'services':
        data = serviceData.map(item => `${item.name}: ${item.value}`).join('\n');
        filename = 'service-report.txt';
        break;
      case 'orders':
        data = orderData.map(item => `Order ${item.id}: ${item.customer} - ${item.status} - ${item.total} RWF`).join('\n');
        filename = 'order-report.txt';
        break;
      case 'distance':
        data = distanceData.map(item => `Order ${item.id}: ${item.distance}km - ${item.cost} RWF`).join('\n');
        filename = 'distance-report.txt';
        break;
      case 'payment':
        data = paymentData.map(item => `${item.name}: ${item.value} orders - ${item.amount} RWF`).join('\n');
        filename = 'payment-report.txt';
        break;
      default:
        return;
    }

    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const reportItems = [
    { id: 'overview', name: 'Overview', icon: FileText },
    { id: 'services', name: 'Service Report', icon: Package },
    { id: 'orders', name: 'Order Report', icon: FileText },
    { id: 'transport', name: 'Transport Report', icon: Truck },
    { id: 'cleaning', name: 'Cleaning Report', icon: Sparkles },
    { id: 'keydelivery', name: 'Key Delivery Report', icon: Key },
    { id: 'distance', name: 'Distance Report', icon: MapPin },
    { id: 'payment', name: 'Payment Report', icon: CreditCard },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Reports & Analytics</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {reportItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveReport(item.id)}
              className={`p-4 rounded-lg border text-left transition-colors ${
                activeReport === item.id
                  ? 'bg-green-50 border-green-200 text-green-700'
                  : 'bg-white border-gray-200 hover:bg-gray-50'
              }`}
            >
              <Icon className="h-5 w-5 mb-2" />
              <p className="text-sm font-medium">{item.name}</p>
            </button>
          );
        })}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        {activeReport === 'overview' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Business Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900">Total Orders</h4>
                <p className="text-2xl font-bold text-blue-600">{orders.length}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-900">Completed</h4>
                <p className="text-2xl font-bold text-green-600">
                  {orders.filter(o => o.status === 'completed').length}
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-900">Total Revenue</h4>
                <p className="text-2xl font-bold text-purple-600">
                  {orders.reduce((sum, o) => sum + o.totalCost, 0).toLocaleString()} RWF
                </p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-semibold text-orange-900">Active Workers</h4>
                <p className="text-2xl font-bold text-orange-600">{workers.length}</p>
              </div>
            </div>
          </div>
        )}

        {activeReport === 'services' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Service Usage Report</h3>
              <button
                onClick={() => downloadReport('services')}
                className="flex items-center text-green-600 hover:text-green-700"
              >
                <Download className="h-4 w-4 mr-1" />
                Download
              </button>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={serviceData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label
                  >
                    {serviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeReport === 'distance' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Distance & Transport Cost Report</h3>
              <button
                onClick={() => downloadReport('distance')}
                className="flex items-center text-green-600 hover:text-green-700"
              >
                <Download className="h-4 w-4 mr-1" />
                Download
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left">Order ID</th>
                    <th className="px-4 py-2 text-left">Customer</th>
                    <th className="px-4 py-2 text-left">Distance (km)</th>
                    <th className="px-4 py-2 text-left">Transport Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {distanceData.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="px-4 py-2">{item.id}</td>
                      <td className="px-4 py-2">{item.customer}</td>
                      <td className="px-4 py-2">{item.distance}</td>
                      <td className="px-4 py-2">{item.cost.toLocaleString()} RWF</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeReport === 'payment' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Payment Status Report</h3>
              <button
                onClick={() => downloadReport('payment')}
                className="flex items-center text-green-600 hover:text-green-700"
              >
                <Download className="h-4 w-4 mr-1" />
                Download
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paymentData.map((item, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900">{item.name}</h4>
                  <p className="text-lg font-bold text-green-600">{item.value} orders</p>
                  <p className="text-sm text-gray-600">{item.amount.toLocaleString()} RWF</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsPanel;
