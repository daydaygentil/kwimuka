
import { ArrowLeft, Truck, Users, Sparkles, Key, Phone, MapPin, Clock, DollarSign } from "lucide-react";

interface HelpPageProps {
  onBack: () => void;
}

const HelpPage = ({ onBack }: HelpPageProps) => {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center text-green-600 hover:text-green-700 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Home
        </button>

        <div className="bg-white p-8 rounded-xl shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Help & Support</h1>
          <p className="text-gray-600 mb-8">Everything you need to know about EasyMove services</p>

          {/* Services Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Services</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-200 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 p-3 rounded-lg mr-4">
                    <Truck className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Truck Transport</h3>
                    <p className="text-green-600 font-bold">40,000 RWF</p>
                  </div>
                </div>
                <p className="text-gray-600">
                  Professional moving service with our reliable trucks. Perfect for moving furniture, 
                  appliances, and large items safely across Kigali.
                </p>
              </div>

              <div className="border border-gray-200 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <div className="bg-orange-100 p-3 rounded-lg mr-4">
                    <Users className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Moving Helpers</h3>
                    <p className="text-green-600 font-bold">10,000 RWF per person</p>
                  </div>
                </div>
                <p className="text-gray-600">
                  Experienced helpers to assist with packing, loading, unloading, and arranging your items. 
                  You can hire 1-4 helpers based on your needs.
                </p>
              </div>

              <div className="border border-gray-200 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <div className="bg-purple-100 p-3 rounded-lg mr-4">
                    <Sparkles className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Cleaning Service</h3>
                    <p className="text-green-600 font-bold">5,000 RWF</p>
                  </div>
                </div>
                <p className="text-gray-600">
                  Deep cleaning service for your old or new place. Includes cleaning floors, windows, 
                  bathrooms, and kitchen areas to ensure everything is spotless.
                </p>
              </div>

              <div className="border border-gray-200 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <div className="bg-green-100 p-3 rounded-lg mr-4">
                    <Key className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Key Delivery</h3>
                    <p className="text-green-600 font-bold">5,000 RWF</p>
                  </div>
                </div>
                <p className="text-gray-600">
                  Secure key handover service between landlords and tenants. We ensure safe and 
                  documented key delivery with proper verification.
                </p>
              </div>
            </div>
          </section>

          {/* How It Works */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">How Orders Work</h2>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">1</div>
                <div>
                  <h3 className="font-semibold text-gray-900">Place Your Order</h3>
                  <p className="text-gray-600">Fill out the order form with pickup and delivery addresses, select your services, and get an instant quote.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">2</div>
                <div>
                  <h3 className="font-semibold text-gray-900">Confirm & Pay</h3>
                  <p className="text-gray-600">Review your order details, confirm the total cost, and receive your unique Order ID.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">3</div>
                <div>
                  <h3 className="font-semibold text-gray-900">Driver Assignment</h3>
                  <p className="text-gray-600">Our admin team assigns a qualified driver and helpers to your order.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">4</div>
                <div>
                  <h3 className="font-semibold text-gray-900">Service Delivery</h3>
                  <p className="text-gray-600">Our team arrives at your pickup location and completes the move according to your requirements.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Order Tracking */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Tracking</h2>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">How to Track Your Order</h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-600">
                <li>Go to the "Track Order" page or click "Track Order" on your receipt</li>
                <li>Enter your 6-digit Order ID (e.g., 123456)</li>
                <li>View your order status, assigned driver, and delivery details</li>
              </ol>
              
              <div className="mt-4">
                <h4 className="font-medium text-gray-900 mb-2">Order Status Meanings:</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">Pending</span>
                    <span className="text-gray-600">Order received, waiting for driver assignment</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">Assigned</span>
                    <span className="text-gray-600">Driver assigned, preparing for pickup</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs">In Progress</span>
                    <span className="text-gray-600">Moving service in progress</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Completed</span>
                    <span className="text-gray-600">Order successfully completed</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">What areas do you serve?</h3>
                <p className="text-gray-600">We currently serve all areas within Kigali city. Contact us for specific location availability.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">How is the cost calculated?</h3>
                <p className="text-gray-600">Cost is based on selected services plus a 15,000 RWF service fee. Distance is automatically calculated using GPS coordinates.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Can I modify my order after placing it?</h3>
                <p className="text-gray-600">Please contact us immediately at +250 788 123 456 if you need to modify your order. Changes may incur additional fees.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">What if my items are damaged during the move?</h3>
                <p className="text-gray-600">We take great care with all items. In the rare event of damage, please contact us immediately for resolution.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">How long does a typical move take?</h3>
                <p className="text-gray-600">Move duration depends on distance, amount of items, and selected services. Typical local moves take 2-4 hours.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Do you provide packing materials?</h3>
                <p className="text-gray-600">Basic packing materials are included with helper service. For extensive packing needs, please mention this when placing your order.</p>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Us</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-3 rounded-full">
                  <Phone className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Call Us</p>
                  <p className="text-green-600">+250 788 123 456</p>
                  <p className="text-sm text-gray-600">Available 7 days a week</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-3 rounded-full">
                  <Clock className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Business Hours</p>
                  <p className="text-gray-600">6:00 AM - 8:00 PM</p>
                  <p className="text-sm text-gray-600">Monday to Sunday</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
