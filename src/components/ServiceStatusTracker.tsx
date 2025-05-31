
import { CheckCircle, Clock, User, AlertCircle, Star } from 'lucide-react';
import { JobAssignment } from '@/types/worker';

interface ServiceStatusTrackerProps {
  jobAssignments: JobAssignment[];
  orderId: string;
  isVip?: boolean; // Add VIP flag
}

const ServiceStatusTracker = ({ jobAssignments, orderId, isVip = false }: ServiceStatusTrackerProps) => {
  const orderAssignments = jobAssignments.filter(job => job.orderId === orderId);

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
      case 'assigned': return <User className="h-4 w-4" />;
      case 'in-progress': return <AlertCircle className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getServiceName = (serviceType: string) => {
    switch (serviceType) {
      case 'transport': return 'Truck Transport';
      case 'helpers': return 'Moving Helpers';
      case 'cleaning': return 'Cleaning Service';
      case 'keyDelivery': return 'Key Delivery';
      default: return serviceType;
    }
  };

  if (orderAssignments.length === 0) {
    return null;
  }

  return (    <div className={`bg-white p-6 rounded-xl ${isVip ? 'border-2 border-amber-400' : 'shadow-sm'}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Service Status</h3>
        {isVip && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
            <Star className="h-3 w-3 mr-1" />
            VIP Priority
          </span>
        )}
      </div>
      
      <div className="space-y-3">
        {orderAssignments.map((assignment) => (
          <div key={assignment.id} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900">
                {getServiceName(assignment.serviceType)}
              </h4>
              <div className={`flex items-center px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(assignment.status)}`}>
                {getStatusIcon(assignment.status)}
                <span className="ml-1 capitalize">{assignment.status}</span>
              </div>
            </div>            {assignment.assignedWorker && (
              <div className={`text-sm ${isVip ? 'bg-amber-50 rounded-lg p-3' : ''}`}>
                <div className="flex items-center gap-2 mb-2">
                  <User className={`h-4 w-4 ${isVip ? 'text-amber-500' : 'text-gray-400'}`} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${isVip ? 'text-amber-800' : 'text-gray-900'}`}>
                        {assignment.assignedWorker.name}
                      </span>
                      {isVip && assignment.assignedWorker.vipCertified && (
                        <span className="px-1.5 py-0.5 text-xs bg-amber-200 text-amber-800 rounded-full">
                          VIP Certified
                        </span>
                      )}
                      {isVip && assignment.assignedWorker.rating && (
                        <span className="flex items-center text-xs text-amber-600">
                          <Star className="h-3 w-3 mr-0.5 fill-amber-400" />
                          {assignment.assignedWorker.rating.toFixed(1)}
                        </span>
                      )}
                    </div>
                    {isVip && assignment.assignedWorker.totalCompletedJobs && (
                      <p className="text-xs text-amber-600 mt-0.5">
                        {assignment.assignedWorker.totalCompletedJobs}+ completed moves
                      </p>
                    )}
                  </div>
                </div>
                <p className={`flex items-center ${isVip ? 'text-amber-700' : 'text-gray-600'}`}>
                  <span className="font-medium mr-1">Contact:</span> {assignment.assignedWorker.phone}
                </p>
              </div>
            )}

            {assignment.status === 'pending' && (
              <div className="text-sm text-yellow-600 mt-2">
                Searching for available worker...
              </div>
            )}

            {assignment.acceptedAt && (
              <div className="text-sm text-gray-500 mt-2">
                Accepted: {assignment.acceptedAt.toLocaleTimeString()}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceStatusTracker;
