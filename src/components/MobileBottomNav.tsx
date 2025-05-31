import { Home, Plus, Truck, Settings, Search, HelpCircle, LogOut, LogIn, User } from "lucide-react";
import { UserRole, ViewType } from "@/pages/Index";

interface MobileBottomNavProps {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
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
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
      <div className="flex justify-around items-center">
        <NavButton
          view="home"
          currentView={currentView}
          onClick={() => setCurrentView('home')}
          icon={<Home className="h-5 w-5 mb-1" />}
          label="Home"
        />

        {(!isAuthenticated || userRole === 'customer') && (
          <>
            <NavButton
              view="order"
              currentView={currentView}
              onClick={() => setCurrentView('order')}
              icon={<Plus className="h-5 w-5 mb-1" />}
              label="Order"
            />
            <NavButton
              view="track"
              currentView={currentView}
              onClick={() => setCurrentView('track')}
              icon={<Search className="h-5 w-5 mb-1" />}
              label="Track"
            />
          </>
        )}

        {isAuthenticated && (userRole === 'driver' || userRole === 'helper' || userRole === 'cleaner') && (
          <NavButton
            view="driver"
            currentView={currentView}
            onClick={() => setCurrentView('driver')}
            icon={<Truck className="h-5 w-5 mb-1" />}
            label="Jobs"
          />
        )}

        {isAuthenticated && userRole === 'admin' && (
          <NavButton
            view="admin"
            currentView={currentView}
            onClick={() => setCurrentView('admin')}
            icon={<Settings className="h-5 w-5 mb-1" />}
            label="Admin"
          />
        )}

        {isAuthenticated && userRole === 'agent' && (
          <NavButton
            view="agent"
            currentView={currentView}
            onClick={() => setCurrentView('agent')}
            icon={<User className="h-5 w-5 mb-1" />}
            label="Agent"
          />
        )}

        <NavButton
          view="help"
          currentView={currentView}
          onClick={() => setCurrentView('help')}
          icon={<HelpCircle className="h-5 w-5 mb-1" />}
          label="Help"
        />

        {/* Authentication Button */}
        {isAuthenticated ? (
          <NavButton
            view="unified-login"
            currentView={currentView}
            onClick={onLogout}
            icon={<LogOut className="h-5 w-5 mb-1" />}
            label="Logout"
            className="text-red-500"
          />
        ) : (
          <NavButton
            view="unified-login"
            currentView={currentView}
            onClick={() => setCurrentView('unified-login')}
            icon={<LogIn className="h-5 w-5 mb-1" />}
            label="Login"
          />
        )}
      </div>
    </div>
  );
};

interface NavButtonProps {
  view: ViewType;
  currentView: ViewType;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  className?: string;
}

const NavButton = ({ view, currentView, onClick, icon, label, className = "" }: NavButtonProps) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
      currentView === view 
        ? 'text-green-600 bg-green-50' 
        : 'text-gray-500'
    } ${className}`}
  >
    {icon}
    <span className="text-xs font-medium">{label}</span>
  </button>
);

export default MobileBottomNav;
