
import { useState } from "react";
import Navigation from "@/components/Navigation";
import Homepage from "@/components/Homepage";
import OrderForm from "@/components/OrderForm";
import OrderReceipt from "@/components/OrderReceipt";
import DriverView from "@/components/DriverView";
import AdminPanel from "@/components/AdminPanel";
import MobileBottomNav from "@/components/MobileBottomNav";
import TrackOrder from "@/components/TrackOrder";
import UnifiedLogin from "@/components/UnifiedLogin";
import ApplyJobs from "@/components/ApplyJobs";
import HelpPage from "@/components/HelpPage";
import TermsAndConditions from "@/components/TermsAndConditions";

export type UserRole = 'customer' | 'driver' | 'admin' | 'helper' | 'cleaner';
export type OrderStatus = 'pending' | 'assigned' | 'in-progress' | 'completed';
export type ViewType = 'home' | 'order' | 'receipt' | 'driver' | 'admin' | 'track' | 'unified-login' | 'apply-jobs' | 'help' | 'terms';

export interface Order {
  id: string;
  customerName: string;
  phoneNumber: string;
  pickupAddress: string;
  deliveryAddress: string;
  pickupCoords?: { lat: number; lng: number };
  deliveryCoords?: { lat: number; lng: number };
  distance?: number;
  services: {
    transport: boolean;
    helpers: number;
    cleaning: boolean;
    keyDelivery: boolean;
  };
  totalCost: number;
  status: OrderStatus;
  assignedDriver?: string;
  assignedDriverName?: string;
  assignedDriverPhone?: string;
  createdAt: Date;
}

export interface JobApplication {
  id: string;
  name: string;
  phone: string;
  jobRole: 'helper' | 'cleaner' | 'driver';
  message: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: Date;
}

const Index = () => {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [userRole, setUserRole] = useState<UserRole>('customer');
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [currentUserName, setCurrentUserName] = useState<string>('');

  // Mock drivers data for assignment
  const availableDrivers = [
    { id: 'driver1', name: 'John Doe', phone: '+250 788 123 001' },
    { id: 'driver2', name: 'Jane Smith', phone: '+250 788 123 002' },
    { id: 'driver3', name: 'Mike Johnson', phone: '+250 788 123 003' },
  ];

  const handleOrderSubmit = (order: Order) => {
    // Auto-assign to first available driver for demo
    const assignedDriver = availableDrivers[0];
    const updatedOrder = {
      ...order,
      status: 'assigned' as OrderStatus,
      assignedDriver: assignedDriver.id,
      assignedDriverName: assignedDriver.name,
      assignedDriverPhone: assignedDriver.phone
    };
    
    setOrders(prev => [...prev, updatedOrder]);
    setCurrentOrder(updatedOrder);
    setCurrentView('receipt');
  };

  const handleRoleChange = (role: UserRole) => {
    if (!isAuthenticated) {
      setUserRole(role);
      setCurrentView('unified-login');
      return;
    }

    setUserRole(role);
    switch (role) {
      case 'driver':
      case 'helper':
      case 'cleaner':
        setCurrentView('driver');
        break;
      case 'admin':
        setCurrentView('admin');
        break;
      default:
        setCurrentView('home');
    }
  };

  const handleViewChange = (view: string) => {
    // Check if view requires authentication
    const protectedViews = ['driver', 'admin'];
    if (protectedViews.includes(view) && !isAuthenticated) {
      setCurrentView('unified-login');
      return;
    }
    setCurrentView(view as ViewType);
  };

  const handleJobApplication = (application: JobApplication) => {
    setJobApplications(prev => [...prev, application]);
  };

  const handleLogin = (success: boolean, role: string, userId?: string, userName?: string) => {
    if (success && userId && userName) {
      setIsAuthenticated(true);
      setUserRole(role as UserRole);
      setCurrentUserId(userId);
      setCurrentUserName(userName);
      
      // Navigate to appropriate view based on role
      switch (role) {
        case 'admin':
          setCurrentView('admin');
          break;
        case 'driver':
        case 'helper':
        case 'cleaner':
          setCurrentView('driver');
          break;
        default:
          setCurrentView('home');
      }
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUserId('');
    setCurrentUserName('');
    setUserRole('customer');
    setCurrentView('home');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Navigation */}
      <div className="hidden md:block">
        <Navigation 
          currentView={currentView} 
          setCurrentView={handleViewChange}
          userRole={userRole}
          onRoleChange={handleRoleChange}
          isAuthenticated={isAuthenticated}
          currentUserName={currentUserName}
          onLogout={handleLogout}
        />
      </div>

      {/* Main Content */}
      <div className="pb-20 md:pb-0">
        {currentView === 'home' && (
          <Homepage 
            onPlaceOrder={() => setCurrentView('order')}
            onTrackOrder={() => setCurrentView('track')}
            onApplyJobs={() => setCurrentView('apply-jobs')}
            onHelp={() => setCurrentView('help')}
            onTerms={() => setCurrentView('terms')}
          />
        )}
        
        {currentView === 'order' && (
          <OrderForm 
            onOrderSubmit={handleOrderSubmit}
            onBack={() => setCurrentView('home')}
          />
        )}
        
        {currentView === 'receipt' && currentOrder && (
          <OrderReceipt 
            order={currentOrder}
            onBack={() => setCurrentView('home')}
            onTrackOrder={() => setCurrentView('track')}
          />
        )}

        {currentView === 'track' && (
          <TrackOrder 
            orders={orders}
            onBack={() => setCurrentView('home')}
          />
        )}

        {currentView === 'unified-login' && (
          <UnifiedLogin 
            onLogin={handleLogin}
            onBack={() => setCurrentView('home')}
          />
        )}
        
        {currentView === 'driver' && isAuthenticated && (
          <DriverView 
            orders={orders.filter(o => 
              o.assignedDriver === currentUserId || 
              (userRole === 'admin' && true) ||
              (userRole === 'helper' && o.services.helpers > 0) ||
              (userRole === 'cleaner' && o.services.cleaning)
            )}
            onUpdateOrder={(orderId, status) => {
              setOrders(prev => prev.map(o => 
                o.id === orderId ? { ...o, status } : o
              ));
            }}
            driverId={currentUserId}
            userName={currentUserName}
            userRole={userRole}
            onLogout={handleLogout}
          />
        )}
        
        {currentView === 'admin' && isAuthenticated && userRole === 'admin' && (
          <AdminPanel 
            orders={orders}
            jobApplications={jobApplications}
            onUpdateOrder={(orderId, updates) => {
              setOrders(prev => prev.map(o => 
                o.id === orderId ? { ...o, ...updates } : o
              ));
            }}
            onUpdateJobApplication={(applicationId, status) => {
              setJobApplications(prev => prev.map(app => 
                app.id === applicationId ? { ...app, status } : app
              ));
            }}
            availableDrivers={availableDrivers}
            onLogout={handleLogout}
          />
        )}

        {currentView === 'apply-jobs' && (
          <ApplyJobs 
            onSubmitApplication={handleJobApplication}
            onBack={() => setCurrentView('home')}
          />
        )}

        {currentView === 'help' && (
          <HelpPage 
            onBack={() => setCurrentView('home')}
          />
        )}

        {currentView === 'terms' && (
          <TermsAndConditions 
            onBack={() => setCurrentView('home')}
          />
        )}
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden">
        <MobileBottomNav 
          currentView={currentView}
          setCurrentView={handleViewChange}
          userRole={userRole}
          onRoleChange={handleRoleChange}
          isAuthenticated={isAuthenticated}
          onLogout={handleLogout}
        />
      </div>
    </div>
  );
};

export default Index;
