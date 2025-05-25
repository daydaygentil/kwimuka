
import { Truck, User, Settings, HelpCircle } from "lucide-react";
import { UserRole, ViewType } from "@/pages/Index";

interface NavigationProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  userRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

const Navigation = ({ currentView, setCurrentView, userRole, onRoleChange }: NavigationProps) => {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Truck className="h-8 w-8 text-green-600" />
            <span className="text-xl font-bold text-gray-900">EasyMove</span>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            <button
              onClick={() => setCurrentView('home')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === 'home' 
                  ? 'text-green-600 bg-green-50' 
                  : 'text-gray-700 hover:text-green-600'
              }`}
            >
              Home
            </button>

            {userRole === 'customer' && (
              <>
                <button
                  onClick={() => setCurrentView('order')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentView === 'order' 
                      ? 'text-green-600 bg-green-50' 
                      : 'text-gray-700 hover:text-green-600'
                  }`}
                >
                  Place Order
                </button>
                <button
                  onClick={() => setCurrentView('track')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentView === 'track' 
                      ? 'text-green-600 bg-green-50' 
                      : 'text-gray-700 hover:text-green-600'
                  }`}
                >
                  Track Order
                </button>
              </>
            )}

            <button
              onClick={() => setCurrentView('help')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === 'help' 
                  ? 'text-green-600 bg-green-50' 
                  : 'text-gray-700 hover:text-green-600'
              }`}
            >
              <HelpCircle className="h-4 w-4 inline mr-1" />
              Help
            </button>

            {/* Role Selector */}
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-gray-500" />
              <select
                value={userRole}
                onChange={(e) => onRoleChange(e.target.value as UserRole)}
                className="border-0 bg-transparent text-sm font-medium text-gray-700 focus:ring-0"
              >
                <option value="customer">Customer</option>
                <option value="driver">Driver</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
