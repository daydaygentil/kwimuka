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
import '@/utils/populateRwandaLocations';

export interface Order {
  id: string;
  customerName: string;
  phoneNumber: string;
  pickupAddress: string;
  deliveryAddress: string;
  services: {
    transport: boolean;
    helpers: number;
    cleaning: boolean;
    keyDelivery: boolean;
  };
  distance: number;
  totalCost: number;
  status: 'pending' | 'assigned' | 'in-progress' | 'completed';
  createdAt: Date;
  locationData?: {
    pickup: any;
    delivery: any;
  };
}

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUserName, setCurrentUserName] = useState<string | null>(null);
  const [currentUserPhone, setCurrentUserPhone] = useState<string | null>(null);
  const [userOrders, setUserOrders] = useState<Order[]>([]);
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
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', (await user).data?.user?.id)
        .single();

      if (profileError) {
        throw profileError;
      }

      setCurrentUserName(profileData?.full_name || null);
      setCurrentUserPhone(profileData?.phone_number || null);
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
        .eq('user_id', (await user).data?.user?.id)
        .order('created_at', { ascending: false });

      if (ordersError) {
        throw ordersError;
      }

      setUserOrders(orders || []);
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
          ...order,
          user_id: (await user).data?.user?.id,
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <>
      <Toaster />
      <Navigation isAuthenticated={isAuthenticated} onLogout={handleLogout} />

      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<UnifiedLogin />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/apply-jobs" element={<ApplyJobs />} />
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
              <UnifiedLogin />
            )
          }
        />
        <Route path="/track-order/:orderId" element={<TrackOrder />} />
        <Route path="/driver-view" element={<DriverView />} />
        <Route path="/admin-panel" element={<AdminPanel />} />
        <Route path="/agent-panel" element={<AgentPanel />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      {isAuthenticated && <MobileBottomNav />}
    </>
  );
};

export default Index;
