
import { CreditCard, Smartphone, Building2, Banknote } from "lucide-react";

interface PaymentMethodsProps {
  selectedMethod: string;
  onMethodSelect: (method: string) => void;
  orderTotal: number;
}

const PaymentMethods = ({ selectedMethod, onMethodSelect, orderTotal }: PaymentMethodsProps) => {
  const paymentMethods = [
    {
      id: 'cash',
      name: 'Cash Payment',
      description: 'Pay with cash on delivery',
      icon: <Banknote className="h-6 w-6" />,
      color: 'bg-green-100 text-green-600'
    },
    {
      id: 'mtn',
      name: 'MTN Mobile Money',
      description: 'Pay with MTN MoMo',
      icon: <Smartphone className="h-6 w-6" />,
      color: 'bg-yellow-100 text-yellow-600'
    },
    {
      id: 'airtel',
      name: 'Airtel Money',
      description: 'Pay with Airtel Money',
      icon: <Smartphone className="h-6 w-6" />,
      color: 'bg-red-100 text-red-600'
    },
    {
      id: 'bank',
      name: 'Bank Transfer',
      description: 'Direct bank transfer',
      icon: <Building2 className="h-6 w-6" />,
      color: 'bg-blue-100 text-blue-600'
    }
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h3 className="font-semibold text-gray-900 mb-4">Payment Method</h3>
      
      <div className="space-y-3 mb-6">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            onClick={() => onMethodSelect(method.id)}
            className={`border rounded-lg p-4 cursor-pointer transition-all ${
              selectedMethod === method.id 
                ? 'border-green-500 bg-green-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className={`p-2 rounded-lg ${method.color}`}>
                {method.icon}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{method.name}</h4>
                <p className="text-sm text-gray-600">{method.description}</p>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  checked={selectedMethod === method.id}
                  onChange={() => onMethodSelect(method.id)}
                  className="h-4 w-4 text-green-600"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between items-center text-lg font-semibold">
          <span>Total Amount:</span>
          <span className="text-green-600">{orderTotal.toLocaleString()} RWF</span>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethods;
