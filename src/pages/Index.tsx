import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Homepage from "@/components/Homepage";
import OrderForm from "@/components/OrderForm";
import TrackOrder from "@/components/TrackOrder";
import UnifiedLogin from "@/components/UnifiedLogin";
import DriverView from "@/components/DriverView";
import AdminPanel from "@/components/AdminPanel";
import AgentPanel from "@/components/AgentPanel";
import ApplyJobs from "@/components/ApplyJobs";
import TermsAndConditions from "@/components/TermsAndConditions";
import HelpPage from "@/components/HelpPage";
import NotFound from "./NotFound";
import { Toaster } from "@/components/ui/toaster";
import Navigation from "@/components/Navigation";
import MobileBottomNav from "@/components/MobileBottomNav";
import { useToast } from "@/hooks/use-toast";
import { Order, OrderStatus, UserRole, ViewType, JobApplication } from "@/types";
import '@/utils/populateRwandaLocations';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUserName, setCurrentUserName] = useState<string | null>(null);
  const [currentUserPhone, setCurrentUserPhone] = useState<string | null>(null);
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [userRole, setUserRole] = useState<UserRole>('customer');
  const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        setIsAuthenticated(true);
        fetchUserData();
      } else {
        setIsAuthenticated(false);
        if (location.pathname !== '/') {
          navigate('/login');
        }
      }
    };

    checkSession();

    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        setIsAuthenticated(true);
        fetchUserData();
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        setCurrentUserName(null);
        setCurrentUserPhone(null);
        setUserOrders([]);
        navigate('/login');
      }
    });
  }, [navigate, location.pathname]);

  const fetchUserData = async () => {
    const user = supabase.auth.getUser();
    if (!user) return;

    try {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', (await user).data?.user?.id)
        .single();

      if (userError) {
        throw userError;
      }

      setCurrentUserName(userData?.name || null);
      setCurrentUserPhone(userData?.phone || null);
      setUserRole(userData?.role as UserRole || 'customer');
    } catch (error: any) {
      console.error("Error fetching user profile:", error.message);
      toast({
        title: "Error",
        description: "Failed to load user profile.",
        variant: "destructive",
      });
    }

    try {
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (ordersError) {
        throw ordersError;
      }

      // Transform database orders to match our Order interface
      const transformedOrders: Order[] = (orders || []).map(order => ({
        id: order.id,
        customerName: order.user_name,
        phoneNumber: order.phone_number.toString(),
        pickupAddress: order.pickup_address,
        deliveryAddress: order.delivery_address,
        services: order.services as any,
        distance: order.distance || 0,
        totalCost: order.total_cost,
        status: order.status as OrderStatus,
        createdAt: new Date(order.created_at),
        assignedDriver: order.assigned_driver,
        assignedDriverName: order.assigned_driver_name,
        assignedDriverPhone: order.assigned_driver_phone,
      }));

      setUserOrders(transformedOrders);
    } catch (error: any) {
      console.error("Error fetching user orders:", error.message);
      toast({
        title: "Error",
        description: "Failed to load your orders.",
        variant: "destructive",
      });
    }
  };

  const handleOrderSubmit = async (order: Order) => {
    try {
      const user = supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "User not authenticated.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('orders')
        .insert({
          id: order.id,
          user_name: order.customerName,
          phone_number: parseInt(order.phoneNumber),
          pickup_address: order.pickupAddress,
          delivery_address: order.deliveryAddress,
          services: order.services,
          distance: order.distance,
          total_cost: order.totalCost,
          status: order.status,
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Order placed successfully!",
      });
      navigate('/track-order/' + order.id);
      fetchUserData();
    } catch (error: any) {
      console.error("Error submitting order:", error.message);
      toast({
        title: "Error",
        description: "Failed to place order.",
        variant: "destructive",
      });
    }
  };

  const handleJobApplicationSubmit = (application: JobApplication) => {
    setJobApplications(prev => [...prev, application]);
    toast({
      title: "Success",
      description: "Job application submitted successfully!",
    });
  };

  const handleUpdateOrder = (orderId: string, updates: Partial<Order>) => {
    setUserOrders(prev => 
      prev.map(order => 
        order.id === orderId ? { ...order, ...updates } : order
      )
    );
  };

  const handleDriverOrderUpdate = (orderId: string, status: OrderStatus) => {
    handleUpdateOrder(orderId, { status });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    navigate('/login');
  };

  const handleRoleChange = (role: UserRole) => {
    setUserRole(role);
  };

  const handleViewChange = (view: ViewType) => {
    setCurrentView(view);
  };

  // Mock data for missing props
  const mockWorkers = [];
  const mockJobAssignments = [];
  const mockNotifications = [];
  const mockUserAccounts = [];
  const mockAvailableDrivers = [
    { id: '1', name: 'John Doe', phone: '+250781234567' },
    { id: '2', name: 'Jane Smith', phone: '+250782345678' },
  ];

  const handleUpdateJobApplication = (applicationId: string, status: 'pending' | 'approved' | 'rejected') => {
    setJobApplications(prev => 
      prev.map(app => 
        app.id === applicationId ? { ...app, status } : app
      )
    );
  };

  const handleUpdateUserAccounts = (accounts: any[]) => {
    console.log('Update user accounts:', accounts);
  };

  const handleSendSMS = (phone: string, message: string) => {
    console.log(`SMS sent to ${phone}: ${message}`);
  };

  const handleSendNotification = (userId: string, message: string, type: 'email' | 'push' | 'sms') => {
    console.log(`${type} notification sent to user ${userId}: ${message}`);
  };

  return (
    <>
      <Toaster />
      <Navigation 
        isAuthenticated={isAuthenticated} 
        onLogout={handleLogout}
        currentView={currentView}
        setCurrentView={handleViewChange}
        userRole={userRole}
        onRoleChange={handleRoleChange}
        currentUserName={currentUserName || undefined}
      />

      <Routes>
        <Route path="/" element={
          <Homepage 
            onPlaceOrder={() => navigate('/order')}
            onTrackOrder={() => navigate('/track-order/search')}
            onApplyJobs={() => navigate('/apply-jobs')}
            onHelp={() => navigate('/help')}
            onTerms={() => navigate('/terms')}
          />
        } />
        <Route path="/login" element={
          <UnifiedLogin 
            onLogin={() => setIsAuthenticated(true)}
            onBack={() => navigate('/')}
            userAccounts={[]}
          />
        } />
        <Route path="/terms" element={<TermsAndConditions onBack={() => navigate('/')} />} />
        <Route path="/help" element={<HelpPage onBack={() => navigate('/')} />} />
        <Route path="/apply-jobs" element={
          <ApplyJobs 
            onSubmitApplication={handleJobApplicationSubmit}
            onBack={() => navigate('/')}
          />
        } />
        <Route
          path="/order"
          element={
            isAuthenticated ? (
              <OrderForm
                onOrderSubmit={handleOrderSubmit}
                onBack={() => navigate('/')}
                isAuthenticated={isAuthenticated}
                currentUserName={currentUserName}
                currentUserPhone={currentUserPhone}
                userOrders={userOrders}
              />
            ) : (
              <UnifiedLogin 
                onLogin={() => setIsAuthenticated(true)}
                onBack={() => navigate('/')}
                userAccounts={[]}
              />
            )
          }
        />
        <Route path="/track-order/:orderId" element={
          <TrackOrder 
            orders={userOrders}
            jobAssignments={[]}
            onBack={() => navigate('/')}
          />
        } />
        <Route path="/driver-view" element={
          <DriverView 
            orders={userOrders}
            driverId={currentUserName || ''}
            onUpdateOrder={handleDriverOrderUpdate}
          />
        } />
        <Route path="/admin-panel" element={
          <AdminPanel 
            orders={userOrders}
            jobApplications={jobApplications}
            jobAssignments={mockJobAssignments}
            workers={mockWorkers}
            notifications={mockNotifications}
            userAccounts={mockUserAccounts}
            onUpdateOrder={handleUpdateOrder}
            onUpdateJobApplication={handleUpdateJobApplication}
            onUpdateUserAccounts={handleUpdateUserAccounts}
            availableDrivers={mockAvailableDrivers}
            onLogout={handleLogout}
          />
        } />
        <Route path="/agent-panel" element={<AgentPanel />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      {isAuthenticated && (
        <MobileBottomNav 
          currentView={currentView}
          setCurrentView={handleViewChange}
          userRole={userRole}
          onRoleChange={handleRoleChange}
          isAuthenticated={isAuthenticated}
          onLogout={handleLogout}
        />
      )}
    </>
  );
};

export default Index;
export type { Order, OrderStatus, UserRole, ViewType, JobApplication };
