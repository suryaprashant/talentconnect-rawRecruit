import { useState } from 'react';
import { ChevronDown, Users, Target, BarChart, Clock, ArrowLeft, Send, CheckSquare, Users as SeminarIcon } from 'lucide-react';

export default function RequestInfo({ onBackClick, handleSubmit: handleSubmitProp }) {
  const [numberOfStudents, setNumberOfStudents] = useState('');
  const [seminarTypes, setSeminarTypes] = useState([]);
  const [evaluationType, setEvaluationType] = useState('Examination');
  const [duration, setDuration] = useState('');
  const [submissions, setSubmissions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isStudentsDropdownOpen, setIsStudentsDropdownOpen] = useState(false);
  const [isSeminarsDropdownOpen, setIsSeminarsDropdownOpen] = useState(false);
  const [isHoursDropdownOpen, setIsHoursDropdownOpen] = useState(false);

  const studentsOptions = ['1-10', '11-50', '51-100', '100+'];
  const seminarOptions = ['Cyber Security', 'AI', 'Leadership', 'Domain-Specific'];
  const hoursOptions = ['1-8 hours', '9-16 hours', '2-5 days', '1 week+'];

  const handleSubmit = async () => {
    if (!numberOfStudents || seminarTypes.length === 0 || !duration) {
      alert("Please fill all required fields.");
      return;
    }

    const formData = {
      numberOfStudents,
      typesOfSeminar: seminarTypes,
      evaluationBasedOn: evaluationType,
      numberOfHoursDays: duration
    };

    setIsSubmitting(true);
    try {
      await handleSubmitProp(formData); // call parent-provided handler
      setSubmissions(prev => [...prev, { ...formData, id: Date.now() }]);
    } catch (error) {
      console.error("Submission error:", error);
      alert("Submission failed.");
    } finally {
      setIsSubmitting(false);
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
            Seminars: Empower Minds, Inspire Futures
          </h1>
          <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto">
            Equip students with insights and knowledge that shape their careers. Our seminars bring industry experts to your campus, offering students a deeper understanding of various career paths, market trends, and essential skills. Create a learning environment that fosters growth and help students make informed career decisions.
          </p>
        </div>

        {/* Form Section */}
        <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-blue-50/50 p-8">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] bg-clip-text text-transparent mb-2 text-center">
            Register for Transformative Seminars
          </h2>
          <p className="text-gray-600 mb-8 text-center">
            Fill out the form below and our team will get back to you with detailed information.
          </p>

          <div className="space-y-6">
            {/* Number of Students */}
            <div>
              <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                <Users className="w-4 h-4 text-[#3b82f6]" />
                Number of Students
              </label>
              <div className="relative">
                <button
                  type="button"
                  className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded-xl p-3 text-left flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent transition-all duration-200"
                  onClick={() => setIsStudentsDropdownOpen(!isStudentsDropdownOpen)}
                >
                  <span className={numberOfStudents ? 'text-gray-900' : 'text-gray-500'}>
                    {numberOfStudents || 'Select an option'}
                  </span>
                  <ChevronDown size={16} className="text-[#3b82f6]" />
                </button>
                {isStudentsDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white/90 backdrop-blur-sm border border-white/50 rounded-xl shadow-lg shadow-blue-50/50 overflow-hidden">
                    {studentsOptions.map((option) => (
                      <div
                        key={option}
                        className="px-4 py-3 hover:bg-[#93c5fd]/10 cursor-pointer border-b border-white/50 last:border-b-0 transition-colors duration-200"
                        onClick={() => {
                          setNumberOfStudents(option);
                          setIsStudentsDropdownOpen(false);
                        }}
                      >
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full mr-3 ${numberOfStudents === option ? 'bg-[#3b82f6]' : 'bg-gray-300'}`}></div>
                          {option}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Types of Seminar */}
            <div>
              <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                <SeminarIcon className="w-4 h-4 text-[#3b82f6]" />
                Types of Seminar
              </label>
              <div className="relative">
                <button
                  type="button"
                  className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded-xl p-3 text-left flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent transition-all duration-200"
                  onClick={() => setIsSeminarsDropdownOpen(!isSeminarsDropdownOpen)}
                >
                  <span className={seminarTypes.length > 0 ? 'text-gray-900' : 'text-gray-500'}>
                    {seminarTypes.length > 0 ? seminarTypes.join(', ') : 'Select seminars'}
                  </span>
                  <ChevronDown size={16} className="text-[#3b82f6]" />
                </button>
                {isSeminarsDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white/90 backdrop-blur-sm border border-white/50 rounded-xl shadow-lg shadow-blue-50/50 overflow-hidden">
                    {seminarOptions.map((option) => (
                      <div
                        key={option}
                        className="px-4 py-3 hover:bg-[#93c5fd]/10 cursor-pointer border-b border-white/50 last:border-b-0 transition-colors duration-200"
                        onClick={() => {
                          if (seminarTypes.includes(option)) {
                            setSeminarTypes(seminarTypes.filter(item => item !== option));
                          } else {
                            setSeminarTypes([...seminarTypes, option]);
                          }
                        }}
                      >
                        <div className="flex items-center">
                          <div className={`w-5 h-5 border-2 rounded mr-3 flex items-center justify-center ${seminarTypes.includes(option) ? 'bg-[#3b82f6] border-[#3b82f6]' : 'border-gray-300'}`}>
                            {seminarTypes.includes(option) && (
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

            {/* Evaluation based on */}
            <div>
              <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                <BarChart className="w-4 h-4 text-[#3b82f6]" />
                Evaluation based on
              </label>
              <div className="flex gap-3">
                {["Examination", "Project"].map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    className={`flex-1 px-4 py-3 rounded-xl border transition-all duration-200 font-medium ${
                      evaluationType === mode 
                        ? 'bg-gradient-to-r from-[#93c5fd] to-[#3b82f6] text-white border-transparent shadow-md shadow-[#93c5fd]/30' 
                        : 'bg-white/50 backdrop-blur-sm border-white/50 text-gray-700 hover:bg-white/70'
                    }`}
                    onClick={() => setEvaluationType(mode)}
                  >
                    {mode}
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
                  <span className={duration ? 'text-gray-900' : 'text-gray-500'}>
                    {duration || 'Select duration'}
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
                          setDuration(option);
                          setIsHoursDropdownOpen(false);
                        }}
                      >
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full mr-3 ${duration === option ? 'bg-[#3b82f6]' : 'bg-gray-300'}`}></div>
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
                disabled={isSubmitting}
                className="group flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-[#93c5fd] to-[#3b82f6] text-white rounded-xl hover:shadow-lg hover:shadow-[#93c5fd]/40 transition-all duration-200 text-base font-medium disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
                {isSubmitting ? 'Submitting...' : 'Register'}
                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Local Submissions Display (for testing) */}
        {submissions.length > 0 && (
          <div className="mt-8 bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-blue-50/50 p-6 max-w-md mx-auto">
            <h3 className="text-lg font-bold text-[#3b82f6] mb-4">Recent Submissions ({submissions.length}):</h3>
            <div className="space-y-4">
              {submissions.slice(-3).map((sub) => (
                <div 
                  key={sub.id} 
                  className="p-4 bg-gradient-to-r from-[#93c5fd]/10 to-[#3b82f6]/5 rounded-xl border border-[#93c5fd]/20"
                >
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Students:</span>
                      <p className="text-gray-900">{sub.numberOfStudents}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Duration:</span>
                      <p className="text-gray-900">{sub.duration}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="font-medium text-gray-700">Seminars:</span>
                      <p className="text-gray-900">{sub.seminarTypes.join(', ')}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="font-medium text-gray-700">Evaluation:</span>
                      <p className="text-gray-900">{sub.evaluationType}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}