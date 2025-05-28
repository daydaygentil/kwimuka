
import { useState, useEffect } from 'react';
import { Users, Plus, Search, Filter, Star, Activity } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Worker {
  id: string;
  name: string;
  phone: string;
  worker_type: 'driver' | 'helper' | 'cleaner';
  is_active: boolean;
  vip_certified: boolean;
  commission_rate: number;
  created_at: string;
}

interface WorkerStats {
  job_count: number;
  total_revenue: number;
  total_commission: number;
  active_jobs: number;
}

interface WorkerManagementProps {
  isAdmin?: boolean;
}

const WorkerManagement = ({ isAdmin = false }: WorkerManagementProps) => {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [workerStats, setWorkerStats] = useState<Record<string, WorkerStats>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [showAddWorker, setShowAddWorker] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const { toast } = useToast();

  const [newWorker, setNewWorker] = useState({
    name: '',
    phone: '',
    worker_type: 'driver' as 'driver' | 'helper' | 'cleaner',
    vip_certified: false,
    commission_rate: 0.15
  });

  const fetchWorkers = async () => {
    try {
      const { data: workersData, error: workersError } = await supabase
        .from('worker_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (workersError) throw workersError;

      const { data: statsData, error: statsError } = await supabase
        .from('worker_stats')
        .select('*, worker_id');

      if (statsError) throw statsError;

      setWorkers(workersData || []);
      
      // Organize stats by worker_id
      const statsMap: Record<string, WorkerStats> = {};
      (statsData || []).forEach(stat => {
        statsMap[stat.worker_id] = {
          job_count: stat.job_count || 0,
          total_revenue: stat.total_revenue || 0,
          total_commission: stat.total_commission || 0,
          active_jobs: stat.active_jobs || 0
        };
      });
      setWorkerStats(statsMap);
    } catch (error) {
      console.error('Error fetching workers:', error);
      toast({
        title: "Error",
        description: "Failed to fetch worker data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addWorker = async () => {
    try {
      // Insert worker profile
      const { data: workerData, error: workerError } = await supabase
        .from('worker_profiles')
        .insert([newWorker])
        .select()
        .single();

      if (workerError) throw workerError;

      // Initialize worker stats
      const { error: statsError } = await supabase
        .from('worker_stats')
        .insert([{
          worker_id: workerData.id,
          job_count: 0,
          total_revenue: 0,
          total_commission: 0,
          active_jobs: 0,
          applications_count: 0
        }]);

      if (statsError) throw statsError;

      toast({
        title: "Success",
        description: "Worker added successfully",
      });

      setNewWorker({
        name: '',
        phone: '',
        worker_type: 'driver',
        vip_certified: false,
        commission_rate: 0.15
      });
      setShowAddWorker(false);
      fetchWorkers();
    } catch (error: any) {
      console.error('Error adding worker:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add worker",
        variant: "destructive",
      });
    }
  };

  const toggleWorkerStatus = async (workerId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('worker_profiles')
        .update({ is_active: !currentStatus })
        .eq('id', workerId);

      if (error) throw error;

      setWorkers(prev => prev.map(worker => 
        worker.id === workerId ? { ...worker, is_active: !currentStatus } : worker
      ));

      toast({
        title: "Success",
        description: `Worker ${!currentStatus ? 'activated' : 'deactivated'} successfully`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update worker status",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  const filteredWorkers = workers.filter(worker => {
    const matchesSearch = worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         worker.phone.includes(searchTerm);
    const matchesFilter = filterType === 'all' || worker.worker_type === filterType;
    return matchesSearch && matchesFilter;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <Users className="h-6 w-6 mr-2" />
          Worker Management
        </h2>
        {isAdmin && (
          <button
            onClick={() => setShowAddWorker(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Worker
          </button>
        )}
      </div>

      {/* Search and Filter */}
      <div className="flex space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search workers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="driver">Drivers</option>
            <option value="helper">Helpers</option>
            <option value="cleaner">Cleaners</option>
          </select>
        </div>
      </div>

      {/* Workers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWorkers.map((worker) => {
          const stats = workerStats[worker.id] || {
            job_count: 0,
            total_revenue: 0,
            total_commission: 0,
            active_jobs: 0
          };

          return (
            <div key={worker.id} className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900 flex items-center">
                    {worker.name}
                    {worker.vip_certified && (
                      <Star className="h-4 w-4 text-yellow-500 ml-2" />
                    )}
                  </h3>
                  <p className="text-sm text-gray-600">{worker.phone}</p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                    worker.worker_type === 'driver' ? 'bg-blue-100 text-blue-800' :
                    worker.worker_type === 'helper' ? 'bg-green-100 text-green-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {worker.worker_type.charAt(0).toUpperCase() + worker.worker_type.slice(1)}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    worker.is_active ? 'bg-green-500' : 'bg-gray-300'
                  }`}></div>
                  {isAdmin && (
                    <button
                      onClick={() => toggleWorkerStatus(worker.id, worker.is_active)}
                      className={`px-3 py-1 rounded text-xs font-medium ${
                        worker.is_active 
                          ? 'bg-red-100 text-red-800 hover:bg-red-200'
                          : 'bg-green-100 text-green-800 hover:bg-green-200'
                      }`}
                    >
                      {worker.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Jobs Completed:</span>
                  <span className="font-medium">{stats.job_count}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Jobs:</span>
                  <span className="font-medium flex items-center">
                    <Activity className="h-3 w-3 mr-1 text-orange-500" />
                    {stats.active_jobs}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Revenue:</span>
                  <span className="font-medium text-green-600">
                    {stats.total_revenue.toLocaleString()} RWF
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Commission Rate:</span>
                  <span className="font-medium">{(worker.commission_rate * 100)}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Worker Modal */}
      {showAddWorker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Add New Worker</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={newWorker.name}
                  onChange={(e) => setNewWorker(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Worker name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={newWorker.phone}
                  onChange={(e) => setNewWorker(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="+250 xxx xxx xxx"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Worker Type</label>
                <select
                  value={newWorker.worker_type}
                  onChange={(e) => setNewWorker(prev => ({ ...prev, worker_type: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="driver">Driver</option>
                  <option value="helper">Helper</option>
                  <option value="cleaner">Cleaner</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Commission Rate (%)</label>
                <input
                  type="number"
                  min="0"
                  max="1"
                  step="0.01"
                  value={newWorker.commission_rate}
                  onChange={(e) => setNewWorker(prev => ({ ...prev, commission_rate: parseFloat(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="0.15"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="vip_certified"
                  checked={newWorker.vip_certified}
                  onChange={(e) => setNewWorker(prev => ({ ...prev, vip_certified: e.target.checked }))}
                  className="mr-2"
                />
                <label htmlFor="vip_certified" className="text-sm text-gray-700">VIP Certified</label>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowAddWorker(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={addWorker}
                disabled={!newWorker.name || !newWorker.phone}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
              >
                Add Worker
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkerManagement;
