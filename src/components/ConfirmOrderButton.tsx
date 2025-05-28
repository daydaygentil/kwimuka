
import { useState } from 'react';
import { CheckCircle, Loader2 } from 'lucide-react';

interface ConfirmOrderButtonProps {
  onConfirm: () => Promise<void>;
  disabled?: boolean;
  className?: string;
}

const ConfirmOrderButton = ({ onConfirm, disabled = false, className = '' }: ConfirmOrderButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    if (isLoading || disabled) return;
    
    setIsLoading(true);
    try {
      await onConfirm();
    } catch (error) {
      console.error('Error confirming order:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleConfirm}
        disabled={isLoading || disabled}
        className={`
          w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 
          text-white font-semibold py-3 px-6 rounded-lg transition-colors 
          flex items-center justify-center
          ${className}
        `}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            Confirming Order...
          </>
        ) : (
          <>
            <CheckCircle className="h-5 w-5 mr-2" />
            Confirm Order
          </>
        )}
      </button>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-green-600" />
            <p className="text-lg font-semibold text-gray-900 mb-2">Processing Your Order</p>
            <p className="text-gray-600">Please wait while we confirm your booking...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfirmOrderButton;
