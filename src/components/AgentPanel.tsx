
import { useState, useEffect } from 'react';
import { Users, DollarSign, TrendingUp, Plus, Phone, Mail, Calendar, MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Agent {
  id: string;
  name: string;
  phone: string;
  email?: string;
  registered_on: string;
  is_active: boolean;
}

interface ServiceProvider {
  id: string;
  name: string;
  phone: string;
  email?: string;
  service_type: string;
  registered_by_agent_id: string;
  is_active: boolean;
  created_at: string;
}

interface Commission {
  id: string;
  agent_id: string;
  order_id: string;
  amount: number;
  status: string;
  commission_rate: number;
  created_at: string;
  orders?: {
    user_name: string;
    pickup_address: string;
    delivery_address: string;
    total_cost: number;
  };
}

const AgentPanel = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [serviceProviders, setServiceProviders] = useState<ServiceProvider[]>([]);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'overview' | 'providers' | 'commissions'>('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [showAddProvider, setShowAddProvider] = useState(false);
  const { toast } = useToast();

  const [newProvider, setNewProvider] = useState({
    name: '',
    phone: '',
    email: '',
    service_type: 'transport'
  });

  useEffect(() => {
    loadAgents();
  }, []);

  useEffect(() => {
    if (selectedAgent) {
      loadServiceProviders(selectedAgent);
      loadCommissions(selectedAgent);
    }
  }, [selectedAgent]);

  const loadAgents = async () => {
    try {
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAgents(data || []);
      
      if (data && data.length > 0 && !selectedAgent) {
        setSelectedAgent(data[0].id);
      }
    } catch (error) {
      console.error('Error loading agents:', error);
      toast({
        title: "Error",
        description: "Failed to load agents",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadServiceProviders = async (agentId: string) => {
    try {
      const { data, error } = await supabase
        .from('service_providers')
        .select('*')
        .eq('registered_by_agent_id', agentId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setServiceProviders(data || []);
    } catch (error) {
      console.error('Error loading service providers:', error);
      toast({
        title: "Error",
        description: "Failed to load service providers",
        variant: "destructive"
      });
    }
  };

  const loadCommissions = async (agentId: string) => {
    try {
      const { data, error } = await supabase
        .from('agent_commissions')
        .select(`
          *,
          orders (
            user_name,
            pickup_address,
            delivery_address,
            total_cost
          )
        `)
        .eq('agent_id', agentId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCommissions(data || []);
    } catch (error) {
      console.error('Error loading commissions:', error);
      toast({
        title: "Error",
        description: "Failed to load commissions",
        variant: "destructive"
      });
    }
  };

  const handleAddProvider = async () => {
    if (!newProvider.name || !newProvider.phone || !selectedAgent) return;

    try {
      const { error } = await supabase
        .from('service_providers')
        .insert([{
          name: newProvider.name,
          phone: newProvider.phone,
          email: newProvider.email || null,
          service_type: newProvider.service_type,
          registered_by_agent_id: selectedAgent
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Service provider added successfully"
      });

      setNewProvider({ name: '', phone: '', email: '', service_type: 'transport' });
      setShowAddProvider(false);
      loadServiceProviders(selectedAgent);
    } catch (error: any) {
      console.error('Error adding service provider:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add service provider",
        variant: "destructive"
      });
    }
  };

  const getServiceTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      transport: 'Transport',
      helpers: 'Helpers',
      cleaning: 'Cleaning',
      keyDelivery: 'Key Delivery',
      carRental: 'Car Rental',
      toolRental: 'Tool Rental',
      movingMaterials: 'Moving Materials'
    };
    return labels[type] || type;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const calculateTotalCommissions = () => {
    return commissions
      .filter(c => c.status === 'paid')
      .reduce((sum, c) => sum + c.amount, 0);
  };

  const calculatePendingCommissions = () => {
    return commissions
      .filter(c => c.status === 'pending')
      .reduce((sum, c) => sum + c.amount, 0);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-gray-500">Loading agent data...</div>
      </div>
    );
  }

  const currentAgent = agents.find(agent => agent.id === selectedAgent);

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Agent Panel</h2>
          <select
            value={selectedAgent}
            onChange={(e) => setSelectedAgent(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          >
            {agents.map(agent => (
              <option key={agent.id} value={agent.id}>
                {agent.name} ({agent.phone})
              </option>
            ))}
          </select>
        </div>
      </div>

      {currentAgent && (
        <>
          {/* Agent Info */}
          <div className="p-6 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3">
                <Users className="h-8 w-8 text-green-600" />
                <div>
                  <p className="font-semibold text-gray-900">{currentAgent.name}</p>
                  <p className="text-sm text-gray-600">Agent</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">{currentAgent.phone}</p>
                  <p className="text-sm text-gray-600">Phone</p>
                </div>
              </div>
              {currentAgent.email && (
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">{currentAgent.email}</p>
                    <p className="text-sm text-gray-600">Email</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Statistics */}
          <div className="p-6 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 text-sm font-medium">Total Earned</p>
                    <p className="text-2xl font-bold text-green-900">
                      {calculateTotalCommissions().toLocaleString()} RWF
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-600 text-sm font-medium">Pending</p>
                    <p className="text-2xl font-bold text-yellow-900">
                      {calculatePendingCommissions().toLocaleString()} RWF
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-yellow-600" />
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 text-sm font-medium">Service Providers</p>
                    <p className="text-2xl font-bold text-blue-900">{serviceProviders.length}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('providers')}
                className={`py-4 border-b-2 font-medium text-sm ${
                  activeTab === 'providers'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Service Providers
              </button>
              <button
                onClick={() => setActiveTab('commissions')}
                className={`py-4 border-b-2 font-medium text-sm ${
                  activeTab === 'commissions'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Commissions
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                      {commissions.slice(0, 5).map(commission => (
                        <div key={commission.id} className="border rounded-lg p-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">Order #{commission.order_id}</p>
                              <p className="text-sm text-gray-600">
                                {commission.orders?.user_name}
                              </p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(commission.status)}`}>
                              {commission.status}
                            </span>
                          </div>
                          <div className="mt-2 flex justify-between items-center">
                            <span className="text-sm text-gray-500">
                              {new Date(commission.created_at).toLocaleDateString()}
                            </span>
                            <span className="font-medium text-green-600">
                              {commission.amount.toLocaleString()} RWF
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Active Service Providers</h3>
                    <div className="space-y-3">
                      {serviceProviders.filter(sp => sp.is_active).slice(0, 5).map(provider => (
                        <div key={provider.id} className="border rounded-lg p-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{provider.name}</p>
                              <p className="text-sm text-gray-600">{provider.phone}</p>
                            </div>
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                              {getServiceTypeLabel(provider.service_type)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'providers' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium text-gray-900">Service Providers</h3>
                  <button
                    onClick={() => setShowAddProvider(true)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Provider</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service Type</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Registered</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {serviceProviders.map(provider => (
                        <tr key={provider.id}>
                          <td className="px-4 py-4 whitespace-nowrap font-medium text-gray-900">
                            {provider.name}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-gray-600">
                            {provider.phone}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                              {getServiceTypeLabel(provider.service_type)}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              provider.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {provider.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-gray-600">
                            {new Date(provider.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'commissions' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-6">Commission History</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Route</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commission</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {commissions.map(commission => (
                        <tr key={commission.id}>
                          <td className="px-4 py-4 whitespace-nowrap font-medium text-gray-900">
                            #{commission.order_id}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-gray-600">
                            {commission.orders?.user_name || 'N/A'}
                          </td>
                          <td className="px-4 py-4 text-gray-600 max-w-xs">
                            <div className="truncate">
                              {commission.orders?.pickup_address} → {commission.orders?.delivery_address}
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap font-medium text-green-600">
                            {commission.amount.toLocaleString()} RWF
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(commission.status)}`}>
                              {commission.status}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-gray-600">
                            {new Date(commission.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Add Provider Modal */}
      {showAddProvider && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add Service Provider</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  value={newProvider.name}
                  onChange={(e) => setNewProvider({ ...newProvider, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="Provider name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                <input
                  type="text"
                  value={newProvider.phone}
                  onChange={(e) => setNewProvider({ ...newProvider, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="+250 788 123 456"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={newProvider.email}
                  onChange={(e) => setNewProvider({ ...newProvider, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Type *</label>
                <select
                  value={newProvider.service_type}
                  onChange={(e) => setNewProvider({ ...newProvider, service_type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="transport">Transport</option>
                  <option value="helpers">Helpers</option>
                  <option value="cleaning">Cleaning</option>
                  <option value="keyDelivery">Key Delivery</option>
                  <option value="carRental">Car Rental</option>
                  <option value="toolRental">Tool Rental</option>
                  <option value="movingMaterials">Moving Materials</option>
                </select>
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleAddProvider}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex-1"
                disabled={!newProvider.name || !newProvider.phone}
              >
                Add Provider
              </button>
              <button
                onClick={() => {
                  setShowAddProvider(false);
                  setNewProvider({ name: '', phone: '', email: '', service_type: 'transport' });
                }}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentPanel;
