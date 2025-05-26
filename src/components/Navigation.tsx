
import { Truck, User, Settings, HelpCircle, LogOut, LogIn } from "lucide-react";
import { UserRole, ViewType } from "@/pages/Index";
import SocialShare from "@/components/SocialShare";

interface NavigationProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  userRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  isAuthenticated?: boolean;
  currentUserName?: string;
  onLogout?: () => void;
}

const Navigation = ({ 
  currentView, 
  setCurrentView, 
  userRole, 
  onRoleChange,
  isAuthenticated = false,
  currentUserName,
  onLogout
}: NavigationProps) => {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Truck className="h-8 w-8 text-green-600" />
            <span className="text-xl font-bold text-gray-900">EasyMove</span>
          </div>

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

            {(!isAuthenticated || userRole === 'customer') && (
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

            {isAuthenticated && (userRole === 'driver' || userRole === 'helper' || userRole === 'cleaner') && (
              <button
                onClick={() => setCurrentView('driver')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'driver' 
                    ? 'text-green-600 bg-green-50' 
                    : 'text-gray-700 hover:text-green-600'
                }`}
              >
                My Jobs
              </button>
            )}

            {isAuthenticated && userRole === 'admin' && (
              <button
                onClick={() => setCurrentView('admin')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'admin' 
                    ? 'text-green-600 bg-green-50' 
                    : 'text-gray-700 hover:text-green-600'
                }`}
              >
                Admin Panel
              </button>
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

            <SocialShare />

            <div className="flex items-center space-x-3 border-l pl-3">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">{currentUserName}</span>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                    </span>
                  </div>
                  <button
                    onClick={onLogout}
                    className="flex items-center text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    <LogOut className="h-4 w-4 mr-1" />
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setCurrentView('unified-login')}
                  className="flex items-center text-green-600 hover:text-green-700 text-sm font-medium"
                >
                  <LogIn className="h-4 w-4 mr-1" />
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
