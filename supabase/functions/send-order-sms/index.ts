
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SMSRequest {
  orderId: string;
  phoneNumber: string;
  customerName: string;
  driverName?: string;
  message: string;
}

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orderId, phoneNumber, customerName, driverName, message }: SMSRequest = await req.json();
    
    console.log(`Sending SMS for order ${orderId} to ${phoneNumber}`);

    // Simulate SMS sending (in a real implementation, you'd use a service like Twilio)
    const smsSuccess = Math.random() > 0.1; // 90% success rate for demo
    const timestamp = new Date().toISOString();
    
    if (smsSuccess) {
      // Log successful SMS
      const { error: logError } = await supabase
        .from('sms_logs')
        .insert({
          order_id: orderId,
          phone_number: phoneNumber,
          message: message,
          status: 'sent',
          timestamp: timestamp
        });

      if (logError) {
        console.error('Error logging SMS:', logError);
      }

      // Update order SMS status
      const { error: updateError } = await supabase
        .from('orders')
        .update({ 
          sms_status: 'sent',
          sms_error: null
        })
        .eq('id', orderId);

      if (updateError) {
        console.error('Error updating order SMS status:', updateError);
      }

      console.log(`SMS sent successfully to ${phoneNumber} for order ${orderId}`);
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'SMS sent successfully',
          orderId: orderId
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    } else {
      // Simulate SMS failure with different types of errors
      const errorTypes = [
        'SMS gateway timeout',
        'Invalid phone number format',
        'Network connectivity issue',
        'SMS service temporarily unavailable'
      ];
      const errorMessage = errorTypes[Math.floor(Math.random() * errorTypes.length)];
      
      // Log failed SMS
      const { error: logError } = await supabase
        .from('sms_logs')
        .insert({
          order_id: orderId,
          phone_number: phoneNumber,
          message: message,
          status: 'failed',
          error: errorMessage,
          timestamp: timestamp
        });

      if (logError) {
        console.error('Error logging SMS failure:', logError);
      }

      // Update order SMS status
      const { error: updateError } = await supabase
        .from('orders')
        .update({ 
          sms_status: 'failed',
          sms_error: errorMessage
        })
        .eq('id', orderId);

      if (updateError) {
        console.error('Error updating order SMS status:', updateError);
      }

      console.log(`SMS failed for ${phoneNumber} for order ${orderId}: ${errorMessage}`);
      
      // Return clear failure response with 500 status as requested
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: errorMessage,
          orderId: orderId
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
  } catch (error: any) {
    console.error("Error in send-order-sms function:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: `Unexpected error: ${error.message}` 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
