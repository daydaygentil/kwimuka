import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Homepage from "@/components/Homepage";
import OrderForm from "@/components/OrderForm";
import OrderReceipt from "@/components/OrderReceipt";
import DriverView from "@/components/DriverView";
import AdminPanel from "@/components/AdminPanel";
import AgentDashboard from "@/components/AgentDashboard";
import MobileBottomNav from "@/components/MobileBottomNav";
import TrackOrder from "@/components/TrackOrder";
import UnifiedLogin from "@/components/UnifiedLogin";
import ApplyJobs from "@/components/ApplyJobs";
import HelpPage from "@/components/HelpPage";
import TermsAndConditions from "@/components/TermsAndConditions";
import { Worker, JobAssignment, ServiceNotification, WorkerType } from '@/types/worker';
import { AgentCommission, WithdrawalRequest, AgentProfile } from '@/types/agent';
import WorkerNotificationPanel from '@/components/WorkerNotificationPanel';
import ServiceStatusTracker from '@/components/ServiceStatusTracker';
import UserRegistration from "@/components/UserRegistration";
import ForgotPassword from "@/components/ForgotPassword";
import PaymentMethods from "@/components/PaymentMethods";
import PriceBreakdown from "@/components/PriceBreakdown";
import BudgetDriverFinder from "@/components/BudgetDriverFinder";
import SocialShare from "@/components/SocialShare";
import { UserAccount, SMSSettings } from '@/types/worker';
import { supabase } from "@/integrations/supabase/client";
import type { Database } from '@/types/database';
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { useNotifications } from "@/hooks/useNotifications";
import { useJobApplications } from "@/hooks/useJobApplications";

export type UserRole = 'customer' | 'driver' | 'admin' | 'helper' | 'cleaner' | 'agent';
export type OrderStatus = 'pending' | 'assigned' | 'in-progress' | 'completed';
export type ViewType = 
  // Main views
  | 'home'
  | 'order' 
  | 'receipt'
  | 'track'
  
  // User role specific views 
  | 'driver'
  | 'admin'
  | 'agent'
  
  // Authentication views
  | 'unified-login'
  | 'register'
  | 'forgot-password'
  
  // Feature views
  | 'apply-jobs'
  | 'payment-methods' 
  | 'price-breakdown'
  | 'budget-driver-finder'
  | 'social-share'
  
  // Info views
  | 'help'
  | 'terms';

// Create a type-safe setter function
export const setView = (view: ViewType, setter: React.Dispatch<React.SetStateAction<ViewType>>) => {
  setter(view);
}

export interface Order {
  id: string;
  customerName: string;
  phoneNumber: string;
  pickupAddress: string;
  deliveryAddress: string;
  pickupCoords?: { lat: number; lng: number };
  deliveryCoords?: { lat: number; lng: number };
  distance?: number;  services: {
    transport: boolean;
    helpers: number;
    cleaning: boolean;
    keyDelivery: boolean;
    vip: boolean;
  };
  totalCost: number;
  status: OrderStatus;
  assignedDriver?: string;
  assignedDriverName?: string;
  assignedDriverPhone?: string;
  createdAt: Date;
  isVip?: boolean;
  specialItemsDescription?: string;
  paymentMethod?: string;
  paymentTiming?: 'prepay' | 'pay_after';
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

// Helper function to parse coordinates from JSON
type Coordinates = {
  lat: number;
  lng: number;
};

const parseCoordinates = (coords: unknown): Coordinates | undefined => {
  if (!coords || typeof coords !== 'object') return undefined;
  const coordsObj = coords as Record<string, unknown>;
  if (typeof coordsObj.lat === 'number' && typeof coordsObj.lng === 'number') {
    return { lat: coordsObj.lat, lng: coordsObj.lng };
  }
  return undefined;
};

// Helper function to parse services from JSON
interface Services {
  transport: boolean;
  helpers: number;
  cleaning: boolean;
  keyDelivery: boolean;
  vip: boolean;
}

const parseServices = (services: unknown): Services => {
  if (!services || typeof services !== 'object') {
    return {
      transport: false,
      helpers: 0,
      cleaning: false,
      keyDelivery: false,
      vip: false
    };
  }
  
  const servicesObj = services as Record<string, unknown>;
  return {
    transport: Boolean(servicesObj.transport),
    helpers: Number(servicesObj.helpers) || 0,
    cleaning: Boolean(servicesObj.cleaning),
    keyDelivery: Boolean(servicesObj.keyDelivery),
    vip: Boolean(servicesObj.vip)
  };
};

const Index = () => {
  const { toast } = useToast();
  // View state
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [userRole, setUserRole] = useState<UserRole>('customer');
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [currentUserName, setCurrentUserName] = useState<string>('');

  // Agent state
  const [agentProfile, setAgentProfile] = useState<AgentProfile | null>(null);
  const [agentCommissions, setAgentCommissions] = useState<AgentCommission[]>([]);
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>([]);

  // Initialize hooks
  const { notifications: realNotifications, unreadCount, markAsRead, createNotification } = useNotifications(currentUserId);
  const { submitJobApplication, isSubmitting: isSubmittingJob } = useJobApplications();  const [userAccounts, setUserAccounts] = useState<UserAccount[]>([
    {
      id: 'admin1',
      name: 'Admin User',
      phone: 'admin',
      password: 'admin123',
      role: 'admin',
      createdAt: new Date()
    },
    {
      id: 'agent1',
      name: 'Agent User',
      phone: 'agent',
      password: 'agent123',
      role: 'agent',
      createdAt: new Date()
    },
    {
      id: 'agent1',
      name: 'Agency User',
      phone: 'agent',
      password: 'agent123',
      role: 'agent',
      createdAt: new Date()
    },{
      id: 'agent1',
      name: 'Agency User',
      phone: 'agent',
      password: 'agent123',
      role: 'agent',
      createdAt: new Date()
    },
    {
      id: 'driver1',
      name: 'John Driver',
      phone: 'john',
      password: 'john123',
      role: 'driver',
      createdAt: new Date()
    },
    {
      id: 'helper1',
      name: 'Helper One',
      phone: 'helper1',
      password: 'helper123',
      role: 'helper',
      createdAt: new Date()
    },
    {
      id: 'cleaner1',
      name: 'Cleaner One',
      phone: 'cleaner1',
      password: 'cleaner123',
      role: 'cleaner',
      createdAt: new Date()
    },
    {
      id: 'customer1',
      name: 'Customer User',
      phone: 'customer',
      password: 'customer123',
      role: 'customer',
      createdAt: new Date()
    }
  ]);
  
  const [smsSettings, setSmsSettings] = useState<SMSSettings>({
    id: 'sms1',
    message: 'Hello {customerPhone}, your driver {driverName} has confirmed your order and is on the way!',
    isActive: true,
    updatedBy: 'admin',
    updatedAt: new Date()
  });
  
  const [workers, setWorkers] = useState<Worker[]>([
    { id: 'driver1', name: 'John Doe', phone: '+250 788 123 001', type: 'driver', isAvailable: true, currentJobs: [] },
    { id: 'driver2', name: 'Jane Smith', phone: '+250 788 123 002', type: 'driver', isAvailable: true, currentJobs: [] },
    { id: 'driver3', name: 'Mike Johnson', phone: '+250 788 123 003', type: 'driver', isAvailable: true, currentJobs: [] },
    { id: 'helper1', name: 'Paul Helper', phone: '+250 788 123 004', type: 'helper', isAvailable: true, currentJobs: [] },
    { id: 'helper2', name: 'Mary Helper', phone: '+250 788 123 005', type: 'helper', isAvailable: true, currentJobs: [] },
    { id: 'cleaner1', name: 'Alice Cleaner', phone: '+250 788 123 006', type: 'cleaner', isAvailable: true, currentJobs: [] },
    { id: 'cleaner2', name: 'Bob Cleaner', phone: '+250 788 123 007', type: 'cleaner', isAvailable: true, currentJobs: [] },
    { id: 'delivery1', name: 'Sam Delivery', phone: '+250 788 123 008', type: 'delivery', isAvailable: true, currentJobs: [] },
    { id: 'delivery2', name: 'Lisa Delivery', phone: '+250 788 123 009', type: 'delivery', isAvailable: true, currentJobs: [] },
  ]);
  
  const [jobAssignments, setJobAssignments] = useState<JobAssignment[]>([]);
  const [notifications, setNotifications] = useState<ServiceNotification[]>([]);

  const availableDrivers = [
    { id: 'driver1', name: 'John Doe', phone: '+250 788 123 001' },
    { id: 'driver2', name: 'Jane Smith', phone: '+250 788 123 002' },
    { id: 'driver3', name: 'Mike Johnson', phone: '+250 788 123 003' },
  ];
  // Fetch orders from Supabase
  const { data: supabaseOrders, refetch: refetchOrders } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      console.log('Fetching orders from Supabase...');
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
        toast({
          title: "Error",
          description: "Failed to fetch orders from database",
          variant: "destructive",
        });
        return [];
      }

      console.log('Orders fetched successfully:', data);
      
      // Transform Supabase data to match our Order interface
      return (data || []).map(order => ({
        id: order.id,
        customerName: order.user_name,
        phoneNumber: order.phone_number.toString(),
        pickupAddress: order.pickup_address,
        deliveryAddress: order.delivery_address,
        pickupCoords: parseCoordinates(order.pickup_coords),
        deliveryCoords: parseCoordinates(order.delivery_coords),
        distance: order.distance || undefined,
        services: parseServices(order.services),
        totalCost: Number(order.total_cost),
        status: order.status as OrderStatus,
        assignedDriver: order.assigned_driver || undefined,
        assignedDriverName: order.assigned_driver_name || undefined,
        assignedDriverPhone: order.assigned_driver_phone || undefined,
        createdAt: new Date(order.created_at),
        isVip: order.is_vip || false,
        specialItemsDescription: order.special_items_description || undefined,
      }));
    }
  });

  // Update local orders when Supabase data changes
  useEffect(() => {
    if (supabaseOrders) {
      setOrders(supabaseOrders);
    }
  }, [supabaseOrders]);

  // Save order to Supabase and trigger SMS with improved error handling
  const saveOrderToSupabase = async (order: Order) => {
    try {
      console.log('Saving order to Supabase:', order);

      // Insert order into Supabase
      const { data, error } = await supabase
        .from('orders')
        .insert({
          id: order.id,
          user_name: order.customerName,
          phone_number: parseInt(order.phoneNumber.replace(/\D/g, '')),
          pickup_address: order.pickupAddress,
          delivery_address: order.deliveryAddress,
          pickup_coords: order.pickupCoords || null,
          delivery_coords: order.deliveryCoords || null,
          distance: order.distance || null,
          services: order.services,
          total_cost: order.totalCost,
          status: order.status,
          assigned_driver: order.assignedDriver || null,
          assigned_driver_name: order.assignedDriverName || null,
          assigned_driver_phone: order.assignedDriverPhone || null,
          service_type: order.isVip ? 'vip' : 'standard',
          is_vip: order.isVip || false,
          special_items_description: order.specialItemsDescription || null,
        })
        .select();

      if (error) {
        console.error('Error saving order to Supabase:', error);
        toast({
          title: "Order Save Failed",
          description: "Failed to save order to database. Please try again.",
          variant: "destructive",
        });
        return false;
      }

      console.log('Order saved successfully:', data);

      // Create notification for customer
      await createNotification({
        user_id: currentUserId || 'system',
        title: '✅ Order Confirmed!',
        message: `Your order #${order.id} has been confirmed and is being processed.`,
        notification_type: 'success'
      });

      // Save payment transaction if payment method is specified
      if (order.paymentMethod && order.paymentTiming) {
        await supabase.from('payment_transactions').insert({
          order_id: order.id,
          payment_method: order.paymentMethod,
          payment_timing: order.paymentTiming,
          amount: order.totalCost,
          status: 'pending'
        });
      }      // Prepare SMS message with VIP-specific content
      const smsMessage = `Hello ${order.customerName}, your Kwimuka ${order.isVip ? 'VIP' : ''} order #${order.id} has been confirmed! ${
        order.isVip 
          ? '🌟 Priority VIP Service - You will be assigned our top-rated crew for premium handling.' 
          : 'Standard Service'
      } Total: ${order.totalCost.toLocaleString()} RWF. ${
        order.isVip
          ? 'Your dedicated VIP support will contact you shortly.'
          : "We'll contact you shortly with driver details."
      }`;
      
      // Trigger SMS notification with comprehensive error handling
      try {
        console.log('Attempting to send SMS notification...');
        
        const { data: smsData, error: smsError } = await supabase.functions.invoke('send-order-sms', {
          body: {
            orderId: order.id,
            phoneNumber: order.phoneNumber,
            customerName: order.customerName,
            message: smsMessage
          }
        });

        if (smsError || !smsData || smsData.success !== true) {
          console.error('SMS service error:', smsError || smsData?.error);
          toast({
            title: "⚠️ SMS Confirmation Failed",
            description: "We saved your order, but you may not receive the SMS. Please contact support if needed.",
            variant: "destructive",
          });
          return true;
        }

        console.log('SMS sent successfully');
        toast({
          title: "✅ Order Confirmed!",
          description: "Order saved and SMS confirmation sent successfully.",
          variant: "default",
        });
        
        refetchOrders();
        return true;

      } catch (smsError) {
        console.error('Unexpected error during SMS sending:', smsError);
        toast({
          title: "⚠️ Unexpected Error Sending SMS",
          description: "We saved your order, but encountered an error sending SMS. Please contact support if needed.",
          variant: "destructive",
        });
        return true;
      }

    } catch (error) {
      console.error('Unexpected error saving order:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const createJobAssignments = (order: Order): JobAssignment[] => {
    const assignments: JobAssignment[] = [];
    
    if (order.services.transport) {
      assignments.push({
        id: `${order.id}-transport`,
        orderId: order.id,
        serviceType: 'transport',
        status: 'pending'
      });
    }
    
    if (order.services.helpers > 0) {
      assignments.push({
        id: `${order.id}-helpers`,
        orderId: order.id,
        serviceType: 'helpers',
        status: 'pending'
      });
    }
    
    if (order.services.cleaning) {
      assignments.push({
        id: `${order.id}-cleaning`,
        orderId: order.id,
        serviceType: 'cleaning',
        status: 'pending'
      });
    }
    
    if (order.services.keyDelivery) {
      assignments.push({
        id: `${order.id}-keyDelivery`,
        orderId: order.id,
        serviceType: 'keyDelivery',
        status: 'pending'
      });
    }
    
    return assignments;
  };

  const notifyWorkers = (assignments: JobAssignment[]) => {
    const newNotifications: ServiceNotification[] = [];
    
    assignments.forEach(assignment => {
      const workerType: WorkerType = assignment.serviceType === 'transport' ? 'driver' :
                                    assignment.serviceType === 'helpers' ? 'helper' :
                                    assignment.serviceType === 'cleaning' ? 'cleaner' : 'delivery';
      
      const availableWorkers = workers.filter(w => w.type === workerType && w.isAvailable);
      
      if (availableWorkers.length > 0) {
        const selectedWorker = availableWorkers[0];
        
        const notification: ServiceNotification = {
          id: `notif-${assignment.id}-${Date.now()}`,
          workerId: selectedWorker.id,
          jobAssignmentId: assignment.id,
          message: `New ${assignment.serviceType} job available. Accept now.`,
          type: 'job_offer',
          createdAt: new Date(),
          expiresAt: new Date(Date.now() + 10 * 60 * 1000)
        };
        
        newNotifications.push(notification);
        
        setTimeout(() => {
          handleJobTimeout(assignment.id);
        }, 10 * 60 * 1000);
      }
    });
    
    setNotifications(prev => [...prev, ...newNotifications]);
  };

  const handleJobTimeout = (assignmentId: string) => {
    setJobAssignments(prev => {
      const assignment = prev.find(a => a.id === assignmentId);
      if (assignment && assignment.status === 'pending') {
        setNotifications(prevNotifs => 
          prevNotifs.filter(n => n.jobAssignmentId !== assignmentId)
        );
        
        reassignJob(assignment);
        
        return prev;
      }
      return prev;
    });
  };

  const reassignJob = (assignment: JobAssignment) => {
    const workerType: WorkerType = assignment.serviceType === 'transport' ? 'driver' :
                                  assignment.serviceType === 'helpers' ? 'helper' :
                                  assignment.serviceType === 'cleaning' ? 'cleaner' : 'delivery';
    
    const availableWorkers = workers.filter(w => 
      w.type === workerType && 
      w.isAvailable && 
      !notifications.some(n => n.workerId === w.id && n.jobAssignmentId === assignment.id)
    );
    
    if (availableWorkers.length > 0) {
      const nextWorker = availableWorkers[0];
      
      const notification: ServiceNotification = {
        id: `notif-${assignment.id}-${Date.now()}`,
        workerId: nextWorker.id,
        jobAssignmentId: assignment.id,
        message: `New ${assignment.serviceType} job available. Accept now.`,
        type: 'job_offer',
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 10 * 60 * 1000)
      };
      
      setNotifications(prev => [...prev, notification]);
      
      setTimeout(() => {
        handleJobTimeout(assignment.id);
      }, 10 * 60 * 1000);
    }
  };

  const handleOrderSubmit = async (order: Order) => {
    console.log('Order submitted:', order);
    
    // Save to Supabase first with improved error handling
    const saved = await saveOrderToSupabase(order);
    
    if (saved) {
      // Continue with existing logic
      const assignments = createJobAssignments(order);
      
      setJobAssignments(prev => [...prev, ...assignments]);
      setCurrentOrder(order);
      
      notifyWorkers(assignments);
      
      setCurrentView('receipt');
    } else {
      // If save failed, don't proceed with the order
      console.log('Order save failed, not proceeding');
    }
  };

  const handleAcceptJob = (jobId: string) => {
    const notification = notifications.find(n => n.jobAssignmentId === jobId);
    if (!notification) return;
    
    const worker = workers.find(w => w.id === notification.workerId);
    if (!worker) return;
    
    setJobAssignments(prev => prev.map(assignment => 
      assignment.id === jobId 
        ? { 
            ...assignment, 
            assignedWorker: worker,
            status: 'assigned',
            assignedAt: new Date(),
            acceptedAt: new Date()
          }
        : assignment
    ));
    
    setNotifications(prev => prev.filter(n => n.jobAssignmentId !== jobId));
    
    setWorkers(prev => prev.map(w => 
      w.id === worker.id 
        ? { ...w, currentJobs: [...w.currentJobs, jobId] }
        : w
    ));
    
    const assignment = jobAssignments.find(a => a.id === jobId);
    if (assignment) {
      // Update order status to in-progress
      setOrders(prev => prev.map(order => 
        order.id === assignment.orderId 
          ? { ...order, status: 'in-progress' }
          : order
      ));
    }
  };

  // Handle withdrawal request submission
  const handleRequestWithdrawal = async (amount: number, phoneNumber: string) => {
    if (!agentProfile) {
      toast({
        title: "Error",
        description: "Agent profile not found",
        variant: "destructive",
      });
      return;
    }

    try {    const { data: withdrawal, error } = await supabase
        .from('withdrawal_requests')
        .insert({
          agent_id: agentProfile.id,
          amount,
          phone_number: phoneNumber,
          status: 'processing' as const,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;      const newWithdrawal: WithdrawalRequest = {
        id: withdrawal.id,
        agentId: withdrawal.agent_id,
        amount: withdrawal.amount,
        phoneNumber: withdrawal.phone_number,
        status: withdrawal.status,
        createdAt: new Date(withdrawal.created_at),
        notes: withdrawal.notes
      };

      setWithdrawalRequests(prev => [...prev, newWithdrawal]);

      toast({
        title: "Success",
        description: "Withdrawal request submitted successfully",
      });

      // Send notification to admin
      await createNotification({
        user_id: 'admin',
        title: '💰 New Withdrawal Request',
        message: `Agent ${agentProfile.name} requested withdrawal of ${amount.toLocaleString()} RWF`,
        notification_type: 'withdrawal'
      });

    } catch (error) {
      console.error('Error submitting withdrawal request:', error);
      toast({
        title: "Error",
        description: "Failed to submit withdrawal request",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        userRole={userRole} 
        setUserRole={setUserRole} 
        isAuthenticated={isAuthenticated} 
        setIsAuthenticated={setIsAuthenticated} 
        setCurrentUserId={setCurrentUserId} 
        setCurrentUserName={setCurrentUserName}
        agentProfile={agentProfile}
        setAgentProfile={setAgentProfile}
        withdrawalRequests={withdrawalRequests}
        setWithdrawalRequests={setWithdrawalRequests}
      />
      <main className="flex-grow">
        {currentView === 'home' && <Homepage 
          setCurrentView={setCurrentView} 
          setCurrentOrder={setCurrentOrder} 
          setJobAssignments={setJobAssignments}
          userRole={userRole}
          isAuthenticated={isAuthenticated}
          toast={toast}
        />}
        {currentView === 'order' && <OrderForm 
          setCurrentView={setCurrentView} 
          currentOrder={currentOrder} 
          setCurrentOrder={setCurrentOrder} 
          availableDrivers={availableDrivers}
          userRole={userRole}
          isAuthenticated={isAuthenticated}
          toast={toast}
        />}
        {currentView === 'receipt' && <OrderReceipt 
          currentOrder={currentOrder} 
          setCurrentView={setCurrentView} 
          userRole={userRole}
          isAuthenticated={isAuthenticated}
          toast={toast}
        />}
        {currentView === 'driver' && <DriverView 
          currentOrder={currentOrder} 
          setCurrentView={setCurrentView} 
          userRole={userRole}
          isAuthenticated={isAuthenticated}
          toast={toast}
        />}
        {currentView === 'admin' && <AdminPanel          currentAgent={agentProfile}
          commissions={agentCommissions}
          withdrawals={withdrawalRequests}
          onRequestWithdrawal={handleRequestWithdrawal}
          onLogout={() => {
            // Handle logout
            setIsAuthenticated(false);
            setCurrentView('unified-login');
          }}
        />}
        {currentView === 'agent' && <AgentDashboard 
          currentOrder={currentOrder} 
          setCurrentView={setCurrentView} 
          userRole={userRole}
          isAuthenticated={isAuthenticated}
          toast={toast}
          agentProfile={agentProfile}
          setAgentProfile={setAgentProfile}
          agentCommissions={agentCommissions}
          setAgentCommissions={setAgentCommissions}
          withdrawalRequests={withdrawalRequests}
          setWithdrawalRequests={setWithdrawalRequests}
        />}
        {currentView === 'track' && <TrackOrder 
          setCurrentView={setCurrentView} 
          userRole={userRole}
          isAuthenticated={isAuthenticated}
          toast={toast}
        />}
        {currentView === 'unified-login' && <UnifiedLogin 
          setCurrentView={setCurrentView} 
          userRole={userRole}
          setUserRole={setUserRole}
          isAuthenticated={isAuthenticated}
          setIsAuthenticated={setIsAuthenticated}
          setCurrentUserId={setCurrentUserId}
          setCurrentUserName={setCurrentUserName}
          agentProfile={agentProfile}
          setAgentProfile={setAgentProfile}
        />}
        {currentView === 'apply-jobs' && <ApplyJobs 
          setCurrentView={setCurrentView} 
          userRole={userRole}
          isAuthenticated={isAuthenticated}
          toast={toast}
          submitJobApplication={submitJobApplication}
          isSubmittingJob={isSubmittingJob}
        />}
        {currentView === 'help' && <HelpPage 
          setCurrentView={setCurrentView} 
          userRole={userRole}
          isAuthenticated={isAuthenticated}
          toast={toast}
        />}
        {currentView === 'terms' && <TermsAndConditions 
          setCurrentView={setCurrentView} 
          userRole={userRole}
          isAuthenticated={isAuthenticated}
          toast={toast}
        />}
        {currentView === 'register' && <UserRegistration 
          setCurrentView={setCurrentView} 
          userRole={userRole}
          setUserRole={setUserRole}
          isAuthenticated={isAuthenticated}
          setIsAuthenticated={setIsAuthenticated}
          setCurrentUserId={setCurrentUserId}
          setCurrentUserName={setCurrentUserName}
          agentProfile={agentProfile}
          setAgentProfile={setAgentProfile}
        />}
        {currentView === 'forgot-password' && <ForgotPassword 
          setCurrentView={setCurrentView} 
          userRole={userRole}
          isAuthenticated={isAuthenticated}
          setIsAuthenticated={setIsAuthenticated}
          toast={toast}
        />}
        {currentView === 'payment-methods' && <PaymentMethods 
          setCurrentView={setCurrentView} 
          userRole={userRole}
          isAuthenticated={isAuthenticated}
          toast={toast}
        />}
        {currentView === 'price-breakdown' && <PriceBreakdown 
          setCurrentView={setCurrentView} 
          userRole={userRole}
          isAuthenticated={isAuthenticated}
          toast={toast}
        />}
        {currentView === 'budget-driver-finder' && <BudgetDriverFinder 
          setCurrentView={setCurrentView} 
          userRole={userRole}
          isAuthenticated={isAuthenticated}
          toast={toast}
        />}
        {currentView === 'social-share' && <SocialShare 
          setCurrentView={setCurrentView} 
          userRole={userRole}
          isAuthenticated={isAuthenticated}
          toast={toast}
        />}
      </main>
      <MobileBottomNav 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        userRole={userRole} 
        setUserRole={setUserRole} 
        isAuthenticated={isAuthenticated} 
        setIsAuthenticated={setIsAuthenticated} 
        setCurrentUserId={setCurrentUserId} 
        setCurrentUserName={setCurrentUserName}
        agentProfile={agentProfile}
        setAgentProfile={setAgentProfile}
        withdrawalRequests={withdrawalRequests}
        setWithdrawalRequests={setWithdrawalRequests}
      />
    </div>
  );
};

export default Index;
