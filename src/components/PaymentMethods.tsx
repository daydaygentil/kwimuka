
import { useState } from 'react';
import { CreditCard, Smartphone, Banknote, Clock } from 'lucide-react';

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  timing: 'prepay' | 'pay_after';
  description: string;
}

interface PaymentMethodsProps {
  onPaymentMethodChange: (method: string, timing: 'prepay' | 'pay_after') => void;
  selectedMethod?: string;
  selectedTiming?: 'prepay' | 'pay_after';
}

const PaymentMethods = ({ onPaymentMethodChange, selectedMethod, selectedTiming }: PaymentMethodsProps) => {
  const [paymentMethod, setPaymentMethod] = useState(selectedMethod || 'cash');
  const [paymentTiming, setPaymentTiming] = useState(selectedTiming || 'pay_after');

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'cash',
      name: 'Cash',
      icon: <Banknote className="h-5 w-5" />,
      timing: 'pay_after',
      description: 'Pay with cash on completion'
    },
    {
      id: 'mobile_money',
      name: 'Mobile Money',
      icon: <Smartphone className="h-5 w-5" />,
      timing: 'prepay',
      description: 'MTN Mobile Money, Airtel Money'
    },
    {
      id: 'visa',
      name: 'Visa Card',
      icon: <CreditCard className="h-5 w-5" />,
      timing: 'prepay',
      description: 'Secure card payment'
    },
    {
      id: 'mastercard',
      name: 'Mastercard',
      icon: <CreditCard className="h-5 w-5" />,
      timing: 'prepay',
      description: 'Secure card payment'
    }
  ];

  const handleMethodChange = (method: string, timing: 'prepay' | 'pay_after') => {
    setPaymentMethod(method);
    setPaymentTiming(timing);
    onPaymentMethodChange(method, timing);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center space-x-3 mb-6">
        <CreditCard className="h-6 w-6 text-gray-600" />
        <h3 className="text-xl font-semibold text-gray-900">Payment Method</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            onClick={() => handleMethodChange(method.id, method.timing)}
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
              paymentMethod === method.id
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-3 mb-2">
              <div className={`p-2 rounded-lg ${
                paymentMethod === method.id ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
              }`}>
                {method.icon}
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{method.name}</h4>
                <p className="text-sm text-gray-500">{method.description}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 text-xs">
              <Clock className="h-3 w-3 text-gray-400" />
              <span className="text-gray-500">
                {method.timing === 'prepay' ? 'Pay Now' : 'Pay After Service'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {paymentMethod === 'mobile_money' && paymentTiming === 'prepay' && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <span className="font-medium">Mobile Money Payment:</span> You'll receive SMS instructions 
            to complete payment after order confirmation.
          </p>
        </div>
      )}

      {(paymentMethod === 'visa' || paymentMethod === 'mastercard') && paymentTiming === 'prepay' && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <span className="font-medium">Card Payment:</span> Secure payment processing 
            will be initiated after order confirmation.
          </p>
        </div>
      )}
    </div>
  );
};

export default PaymentMethods;
