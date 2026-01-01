import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { createCounsellingRequest } from '@/lib/User_AxiosInstance';
import { 
  Users, 
  MessageSquare, 
  Calendar, 
  Clock, 
  CheckCircle, 
  Briefcase,
  GraduationCap,
  Target
} from 'lucide-react';

function Counselling() {
  // Service cards data
  const [features] = useState([
    {
      id: 1,
      title: "Career Guidance",
      description: "Get personalized career advice and roadmap planning from industry experts to help you achieve your professional goals.",
      icon: <Target className="h-6 w-6" />
    },
    {
      id: 2,
      title: "Academic Counseling",
      description: "Receive expert guidance on course selection, study strategies, and academic planning for your educational journey.",
      icon: <GraduationCap className="h-6 w-6" />
    },
    {
      id: 3,
      title: "Professional Development",
      description: "Enhance your skills with tailored advice on professional growth, skill development, and workplace success.",
      icon: <Briefcase className="h-6 w-6" />
    }
  ]);

  // Form data - Only 4 fields
  const initialFormData = {
    counsellingType: '',
    date: null,
    time: '',
    message: ''
  };

  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDateChange = (date) => {
    setFormData({ ...formData, date });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.counsellingType || !formData.date || !formData.time) {
      alert("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await createCounsellingRequest(formData);
      alert("Counselling session scheduled successfully!");
      console.log("Response:", response.data);
      
      // Reset form after successful submission
      setFormData(initialFormData);
    } catch (error) {
      console.error("Error submitting request:", error);
      alert("Failed to submit request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea]/5 via-[#f093fb]/5 to-[#764ba2]/5 overflow-hidden">
      <div className="container mx-auto px-4 max-w-6xl flex flex-col py-8">
        {/* Header */}
        <header className="mb-8 pt-2 text-center">
          <div className="flex items-center justify-center gap-3">
            <div className="p-2 bg-gradient-to-br from-[#667eea]/20 to-[#764ba2]/20 rounded-lg">
              <MessageSquare className="h-6 w-6 text-[#667eea]" />
            </div>
            <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
              Professional Counselling Services
            </h1>
          </div>
          <p className="text-sm text-gray-600 mt-4 max-w-2xl mx-auto">
            Get personalized guidance from experienced counselors to help you navigate your academic and professional journey with confidence.
          </p>
        </header>

        {/* Services Section - Square Cards */}
        <section className="mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.id}
                className="group relative bg-white/90 backdrop-blur-sm border border-gray-100 rounded-lg shadow p-6 hover:shadow-md transition-all duration-200 flex flex-col h-96"
              >
                {/* Purple hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#667eea]/0 to-[#764ba2]/0 group-hover:from-[#667eea]/5 group-hover:to-[#764ba2]/5 rounded-lg transition-all duration-300"></div>
                
                {/* Purple border on hover */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#667eea]/20 rounded-lg transition-all duration-300"></div>
                
                <div className="relative z-10 h-full flex flex-col">
                  <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-[#667eea]/20 to-[#764ba2]/20 rounded-lg mb-4">
                    <div className="text-[#667eea]">
                      {feature.icon}
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>

                  <p className="text-gray-600 text-sm leading-relaxed flex-grow overflow-y-auto">
                    {feature.description}
                  </p>

                  <div className="mt-4">
                    <button className="text-[#667eea] font-medium hover:text-[#764ba2] transition-colors duration-200 text-sm">
                      Learn More →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Counselling Form Section - Only 4 fields */}
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg border border-gray-100 p-8 mt-8">
          {/* Form Header */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-2">
              Schedule Your Counselling Session
            </h1>
            <p className="text-gray-600 text-sm">
              Fill out the form below to book your counselling session
            </p>
          </div>

          {/* Registration Form - Only 4 fields */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Row 1: Type of Counselling and Date - Two fields per row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Type of Counselling */}
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Type of Counselling</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <MessageSquare className="w-4 h-4 text-gray-400" />
                  </div>
                  <select
                    name="counsellingType"
                    value={formData.counsellingType}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg p-3 pl-10 bg-white focus:outline-none focus:ring-2 focus:ring-[#667eea]/30 focus:border-[#667eea] appearance-none"
                    required
                  >
                    <option value="">Select type</option>
                    <option value="career">Career Guidance</option>
                    <option value="academic">Academic Counseling</option>
                    <option value="professional">Professional Development</option>
                    <option value="personal">Personal Growth</option>
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Date</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                  </div>
                  <DatePicker
                    selected={formData.date}
                    onChange={handleDateChange}
                    dateFormat="MMMM d, yyyy"
                    minDate={new Date()}
                    className="w-full border border-gray-300 rounded-lg p-3 pl-10 bg-white focus:outline-none focus:ring-2 focus:ring-[#667eea]/30 focus:border-[#667eea]"
                    placeholderText="Select a date"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Row 2: Time - Single field centered */}
            <div>
              <label className="block text-gray-700 mb-2 font-medium">Time</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <Clock className="w-4 h-4 text-gray-400" />
                </div>
                <select
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-3 pl-10 bg-white focus:outline-none focus:ring-2 focus:ring-[#667eea]/30 focus:border-[#667eea] appearance-none"
                  required
                >
                  <option value="">Select Time</option>
                  <option value="09:00">9:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="13:00">1:00 PM</option>
                  <option value="14:00">2:00 PM</option>
                  <option value="15:00">3:00 PM</option>
                  <option value="16:00">4:00 PM</option>
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
            </div>

            {/* Row 3: Message - Full width */}
            <div>
              <label className="block text-gray-700 mb-2 font-medium">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Type your message..."
                className="w-full border border-gray-300 rounded-lg p-4 bg-white focus:outline-none focus:ring-2 focus:ring-[#667eea]/30 focus:border-[#667eea] h-32 resize-none"
              ></textarea>
            </div>

            {/* Submit Button - Centered */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white px-8 py-3.5 rounded-lg font-medium hover:shadow-lg hover:shadow-[#667eea]/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <Calendar className="h-4 w-4" />
                    Schedule Session
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Counselling;