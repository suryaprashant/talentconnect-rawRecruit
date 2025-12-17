import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { createMockInterviewRequest } from '@/lib/User_AxiosInstance';
import { 
  FiCalendar, 
  FiClock, 
  FiMessageSquare, 
  FiCheck, 
  FiX,
  FiUsers,
  FiTarget,
  FiAward,
  FiCode,
  FiBriefcase,
  FiFileText
} from 'react-icons/fi';

function FresherMockInterview() {
  const [features] = useState([
    {
      id: 1,
      title: "Real Interview Simulation",
      description: "Experience authentic interview scenarios with industry-standard questions.",
      icon: FiTarget,
      color: "from-[#a5b4fc]/20 to-[#c4b5fd]/20",
      borderColor: "border-[#a5b4fc]/30",
      iconColor: "text-[#667eea]"
    },
    {
      id: 2,
      title: "Expert Feedback",
      description: "Receive detailed feedback from experienced interviewers.",
      icon: FiUsers,
      color: "from-[#bbf7d0]/20 to-[#86efac]/20",
      borderColor: "border-[#bbf7d0]/30",
      iconColor: "text-[#059669]"
    },
    {
      id: 3,
      title: "Performance Analysis",
      description: "Get comprehensive analysis of your strengths and areas for improvement.",
      icon: FiAward,
      color: "from-[#fde68a]/20 to-[#fcd34d]/20",
      borderColor: "border-[#fde68a]/30",
      iconColor: "text-[#d97706]"
    },
  ]);

  const suggestedSkills = ['React', 'Node.js', 'Python', 'Java', 'SQL', 'C++', 'MongoDB', 'Django'];

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
      console.log("✅ Response:", response.data);
      alert("Mock interview scheduled successfully!");
      
      // Reset form after successful submission
      setFormData(initialFormData);
    } catch (error) {
      console.error("❌ Submission error:", error.response?.data || error.message);
      alert("Failed to schedule mock interview. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2 space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold leading-snug bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
                Ace Your Interviews with Mock Practice
              </h1>
            </div>
            <div className="md:w-1/2">
              <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-xl p-6">
                <p className="text-gray-600">
                  Get real interview experience with our mock interview sessions. Practice with 
                  industry experts and receive detailed feedback to improve your performance.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <div key={feature.id} className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-purple-50/50 p-6">
                <div className="bg-gradient-to-br from-white/50 to-white/30 h-40 mb-4 flex items-center justify-center rounded-xl">
                  <IconComponent className={`w-12 h-12 ${feature.iconColor}`} />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <button className="text-[#667eea] font-medium hover:underline">Learn More</button>
              </div>
            );
          })}
        </section>

        {/* Mock Interview Form */}
        <section className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-purple-50/50 p-8 max-w-3xl mx-auto">
          <h2 className="text-3xl font-semibold text-center mb-2 bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
            Schedule a Mock Interview
          </h2>
          <p className="text-center text-gray-500 mb-8">
            Prepare for success with personalized mock interview sessions
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-200 rounded-xl bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#667eea]/30 focus:border-[#667eea] transition-all duration-200"
                required
              >
                <option value="">Select Interview Type</option>
                <option value="technical">Technical</option>
                <option value="hr">HR / Behavioral</option>
                <option value="managerial">Managerial</option>
              </select>
            </div>

            {/* Skillset */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">Skillset</label>
              <div className="relative border border-gray-200 p-3 rounded-xl bg-white/50">
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
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        <FiX className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  name="skillInput"
                  value={formData.skillInput}
                  onChange={handleInputChange}
                  onKeyDown={handleSkillKeyDown}
                  placeholder="Type and press Enter to add skill"
                  onFocus={() => setIsDropdownVisible(true)}
                  onBlur={() => setTimeout(() => setIsDropdownVisible(false), 100)}
                  className="w-full p-2 focus:outline-none bg-transparent"
                />
                {isDropdownVisible && (
                  <div className="absolute left-0 right-0 top-full bg-white/90 backdrop-blur-sm border border-gray-200 shadow-lg mt-1 rounded-xl z-10 max-h-48 overflow-y-auto">
                    {suggestedSkills
                      .filter((skill) => !formData.skillset.includes(skill))
                      .map((skill) => (
                        <div
                          key={skill}
                          onMouseDown={() => handleSkillClick(skill)}
                          className="px-4 py-3 hover:bg-gradient-to-r hover:from-[#a5b4fc]/10 hover:to-[#c4b5fd]/10 cursor-pointer text-sm border-b border-gray-100 last:border-b-0"
                        >
                          {skill}
                        </div>
                      ))}
                  </div>
                )}
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
                    placeholderText="Select Date"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 font-medium text-gray-700">Time</label>
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
                    <option value="09:00">9:00 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="13:00">1:00 PM</option>
                    <option value="14:00">2:00 PM</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">Message</label>
              <div className="relative">
                <div className="absolute top-3 left-3 pointer-events-none">
                  <FiMessageSquare className="h-5 w-5 text-gray-400" />
                </div>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Type your message or specific interview focus areas..."
                  className="w-full pl-10 p-3 border border-gray-200 rounded-xl bg-white/50 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-[#667eea]/30 focus:border-[#667eea] transition-all duration-200"
                ></textarea>
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-center p-4 bg-gradient-to-r from-[#fef3c7]/10 to-[#fde68a]/10 rounded-xl border border-[#fde68a]/20">
              <input
                type="checkbox"
                id="terms"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleInputChange}
                className="mr-3 h-4 w-4 text-[#667eea] border-gray-300 rounded focus:ring-[#667eea]"
                required
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                I accept the <span className="text-[#667eea] hover:underline cursor-pointer">Terms</span>
              </label>
            </div>

            {/* Submit */}
            <div className="text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-200 px-8 py-3 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  'Schedule Mock Interview'
                )}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

export default FresherMockInterview;