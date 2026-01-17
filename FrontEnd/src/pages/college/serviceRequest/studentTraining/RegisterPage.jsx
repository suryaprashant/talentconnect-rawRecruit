import { useState } from 'react';
import { ChevronDown, Users, Target, Monitor, BarChart, Clock, ArrowLeft, Send, CheckSquare, MessageSquare } from 'lucide-react';
import axios from 'axios';

export default function RequestInfo({ onBackClick }) {
  const [numberOfEmployees, setNumberOfEmployees] = useState('');
  const [skillTypes, setSkillTypes] = useState([]);
  const [trainingMode, setTrainingMode] = useState('Virtual');
  const [evaluationType, setEvaluationType] = useState('Examination');
  const [hoursOrDays, setHoursOrDays] = useState('');
  const [description, setDescription] = useState('');
  const [descriptionError, setDescriptionError] = useState('');

  const [isEmployeeDropdownOpen, setIsEmployeeDropdownOpen] = useState(false);
  const [isSkillsDropdownOpen, setIsSkillsDropdownOpen] = useState(false);
  const [isHoursDropdownOpen, setIsHoursDropdownOpen] = useState(false);

  const employeeOptions = ['1-10', '11-50', '51-100', '100+'];
  const skillOptions = ['Technical Skills', 'Soft Skills', 'Leadership', 'Domain-Specific'];
  const hoursOptions = ['1-8 hours', '9-16 hours', '2-5 days', '1 week+'];

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (description.length > 500) {
      setDescriptionError("Description cannot exceed 500 characters.");
      return;
    }

    const payload = {
      numberOfStudents: [numberOfEmployees],
      typesOfSkills: skillTypes,
      modeOfTraining: trainingMode,
      evaluationBasedOn: evaluationType,
      numberOfHoursOrDays: [hoursOrDays],
      description: description
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_Backend_URL}/api/rawrecruit/student-training/register`,
        payload
      );
      console.log('✅ Saved:', response.data);
      alert('Request submitted successfully!');
      onBackClick();
    } catch (error) {
      console.error('❌ Submission error:', error.response?.data || error.message);
      alert('Failed to submit. Please check the console.');
    }
  };

  const toggleSkill = (skill) => {
    if (skillTypes.includes(skill)) {
      setSkillTypes(skillTypes.filter(item => item !== skill));
    } else {
      setSkillTypes([...skillTypes, skill]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0e6f7]/60 via-[#d4e8f9]/55 to-[#cff7ea]/60">
      {/* Background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#fbcfe8]/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-[#93c5fd]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/3 w-40 h-40 bg-[#a7f3d0]/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-6 max-w-5xl">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-xl shadow-lg shadow-blue-50/50 p-4 mb-6">
          <header className="text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] bg-clip-text text-transparent">
              Student Training Programs
            </h1>
            <p className="text-gray-600 text-sm max-w-2xl mx-auto mt-2">
              Offer targeted training programs to bridge skill gaps and ensure graduates are prepared with industry specific skills necessary for their careers.
            </p>
          </header>
        </div>

        {/* Form Card */}
        <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-blue-50/50 p-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] bg-clip-text text-transparent text-center mb-1">
            Register for Student Training Programs
          </h2>
          <p className="text-gray-600 text-center text-sm mb-6">
            Fill out the form below and our team will get back to you with detailed information.
          </p>

          <div className="space-y-5">
            {/* Row 1: Number of Employees & Types of Skills */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Number of Employees */}
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-[#3b82f6]" />
                  Number of Students
                </label>
                <div className="relative">
                  <button
                    type="button"
                    className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded-lg p-2.5 text-left flex justify-between items-center focus:ring-1 focus:ring-[#93c5fd] outline-none transition-all duration-200 min-h-[42px] text-sm"
                    onClick={() => setIsEmployeeDropdownOpen(!isEmployeeDropdownOpen)}
                  >
                    <span className={numberOfEmployees ? 'text-gray-900' : 'text-gray-500'}>
                      {numberOfEmployees || 'Select an option'}
                    </span>
                    <ChevronDown size={16} className={`text-[#3b82f6] transition-transform ${isEmployeeDropdownOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isEmployeeDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white/90 backdrop-blur-sm border border-white/50 rounded-lg shadow-lg shadow-blue-50/50 overflow-hidden">
                      {employeeOptions.map((option) => (
                        <div
                          key={option}
                          className="px-3 py-2 hover:bg-[#93c5fd]/10 cursor-pointer border-b border-white/50 last:border-b-0 transition-colors duration-200 text-sm"
                          onClick={() => {
                            setNumberOfEmployees(option);
                            setIsEmployeeDropdownOpen(false);
                          }}
                        >
                          <div className="flex items-center">
                            <div className={`w-4 h-4 border-2 rounded mr-2 flex items-center justify-center ${numberOfEmployees === option ? 'bg-[#3b82f6] border-[#3b82f6]' : 'border-gray-300'}`}>
                              {numberOfEmployees === option && <CheckSquare size={10} className="text-white" />}
                            </div>
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
                <label className="block text-gray-700 font-medium mb-2 text-sm flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-[#3b82f6]" />
                  Types of Skills
                </label>
                <div className="relative">
                  <button
                    type="button"
                    className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded-lg p-2.5 text-left flex justify-between items-center focus:ring-1 focus:ring-[#93c5fd] outline-none transition-all duration-200 min-h-[42px] text-sm"
                    onClick={() => setIsSkillsDropdownOpen(!isSkillsDropdownOpen)}
                  >
                    <span className={skillTypes.length > 0 ? 'text-gray-900' : 'text-gray-500'}>
                      {skillTypes.length > 0 ? skillTypes.join(', ') : 'Select skills'}
                    </span>
                    <ChevronDown size={16} className={`text-[#3b82f6] transition-transform ${isSkillsDropdownOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isSkillsDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white/90 backdrop-blur-sm border border-white/50 rounded-lg shadow-lg shadow-blue-50/50 overflow-hidden">
                      {skillOptions.map((option) => (
                        <div
                          key={option}
                          className="px-3 py-2 hover:bg-[#93c5fd]/10 cursor-pointer border-b border-white/50 last:border-b-0 transition-colors duration-200 text-sm"
                          onClick={() => toggleSkill(option)}
                        >
                          <div className="flex items-center">
                            <div className={`w-4 h-4 border-2 rounded mr-2 flex items-center justify-center ${skillTypes.includes(option) ? 'bg-[#3b82f6] border-[#3b82f6]' : 'border-gray-300'}`}>
                              {skillTypes.includes(option) && <CheckSquare size={10} className="text-white" />}
                            </div>
                            <span className={skillTypes.includes(option) ? "text-[#3b82f6] font-medium" : "text-gray-700"}>{option}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Row 2: Mode of Training & Evaluation based on */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Mode of Training */}
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm flex items-center gap-1.5">
                  <Monitor className="w-4 h-4 text-[#3b82f6]" />
                  Mode of Training
                </label>
                <div className="flex gap-2">
                  {['Virtual', 'Classroom'].map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      className={`flex-1 px-3 py-2 rounded-lg border text-sm transition-all duration-200 font-medium ${
                        trainingMode === mode 
                          ? 'bg-gradient-to-r from-[#93c5fd] to-[#3b82f6] text-white border-transparent' 
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
                <label className="block text-gray-700 font-medium mb-2 text-sm flex items-center gap-1.5">
                  <BarChart className="w-4 h-4 text-[#3b82f6]" />
                  Evaluation based on
                </label>
                <div className="flex gap-2">
                  {['Examination', 'Project'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      className={`flex-1 px-3 py-2 rounded-lg border text-sm transition-all duration-200 font-medium ${
                        evaluationType === type 
                          ? 'bg-gradient-to-r from-[#93c5fd] to-[#3b82f6] text-white border-transparent' 
                          : 'bg-white/50 backdrop-blur-sm border-white/50 text-gray-700 hover:bg-white/70'
                      }`}
                      onClick={() => setEvaluationType(type)}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Row 3: Number of Hours/Days and Description */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Number of Hours/Days */}
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#3b82f6]" />
                  Number of Hours/Days
                </label>
                <div className="relative">
                  <button
                    type="button"
                    className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded-lg p-2.5 text-left flex justify-between items-center focus:ring-1 focus:ring-[#93c5fd] outline-none transition-all duration-200 min-h-[42px] text-sm"
                    onClick={() => setIsHoursDropdownOpen(!isHoursDropdownOpen)}
                  >
                    <span className={hoursOrDays ? 'text-gray-900' : 'text-gray-500'}>
                      {hoursOrDays || 'Select duration'}
                    </span>
                    <ChevronDown size={16} className={`text-[#3b82f6] transition-transform ${isHoursDropdownOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isHoursDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white/90 backdrop-blur-sm border border-white/50 rounded-lg shadow-lg shadow-blue-50/50 overflow-hidden">
                      {hoursOptions.map((option) => (
                        <div
                          key={option}
                          className="px-3 py-2 hover:bg-[#93c5fd]/10 cursor-pointer border-b border-white/50 last:border-b-0 transition-colors duration-200 text-sm"
                          onClick={() => {
                            setHoursOrDays(option);
                            setIsHoursDropdownOpen(false);
                          }}
                        >
                          <div className="flex items-center">
                            <div className={`w-4 h-4 border-2 rounded mr-2 flex items-center justify-center ${hoursOrDays === option ? 'bg-[#3b82f6] border-[#3b82f6]' : 'border-gray-300'}`}>
                              {hoursOrDays === option && <CheckSquare size={10} className="text-white" />}
                            </div>
                            {option}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-[#3b82f6]" />
                  Description / Additional Requirements
                </label>
                <textarea 
                  className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded-lg px-2.5 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#93c5fd] focus:border-transparent resize-none" 
                  placeholder="Additional information about training requirements..." 
                  value={description} 
                  onChange={(e) => {
                    setDescription(e.target.value);
                    if (e.target.value.length > 500) {
                      setDescriptionError("Description cannot exceed 500 characters.");
                    } else {
                      setDescriptionError("");
                    }
                  }} 
                  rows="3"
                  maxLength={500}
                ></textarea>
                <div className="flex justify-between text-xs mt-1">
                  <span className={descriptionError ? 'text-red-500' : 'text-gray-500'}>
                    {descriptionError ? descriptionError : `${description.length}/500`}
                  </span>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-6 border-t border-gray-200/50">
              <button
                type="button"
                onClick={onBackClick}
                className="flex items-center gap-1.5 text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200 text-sm"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back 
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                className="group flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#93c5fd] to-[#3b82f6] text-white rounded-lg hover:shadow-lg hover:shadow-[#93c5fd]/40 transition-all duration-200 text-sm font-medium"
              >
                <Send className="w-4 h-4" />
                Register
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}