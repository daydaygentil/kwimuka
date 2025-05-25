
import { CheckCircle, Clock, Truck, MapPin } from "lucide-react";
import { OrderStatus } from "@/pages/Index";

interface OrderStatusTrackerProps {
  status: OrderStatus;
  assignedDriver?: string;
  driverPhone?: string;
}

const OrderStatusTracker = ({ status, assignedDriver, driverPhone }: OrderStatusTrackerProps) => {
  const getStatusSteps = () => {
    const steps = [
      { id: 'pending', label: 'Order Placed', icon: Clock },
      { id: 'assigned', label: 'Driver Assigned', icon: Truck },
      { id: 'preparing', label: 'Preparing for Pickup', icon: MapPin },
      { id: 'in-progress', label: 'Moving Service in Progress', icon: Truck },
      { id: 'completed', label: 'Order Successfully Completed', icon: CheckCircle }
    ];

    const statusMap: { [key in OrderStatus]: number } = {
      'pending': 0,
      'assigned': 1,
      'in-progress': 3,
      'completed': 4
    };

    const currentStep = statusMap[status];

    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentStep,
      active: index === currentStep
    }));
  };

  const steps = getStatusSteps();

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h3 className="font-semibold text-gray-900 mb-4">Order Status</h3>
      
      {assignedDriver && (
        <div className="bg-blue-50 p-4 rounded-lg mb-4">
          <h4 className="font-medium text-blue-900 mb-2">Assigned Driver</h4>
          <p className="text-blue-800">{assignedDriver}</p>
          {driverPhone && (
            <p className="text-blue-700 text-sm">Phone: {driverPhone}</p>
          )}
        </div>
      )}

      <div className="space-y-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div key={step.id} className="flex items-center">
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                step.completed 
                  ? 'bg-green-100 text-green-600' 
                  : step.active 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'bg-gray-100 text-gray-400'
              }`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="ml-4 flex-1">
                <p className={`font-medium ${
                  step.completed 
                    ? 'text-green-600' 
                    : step.active 
                    ? 'text-blue-600' 
                    : 'text-gray-400'
                }`}>
                  {step.label}
                </p>
                {step.active && (
                  <p className="text-sm text-gray-600">Current status</p>
                )}
              </div>
              {step.completed && (
                <CheckCircle className="h-5 w-5 text-green-600" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderStatusTracker;
