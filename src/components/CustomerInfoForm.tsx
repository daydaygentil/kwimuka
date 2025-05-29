
interface CustomerInfoFormProps {
  customerName: string;
  phoneNumber: string;
  onCustomerNameChange: (name: string) => void;
  onPhoneNumberChange: (phone: string) => void;
  isAuthenticated: boolean;
  isReadOnly: boolean;
}

const CustomerInfoForm = ({
  customerName,
  phoneNumber,
  onCustomerNameChange,
  onPhoneNumberChange,
  isAuthenticated,
  isReadOnly
}: CustomerInfoFormProps) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            required
            value={customerName}
            onChange={(e) => onCustomerNameChange(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Enter your full name"
            readOnly={isReadOnly}
          />
          {isAuthenticated && isReadOnly && (
            <p className="text-xs text-green-600 mt-1">Auto-filled from your account</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            required
            value={phoneNumber}
            onChange={(e) => onPhoneNumberChange(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="+250 7XX XXX XXX"
            readOnly={isReadOnly}
          />
          {isAuthenticated && isReadOnly && (
            <p className="text-xs text-green-600 mt-1">Auto-filled from your account</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerInfoForm;
