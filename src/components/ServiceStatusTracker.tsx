
import { CheckCircle, Clock, User, AlertCircle } from 'lucide-react';
import { JobAssignment } from '@/types/worker';

interface ServiceStatusTrackerProps {
  jobAssignments: JobAssignment[];
  orderId: string;
}

const ServiceStatusTracker = ({ jobAssignments, orderId }: ServiceStatusTrackerProps) => {
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

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h3 className="font-semibold text-gray-900 mb-4">Service Status</h3>
      
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
            </div>

            {assignment.assignedWorker && (
              <div className="text-sm text-gray-600">
                <p><span className="font-medium">Worker:</span> {assignment.assignedWorker.name}</p>
                <p><span className="font-medium">Phone:</span> {assignment.assignedWorker.phone}</p>
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
