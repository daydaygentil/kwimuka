
import { Home, Plus, Truck, Settings, Search, HelpCircle, LogOut, LogIn, User } from "lucide-react";
import { UserRole } from "@/pages/Index";

interface MobileBottomNavProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  userRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  isAuthenticated?: boolean;
  onLogout?: () => void;
}

const MobileBottomNav = ({ 
  currentView, 
  setCurrentView, 
  userRole, 
  onRoleChange,
  isAuthenticated = false,
  onLogout
}: MobileBottomNavProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
      <div className="flex justify-around items-center">
        <button
          onClick={() => setCurrentView('home')}
          className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
            currentView === 'home' 
              ? 'text-green-600 bg-green-50' 
              : 'text-gray-500'
          }`}
        >
          <Home className="h-5 w-5 mb-1" />
          <span className="text-xs font-medium">Home</span>
        </button>

        {(!isAuthenticated || userRole === 'customer') && (
          <>
            <button
              onClick={() => setCurrentView('order')}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                currentView === 'order' 
                  ? 'text-green-600 bg-green-50' 
                  : 'text-gray-500'
              }`}
            >
              <Plus className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">Order</span>
            </button>

            <button
              onClick={() => setCurrentView('track')}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                currentView === 'track' 
                  ? 'text-green-600 bg-green-50' 
                  : 'text-gray-500'
              }`}
            >
              <Search className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">Track</span>
            </button>
          </>
        )}

        {isAuthenticated && (userRole === 'driver' || userRole === 'helper' || userRole === 'cleaner') && (
          <button
            onClick={() => setCurrentView('driver')}
            className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
              currentView === 'driver' 
                ? 'text-green-600 bg-green-50' 
                : 'text-gray-500'
            }`}
          >
            <Truck className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">Jobs</span>
          </button>
        )}

        {isAuthenticated && userRole === 'admin' && (
          <button
            onClick={() => setCurrentView('admin')}
            className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
              currentView === 'admin' 
                ? 'text-green-600 bg-green-50' 
                : 'text-gray-500'
            }`}
          >
            <Settings className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">Admin</span>
          </button>
        )}

        <button
          onClick={() => setCurrentView('help')}
          className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
            currentView === 'help' 
              ? 'text-green-600 bg-green-50' 
              : 'text-gray-500'
          }`}
        >
          <HelpCircle className="h-5 w-5 mb-1" />
          <span className="text-xs font-medium">Help</span>
        </button>

        {/* Authentication Button */}
        {isAuthenticated ? (
          <button
            onClick={onLogout}
            className="flex flex-col items-center py-2 px-3 rounded-lg text-red-500"
          >
            <LogOut className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">Logout</span>
          </button>
        ) : (
          <button
            onClick={() => setCurrentView('unified-login')}
            className="flex flex-col items-center py-2 px-3 rounded-lg text-gray-500"
          >
            <LogIn className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">Login</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default MobileBottomNav;
