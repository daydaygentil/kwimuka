import { useState, useEffect } from "react";
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
import { Worker, JobAssignment, ServiceNotification, WorkerType } from '@/types/worker';
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
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { useNotifications } from "@/hooks/useNotifications";
import { useJobApplications } from "@/hooks/useJobApplications";

export type UserRole = 'customer' | 'driver' | 'admin' | 'helper' | 'cleaner';
export type OrderStatus = 'pending' | 'assigned' | 'in-progress' | 'completed';
export type ViewType = 'home' | 'order' | 'receipt' | 'driver' | 'admin' | 'track' | 'unified-login' | 'apply-jobs' | 'help' | 'terms' | 'register' | 'forgot-password';

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
const parseCoordinates = (coords: any): { lat: number; lng: number } | undefined => {
  if (!coords || typeof coords !== 'object') return undefined;
  if (typeof coords.lat === 'number' && typeof coords.lng === 'number') {
    return { lat: coords.lat, lng: coords.lng };
  }
  return undefined;
};

// Helper function to parse services from JSON
const parseServices = (services: any) => {
  if (!services || typeof services !== 'object') {
    return {
      transport: false,
      helpers: 0,
      cleaning: false,
      keyDelivery: false
    };
  }
  
  return {
    transport: Boolean(services.transport),
    helpers: Number(services.helpers) || 0,
    cleaning: Boolean(services.cleaning),
    keyDelivery: Boolean(services.keyDelivery)
  };
};

const Index = () => {
  const { toast } = useToast();
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [userRole, setUserRole] = useState<UserRole>('customer');
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [currentUserName, setCurrentUserName] = useState<string>('');
  
  // Initialize hooks
  const { notifications: realNotifications, unreadCount, markAsRead, createNotification } = useNotifications(currentUserId);
  const { submitJobApplication, isSubmitting: isSubmittingJob } = useJobApplications();

  const [userAccounts, setUserAccounts] = useState<UserAccount[]>([
    {
      id: 'admin1',
      name: 'Admin User',
      phone: 'admin',
      password: 'admin123',
      role: 'admin',
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
      }

      // Prepare SMS message
      const smsMessage = `Hello ${order.customerName}, your Kwimuka order #${order.id} has been confirmed! ${order.isVip ? 'VIP Service' : 'Standard Service'} - Total: ${order.totalCost.toLocaleString()} RWF. We'll contact you shortly with driver details.`;
      
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
      console.log(`Your ${assignment.serviceType} was accepted by ${worker.name}.`);
    }
  };

  const handleDeclineJob = (jobId: string) => {
    setNotifications(prev => prev.filter(n => n.jobAssignmentId !== jobId));
    
    const assignment = jobAssignments.find(a => a.id === jobId);
    if (assignment) {
      setTimeout(() => reassignJob(assignment), 1000);
    }
  };

  const handleMarkNotificationRead = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
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
    const protectedViews = ['driver', 'admin'];
    if (protectedViews.includes(view) && !isAuthenticated) {
      setCurrentView('unified-login');
      return;
    }
    setCurrentView(view as ViewType);
  };

  const handleJobApplication = async (application: Omit<JobApplication, 'id' | 'status' | 'submittedAt'>) => {
    const success = await submitJobApplication({
      name: application.name,
      phone: application.phone,
      job_role: application.jobRole,
      message: application.message
    });

    if (success) {
      // Also add to local state for immediate UI update
      const newApplication: JobApplication = {
        ...application,
        id: `temp_${Date.now()}`,
        status: 'pending',
        submittedAt: new Date()
      };
      setJobApplications(prev => [...prev, newApplication]);
    }
  };

  const handleLogin = (success: boolean, role: string, userId?: string, userName?: string) => {
    if (success && userId && userName) {
      setIsAuthenticated(true);
      setUserRole(role as UserRole);
      setCurrentUserId(userId);
      setCurrentUserName(userName);
      
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

  const handleUserRegistration = async (userData: { name: string; phone: string; password: string }) => {
    try {
      console.log('Registering user with Supabase Auth...');
      
      // Sign up with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: `${userData.phone}@kwimuka.com`, // Create a dummy email using phone
        password: userData.password,
        options: {
          data: {
            name: userData.name,
            phone: userData.phone
          }
        }
      });

      if (error) {
        console.error('Supabase signup error:', error);
        toast({
          title: "Registration Failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      console.log('User registered successfully:', data);
      
      // The trigger will automatically insert into users table
      toast({
        title: "✅ Registration Successful!",
        description: "Your account has been created successfully. You can now log in.",
        variant: "default",
      });
      
      setCurrentView('unified-login');
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: "An unexpected error occurred during registration.",
        variant: "destructive",
      });
    }
  };

  const handleDriverConfirmation = (orderId: string, driverId: string) => {
    const order = orders.find(o => o.id === orderId);
    const driver = workers.find(w => w.id === driverId);
    
    if (order && driver && smsSettings.isActive) {
      const smsMessage = smsSettings.message
        .replace('{driverName}', driver.name)
        .replace('{customerPhone}', order.phoneNumber);
      
      console.log(`SMS sent to ${order.phoneNumber}: ${smsMessage}`);
    }
  };

  const handleCancelOrder = (orderId: string) => {
    setOrders(prev => prev.map(o => 
      o.id === orderId ? { ...o, status: 'pending' as OrderStatus } : o
    ));
    
    setJobAssignments(prev => prev.map(ja => 
      ja.orderId === orderId ? { ...ja, status: 'pending', assignedWorker: undefined } : ja
    ));
    
    console.log(`Order ${orderId} has been cancelled`);
  };

  const handleSMSSettingsUpdate = (newMessage: string) => {
    setSmsSettings(prev => ({
      ...prev,
      message: newMessage,
      updatedAt: new Date()
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
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

      <div className="pb-20 md:pb-0">
        {currentView === 'home' && (
          <div>
            <Homepage 
              onPlaceOrder={() => setCurrentView('order')}
              onTrackOrder={() => setCurrentView('track')}
              onApplyJobs={() => setCurrentView('apply-jobs')}
              onHelp={() => setCurrentView('help')}
              onTerms={() => setCurrentView('terms')}
            />
            <div className="max-w-7xl mx-auto px-4 py-6">
              <div className="flex justify-center">
                <SocialShare />
              </div>
            </div>
          </div>
        )}
        
        {currentView === 'order' && (
          <OrderForm 
            onOrderSubmit={handleOrderSubmit}
            onBack={() => setCurrentView('home')}
            isAuthenticated={isAuthenticated}
            currentUserName={currentUserName}
            currentUserPhone={userAccounts.find(u => u.id === currentUserId)?.phone || ''}
            userOrders={orders.filter(o => 
              isAuthenticated && (
                o.customerName === currentUserName || 
                o.phoneNumber === userAccounts.find(u => u.id === currentUserId)?.phone
              )
            )}
          />
        )}
        
        {currentView === 'receipt' && currentOrder && (
          <div>
            <OrderReceipt 
              order={currentOrder}
              onBack={() => setCurrentView('home')}
              onTrackOrder={() => setCurrentView('track')}
            />
            <div className="max-w-2xl mx-auto px-4 mt-6">
              <ServiceStatusTracker 
                jobAssignments={jobAssignments}
                orderId={currentOrder.id}
              />
            </div>
          </div>
        )}

        {currentView === 'track' && (
          <TrackOrder 
            orders={orders}
            jobAssignments={jobAssignments}
            onBack={() => setCurrentView('home')}
          />
        )}

        {currentView === 'register' && (
          <UserRegistration 
            onRegister={handleUserRegistration}
            onBack={() => setCurrentView('home')}
            onLoginClick={() => setCurrentView('unified-login')}
          />
        )}

        {currentView === 'forgot-password' && (
          <ForgotPassword 
            onBack={() => setCurrentView('unified-login')}
            onResetSuccess={() => setCurrentView('unified-login')}
          />
        )}

        {currentView === 'unified-login' && (
          <UnifiedLogin 
            onLogin={handleLogin}
            onBack={() => setCurrentView('home')}
            onRegister={() => setCurrentView('register')}
            onForgotPassword={() => setCurrentView('forgot-password')}
            userAccounts={userAccounts}
          />
        )}
        
        {currentView === 'driver' && isAuthenticated && (
          <div className="relative">
            <div className="absolute top-4 right-4 z-10">
              <WorkerNotificationPanel
                workerId={currentUserId}
                notifications={notifications}
                jobAssignments={jobAssignments}
                onAcceptJob={handleAcceptJob}
                onDeclineJob={handleDeclineJob}
                onMarkNotificationRead={handleMarkNotificationRead}
              />
            </div>
            <DriverView 
              orders={orders.filter(o => 
                jobAssignments.some(ja => 
                  ja.orderId === o.id && 
                  ja.assignedWorker?.id === currentUserId
                )
              )}
              onUpdateOrder={(orderId, status) => {
                setOrders(prev => prev.map(o => 
                  o.id === orderId ? { ...o, status } : o
                ));
                
                setJobAssignments(prev => prev.map(ja => 
                  ja.orderId === orderId && ja.assignedWorker?.id === currentUserId
                    ? { ...ja, status: status === 'completed' ? 'completed' : 'in-progress' }
                    : ja
                ));
              }}
              onCancelOrder={handleCancelOrder}
              driverId={currentUserId}
              userName={currentUserName}
              userRole={userRole}
              onLogout={handleLogout}
            />
          </div>
        )}
        
        {currentView === 'admin' && isAuthenticated && userRole === 'admin' && (
          <AdminPanel 
            orders={orders}
            jobApplications={jobApplications}
            jobAssignments={jobAssignments}
            workers={workers}
            notifications={notifications}
            userAccounts={userAccounts}
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
            onUpdateUserAccounts={setUserAccounts}
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
