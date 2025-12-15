import { useState } from 'react';
import { ChevronDown, Calendar, Clock, Users, Target, Monitor, BarChart, ArrowLeft, Send, CheckSquare } from 'lucide-react';
import axios from 'axios';

export default function RequestInfo({ onBackClick }) {
  const [numberOfEmployees, setNumberOfEmployees] = useState('');
  const [skillTypes, setSkillTypes] = useState([]);
  const [trainingMode, setTrainingMode] = useState('Virtual');
  const [evaluationType, setEvaluationType] = useState('Examination');
  const [hoursOrDays, setHoursOrDays] = useState('');

  const [isEmployeeDropdownOpen, setIsEmployeeDropdownOpen] = useState(false);
  const [isSkillsDropdownOpen, setIsSkillsDropdownOpen] = useState(false);
  const [isHoursDropdownOpen, setIsHoursDropdownOpen] = useState(false);

  const employeeOptions = ['1-10', '11-50', '51-100', '100+'];
  const skillOptions = ['Technical Skills', 'Soft Skills', 'Leadership', 'Domain-Specific'];
  const hoursOptions = ['1-8 hours', '9-16 hours', '2-5 days', '1 week+'];

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    // 🔁 Map fields to what backend expects
    const payload = {
      numberOfStudents: [numberOfEmployees],
      typesOfSkills: skillTypes,
      modeOfTraining: trainingMode,
      evaluationBasedOn: evaluationType,
      numberOfHoursOrDays: [hoursOrDays]
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_Backend_URL}/api/rawrecruit/student-training/register`,
        payload
      );
      console.log('✅ Saved:', response.data);
      alert('Request submitted successfully!');
      onBackClick(); // go back to main page
    } catch (error) {
      console.error('❌ Submission error:', error.response?.data || error.message);
      alert('Failed to submit. Please check the console.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0e6f7]/60 via-[#d4e8f9]/55 to-[#cff7ea]/60">
      {/* Pastel blur background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#fbcfe8]/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-[#93c5fd]/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-1/3 w-40 h-40 bg-[#a7f3d0]/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/4 right-1/4 w-48 h-48 bg-[#c7d2fe]/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 left-1/4 w-56 h-56 bg-[#fde68a]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-2xl">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] bg-clip-text text-transparent mb-2">
            Student Training Programs
          </h1>
          <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto">
            Offer targeted training programs to bridge skill gaps and ensure graduates are prepared with industry specific skills necessary for their careers.
          </p>
        </div>

        {/* Form Section */}
        <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-blue-50/50 p-8">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] bg-clip-text text-transparent mb-2 text-center">
            Request info for Student Training Programs
          </h2>
          <p className="text-gray-600 mb-8 text-center">
            Fill out the form below and our team will get back to you with detailed information.
          </p>

          <div className="space-y-6">
            {/* Number of Employees */}
            <div>
              <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                <Users className="w-4 h-4 text-[#3b82f6]" />
                Number of Employees
              </label>
              <div className="relative">
                <button
                  type="button"
                  className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded-xl p-3 text-left flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent transition-all duration-200"
                  onClick={() => setIsEmployeeDropdownOpen(!isEmployeeDropdownOpen)}
                >
                  <span className={numberOfEmployees ? 'text-gray-900' : 'text-gray-500'}>
                    {numberOfEmployees || 'Select an option'}
                  </span>
                  <ChevronDown size={16} className="text-[#3b82f6]" />
                </button>
                {isEmployeeDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white/90 backdrop-blur-sm border border-white/50 rounded-xl shadow-lg shadow-blue-50/50 overflow-hidden">
                    {employeeOptions.map((option) => (
                      <div
                        key={option}
                        className="px-4 py-3 hover:bg-[#93c5fd]/10 cursor-pointer border-b border-white/50 last:border-b-0 transition-colors duration-200"
                        onClick={() => {
                          setNumberOfEmployees(option);
                          setIsEmployeeDropdownOpen(false);
                        }}
                      >
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full mr-3 ${numberOfEmployees === option ? 'bg-[#3b82f6]' : 'bg-gray-300'}`}></div>
                          {option}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Types of Skills */}
            <div>
              <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                <Target className="w-4 h-4 text-[#3b82f6]" />
                Types of Skills
              </label>
              <div className="relative">
                <button
                  type="button"
                  className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded-xl p-3 text-left flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent transition-all duration-200"
                  onClick={() => setIsSkillsDropdownOpen(!isSkillsDropdownOpen)}
                >
                  <span className={skillTypes.length > 0 ? 'text-gray-900' : 'text-gray-500'}>
                    {skillTypes.length > 0 ? skillTypes.join(', ') : 'Select skills'}
                  </span>
                  <ChevronDown size={16} className="text-[#3b82f6]" />
                </button>
                {isSkillsDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white/90 backdrop-blur-sm border border-white/50 rounded-xl shadow-lg shadow-blue-50/50 overflow-hidden">
                    {skillOptions.map((option) => (
                      <div
                        key={option}
                        className="px-4 py-3 hover:bg-[#93c5fd]/10 cursor-pointer border-b border-white/50 last:border-b-0 transition-colors duration-200"
                        onClick={() => {
                          if (skillTypes.includes(option)) {
                            setSkillTypes(skillTypes.filter(item => item !== option));
                          } else {
                            setSkillTypes([...skillTypes, option]);
                          }
                        }}
                      >
                        <div className="flex items-center">
                          <div className={`w-5 h-5 border-2 rounded mr-3 flex items-center justify-center ${skillTypes.includes(option) ? 'bg-[#3b82f6] border-[#3b82f6]' : 'border-gray-300'}`}>
                            {skillTypes.includes(option) && (
                              <CheckSquare size={12} className="text-white" />
                            )}
                          </div>
                          {option}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Mode of Training */}
            <div>
              <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                <Monitor className="w-4 h-4 text-[#3b82f6]" />
                Mode of Training
              </label>
              <div className="flex gap-3">
                {['Virtual', 'Classroom'].map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    className={`flex-1 px-4 py-3 rounded-xl border transition-all duration-200 font-medium ${
                      trainingMode === mode 
                        ? 'bg-gradient-to-r from-[#93c5fd] to-[#3b82f6] text-white border-transparent shadow-md shadow-[#93c5fd]/30' 
                        : 'bg-white/50 backdrop-blur-sm border-white/50 text-gray-700 hover:bg-white/70'
                    }`}
                    onClick={() => setTrainingMode(mode)}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Evaluation based on */}
            <div>
              <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                <BarChart className="w-4 h-4 text-[#3b82f6]" />
                Evaluation based on
              </label>
              <div className="flex gap-3">
                {['Examination', 'Project'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    className={`flex-1 px-4 py-3 rounded-xl border transition-all duration-200 font-medium ${
                      evaluationType === type 
                        ? 'bg-gradient-to-r from-[#93c5fd] to-[#3b82f6] text-white border-transparent shadow-md shadow-[#93c5fd]/30' 
                        : 'bg-white/50 backdrop-blur-sm border-white/50 text-gray-700 hover:bg-white/70'
                    }`}
                    onClick={() => setEvaluationType(type)}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Number of Hours/Days */}
            <div>
              <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#3b82f6]" />
                Number of Hours/Days
              </label>
              <div className="relative">
                <button
                  type="button"
                  className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded-xl p-3 text-left flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent transition-all duration-200"
                  onClick={() => setIsHoursDropdownOpen(!isHoursDropdownOpen)}
                >
                  <span className={hoursOrDays ? 'text-gray-900' : 'text-gray-500'}>
                    {hoursOrDays || 'Select duration'}
                  </span>
                  <ChevronDown size={16} className="text-[#3b82f6]" />
                </button>
                {isHoursDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white/90 backdrop-blur-sm border border-white/50 rounded-xl shadow-lg shadow-blue-50/50 overflow-hidden">
                    {hoursOptions.map((option) => (
                      <div
                        key={option}
                        className="px-4 py-3 hover:bg-[#93c5fd]/10 cursor-pointer border-b border-white/50 last:border-b-0 transition-colors duration-200"
                        onClick={() => {
                          setHoursOrDays(option);
                          setIsHoursDropdownOpen(false);
                        }}
                      >
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full mr-3 ${hoursOrDays === option ? 'bg-[#3b82f6]' : 'bg-gray-300'}`}></div>
                          {option}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 border-t border-gray-200/50">
              <button 
                type="button"
                onClick={onBackClick}
                className="flex items-center gap-2 text-[#3b82f6] hover:text-[#1d4ed8] font-medium transition-colors duration-200 group"
              >
                <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform duration-200" />
                Back to Home
              </button>
              <button 
                type="button"
                onClick={handleSubmit}
                className="group flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-[#93c5fd] to-[#3b82f6] text-white rounded-xl hover:shadow-lg hover:shadow-[#93c5fd]/40 transition-all duration-200 text-base font-medium"
              >
                <Send className="w-5 h-5" />
                Register
                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}