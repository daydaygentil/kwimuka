import { useState } from "react";
import { Order, OrderStatus, JobApplication } from "@/pages/Index";
import { Search, Filter, DollarSign, Users, Truck, FileText, Printer } from "lucide-react";

interface AdminPanelProps {
  orders: Order[];
  jobApplications: JobApplication[];
  onUpdateOrder: (orderId: string, updates: Partial<Order>) => void;
  onUpdateJobApplication: (applicationId: string, status: 'pending' | 'approved' | 'rejected') => void;
  availableDrivers: { id: string; name: string; phone: string }[];
  onLogout: () => void;
}

const AdminPanel = ({ 
  orders, 
  jobApplications, 
  onUpdateOrder, 
  onUpdateJobApplication, 
  availableDrivers, 
  onLogout 
}: AdminPanelProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [activeTab, setActiveTab] = useState<'orders' | 'applications'>('orders');

  const drivers = availableDrivers.map(driver => driver.name);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = orders.reduce((sum, order) => sum + order.totalCost, 0);
  const commission = orders.length * 15000; // 15,000 RWF per order
  const completedOrders = orders.filter(order => order.status === 'completed').length;

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'assigned': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getApplicationStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const printReport = () => {
    const reportContent = `
      EasyMove Admin Report
      Generated: ${new Date().toLocaleDateString()}
      
      Summary:
      - Total Orders: ${orders.length}
      - Completed Orders: ${completedOrders}
      - Total Revenue: ${totalRevenue.toLocaleString()} RWF
      - Total Commission: ${commission.toLocaleString()} RWF
      - Pending Applications: ${jobApplications.filter(app => app.status === 'pending').length}
      
      Orders:
      ${orders.map(order => `
      Order #${order.id} - ${order.customerName}
      Status: ${order.status}
      Total: ${order.totalCost.toLocaleString()} RWF
      Date: ${order.createdAt.toLocaleDateString()}
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
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Manage orders, drivers, and track performance</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={printReport}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
            >
              <Printer className="h-4 w-4 mr-2" />
              Print Report
            </button>
            <button
              onClick={onLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Truck className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{totalRevenue.toLocaleString()} RWF</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Commission</p>
                <p className="text-2xl font-bold text-gray-900">{commission.toLocaleString()} RWF</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center">
              <div className="bg-orange-100 p-3 rounded-lg">
                <FileText className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Applications</p>
                <p className="text-2xl font-bold text-gray-900">{jobApplications.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('orders')}
                className={`py-4 border-b-2 font-medium text-sm ${
                  activeTab === 'orders'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Orders ({orders.length})
              </button>
              <button
                onClick={() => setActiveTab('applications')}
                className={`py-4 border-b-2 font-medium text-sm ${
                  activeTab === 'applications'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Job Applications ({jobApplications.length})
              </button>
            </nav>
          </div>

          {activeTab === 'orders' && (
            <div className="p-6">
              {/* Filters */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by order ID or customer name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div className="md:w-48">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="assigned">Assigned</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              {/* Orders Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Services</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">#{order.id}</div>
                            <div className="text-sm text-gray-500">{order.createdAt.toLocaleDateString()}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                            <div className="text-sm text-gray-500">{order.phoneNumber}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {order.services.transport && (
                              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">Transport</span>
                            )}
                            {order.services.helpers > 0 && (
                              <span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded">
                                {order.services.helpers} Helper(s)
                              </span>
                            )}
                            {order.services.cleaning && (
                              <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">Cleaning</span>
                            )}
                            {order.services.keyDelivery && (
                              <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">Key Delivery</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{order.totalCost.toLocaleString()} RWF</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={order.status}
                            onChange={(e) => onUpdateOrder(order.id, { status: e.target.value as OrderStatus })}
                            className={`px-3 py-1 rounded-full text-sm font-medium border-0 ${getStatusColor(order.status)}`}
                          >
                            <option value="pending">Pending</option>
                            <option value="assigned">Assigned</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={order.assignedDriver || ''}
                            onChange={(e) => {
                              const selectedDriver = availableDrivers.find(d => d.name === e.target.value);
                              onUpdateOrder(order.id, { 
                                assignedDriver: selectedDriver?.id || e.target.value,
                                assignedDriverName: selectedDriver?.name || e.target.value,
                                assignedDriverPhone: selectedDriver?.phone,
                                status: e.target.value ? 'assigned' : 'pending'
                              });
                            }}
                            className="text-sm border border-gray-300 rounded px-2 py-1"
                          >
                            <option value="">Unassigned</option>
                            {drivers.map(driver => (
                              <option key={driver} value={driver}>{driver}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'applications' && (
            <div className="p-6">
              {jobApplications.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">No job applications yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {jobApplications.map((application) => (
                        <tr key={application.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{application.name}</div>
                              <div className="text-sm text-gray-500">{application.phone}</div>
                              <div className="text-sm text-gray-500">{application.submittedAt.toLocaleDateString()}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded capitalize">
                              {application.jobRole}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-600 max-w-xs truncate">
                              {application.message || 'No message provided'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getApplicationStatusColor(application.status)}`}>
                              {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {application.status === 'pending' && (
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => onUpdateJobApplication(application.id, 'approved')}
                                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => onUpdateJobApplication(application.id, 'rejected')}
                                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                                >
                                  Reject
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
