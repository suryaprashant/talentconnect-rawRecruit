import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { createCounsellingRequest } from '@/lib/User_AxiosInstance';
import { 
  FiCalendar, 
  FiClock, 
  FiMessageSquare, 
  FiCheck, 
  FiUsers, 
  FiTarget, 
  FiTrendingUp, 
  FiAward,
  FiUser,
  FiCode,
  FiFileText,
  FiShield,
  FiStar,
  FiHelpCircle,
  FiLoader
} from 'react-icons/fi';

function FresherCounselling() {
  const [features] = useState([
    {
      id: 1,
      title: "Expert Career Guidance",
      description: "Get personalized career advice from industry experts with years of experience.",
      icon: FiTarget,
      color: "from-[#a5b4fc]/20 to-[#c4b5fd]/20",
      borderColor: "border-[#a5b4fc]/30",
      iconColor: "text-[#667eea]"
    },
    {
      id: 2,
      title: "Personal Development Plans",
      description: "Create tailored development plans to help you achieve your career goals.",
      icon: FiTrendingUp,
      color: "from-[#bbf7d0]/20 to-[#86efac]/20",
      borderColor: "border-[#bbf7d0]/30",
      iconColor: "text-[#059669]"
    },
    {
      id: 3,
      title: "Skill Enhancement Strategies",
      description: "Learn effective strategies to enhance your skills and stay competitive.",
      icon: FiAward,
      color: "from-[#fde68a]/20 to-[#fcd34d]/20",
      borderColor: "border-[#fde68a]/30",
      iconColor: "text-[#d97706]"
    },
  ]);

  const initialFormData = {
    counsellingType: '',
    date: null,
    time: '',
    message: '',
    agreeToTerms: false,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleDateChange = (date) => {
    setFormData({ ...formData, date });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.agreeToTerms) {
      alert("Please accept the terms.");
      return;
    }

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

  const counsellingTypes = [
    { 
      value: 'career', 
      label: 'Career Guidance', 
      description: 'Explore career paths and opportunities',
      icon: FiTarget
    },
    { 
      value: 'technical', 
      label: 'Technical Skills', 
      description: 'Improve technical and coding skills',
      icon: FiCode
    },
    { 
      value: 'interview', 
      label: 'Interview Preparation', 
      description: 'Prepare for technical interviews',
      icon: FiUser
    },
    { 
      value: 'resume', 
      label: 'Resume Review', 
      description: 'Get professional resume feedback',
      icon: FiFileText
    },
  ];

  const timeSlots = [
    { value: '09:00', label: '9:00 AM - 10:00 AM' },
    { value: '10:00', label: '10:00 AM - 11:00 AM' },
    { value: '11:00', label: '11:00 AM - 12:00 PM' },
    { value: '13:00', label: '1:00 PM - 2:00 PM' },
    { value: '14:00', label: '2:00 PM - 3:00 PM' },
    { value: '15:00', label: '3:00 PM - 4:00 PM' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea]/10 via-[#f093fb]/5 to-[#764ba2]/10">
      {/* Pastel blur background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#667eea]/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-[#f093fb]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-1/3 w-40 h-40 bg-[#764ba2]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-20">
        {/* Hero Section */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-1/2 space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold leading-snug bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
                Professional Career Counselling
              </h1>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 text-gray-600">
                  <FiStar className="w-5 h-5 text-[#667eea]" />
                  <p>Personalized guidance for your career journey</p>
                </div>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-purple-50/50 p-6">
                <p className="text-gray-600 leading-relaxed">
                  Get expert guidance to navigate your career path. Our experienced counselors 
                  provide personalized advice to help you make informed decisions about your 
                  professional development, skill enhancement, and career opportunities.
                </p>
                <div className="mt-4 flex items-center space-x-2 text-sm text-[#667eea]">
                  <FiUsers className="w-4 h-4" />
                  <span>Join thousands of successful professionals</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <div 
                key={feature.id} 
                className={`bg-gradient-to-br ${feature.color} backdrop-blur-sm border ${feature.borderColor} rounded-2xl shadow-lg hover:shadow-xl hover:shadow-purple-100/30 transition-all duration-300 transform hover:-translate-y-1 p-6`}
              >
                <div className="w-16 h-16 bg-white/50 rounded-xl mb-4 flex items-center justify-center">
                  <IconComponent className={`w-8 h-8 ${feature.iconColor}`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <button className="text-[#667eea] font-medium hover:text-[#764ba2] transition-colors duration-200 flex items-center">
                  Learn more
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </button>
              </div>
            );
          })}
        </section>

        {/* Counselling Form */}
        <section className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-purple-50/50 p-8 max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#a5b4fc]/20 to-[#c4b5fd]/20 rounded-full mb-4">
              <FiHelpCircle className="w-8 h-8 text-[#667eea]" />
            </div>
            <h2 className="text-3xl font-semibold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-2">
              Schedule a Counselling Session
            </h2>
            <p className="text-gray-500">
              Let us help you with your journey. Book a time that works best for you.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Counselling Type */}
            <div>
              <label className="block mb-3 font-medium text-gray-700">Type of Counselling</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {counsellingTypes.map((type) => {
                  const TypeIcon = type.icon;
                  return (
                    <div 
                      key={type.value}
                      className={`p-4 border rounded-xl cursor-pointer transition-all duration-200 ${
                        formData.counsellingType === type.value 
                          ? 'border-[#667eea] bg-gradient-to-r from-[#a5b4fc]/10 to-[#c4b5fd]/10' 
                          : 'border-gray-200 hover:border-[#a5b4fc] hover:bg-gray-50/50'
                      }`}
                      onClick={() => setFormData({...formData, counsellingType: type.value})}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <TypeIcon className={`w-6 h-6 ${formData.counsellingType === type.value ? 'text-[#667eea]' : 'text-gray-400'}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-gray-900">{type.label}</span>
                            {formData.counsellingType === type.value && (
                              <FiCheck className="w-5 h-5 text-[#667eea]" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{type.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 font-medium text-gray-700">Date</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiCalendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <DatePicker
                    selected={formData.date}
                    onChange={handleDateChange}
                    dateFormat="MMMM d, yyyy"
                    className="w-full pl-10 p-3 border border-gray-200 rounded-xl bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#667eea]/30 focus:border-[#667eea] transition-all duration-200"
                    placeholderText="Select a date"
                    required
                    minDate={new Date()}
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 font-medium text-gray-700">Time Slot</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiClock className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className="w-full pl-10 p-3 border border-gray-200 rounded-xl bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#667eea]/30 focus:border-[#667eea] appearance-none transition-all duration-200"
                    required
                  >
                    <option value="">Select Time</option>
                    {timeSlots.map((slot) => (
                      <option key={slot.value} value={slot.value} className="text-gray-700">
                        {slot.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">Additional Information</label>
              <div className="relative">
                <div className="absolute top-3 left-3 pointer-events-none">
                  <FiMessageSquare className="h-5 w-5 text-gray-400" />
                </div>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Tell us about your specific needs or concerns..."
                  className="w-full pl-10 p-3 border border-gray-200 rounded-xl bg-white/50 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-[#667eea]/30 focus:border-[#667eea] transition-all duration-200"
                ></textarea>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="p-4 bg-gradient-to-r from-[#fef3c7]/10 to-[#fde68a]/10 border border-[#fde68a]/20 rounded-xl">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="terms"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  className="mt-1 mr-3 h-4 w-4 text-[#667eea] border-gray-300 rounded focus:ring-[#667eea]"
                  required
                />
                <div className="flex-1">
                  <label htmlFor="terms" className="text-sm text-gray-600">
                    I agree to the Terms of Service and Privacy Policy. I understand that this 
                    counselling session is confidential and will be conducted professionally.
                  </label>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-200 px-8 py-4 rounded-xl font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <FiLoader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                    Scheduling Session...
                  </span>
                ) : (
                  'Schedule Counselling Session'
                )}
              </button>
              {/* <p className="text-sm text-gray-500 mt-3">
                You'll receive a confirmation email with session details
              </p> */}
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

export default FresherCounselling;