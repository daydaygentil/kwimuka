import { useState, useCallback } from "react";
import { Lock, User, ArrowLeft, Shield, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { AuthError, AuthResponse } from '@supabase/supabase-js';
import type { ProfilesTable } from '@/types/supabase';

type UserRole = 'admin' | 'agent' | 'driver' | 'helper' | 'cleaner' | 'customer';

interface LoginError extends Error {
  code?: string;
  message: string;
  details?: string;
}

interface UnifiedLoginProps {
  onLogin: (success: boolean, userRole: UserRole, userId?: string, userName?: string) => void;
  onBack: () => void;
  onRegister?: () => void;
  onForgotPassword?: () => void;
  setCurrentView: (view: string) => void;
}

const retryOperation = async <T,>(operation: () => Promise<T>, maxRetries = 3, delay = 1000): Promise<T> => {
  let lastError: Error | undefined;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      if (i === maxRetries - 1) throw lastError;
      await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
    }
  }
  
  throw lastError;
};

const UnifiedLogin = ({ 
  onLogin, 
  onBack, 
  onRegister, 
  onForgotPassword, 
  setCurrentView 
}: UnifiedLoginProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleRoleBasedRedirect = (role: UserRole) => {
    switch (role) {
      case 'admin':
        setCurrentView('admin');
        break;
      case 'agent':
        setCurrentView('agent');
        break;
      case 'driver':
      case 'helper':
      case 'cleaner':
        setCurrentView('driver');
        break;
      default:
        setCurrentView('home');
    }
  };

  const handleDatabaseError = useCallback((error: AuthError | Error): string => {
    console.error('Database error:', error);
    if ('code' in error) {
      switch (error.code) {
        case 'PGRST116':
          return "No account found with this email";
        case 'AUTH_INVALID_CREDENTIALS':
          return "Invalid email or password";
        default:
          return error.message;
      }
    }
    if (error.message.toLowerCase().includes('network')) {
      return "Network error. Please check your connection";
    }
    if (error.message.toLowerCase().includes('timeout')) {
      return "Server is taking too long to respond. Please try again";
    }
    return "Error connecting to server. Please try again later";
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Attempt login with retry
      const authResult = await retryOperation(async () => {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: username,
          password: password,
        });

        if (error) throw error;
        if (!data.user) throw new Error("Login failed: No user data received");
        return data;
      });

      // Get user profile with retry
      const profileResult = await retryOperation(async () => {
        const { data, error } = await supabase
          .from('profiles')
          .select('role, name')
          .eq('id', authResult.user.id)
          .single();

        if (error) throw error;
        if (!data) throw new Error("Profile not found");
        return data;
      });

      if (!profileResult.role || !['admin', 'agent', 'driver', 'helper', 'cleaner', 'customer'].includes(profileResult.role)) {
        throw new Error("Invalid user role. Please contact support");
      }

      toast({
        title: "Login successful",
        description: `Welcome back, ${profileResult.name || authResult.user.email}!`,
        variant: "default",
      });

      onLogin(true, profileResult.role as UserRole, authResult.user.id, profileResult.name || authResult.user.email);
      handleRoleBasedRedirect(profileResult.role as UserRole);

    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(handleDatabaseError(err instanceof Error ? err : new Error(errorMessage)));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="max-w-md mx-auto">
        <button
          onClick={() => setCurrentView('home')}
          className="flex items-center text-green-600 hover:text-green-700 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Home
        </button>

        <div className="bg-white p-8 rounded-xl shadow-sm">
          <div className="text-center mb-6">
            <div className="bg-green-100 p-3 rounded-full w-fit mx-auto mb-4">
              <Shield className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Login to Kwimuka</h1>
            <p className="text-gray-600">Access your dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number or Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter phone number or username"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>

          <div className="mt-6 space-y-4">
            {onForgotPassword && (
              <div className="text-center">
                <button
                  onClick={onForgotPassword}
                  className="text-green-600 hover:text-green-700 font-medium text-sm"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            {onRegister && (
              <div className="text-center">
                <p className="text-gray-600">
                  Don't have an account?{" "}
                  <button
                    onClick={onRegister}
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    Create Account
                  </button>
                </p>
              </div>
            )}

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 text-center mb-2">
                <strong>Demo Accounts:</strong>
              </p>
              <div className="space-y-1 text-xs text-gray-600">
                <p><strong>Admin:</strong> admin / admin123</p>
                <p><strong>Agent:</strong> agent / agent123</p>
                <p><strong>Driver:</strong> john / john123</p>
                <p><strong>Helper:</strong> helper1 / helper123</p>
                <p><strong>Cleaner:</strong> cleaner1 / cleaner123</p>
                <p><strong>Customer:</strong> customer / customer123</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedLogin;
