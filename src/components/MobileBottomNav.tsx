
import { Home, Plus, Truck, Settings } from "lucide-react";
import { UserRole } from "@/pages/Index";

interface MobileBottomNavProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  userRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

const MobileBottomNav = ({ currentView, setCurrentView, userRole, onRoleChange }: MobileBottomNavProps) => {
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

        {userRole === 'customer' && (
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
        )}

        {userRole === 'driver' && (
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

        {userRole === 'admin' && (
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

        {/* Role Switcher */}
        <button
          onClick={() => {
            const roles: UserRole[] = ['customer', 'driver', 'admin'];
            const currentIndex = roles.indexOf(userRole);
            const nextRole = roles[(currentIndex + 1) % roles.length];
            onRoleChange(nextRole);
          }}
          className="flex flex-col items-center py-2 px-3 rounded-lg text-gray-500"
        >
          <div className="h-5 w-5 mb-1 rounded-full bg-gray-300 flex items-center justify-center">
            <span className="text-xs font-bold text-white">
              {userRole === 'customer' ? 'C' : userRole === 'driver' ? 'D' : 'A'}
            </span>
          </div>
          <span className="text-xs font-medium">Role</span>
        </button>
      </div>
    </div>
  );
};

export default MobileBottomNav;
