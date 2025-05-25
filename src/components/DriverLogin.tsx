
import { useState } from "react";
import { Lock, User, ArrowLeft, Truck } from "lucide-react";

interface DriverLoginProps {
  onLogin: (success: boolean, driverId?: string) => void;
  onBack: () => void;
}

const DriverLogin = ({ onLogin, onBack }: DriverLoginProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Mock drivers database
  const drivers = [
    { id: "driver1", username: "john", password: "john123", name: "John Doe" },
    { id: "driver2", username: "jane", password: "jane123", name: "Jane Smith" },
    { id: "driver3", username: "mike", password: "mike123", name: "Mike Johnson" }
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    setTimeout(() => {
      const driver = drivers.find(d => d.username === username && d.password === password);
      
      if (driver) {
        onLogin(true, driver.id);
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
            <div className="bg-blue-100 p-3 rounded-full w-fit mx-auto mb-4">
              <Truck className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Driver Login</h1>
            <p className="text-gray-600">Access your driving dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
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
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-medium py-3 rounded-lg transition-colors"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 text-center mb-2">
              <strong>Demo Driver Accounts:</strong>
            </p>
            <div className="space-y-1 text-xs text-gray-600">
              <p>john / john123 (John Doe)</p>
              <p>jane / jane123 (Jane Smith)</p>
              <p>mike / mike123 (Mike Johnson)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverLogin;
