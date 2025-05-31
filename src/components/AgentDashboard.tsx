import { useState } from "react";
import { ViewType } from "@/pages/Index";
import {
  Wallet,
  ArrowDownToLine,
  UserCircle,
  PhoneCall,
  DollarSign,
  Ban,
  CheckCircle,
  Clock,
  LogOut,
  Star,  
  Search
} from "lucide-react";
import type { AgentCommission, WithdrawalRequest, AgentProfile } from "../types/agent";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

interface AgentDashboardProps {
  currentAgent: AgentProfile;
  commissions: AgentCommission[];
  withdrawals: WithdrawalRequest[];
  onRequestWithdrawal: (amount: number, phoneNumber: string) => Promise<void>;
  setCurrentView: (view: ViewType) => void;
}

const AgentDashboard = ({
  currentAgent,
  commissions,
  withdrawals,
  onRequestWithdrawal,
  setCurrentView
}: AgentDashboardProps) => {
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(currentAgent.phone);
  const [withdrawalError, setWithdrawalError] = useState("");
  const [commissionFilter, setCommissionFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Calculate total available balance from approved commissions
  const availableBalance = commissions
    .filter(commission => commission.status === 'approved')
    .reduce((total, commission) => total + commission.amount, 0);

  // Calculate performance metrics
  const performanceMetrics = {
    totalCommissions: commissions.length,
    approvedCommissions: commissions.filter(c => c.status === 'approved').length,
    totalEarnings: commissions.reduce((sum, c) => sum + (c.status === 'approved' ? c.amount : 0), 0),
    successRate: Math.round((commissions.filter(c => c.status === 'approved').length / commissions.length) * 100) || 0,
    serviceTypes: {
      truck_transport: commissions.filter(c => c.serviceType === 'truck_transport').length,
      moving_helpers: commissions.filter(c => c.serviceType === 'moving_helpers').length,
      cleaning: commissions.filter(c => c.serviceType === 'cleaning').length,
      key_delivery: commissions.filter(c => c.serviceType === 'key_delivery').length,
    }
  };

  // Handler for withdrawal request
  const handleWithdrawalRequest = async () => {
    setWithdrawalError("");
    
    const amount = parseFloat(withdrawalAmount);
    if (isNaN(amount) || amount <= 0) {
      setWithdrawalError("Please enter a valid amount");
      return;
    }

    if (amount > availableBalance) {
      setWithdrawalError("Amount exceeds available balance");
      return;
    }

    if (!phoneNumber || !/^[0-9]{10}$/.test(phoneNumber)) {
      setWithdrawalError("Please enter a valid phone number");
      return;
    }

    try {
      await onRequestWithdrawal(amount, phoneNumber);
      setWithdrawalAmount("");
    } catch (error) {
      setWithdrawalError("Failed to process withdrawal request");
    }
  };

  // Get status color for commission and withdrawal status badges
  const getStatusColor = (status: string) => {
    const colors = {
      approved: "text-green-600 bg-green-50",
      rejected: "text-red-600 bg-red-50",
      pending: "text-yellow-600 bg-yellow-50",
      processing: "text-blue-600 bg-blue-50",
      paid: "text-green-600 bg-green-50",
      failed: "text-red-600 bg-red-50"
    };
    return colors[status as keyof typeof colors] || "text-gray-600 bg-gray-50";
  };

  // Get status icon for commission and withdrawal status badges
  const getStatusIcon = (status: string) => {
    const icons = {
      approved: CheckCircle,
      rejected: Ban,
      pending: Clock,
      processing: Clock,
      paid: CheckCircle,
      failed: Ban
    };
    const Icon = icons[status as keyof typeof icons];
    return Icon ? <Icon className="h-4 w-4" /> : null;
  };

  // Filter commissions based on status and search term
  const filteredCommissions = commissions.filter(commission => {
    const matchesFilter = commissionFilter === "all" || commission.status === commissionFilter;
    const matchesSearch = searchTerm === "" || 
      commission.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      commission.serviceType.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Agent Dashboard</h1>
            <p className="text-gray-600">Welcome back, {currentAgent.name}</p>
          </div>          <button
            onClick={() => setCurrentView('unified-login')}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </button>
        </div>

        {/* Agent Profile & Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Balance Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <Wallet className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Available Balance</p>
                <p className="text-2xl font-bold text-gray-900">
                  {availableBalance.toLocaleString()} RWF
                </p>
              </div>
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <button className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center">
                  <ArrowDownToLine className="h-4 w-4 mr-2" />
                  Request Withdrawal
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Request Withdrawal</DialogTitle>
                  <DialogDescription>
                    Enter the amount you want to withdraw and confirm your mobile money number.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Amount (RWF)
                    </label>
                    <input
                      type="number"
                      value={withdrawalAmount}
                      onChange={(e) => setWithdrawalAmount(e.target.value)}
                      placeholder="Enter amount"
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="Enter phone number"
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  {withdrawalError && (
                    <p className="text-red-600 text-sm">{withdrawalError}</p>
                  )}
                  <button
                    onClick={handleWithdrawalRequest}
                    className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Confirm Withdrawal
                  </button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Performance Stats */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Star className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {performanceMetrics.successRate}%
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Commissions:</span>
                <span className="font-semibold">{performanceMetrics.totalCommissions}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Approved:</span>
                <span className="font-semibold">{performanceMetrics.approvedCommissions}</span>
              </div>
            </div>
          </div>

          {/* Total Earnings */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold text-gray-900">
                  {performanceMetrics.totalEarnings.toLocaleString()} RWF
                </p>
              </div>
            </div>
          </div>

          {/* Agent Profile */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center mb-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <UserCircle className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Agent Status</p>
                <p className="text-2xl font-bold text-gray-900 capitalize">
                  {currentAgent.status}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Commission Rate:</span>
                <span className="font-semibold">{currentAgent.commission_rate}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Registered:</span>
                <span className="font-semibold">{new Date(currentAgent.registered_on).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Commission History */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Commission History</h2>
            
            {/* Filters and Search */}
            <div className="mt-4 flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by order ID or service type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div className="md:w-48">
                <select
                  value={commissionFilter}
                  onChange={(e) => setCommissionFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  {currentAgent.status === 'approved' && (
                    <TableHead>Approval Date</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCommissions.map((commission) => (
                  <TableRow key={commission.id} className="hover:bg-gray-50">
                    <TableCell>
                      {new Date(commission.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="capitalize">
                      {commission.serviceType.replace('_', ' ')}
                    </TableCell>
                    <TableCell className="font-mono">{commission.orderId}</TableCell>
                    <TableCell>{commission.amount.toLocaleString()} RWF</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(commission.status)}`}>
                        {getStatusIcon(commission.status)}
                        <span className="ml-1 capitalize">{commission.status}</span>
                      </span>
                    </TableCell>
                    {currentAgent.status === 'approved' && (
                      <TableCell>
                        {commission.approvedAt ? new Date(commission.approvedAt).toLocaleDateString() : '-'}
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Service Type Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          {/* Transport Services */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-sm font-medium text-gray-600 mb-4">Transport Services</h3>
            <p className="text-2xl font-bold text-gray-900">{performanceMetrics.serviceTypes.truck_transport}</p>
          </div>
          
          {/* Moving Helpers */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-sm font-medium text-gray-600 mb-4">Moving Helpers</h3>
            <p className="text-2xl font-bold text-gray-900">{performanceMetrics.serviceTypes.moving_helpers}</p>
          </div>
          
          {/* Cleaning Services */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-sm font-medium text-gray-600 mb-4">Cleaning Services</h3>
            <p className="text-2xl font-bold text-gray-900">{performanceMetrics.serviceTypes.cleaning}</p>
          </div>
          
          {/* Key Delivery */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-sm font-medium text-gray-600 mb-4">Key Delivery</h3>
            <p className="text-2xl font-bold text-gray-900">{performanceMetrics.serviceTypes.key_delivery}</p>
          </div>
        </div>

        {/* Support Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Support Contact</h2>
          <div className="flex items-start space-x-4">
            <div className="bg-orange-100 p-3 rounded-lg">
              <PhoneCall className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Need assistance?</p>
              <p className="text-gray-600 mb-2">Contact our support team for any questions or concerns</p>
              <a href="tel:+250780000000" className="text-blue-600 hover:text-blue-700 font-medium">
                +250 780 000 000
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;