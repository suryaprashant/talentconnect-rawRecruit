import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs'; 
import { createMockInterviewRequest } from '@/lib/User_AxiosInstance';

function MockInterview() {
  const [features] = useState([
    {
      id: 1,
      title: "Long heading is what you see here in this feature section",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
    },
    {
      id: 2,
      title: "Long heading is what you see here in this feature section",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
    },
    {
      id: 3,
      title: "Long heading is what you see here in this feature section",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
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
    <div className="min-h-screen bg-gradient-to-br from-[#667eea]/10 via-[#f093fb]/5 to-[#764ba2]/10">
      {/* Pastel blur background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#667eea]/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-[#f093fb]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-1/3 w-40 h-40 bg-[#764ba2]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 space-y-20">
        {/* Hero Section */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2 space-y-4">
              <h1 className="text-4xl font-bold leading-snug bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
                Long heading is what you see here in this feature section
              </h1>
            </div>
            <div className="md:w-1/2">
              <p className="text-gray-600 bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-white/50">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.
              </p>
            </div>
          </div>
        </section>

        {/* Feature Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div key={feature.id} className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-purple-50/50 p-6 hover:shadow-xl transition-all duration-200">
              <div className="bg-gradient-to-r from-[#667eea]/10 to-[#764ba2]/10 h-40 mb-4 flex items-center justify-center rounded-2xl">
                <span className="text-gray-400 text-4xl">📷</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">{feature.title}</h3>
              <p className="text-gray-600 mb-4">{feature.description}</p>
              <button className="text-[#667eea] font-medium hover:text-[#764ba2] transition-colors duration-200">
                Button
              </button>
            </div>
          ))}
        </section>

        {/* Mock Interview Form */}
        <section className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-purple-50/50 p-8 max-w-3xl mx-auto">
          <h2 className="text-3xl font-semibold text-center mb-2 bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
            Schedule a Mock Interview
          </h2>
          <p className="text-center text-gray-500 mb-8">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-200 rounded-xl bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#667eea]/30 focus:border-[#667eea] backdrop-blur-sm"
                required
              >
                <option value="">Select</option>
                <option value="technical">Technical</option>
                <option value="hr">HR</option>
                <option value="managerial">Managerial</option>
              </select>
            </div>

            {/* Skillset */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">Skillset</label>
              <div className="relative border border-gray-200 p-3 rounded-xl bg-white/50 backdrop-blur-sm">
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
                <input
                  type="text"
                  name="skillInput"
                  value={formData.skillInput}
                  onChange={handleInputChange}
                  onKeyDown={handleSkillKeyDown}
                  placeholder="Type and press Enter to add skill"
                  onFocus={() => setIsDropdownVisible(true)}
                  onBlur={() => setTimeout(() => setIsDropdownVisible(false), 100)}
                  className="w-full p-2 bg-transparent focus:outline-none"
                />
                {isDropdownVisible && (
                  <div className="absolute left-0 right-0 top-full bg-white/90 backdrop-blur-sm border border-gray-200 shadow-lg shadow-purple-50/50 mt-1 rounded-xl z-10 max-h-48 overflow-y-auto">
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
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
  <label className="block mb-2 font-medium text-gray-700">Date</label>
  <div className="relative">
    <DatePicker
      selected={formData.date}
      onChange={handleDateChange}
      dateFormat="MMMM d, yyyy"
      className="w-full p-3 pl-10 border border-gray-200 rounded-xl bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#667eea]/30 focus:border-[#667eea] backdrop-blur-sm"
      placeholderText="Select a date"
      required
    />
    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
      </svg>
    </div>
  </div>
</div>

              <div>
                <label className="block mb-2 font-medium text-gray-700">Time</label>
                <select
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-200 rounded-xl bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#667eea]/30 focus:border-[#667eea] backdrop-blur-sm"
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

            {/* Message */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Type your message..."
                className="w-full p-3 border border-gray-200 rounded-xl bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#667eea]/30 focus:border-[#667eea] backdrop-blur-sm h-32 resize-none"
              ></textarea>
            </div>

            {/* Terms */}
            <div className="flex items-center p-4 bg-gradient-to-r from-[#fef3c7]/10 to-[#fde68a]/10 rounded-xl border border-[#fde68a]/30">
              <input
                type="checkbox"
                id="terms"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleInputChange}
                className="mr-2 w-4 h-4 text-[#667eea] bg-white border-gray-300 rounded focus:ring-[#667eea] focus:ring-2"
                required
              />
              <label htmlFor="terms" className="text-sm text-gray-700">
                I accept the <span className="underline cursor-pointer hover:text-[#667eea] transition-colors duration-200">Terms</span>
              </label>
            </div>

            {/* Submit */}
            <div className="text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white px-8 py-3 rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

export default MockInterview;