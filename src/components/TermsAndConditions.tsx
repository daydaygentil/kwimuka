
import { ArrowLeft, FileText, Shield, Clock, Truck, Users, ClipboardCheck } from "lucide-react";

interface TermsAndConditionsProps {
  onBack: () => void;
}

const TermsAndConditions = ({ onBack }: TermsAndConditionsProps) => {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 ml-4">Terms and Conditions</h1>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 space-y-8">
          {/* Moving Policies */}
          <section>
            <div className="flex items-center mb-4">
              <FileText className="h-6 w-6 text-green-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Moving Policies</h2>
            </div>
            <div className="space-y-3 text-gray-700">
              <p>• All moving services must be scheduled at least 24 hours in advance</p>
              <p>• Customers must provide accurate pickup and delivery addresses</p>
              <p>• EasyMove reserves the right to adjust pricing based on actual distance and complexity</p>
              <p>• Fragile items must be declared during order placement</p>
              <p>• Service fees are non-refundable once the moving process begins</p>
            </div>
          </section>

          {/* Driver Responsibilities */}
          <section>
            <div className="flex items-center mb-4">
              <Users className="h-6 w-6 text-blue-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Driver Responsibilities</h2>
            </div>
            <div className="space-y-3 text-gray-700">
              <p>• Drivers must arrive within the agreed time window</p>
              <p>• Professional handling of all customer belongings</p>
              <p>• Proper use of moving equipment and protective materials</p>
              <p>• Clear communication with customers throughout the process</p>
              <p>• Completion of pre and post-move inspection reports</p>
            </div>
          </section>

          {/* Timing and Punctuality */}
          <section>
            <div className="flex items-center mb-4">
              <Clock className="h-6 w-6 text-orange-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Timing and Punctuality</h2>
            </div>
            <div className="space-y-3 text-gray-700">
              <p>• Standard service window is 2 hours for pickup time</p>
              <p>• Drivers will contact customers 30 minutes before arrival</p>
              <p>• Delays due to traffic or weather will be communicated immediately</p>
              <p>• Customers should be ready 15 minutes before scheduled pickup</p>
              <p>• Rescheduling requires 12 hours advance notice</p>
            </div>
          </section>

          {/* Security Handling */}
          <section>
            <div className="flex items-center mb-4">
              <Shield className="h-6 w-6 text-purple-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Security and Safety</h2>
            </div>
            <div className="space-y-3 text-gray-700">
              <p>• All drivers undergo background checks and training</p>
              <p>• Items are insured up to 500,000 RWF during transport</p>
              <p>• Customers must secure valuable items separately</p>
              <p>• Photo documentation at pickup and delivery points</p>
              <p>• Real-time GPS tracking available for all moves</p>
            </div>
          </section>

          {/* Furniture Handling */}
          <section>
            <div className="flex items-center mb-4">
              <Truck className="h-6 w-6 text-red-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Furniture Handling</h2>
            </div>
            <div className="space-y-3 text-gray-700">
              <p>• Disassembly and reassembly services available upon request</p>
              <p>• Protective wrapping included for all furniture pieces</p>
              <p>• Heavy items require minimum 2 helpers</p>
              <p>• Customer must indicate fragile or antique items</p>
              <p>• Stairs and elevator access must be specified during booking</p>
            </div>
          </section>

          {/* Service Delivery Process */}
          <section>
            <div className="flex items-center mb-4">
              <ClipboardCheck className="h-6 w-6 text-green-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Service Delivery Process</h2>
            </div>
            <div className="space-y-3 text-gray-700">
              <p>• Order confirmation within 2 hours of placement</p>
              <p>• Driver assignment notification sent via SMS</p>
              <p>• Pre-move call 24 hours before scheduled service</p>
              <p>• Real-time status updates throughout the move</p>
              <p>• Post-service quality check and feedback collection</p>
            </div>
          </section>

          {/* Payment Process */}
          <section>
            <div className="flex items-center mb-4">
              <FileText className="h-6 w-6 text-indigo-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Payment and Confirmation</h2>
            </div>
            <div className="space-y-3 text-gray-700">
              <p>• Payment due upon completion of service</p>
              <p>• Accepted payment methods: Cash, Mobile Money, Bank Transfer</p>
              <p>• Service fee (15,000 RWF) is charged for all orders</p>
              <p>• Additional charges apply for overtime or extra services</p>
              <p>• Receipt provided immediately after payment</p>
            </div>
          </section>

          {/* Contact Information */}
          <section className="bg-green-50 p-6 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3">Contact Information</h3>
            <div className="space-y-2 text-gray-700">
              <p><strong>Customer Service:</strong> +250 788 123 456</p>
              <p><strong>Emergency Line:</strong> +250 788 123 457</p>
              <p><strong>Email:</strong> support@easymove.rw</p>
              <p><strong>Operating Hours:</strong> Monday - Sunday, 6:00 AM - 10:00 PM</p>
            </div>
          </section>

          <div className="text-sm text-gray-600 pt-4 border-t">
            <p>By using EasyMove services, you agree to these terms and conditions. Last updated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
