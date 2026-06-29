import { useState } from 'react';
import { ChevronDown, Users, Target, Monitor, BarChart, Clock, ArrowLeft, Send, CheckSquare } from 'lucide-react';
import axios from '../../../../lib/axiosInstance';

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
      onBackClick();
    } catch (error) {
      console.error('❌ Submission error:', error.response?.data || error.message);
      alert('Failed to submit. Please check the console.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0e6f7]/60 via-[#d4e8f9]/55 to-[#cff7ea]/60">
      {/* Background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#fbcfe8]/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-[#143694]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/3 w-40 h-40 bg-[#a7f3d0]/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 pt-14 max-w-2xl">
        {/* Header */}
        <header className="mb-6 text-center">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#1e4ed8] to-[#1e40af] bg-clip-text text-transparent">
            Student Training Programs
          </h1>
          <p className="text-gray-600 text-base md:text-lg max-w-xl mx-auto mt-3">
            Offer targeted training programs to bridge skill gaps and ensure graduates are prepared with industry specific skills necessary for their careers.
          </p>
        </header>

        {/* Form Card */}
        <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#1e4ed8] to-[#1e40af] bg-clip-text text-transparent text-center mb-1">
            Request Info for Student Training Programs
          </h2>
          <p className="text-gray-600 text-center text-sm mb-5">
            Fill out the form below and our team will get back to you with detailed information.
          </p>

          <div className="space-y-5">
            {/* Row 1: Number of Employees & Types of Skills */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Number of Employees */}
              <div>
                <label className="block text-gray-700 font-medium mb-1 flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#1e4ed8]" />
                  Number of Employees
                </label>
                <div className="relative">
                  <button
                    type="button"
                    className="w-full bg-white/50 border border-white/50 rounded-xl p-3 text-left flex justify-between items-center focus:ring-2 focus:ring-[#143694] outline-none"
                    onClick={() => setIsEmployeeDropdownOpen(!isEmployeeDropdownOpen)}
                  >
                    <span className={numberOfEmployees ? 'text-gray-900' : 'text-gray-500'}>
                      {numberOfEmployees || 'Select an option'}
                    </span>
                    <ChevronDown size={16} className="text-[#1e4ed8]" />
                  </button>
                  {isEmployeeDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white/90 backdrop-blur-sm border border-white/50 rounded-xl shadow-lg overflow-hidden">
                      {employeeOptions.map((option) => (
                        <div
                          key={option}
                          className="px-4 py-3 hover:bg-[#143694]/10 cursor-pointer border-b border-white/50 last:border-b-0"
                          onClick={() => {
                            setNumberOfEmployees(option);
                            setIsEmployeeDropdownOpen(false);
                          }}
                        >
                          <div className="flex items-center">
                            <div className={`w-3 h-3 rounded-full mr-3 ${numberOfEmployees === option ? 'bg-[#1e4ed8]' : 'bg-gray-300'}`}></div>
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
                <label className="block text-gray-700 font-medium mb-1 flex items-center gap-2">
                  <Target className="w-4 h-4 text-[#1e4ed8]" />
                  Types of Skills
                </label>
                <div className="relative">
                  <button
                    type="button"
                    className="w-full bg-white/50 border border-white/50 rounded-xl p-3 text-left flex justify-between items-center focus:ring-2 focus:ring-[#143694] outline-none"
                    onClick={() => setIsSkillsDropdownOpen(!isSkillsDropdownOpen)}
                  >
                    <span className={skillTypes.length > 0 ? 'text-gray-900' : 'text-gray-500'}>
                      {skillTypes.length > 0 ? skillTypes.join(', ') : 'Select skills'}
                    </span>
                    <ChevronDown size={16} className="text-[#1e4ed8]" />
                  </button>
                  {isSkillsDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white/90 backdrop-blur-sm border border-white/50 rounded-xl shadow-lg overflow-hidden">
                      {skillOptions.map((option) => (
                        <div
                          key={option}
                          className="px-4 py-3 hover:bg-[#143694]/10 cursor-pointer border-b border-white/50 last:border-b-0"
                          onClick={() => {
                            if (skillTypes.includes(option)) {
                              setSkillTypes(skillTypes.filter(item => item !== option));
                            } else {
                              setSkillTypes([...skillTypes, option]);
                            }
                          }}
                        >
                          <div className="flex items-center">
                            <div className={`w-5 h-5 border-2 rounded mr-3 flex items-center justify-center ${skillTypes.includes(option) ? 'bg-[#1e4ed8] border-[#1e4ed8]' : 'border-gray-300'}`}>
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
            </div>

            {/* Row 2: Mode of Training & Evaluation based on */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Mode of Training */}
              <div>
                <label className="block text-gray-700 font-medium mb-1 flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-[#1e4ed8]" />
                  Mode of Training
                </label>
                <div className="flex gap-3">
                  {['Virtual', 'Classroom'].map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      className={`flex-1 px-4 py-3 rounded-xl border font-medium ${
                        trainingMode === mode 
                          ? 'bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white border-transparent shadow-md shadow-[#143694]/30' 
                          : 'bg-white/50 border-white/50 text-gray-700'
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
                <label className="block text-gray-700 font-medium mb-1 flex items-center gap-2">
                  <BarChart className="w-4 h-4 text-[#1e4ed8]" />
                  Evaluation based on
                </label>
                <div className="flex gap-3">
                  {['Examination', 'Project'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      className={`flex-1 px-4 py-3 rounded-xl border font-medium ${
                        evaluationType === type 
                          ? 'bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white border-transparent shadow-md shadow-[#143694]/30' 
                          : 'bg-white/50 border-white/50 text-gray-700'
                      }`}
                      onClick={() => setEvaluationType(type)}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Number of Hours/Days */}
            <div>
              <label className="block text-gray-700 font-medium mb-1 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#1e4ed8]" />
                Number of Hours/Days
              </label>
              <div className="relative">
                <button
                  type="button"
                  className="w-full bg-white/50 border border-white/50 rounded-xl p-3 text-left flex justify-between items-center focus:ring-2 focus:ring-[#143694] outline-none"
                  onClick={() => setIsHoursDropdownOpen(!isHoursDropdownOpen)}
                >
                  <span className={hoursOrDays ? 'text-gray-900' : 'text-gray-500'}>
                    {hoursOrDays || 'Select duration'}
                  </span>
                  <ChevronDown size={16} className="text-[#1e4ed8]" />
                </button>
                {isHoursDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white/90 backdrop-blur-sm border border-white/50 rounded-xl shadow-lg overflow-hidden">
                    {hoursOptions.map((option) => (
                      <div
                        key={option}
                        className="px-4 py-3 hover:bg-[#143694]/10 cursor-pointer border-b border-white/50 last:border-b-0"
                        onClick={() => {
                          setHoursOrDays(option);
                          setIsHoursDropdownOpen(false);
                        }}
                      >
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full mr-3 ${hoursOrDays === option ? 'bg-[#1e4ed8]' : 'bg-gray-300'}`}></div>
                          {option}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-gray-200/50">
              <button
                type="button"
                onClick={onBackClick}
                className="flex items-center gap-2 text-[#1e4ed8] hover:text-[#1d4ed8] font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                Back               </button>

              <button
                type="button"
                onClick={handleSubmit}
                className="group flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white rounded-xl text-base font-semibold hover:shadow-lg transition-all"
              >
                <Send className="w-5 h-5" />
                Submit Request
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}