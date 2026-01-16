import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { createCounsellingRequest } from '@/lib/User_AxiosInstance';
import { 
  MessageSquare, 
  Calendar, 
  Clock,
  Target,
  GraduationCap,
  Briefcase
} from 'lucide-react';

function Counselling() {
  // Service cards data - Updated with bullet points
  const [features] = useState([
    {
      id: 1,
      title: "Guidance",
      bullets: [
        "Get one-on-one advice from experienced career mentors",
        "Explore career options based on your interests and goals",
        "Understand job roles, industries, and growth paths",
        "Make informed career decisions with clarity"
      ],
      icon: <Target className="h-6 w-6" />
    },
    {
      id: 2,
      title: "Planning",
      bullets: [
        "Create a personalized career development roadmap",
        "Identify strengths, skill gaps, and improvement areas",
        "Set short-term and long-term career goals",
        "Plan your next steps with confidence"
      ],
      icon: <GraduationCap className="h-6 w-6" />
    },
    {
      id: 3,
      title: "Skills",
      bullets: [
        "Learn which skills matter for your chosen career",
        "Get guidance on technical and soft skill development",
        "Stay competitive in the fresher job market",
        "Build confidence through continuous learning"
      ],
      icon: <Briefcase className="h-6 w-6" />
    },
  ]);

  // Form data - Only 4 fields
  const initialFormData = {
    counsellingType: '',
    date: null,
    time: '',
    message: '',
    agreeToTerms: false
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
      alert("Please accept the terms and conditions.");
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

  // Time slots
  const timeSlots = [
    { value: '09:00', label: '9:00 AM' },
    { value: '10:00', label: '10:00 AM' },
    { value: '11:00', label: '11:00 AM' },
    { value: '13:00', label: '1:00 PM' },
    { value: '14:00', label: '2:00 PM' },
    { value: '15:00', label: '3:00 PM' },
    { value: '16:00', label: '4:00 PM' },
  ];

  return (
    <>
      {/* Meta Title and Description */}
      <head>
        <title>Career Counselling for Freshers & Students | RawRecruit</title>
        <meta 
          name="description" 
          content="Get professional career counselling to choose the right path, build skills, and plan your future with expert guidance on RawRecruit." 
        />
      </head>

      <div className="min-h-screen bg-gradient-to-br from-[#667eea]/5 via-[#f093fb]/5 to-[#764ba2]/5 overflow-hidden">
        <div className="container mx-auto px-4 max-w-6xl flex flex-col py-8">
          {/* Header Section with H1 and H2 */}
          <header className="mb-10 pt-2 text-center">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-4">
              Professional Career Counselling
            </h1>
            <h2 className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">
              Personalized career guidance to help you make confident academic and job decisions
            </h2>
          </header>

          {/* Services Section with H3 titles */}
          <section className="mb-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((feature) => (
                <div
                  key={feature.id}
                  className="group relative bg-white/90 backdrop-blur-sm border border-gray-100 rounded-lg shadow p-6 hover:shadow-md transition-all duration-200 flex flex-col min-h-[320px]"
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

                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                      {feature.title}
                    </h3>

                    <ul className="space-y-3 flex-grow">
                      {feature.bullets.map((bullet, index) => (
                        <li key={index} className="flex items-start">
                          <div className="flex-shrink-0 w-1.5 h-1.5 bg-[#667eea] rounded-full mt-2 mr-3"></div>
                          <span className="text-gray-600 text-sm">{bullet}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-6">
                      <button className="text-[#667eea] font-medium hover:text-[#764ba2] transition-colors duration-200 text-sm">
                        Learn More →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Counselling Form Section */}
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg border border-gray-100 p-8">
            {/* Form Header */}
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-2">
                Schedule Your Counselling Session
              </h2>
              <p className="text-gray-600 text-sm">
                Fill out the form below to book your counselling session
              </p>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Row 1: Type of Counselling and Date */}
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
                      <option value="technical">Technical Skills</option>
                      <option value="interview">Interview Preparation</option>
                      <option value="resume">Resume Review</option>
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

              {/* Time */}
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
                    {timeSlots.map((slot) => (
                      <option key={slot.value} value={slot.value} className="text-gray-700">
                        {slot.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Additional Information</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Tell us about your specific needs or concerns..."
                  className="w-full border border-gray-300 rounded-lg p-4 bg-white focus:outline-none focus:ring-2 focus:ring-[#667eea]/30 focus:border-[#667eea] h-32 resize-none"
                ></textarea>
              </div>

              {/* Terms and Conditions Checkbox */}
              <div className="p-4 bg-gradient-to-r from-[#fef3c7]/10 to-[#fde68a]/10 rounded-lg border border-[#fde68a]/20">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      id="terms"
                      name="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-[#667eea] border-gray-300 rounded focus:ring-[#667eea] focus:ring-2"
                      required
                    />
                  </div>
                  <div className="ml-3">
                    <label htmlFor="terms" className="text-sm text-gray-600">
                      I accept the <span className="text-[#667eea] font-medium hover:underline cursor-pointer">Terms of Service</span> and <span className="text-[#667eea] font-medium hover:underline cursor-pointer">Privacy Policy</span>. I understand that this counselling session is confidential and will be conducted professionally.
                    </label>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
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
                      Scheduling Session...
                    </>
                  ) : (
                    <>
                      <Calendar className="h-4 w-4" />
                      Schedule Counselling Session
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Counselling;