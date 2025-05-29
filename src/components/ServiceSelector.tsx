
import { Plus, Minus } from "lucide-react";

interface Services {
  transport: boolean;
  helpers: number;
  cleaning: boolean;
  keyDelivery: boolean;
}

interface ServiceSelectorProps {
  services: Services;
  onServicesChange: (services: Services) => void;
}

const ServiceSelector = ({ services, onServicesChange }: ServiceSelectorProps) => {
  const updateService = (key: keyof Services, value: boolean | number) => {
    onServicesChange({ ...services, [key]: value });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Services</h2>
      
      <div className="space-y-4">
        {/* Transport */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <h3 className="font-medium text-gray-900">Truck Transport</h3>
            <p className="text-sm text-gray-600">Professional moving truck</p>
          </div>
          <div className="flex items-center space-x-3">
            <span className="font-bold text-green-600">40,000 RWF</span>
            <input
              type="checkbox"
              checked={services.transport}
              onChange={(e) => updateService('transport', e.target.checked)}
              className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
          </div>
        </div>

        {/* Helpers */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <h3 className="font-medium text-gray-900">Moving Helpers</h3>
            <p className="text-sm text-gray-600">10,000 RWF per person</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => updateService('helpers', Math.max(0, services.helpers - 1))}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-8 text-center font-medium">{services.helpers}</span>
            <button
              type="button"
              onClick={() => updateService('helpers', Math.min(4, services.helpers + 1))}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Cleaning */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <h3 className="font-medium text-gray-900">Cleaning Service</h3>
            <p className="text-sm text-gray-600">Deep cleaning service</p>
          </div>
          <div className="flex items-center space-x-3">
            <span className="font-bold text-green-600">5,000 RWF</span>
            <input
              type="checkbox"
              checked={services.cleaning}
              onChange={(e) => updateService('cleaning', e.target.checked)}
              className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
          </div>
        </div>

        {/* Key Delivery */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <h3 className="font-medium text-gray-900">Key Delivery</h3>
            <p className="text-sm text-gray-600">Secure key handover</p>
          </div>
          <div className="flex items-center space-x-3">
            <span className="font-bold text-green-600">5,000 RWF</span>
            <input
              type="checkbox"
              checked={services.keyDelivery}
              onChange={(e) => updateService('keyDelivery', e.target.checked)}
              className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceSelector;
export type { Services };
