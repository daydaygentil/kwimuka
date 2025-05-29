
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

async function sendTwilioSMS(to: string, body: string): Promise<{ success: boolean; error?: string }> {
  const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
  const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
  const fromNumber = Deno.env.get('TWILIO_PHONE_NUMBER');

  if (!accountSid || !authToken || !fromNumber) {
    return { success: false, error: 'Twilio credentials not configured' };
  }

  try {
    const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    const credentials = btoa(`${accountSid}:${authToken}`);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        To: to,
        From: fromNumber,
        Body: body,
      }),
    });

    if (response.ok) {
      console.log(`SMS sent successfully via Twilio to ${to}`);
      return { success: true };
    } else {
      const errorData = await response.text();
      console.error('Twilio API error:', errorData);
      return { success: false, error: `Twilio API error: ${response.status}` };
    }
  } catch (error) {
    console.error('Error sending SMS via Twilio:', error);
    return { success: false, error: `Network error: ${error.message}` };
  }
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orderId, phoneNumber, customerName, driverName, message }: SMSRequest = await req.json();
    
    console.log(`Sending SMS for order ${orderId} to ${phoneNumber}`);

    // Format phone number for Twilio (ensure it starts with +)
    const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
    
    // Send SMS via Twilio
    const smsResult = await sendTwilioSMS(formattedPhone, message);
    const timestamp = new Date().toISOString();
    
    if (smsResult.success) {
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
          message: 'SMS sent successfully via Twilio',
          orderId: orderId
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    } else {
      const errorMessage = smsResult.error || 'Unknown Twilio error';
      
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
