
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface JobApplication {
  id: string;
  name: string;
  phone: string;
  job_role: 'driver' | 'helper' | 'cleaner';
  message?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

export const useJobApplications = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const submitJobApplication = useCallback(async (applicationData: {
    name: string;
    phone: string;
    job_role: 'driver' | 'helper' | 'cleaner';
    message?: string;
  }) => {
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('job_applications')
        .insert([applicationData])
        .select()
        .single();

      if (error) {
        console.error('Error submitting job application:', error);
        toast({
          title: "Application Failed",
          description: "Failed to submit your job application. Please try again.",
          variant: "destructive",
        });
        return false;
      }

      console.log('Job application submitted successfully:', data);
      toast({
        title: "✅ Application Submitted!",
        description: "Your job application has been submitted successfully. We'll contact you soon.",
        variant: "default",
      });

      return true;
    } catch (error) {
      console.error('Unexpected error submitting job application:', error);
      toast({
        title: "Application Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [toast]);

  const fetchJobApplications = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('job_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching job applications:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Unexpected error fetching job applications:', error);
      return [];
    }
  }, []);

  const updateJobApplicationStatus = useCallback(async (
    applicationId: string, 
    status: 'pending' | 'approved' | 'rejected'
  ) => {
    try {
      const { error } = await supabase
        .from('job_applications')
        .update({ status })
        .eq('id', applicationId);

      if (error) {
        console.error('Error updating job application status:', error);
        toast({
          title: "Update Failed",
          description: "Failed to update application status.",
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Status Updated",
        description: `Application status updated to ${status}.`,
        variant: "default",
      });

      return true;
    } catch (error) {
      console.error('Unexpected error updating job application:', error);
      toast({
        title: "Update Failed",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
      return false;
    }
  }, [toast]);

  return {
    submitJobApplication,
    fetchJobApplications,
    updateJobApplicationStatus,
    isSubmitting
  };
};
