
import { Truck, Users, Sparkles, Key, ArrowRight, Phone, MapPin, Search, Briefcase } from "lucide-react";

interface HomepageProps {
  onPlaceOrder: () => void;
  onTrackOrder: () => void;
  onApplyJobs: () => void;
  onHelp: () => void;
}

const Homepage = ({ onPlaceOrder, onTrackOrder, onApplyJobs, onHelp }: HomepageProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      {/* Hero Section */}
      <div className="px-4 pt-8 md:pt-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-green-600 p-4 rounded-full">
              <Truck className="h-12 w-12 text-white" />
            </div>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            Fast & Easy Moving Services
            <span className="block text-green-600">in Rwanda</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Professional moving, cleaning, and delivery services at your fingertips. 
            Get instant quotes and book trusted helpers today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button
              onClick={onPlaceOrder}
              className="bg-green-600 hover:bg-green-700 text-white text-lg font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
            >
              Place an Order
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>

            <button
              onClick={onTrackOrder}
              className="bg-white hover:bg-gray-50 text-green-600 border-2 border-green-600 text-lg font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
            >
              Track Order
              <Search className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={onApplyJobs}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow text-left"
            >
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Briefcase className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-900">Apply for Jobs</h3>
                  <p className="text-gray-600 text-sm">Join our team of helpers and drivers</p>
                </div>
              </div>
            </button>

            <button
              onClick={onHelp}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow text-left"
            >
              <div className="flex items-center">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Phone className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-900">Need Help?</h3>
                  <p className="text-gray-600 text-sm">Get support and FAQs</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12">
            Our Services
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-blue-100 p-3 rounded-lg w-fit mb-4">
                <Truck className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Truck Transport</h3>
              <p className="text-gray-600 text-sm mb-3">Professional moving with our reliable trucks</p>
              <p className="font-bold text-green-600">40,000 RWF</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-orange-100 p-3 rounded-lg w-fit mb-4">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Moving Helpers</h3>
              <p className="text-gray-600 text-sm mb-3">Experienced helpers to assist your move</p>
              <p className="font-bold text-green-600">10,000 RWF/person</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-purple-100 p-3 rounded-lg w-fit mb-4">
                <Sparkles className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Cleaning Service</h3>
              <p className="text-gray-600 text-sm mb-3">Deep cleaning for your old or new place</p>
              <p className="font-bold text-green-600">5,000 RWF</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-green-100 p-3 rounded-lg w-fit mb-4">
                <Key className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Key Delivery</h3>
              <p className="text-gray-600 text-sm mb-3">Secure key handover service</p>
              <p className="font-bold text-green-600">5,000 RWF</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
            Need Help?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-center justify-center space-x-3">
              <div className="bg-green-100 p-3 rounded-full">
                <Phone className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Call Us</p>
                <p className="text-green-600">+250 788 123 456</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-3">
              <div className="bg-green-100 p-3 rounded-full">
                <MapPin className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Service Area</p>
                <p className="text-green-600">All of Kigali</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
