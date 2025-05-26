import { Truck, Users, Sparkles, Key, MapPin, Phone, Clock, Star } from "lucide-react";

interface HomepageProps {
  onPlaceOrder: () => void;
  onTrackOrder: () => void;
  onApplyJobs: () => void;
  onHelp: () => void;
  onTerms: () => void;
}

const Homepage = ({ onPlaceOrder, onTrackOrder, onApplyJobs, onHelp, onTerms }: HomepageProps) => {
  const services = [
    {
      icon: Truck,
      title: "Truck Transport",
      description: "Professional moving trucks with experienced drivers",
      price: "40,000 RWF"
    },
    {
      icon: Users,
      title: "Moving Helpers",
      description: "Skilled workers to help with packing and loading",
      price: "10,000 RWF each"
    },
    {
      icon: Sparkles,
      title: "Cleaning Service",
      description: "Deep cleaning for your old and new location",
      price: "5,000 RWF"
    },
    {
      icon: Key,
      title: "Key Delivery",
      description: "Secure key handover service",
      price: "5,000 RWF"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Hero Section */}
      <div className="px-4 py-8 md:py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <Truck className="h-12 w-12 text-green-600 mr-3" />
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900">EasyMove</h1>
          </div>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-8">
            Fast & Easy Moving Services in Rwanda
          </p>
          
          <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto">
            Professional moving services with real-time tracking, experienced drivers, 
            and comprehensive support for all your relocation needs.
          </p>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
            <button
              onClick={onPlaceOrder}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors shadow-lg hover:shadow-xl"
            >
              Place an Order
            </button>
            
            <button
              onClick={onTrackOrder}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors shadow-lg hover:shadow-xl"
            >
              Track Order
            </button>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="px-4 py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Services</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div key={index} className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition-shadow">
                  <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{service.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{service.description}</p>
                  <p className="text-green-600 font-semibold">{service.price}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="px-4 py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Why Choose EasyMove?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Fast & Reliable</h3>
              <p className="text-gray-600">Quick response times and dependable service you can count on.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Real-time Tracking</h3>
              <p className="text-gray-600">Track your order status and driver location in real-time.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Professional Team</h3>
              <p className="text-gray-600">Experienced drivers and helpers trained for safe moving.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Job Opportunities Section */}
      <div className="px-4 py-16 bg-green-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Join Our Team</h2>
          <p className="text-green-100 text-lg mb-8">
            Looking for work? Apply to become a driver, helper, or cleaner with EasyMove.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white bg-opacity-10 p-6 rounded-xl">
              <Truck className="h-8 w-8 text-white mx-auto mb-3" />
              <h3 className="font-semibold text-white mb-2">Drivers</h3>
              <p className="text-green-100 text-sm">Drive our trucks and earn competitive rates</p>
            </div>
            
            <div className="bg-white bg-opacity-10 p-6 rounded-xl">
              <Users className="h-8 w-8 text-white mx-auto mb-3" />
              <h3 className="font-semibold text-white mb-2">Helpers</h3>
              <p className="text-green-100 text-sm">Assist with loading and moving items</p>
            </div>
            
            <div className="bg-white bg-opacity-10 p-6 rounded-xl">
              <Sparkles className="h-8 w-8 text-white mx-auto mb-3" />
              <h3 className="font-semibold text-white mb-2">Cleaners</h3>
              <p className="text-green-100 text-sm">Provide cleaning services for moves</p>
            </div>
          </div>
          
          <button
            onClick={onApplyJobs}
            className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3 rounded-xl font-semibold transition-colors"
          >
            Apply for Jobs
          </button>
        </div>
      </div>

      {/* Contact Section */}
      <div className="px-4 py-16 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Need Help?</h2>
          <p className="text-gray-600 text-lg mb-8">
            Have questions about our services or need assistance with your order?
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              onClick={onHelp}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              Get Help & FAQ
            </button>
            
            <button
              onClick={onTerms}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              Terms & Conditions
            </button>
          </div>
          
          <div className="mt-8 flex items-center justify-center text-gray-600">
            <Phone className="h-5 w-5 mr-2" />
            <span>24/7 Support: +250 788 123 456</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
