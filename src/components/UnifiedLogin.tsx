import { useState } from "react";
import { Lock, User, ArrowLeft, Shield } from "lucide-react";

interface UnifiedLoginProps {
  onLogin: (success: boolean, userRole: string, userId?: string, userName?: string) => void;
  onBack: () => void;
  onRegister?: () => void;
  onForgotPassword?: () => void;
}

const UnifiedLogin = ({ onLogin, onBack, onRegister, onForgotPassword }: UnifiedLoginProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("customer");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Mock user database with different roles
  const users = [
    // Admin users
    { id: "admin1", username: "admin", password: "admin123", role: "admin", name: "Admin User" },
    
    // Driver users
    { id: "driver1", username: "john", password: "john123", role: "driver", name: "John Doe" },
    { id: "driver2", username: "jane", password: "jane123", role: "driver", name: "Jane Smith" },
    { id: "driver3", username: "mike", password: "mike123", role: "driver", name: "Mike Johnson" },
    
    // Helper users
    { id: "helper1", username: "helper1", password: "helper123", role: "helper", name: "Helper One" },
    { id: "helper2", username: "helper2", password: "helper123", role: "helper", name: "Helper Two" },
    
    // Cleaner users
    { id: "cleaner1", username: "cleaner1", password: "cleaner123", role: "cleaner", name: "Cleaner One" },
    { id: "cleaner2", username: "cleaner2", password: "cleaner123", role: "cleaner", name: "Cleaner Two" },
    
    // Customer users
    { id: "customer1", username: "customer", password: "customer123", role: "customer", name: "Customer User" }
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    setTimeout(() => {
      const user = users.find(u => 
        u.username === username && 
        u.password === password && 
        u.role === selectedRole
      );
      
      if (user) {
        onLogin(true, user.role, user.id, user.name);
      } else {
        setError("Invalid username, password, or role selection");
      }
      setLoading(false);
    }, 1000);
  };

  const getRoleIcon = () => {
    switch (selectedRole) {
      case "admin": return <Shield className="h-8 w-8 text-green-600" />;
      case "driver": return <User className="h-8 w-8 text-blue-600" />;
      case "helper": return <User className="h-8 w-8 text-orange-600" />;
      case "cleaner": return <User className="h-8 w-8 text-purple-600" />;
      default: return <User className="h-8 w-8 text-gray-600" />;
    }
  };

  const getRoleColor = () => {
    switch (selectedRole) {
      case "admin": return "bg-green-100";
      case "driver": return "bg-blue-100";
      case "helper": return "bg-orange-100";
      case "cleaner": return "bg-purple-100";
      default: return "bg-gray-100";
    }
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
            <div className={`${getRoleColor()} p-3 rounded-full w-fit mx-auto mb-4`}>
              {getRoleIcon()}
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Login to EasyMove</h1>
            <p className="text-gray-600">Access your dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Role
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="customer">Customer</option>
                <option value="driver">Driver</option>
                <option value="helper">Moving Helper</option>
                <option value="cleaner">Cleaner</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
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

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 text-center mb-2">
              <strong>Demo Accounts:</strong>
            </p>
            <div className="space-y-1 text-xs text-gray-600">
              <p><strong>Admin:</strong> admin / admin123</p>
              <p><strong>Driver:</strong> john / john123</p>
              <p><strong>Helper:</strong> helper1 / helper123</p>
              <p><strong>Cleaner:</strong> cleaner1 / cleaner123</p>
              <p><strong>Customer:</strong> customer / customer123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedLogin;
