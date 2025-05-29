import { useState } from "react";
import { ArrowLeft, Users, Sparkles, Truck, Send } from "lucide-react";
import { JobApplication } from "@/types";

interface ApplyJobsProps {
  onSubmitApplication: (application: JobApplication) => void;
  onBack: () => void;
}

const ApplyJobs = ({ onSubmitApplication, onBack }: ApplyJobsProps) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [jobRole, setJobRole] = useState<'helper' | 'cleaner' | 'driver'>('helper');
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const application: JobApplication = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      phone,
      jobRole,
      message,
      status: 'pending',
      submittedAt: new Date()
    };

    onSubmitApplication(application);
    setSubmitted(true);
  };

  const jobOptions = [
    {
      value: 'helper' as const,
      label: 'Moving Helper',
      icon: Users,
      description: 'Help customers with packing, loading, and moving items',
      pay: '10,000 RWF per job'
    },
    {
      value: 'cleaner' as const,
      label: 'Cleaner',
      icon: Sparkles,
      description: 'Provide professional cleaning services for homes and offices',
      pay: '5,000 RWF per job'
    },
    {
      value: 'driver' as const,
      label: 'Driver',
      icon: Truck,
      description: 'Drive our trucks and manage delivery operations',
      pay: '40,000 RWF per job'
    }
  ];

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white p-8 rounded-xl shadow-sm text-center">
            <div className="bg-green-100 p-4 rounded-full w-fit mx-auto mb-4">
              <Send className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Application Submitted!</h2>
            <p className="text-gray-600 mb-6">
              Thank you for your interest in joining our team. We'll review your application and contact you soon.
            </p>
            <button
              onClick={onBack}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center text-green-600 hover:text-green-700 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Home
        </button>

        <div className="bg-white p-8 rounded-xl shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Apply for Jobs</h1>
          <p className="text-gray-600 mb-6">Join our team and help make moving easier for everyone in Rwanda</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+250 xxx xxx xxx"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Job Selection */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Job Role</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {jobOptions.map((job) => {
                  const Icon = job.icon;
                  return (
                    <label
                      key={job.value}
                      className={`cursor-pointer p-4 border-2 rounded-lg transition-colors ${
                        jobRole === job.value
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-green-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="jobRole"
                        value={job.value}
                        checked={jobRole === job.value}
                        onChange={(e) => setJobRole(e.target.value as typeof jobRole)}
                        className="sr-only"
                      />
                      <div className="text-center">
                        <Icon className={`h-8 w-8 mx-auto mb-2 ${
                          jobRole === job.value ? 'text-green-600' : 'text-gray-400'
                        }`} />
                        <h4 className="font-semibold text-gray-900 mb-1">{job.label}</h4>
                        <p className="text-sm text-gray-600 mb-2">{job.description}</p>
                        <p className="text-sm font-medium text-green-600">{job.pay}</p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Why do you want to join us? (Optional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us about your experience and why you'd like to work with EasyMove..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center"
            >
              <Send className="h-4 w-4 mr-2" />
              Submit Application
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplyJobs;
