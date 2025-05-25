
import { useState } from "react";
import Navigation from "@/components/Navigation";
import Homepage from "@/components/Homepage";
import OrderForm from "@/components/OrderForm";
import OrderReceipt from "@/components/OrderReceipt";
import DriverView from "@/components/DriverView";
import AdminPanel from "@/components/AdminPanel";
import MobileBottomNav from "@/components/MobileBottomNav";

export type UserRole = 'customer' | 'driver' | 'admin';
export type OrderStatus = 'pending' | 'assigned' | 'in-progress' | 'completed';

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

const Index = () => {
  const [currentView, setCurrentView] = useState<'home' | 'order' | 'receipt' | 'driver' | 'admin' | 'track'>('home');
  const [userRole, setUserRole] = useState<UserRole>('customer');
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  const handleOrderSubmit = (order: Order) => {
    setOrders(prev => [...prev, order]);
    setCurrentOrder(order);
    setCurrentView('receipt');
  };

  const handleRoleChange = (role: UserRole) => {
    setUserRole(role);
    switch (role) {
      case 'driver':
        setCurrentView('driver');
        break;
      case 'admin':
        setCurrentView('admin');
        break;
      default:
        setCurrentView('home');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Navigation */}
      <div className="hidden md:block">
        <Navigation 
          currentView={currentView} 
          setCurrentView={setCurrentView}
          userRole={userRole}
          onRoleChange={handleRoleChange}
        />
      </div>

      {/* Main Content */}
      <div className="pb-20 md:pb-0">
        {currentView === 'home' && (
          <Homepage onPlaceOrder={() => setCurrentView('order')} />
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
        
        {currentView === 'driver' && (
          <DriverView 
            orders={orders.filter(o => o.assignedDriver === 'current-driver')}
            onUpdateOrder={(orderId, status) => {
              setOrders(prev => prev.map(o => 
                o.id === orderId ? { ...o, status } : o
              ));
            }}
          />
        )}
        
        {currentView === 'admin' && (
          <AdminPanel 
            orders={orders}
            onUpdateOrder={(orderId, updates) => {
              setOrders(prev => prev.map(o => 
                o.id === orderId ? { ...o, ...updates } : o
              ));
            }}
          />
        )}
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden">
        <MobileBottomNav 
          currentView={currentView}
          setCurrentView={setCurrentView}
          userRole={userRole}
          onRoleChange={handleRoleChange}
        />
      </div>
    </div>
  );
};

export default Index;
