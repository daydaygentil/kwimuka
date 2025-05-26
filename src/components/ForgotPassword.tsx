
import { useState } from "react";
import { ArrowLeft, Phone, Mail, Lock } from "lucide-react";

interface ForgotPasswordProps {
  onBack: () => void;
  onResetSuccess: () => void;
}

const ForgotPassword = ({ onBack, onResetSuccess }: ForgotPasswordProps) => {
  const [resetMethod, setResetMethod] = useState<'phone' | 'email'>('phone');
  const [contact, setContact] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState<'contact' | 'verify' | 'reset'>('contact');
  const [loading, setLoading] = useState(false);

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setStep('verify');
      setLoading(false);
    }, 1000);
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setStep('reset');
      setLoading(false);
    }, 1000);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onResetSuccess();
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="max-w-md mx-auto">
        <button
          onClick={onBack}
          className="flex items-center text-green-600 hover:text-green-700 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Login
        </button>

        <div className="bg-white p-8 rounded-xl shadow-sm">
          <div className="text-center mb-6">
            <div className="bg-orange-100 p-3 rounded-full w-fit mx-auto mb-4">
              <Lock className="h-8 w-8 text-orange-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Reset Password</h1>
            <p className="text-gray-600">
              {step === 'contact' && 'Enter your contact information'}
              {step === 'verify' && 'Enter verification code'}
              {step === 'reset' && 'Create new password'}
            </p>
          </div>

          {step === 'contact' && (
            <form onSubmit={handleSendCode} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Reset Method
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="phone"
                      checked={resetMethod === 'phone'}
                      onChange={(e) => setResetMethod(e.target.value as 'phone')}
                      className="mr-2"
                    />
                    Phone Number
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="email"
                      checked={resetMethod === 'email'}
                      onChange={(e) => setResetMethod(e.target.value as 'email')}
                      className="mr-2"
                    />
                    Email
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {resetMethod === 'phone' ? 'Phone Number' : 'Email Address'}
                </label>
                <div className="relative">
                  {resetMethod === 'phone' ? (
                    <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  ) : (
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  )}
                  <input
                    type={resetMethod === 'phone' ? 'tel' : 'email'}
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder={resetMethod === 'phone' ? '+250 788 123 456' : 'your@email.com'}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-medium py-3 rounded-lg transition-colors"
              >
                {loading ? "Sending..." : "Send Verification Code"}
              </button>
            </form>
          )}

          {step === 'verify' && (
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Verification Code
                </label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-center text-lg tracking-widest"
                  maxLength={6}
                  required
                />
                <p className="text-sm text-gray-600 mt-2">
                  Code sent to {resetMethod === 'phone' ? contact : contact}
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-medium py-3 rounded-lg transition-colors"
              >
                {loading ? "Verifying..." : "Verify Code"}
              </button>
            </form>
          )}

          {step === 'reset' && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-medium py-3 rounded-lg transition-colors"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
