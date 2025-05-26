
import { useState } from "react";
import { Lock, User, ArrowLeft, Shield } from "lucide-react";

interface UnifiedLoginProps {
  onLogin: (success: boolean, userRole: string, userId?: string, userName?: string) => void;
  onBack: () => void;
  onRegister?: () => void;
  onForgotPassword?: () => void;
  userAccounts: any[];
}

const UnifiedLogin = ({ onLogin, onBack, onRegister, onForgotPassword, userAccounts }: UnifiedLoginProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    setTimeout(() => {
      // Check against userAccounts for real users
      const user = userAccounts.find(u => 
        u.phone === username && u.password === password
      );
      
      if (user) {
        onLogin(true, user.role, user.id, user.name);
      } else {
        setError("Invalid username or password");
      }
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
          Back to Home
        </button>

        <div className="bg-white p-8 rounded-xl shadow-sm">
          <div className="text-center mb-6">
            <div className="bg-green-100 p-3 rounded-full w-fit mx-auto mb-4">
              <Shield className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Login to EasyMove</h1>
            <p className="text-gray-600">Access your dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter phone number"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-medium py-3 rounded-lg transition-colors"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="mt-6 space-y-4">
            {onForgotPassword && (
              <div className="text-center">
                <button
                  onClick={onForgotPassword}
                  className="text-green-600 hover:text-green-700 font-medium text-sm"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            {onRegister && (
              <div className="text-center">
                <p className="text-gray-600">
                  Don't have an account?{" "}
                  <button
                    onClick={onRegister}
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    Create Account
                  </button>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedLogin;
