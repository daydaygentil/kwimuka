
import { useState } from "react";
import Navigation from "@/components/Navigation";
import Homepage from "@/components/Homepage";
import OrderForm from "@/components/OrderForm";
import OrderReceipt from "@/components/OrderReceipt";
import DriverView from "@/components/DriverView";
import AdminPanel from "@/components/AdminPanel";
import MobileBottomNav from "@/components/MobileBottomNav";
import TrackOrder from "@/components/TrackOrder";
import AdminLogin from "@/components/AdminLogin";
import DriverLogin from "@/components/DriverLogin";
import ApplyJobs from "@/components/ApplyJobs";
import HelpPage from "@/components/HelpPage";

export type UserRole = 'customer' | 'driver' | 'admin';
export type OrderStatus = 'pending' | 'assigned' | 'in-progress' | 'completed';
export type ViewType = 'home' | 'order' | 'receipt' | 'driver' | 'admin' | 'track' | 'admin-login' | 'driver-login' | 'apply-jobs' | 'help';

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
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isDriverLoggedIn, setIsDriverLoggedIn] = useState(false);
  const [currentDriverId, setCurrentDriverId] = useState<string>('');

  const handleOrderSubmit = (order: Order) => {
    setOrders(prev => [...prev, order]);
    setCurrentOrder(order);
    setCurrentView('receipt');
  };

  const handleRoleChange = (role: UserRole) => {
    setUserRole(role);
    switch (role) {
      case 'driver':
        if (isDriverLoggedIn) {
          setCurrentView('driver');
        } else {
          setCurrentView('driver-login');
        }
        break;
      case 'admin':
        if (isAdminLoggedIn) {
          setCurrentView('admin');
        } else {
          setCurrentView('admin-login');
        }
        break;
      default:
        setCurrentView('home');
    }
  };

  const handleViewChange = (view: string) => {
    setCurrentView(view as ViewType);
  };

  const handleJobApplication = (application: JobApplication) => {
    setJobApplications(prev => [...prev, application]);
  };

  const handleAdminLogin = (success: boolean) => {
    if (success) {
      setIsAdminLoggedIn(true);
      setCurrentView('admin');
    }
  };

  const handleDriverLogin = (success: boolean, driverId?: string) => {
    if (success && driverId) {
      setIsDriverLoggedIn(true);
      setCurrentDriverId(driverId);
      setCurrentView('driver');
    }
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

        {currentView === 'admin-login' && (
          <AdminLogin 
            onLogin={handleAdminLogin}
            onBack={() => setCurrentView('home')}
          />
        )}

        {currentView === 'driver-login' && (
          <DriverLogin 
            onLogin={handleDriverLogin}
            onBack={() => setCurrentView('home')}
          />
        )}
        
        {currentView === 'driver' && isDriverLoggedIn && (
          <DriverView 
            orders={orders.filter(o => o.assignedDriver === currentDriverId)}
            onUpdateOrder={(orderId, status) => {
              setOrders(prev => prev.map(o => 
                o.id === orderId ? { ...o, status } : o
              ));
            }}
            driverId={currentDriverId}
          />
        )}
        
        {currentView === 'admin' && isAdminLoggedIn && (
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
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden">
        <MobileBottomNav 
          currentView={currentView}
          setCurrentView={handleViewChange}
          userRole={userRole}
          onRoleChange={handleRoleChange}
        />
      </div>
    </div>
  );
};

export default Index;
