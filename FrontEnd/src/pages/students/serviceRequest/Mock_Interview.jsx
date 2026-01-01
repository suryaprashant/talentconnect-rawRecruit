import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { createMockInterviewRequest } from '@/lib/User_AxiosInstance';
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  Briefcase,
  Users,
  MessageSquare,
  Target,
  Star,
  Code,
  UserCheck,
  Award
} from 'lucide-react';

function MockInterview() {
  // Service cards data
  const [features] = useState([
    {
      id: 1,
      title: "Technical Interview Practice",
      description: "Get real-time feedback on your technical skills from industry professionals with experience in top tech companies.",
      icon: <Code className="h-6 w-6" />
    },
    {
      id: 2,
      title: "HR Interview Preparation",
      description: "Practice behavioral questions and improve your communication skills with experienced HR professionals.",
      icon: <UserCheck className="h-6 w-6" />
    },
    {
      id: 3,
      title: "Managerial Round Simulation",
      description: "Prepare for leadership and managerial interviews with scenarios that test your decision-making abilities.",
      icon: <Award className="h-6 w-6" />
    }
  ]);

  const suggestedSkills = ['React', 'Node.js', 'Python', 'Java', 'SQL', 'C++', 'MongoDB', 'Django', 'AWS', 'Docker', 'Kubernetes', 'TypeScript'];

  // Form data - Only fields present in original
  const initialFormData = {
    category: '',
    skillInput: '',
    skillset: [],
    date: null,
    time: '',
    message: '',
    agreeToTerms: false,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    if (name === 'skillInput') {
      setIsDropdownVisible(true);
    }
  };

  const handleDateChange = (date) => {
    setFormData({ ...formData, date });
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter' && formData.skillInput.trim()) {
      e.preventDefault();
      addSkill(formData.skillInput.trim());
    }
  };

  const handleSkillClick = (skill) => {
    addSkill(skill);
    setIsDropdownVisible(false);
  };

  const addSkill = (skill) => {
    if (!formData.skillset.includes(skill)) {
      setFormData((prev) => ({
        ...prev,
        skillset: [...prev.skillset, skill],
        skillInput: '',
      }));
    }
  };

  const removeSkill = (skill) => {
    setFormData({
      ...formData,
      skillset: formData.skillset.filter((s) => s !== skill),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.agreeToTerms) {
      alert("Please accept the terms.");
      return;
    }

    if (!formData.category || formData.skillset.length === 0 || !formData.date || !formData.time) {
      alert("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await createMockInterviewRequest(formData);
      alert("Mock interview scheduled successfully!");
      
      setFormData(initialFormData);
    } catch (error) {
      console.error("❌ Submission error:", error.response?.data || error.message);
      alert("Failed to schedule mock interview. Try again.");
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
              <UserCheck className="h-6 w-6 text-[#667eea]" />
            </div>
            <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
              Professional Mock Interview Services
            </h1>
          </div>
          <p className="text-sm text-gray-600 mt-4 max-w-2xl mx-auto">
            Practice and perfect your interview skills with experienced professionals who provide real-time feedback.
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

        {/* Mock Interview Form Section */}
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg border border-gray-100 p-8 mt-8">
          {/* Form Header */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-2">
              Schedule Your Mock Interview
            </h1>
            <p className="text-gray-600 text-sm">
              Fill out the form below to book your personalized mock interview session
            </p>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category - Full width */}
            <div>
              <label className="block text-gray-700 mb-2 font-medium">Category</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <Briefcase className="w-4 h-4 text-gray-400" />
                </div>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-3 pl-10 bg-white focus:outline-none focus:ring-2 focus:ring-[#667eea]/30 focus:border-[#667eea] appearance-none"
                  required
                >
                  <option value="">Select interview type</option>
                  <option value="technical">Technical Interview</option>
                  <option value="hr">HR Interview</option>
                  <option value="managerial">Managerial Interview</option>
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
            </div>

            {/* Skillset - Full width */}
            <div>
              <label className="block text-gray-700 mb-2 font-medium">Skillset</label>
              <div className="border border-gray-300 rounded-lg bg-white p-3">
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.skillset.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-gradient-to-r from-[#a5b4fc]/20 to-[#c4b5fd]/20 text-[#5b21b6] px-3 py-1 rounded-full text-sm flex items-center border border-[#a5b4fc]/30"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="ml-2 text-red-500 font-bold hover:text-red-700"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
                <div className="relative">
                  <input
                    type="text"
                    name="skillInput"
                    value={formData.skillInput}
                    onChange={handleInputChange}
                    onKeyDown={handleSkillKeyDown}
                    placeholder="Type a skill and press Enter or select from suggestions below"
                    onFocus={() => setIsDropdownVisible(true)}
                    onBlur={() => setTimeout(() => setIsDropdownVisible(false), 100)}
                    className="w-full p-2 border border-gray-300 rounded bg-transparent focus:outline-none focus:ring-2 focus:ring-[#667eea]/30 focus:border-[#667eea]"
                  />
                  {isDropdownVisible && (
                    <div className="absolute left-0 right-0 top-full bg-white/90 backdrop-blur-sm border border-gray-200 shadow-lg mt-1 rounded-lg z-10 max-h-48 overflow-y-auto">
                      {suggestedSkills
                        .filter((skill) => !formData.skillset.includes(skill))
                        .map((skill) => (
                          <div
                            key={skill}
                            onMouseDown={() => handleSkillClick(skill)}
                            className="px-4 py-2 hover:bg-gradient-to-r hover:from-[#667eea]/5 hover:to-[#764ba2]/5 cursor-pointer text-sm text-gray-700 hover:text-[#5b21b6]"
                          >
                            {skill}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Press Enter to add skill or select from suggestions
                </p>
              </div>
            </div>

            {/* Date and Time - Two fields per row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>

            {/* Message - Full width */}
            <div>
              <label className="block text-gray-700 mb-2 font-medium">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Tell us about your interview preparation goals or any specific areas you want to focus on..."
                className="w-full border border-gray-300 rounded-lg p-4 bg-white focus:outline-none focus:ring-2 focus:ring-[#667eea]/30 focus:border-[#667eea] h-32 resize-none"
              ></textarea>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-center p-4 bg-gradient-to-r from-[#fef3c7]/10 to-[#fde68a]/10 rounded-xl border border-[#fde68a]/30">
              <input
                type="checkbox"
                id="agreeToTerms"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleInputChange}
                className="mr-3 w-5 h-5 text-[#667eea] bg-white border-gray-300 rounded focus:ring-[#667eea] focus:ring-2"
                required
              />
              <label htmlFor="agreeToTerms" className="text-sm text-gray-700">
                I accept the terms and conditions for scheduling a mock interview session.
              </label>
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
                    Schedule Mock Interview
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

export default MockInterview;