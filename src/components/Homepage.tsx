import { 
  Truck, Users, Sparkles, Key, MapPin, Phone, Clock, Star, 
  CheckCircle, Eye, UserCheck, MapPin as Location, Smartphone, 
  Apple, Crown, Plus, Search, HelpCircle, FileText, UserPlus 
} from "lucide-react";

import { ViewType } from '@/pages/Index';

interface HomepageProps {
  setCurrentView: (view: ViewType) => void;
}

const Homepage = ({ setCurrentView }: { setCurrentView: (view: string) => void }) => {
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
    },
    {
      icon: Star,
      title: "VIP Moving Service",
      description: "Premium experience with certified professionals",
      price: "140,000 RWF",
      isVip: true
    }
  ];

  const howItWorksSteps = [
    {
      icon: CheckCircle,
      title: "Book Your Move",
      description: "Choose your services and confirm the order."
    },
    {
      icon: Eye,
      title: "Track Your Order",
      description: "Get real-time updates on pickup and delivery."
    },
    {
      icon: UserCheck,
      title: "Get Help",
      description: "Our professional helpers assist with moving and cleaning."
    },
    {
      icon: Location,
      title: "Arrive Safely",
      description: "Everything delivered with care to your new location."
    }
  ];

  const testimonials = [
    {
      name: "Jean-Pierre Habimana",
      location: "Kigali",
      rating: 5,
      quote: "Kwimuka made my move so easy! The team was professional, on time, and took great care with my belongings. I highly recommend their services.",
      initials: "JP"
    },
    {
      name: "Marie Uwase",
      location: "Nyarutarama", 
      rating: 5,
      quote: "I was impressed by how quickly they responded and completed my move. The helpers were strong and efficient, and the cleaning service left my new place spotless!",
      initials: "MU"
    },
    {
      name: "Emmanuel Ndayisaba",
      location: "Kimihurura",
      rating: 5,
      quote: "The tracking system was amazing! I could see exactly when my move would happen and who was assigned. Everything arrived safely, and the team was very courteous.",
      initials: "EN"
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">            <button
              onClick={() => setCurrentView('order')}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <Plus className="h-6 w-6" />
              Place an Order
            </button>
            
            <button
              onClick={() => setCurrentView('track')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <Search className="h-6 w-6" />
              Track Order
            </button>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="px-4 py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Services</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div key={index} className={`p-6 rounded-xl hover:shadow-lg transition-shadow relative ${
                  service.isVip ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200' : 'bg-gray-50'
                }`}>
                  {service.isVip && (
                    <div className="absolute -top-2 -right-2">
                      <div className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center">
                        <Crown className="h-3 w-3 mr-1" />
                        VIP
                      </div>
                    </div>
                  )}
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                    service.isVip ? 'bg-yellow-100' : 'bg-green-100'
                  }`}>
                    <Icon className={`h-6 w-6 ${service.isVip ? 'text-yellow-600' : 'text-green-600'}`} />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{service.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{service.description}</p>
                  <p className={`font-semibold ${service.isVip ? 'text-yellow-600' : 'text-green-600'}`}>
                    {service.price}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="px-4 py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600">Our simple process makes moving easy and stress-free.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorksSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="text-center">
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-semibold">
                    {index + 1}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="px-4 py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
            <p className="text-lg text-gray-600">Don't just take our word for it. See what our satisfied customers have to say.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center mr-4 font-semibold">
                    {testimonial.initials}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {testimonial.location}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                  <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                    Verified Customer
                  </span>
                </div>
                
                <p className="text-gray-700 text-sm italic">"{testimonial.quote}"</p>
              </div>
            ))}
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

      {/* Download App Section - Desktop Only */}
      <div className="hidden md:block px-4 py-16" style={{ backgroundColor: '#e6f4ea' }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">📱 Download the Kwimuka App</h2>
          <p className="text-lg text-gray-600 mb-8">Get moving anytime, anywhere — right from your phone.</p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button className="bg-black text-white px-8 py-4 rounded-xl font-semibold flex items-center gap-3 shadow-lg hover:shadow-xl transition-shadow">
              <Apple className="h-6 w-6" />
              <div className="text-left">
                <div className="text-xs">Download on the</div>
                <div className="text-lg font-bold">App Store</div>
              </div>
            </button>
            
            <button className="bg-black text-white px-8 py-4 rounded-xl font-semibold flex items-center gap-3 shadow-lg hover:shadow-xl transition-shadow">
              <Smartphone className="h-6 w-6" />
              <div className="text-left">
                <div className="text-xs">Get it on</div>
                <div className="text-lg font-bold">Google Play</div>
              </div>
            </button>
          </div>
          
          <p className="text-gray-500 text-sm mt-6">
            Experience the convenience of booking and tracking your moves on the go.
          </p>
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
            onClick={() => setCurrentView('apply-jobs')}
            className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <UserPlus className="h-5 w-5" />
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">            <button
              onClick={() => setCurrentView('help')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <HelpCircle className="h-5 w-5" />
              Get Help & FAQ
            </button>
            
            <button
              onClick={() => setCurrentView('terms')}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <FileText className="h-5 w-5" />
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
