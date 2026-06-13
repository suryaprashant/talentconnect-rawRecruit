import { useState } from 'react';
import { ChevronDown, Users, Target, BarChart, Clock, ArrowLeft, Send, CheckSquare, Users as SeminarIcon, MessageSquare } from 'lucide-react';

export default function RequestInfo({ onBackClick, handleSubmit: handleSubmitProp }) {
  const [numberOfStudents, setNumberOfStudents] = useState('');
  const [seminarTypes, setSeminarTypes] = useState([]);
  const [evaluationType, setEvaluationType] = useState('Examination');
  const [duration, setDuration] = useState('');
  const [description, setDescription] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
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

    if (description.length > 500) {
      setDescriptionError("Description cannot exceed 500 characters.");
      return;
    }

    const formData = {
      numberOfStudents,
      typesOfSeminar: seminarTypes,
      evaluationBasedOn: evaluationType,
      numberOfHoursDays: duration,
      description: description
    };

    setIsSubmitting(true);
    try {
      await handleSubmitProp(formData); // call parent-provided handler
      setSubmissions(prev => [...prev, { ...formData, id: Date.now() }]);
      // Reset form
      setNumberOfStudents('');
      setSeminarTypes([]);
      setEvaluationType('Examination');
      setDuration('');
      setDescription('');
      setDescriptionError('');
    } catch (error) {
      console.error("Submission error:", error);
      alert("Submission failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleSeminar = (seminar) => {
    if (seminarTypes.includes(seminar)) {
      setSeminarTypes(seminarTypes.filter(item => item !== seminar));
    } else {
      setSeminarTypes([...seminarTypes, seminar]);
    }
  };

  const toggleDropdown = (dropdown) => {
    // Close all other dropdowns
    setIsStudentsDropdownOpen(false);
    setIsSeminarsDropdownOpen(false);
    setIsHoursDropdownOpen(false);
    
    // Toggle the clicked dropdown
    if (dropdown === 'students') setIsStudentsDropdownOpen(!isStudentsDropdownOpen);
    if (dropdown === 'seminars') setIsSeminarsDropdownOpen(!isSeminarsDropdownOpen);
    if (dropdown === 'hours') setIsHoursDropdownOpen(!isHoursDropdownOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0e6f7]/60 via-[#d4e8f9]/55 to-[#cff7ea]/60">
      {/* Pastel blur background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#fbcfe8]/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-[#143694]/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-1/3 w-40 h-40 bg-[#a7f3d0]/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-6 max-w-5xl">
        {/* Header Section */}
        <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-xl shadow-lg shadow-blue-50/50 p-4 mb-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#1e4ed8] to-[#1e40af] bg-clip-text text-transparent mb-1">
              Seminars: Empower Minds, Inspire Futures
            </h1>
            <p className="text-gray-600 text-sm max-w-2xl mx-auto">
              Equip students with insights and knowledge that shape their careers. Our seminars bring industry experts to your campus.
            </p>
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-blue-50/50 p-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-[#1e4ed8] to-[#1e40af] bg-clip-text text-transparent mb-2 text-center">
            Register for Transformative Seminars
          </h2>
          <p className="text-gray-600 mb-6 text-center text-sm">
            Fill out the form below and our team will get back to you with detailed information.
          </p>

          <div className="space-y-5">
            {/* Row 1: Number of Students and Types of Seminar */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Number of Students */}
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-[#1e4ed8]" />
                  Number of Students
                </label>
                <div className="relative">
                  <button
                    type="button"
                    className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded-lg p-2.5 text-left flex justify-between items-center focus:ring-1 focus:ring-[#143694] outline-none transition-all duration-200 min-h-[42px] text-sm"
                    onClick={() => toggleDropdown('students')}
                  >
                    <span className={numberOfStudents ? 'text-gray-900' : 'text-gray-500'}>
                      {numberOfStudents || 'Select an option'}
                    </span>
                    <ChevronDown size={16} className={`text-[#1e4ed8] transition-transform ${isStudentsDropdownOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isStudentsDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white/90 backdrop-blur-sm border border-white/50 rounded-lg shadow-lg shadow-blue-50/50 overflow-hidden">
                      {studentsOptions.map((option) => (
                        <div
                          key={option}
                          className="px-3 py-2 hover:bg-[#143694]/10 cursor-pointer border-b border-white/50 last:border-b-0 transition-colors duration-200 text-sm"
                          onClick={() => {
                            setNumberOfStudents(option);
                            setIsStudentsDropdownOpen(false);
                          }}
                        >
                          <div className="flex items-center">
                            <div className={`w-4 h-4 border-2 rounded mr-2 flex items-center justify-center ${numberOfStudents === option ? 'bg-[#1e4ed8] border-[#1e4ed8]' : 'border-gray-300'}`}>
                              {numberOfStudents === option && <CheckSquare size={10} className="text-white" />}
                            </div>
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
                <label className="block text-gray-700 font-medium mb-2 text-sm flex items-center gap-1.5">
                  <SeminarIcon className="w-4 h-4 text-[#1e4ed8]" />
                  Types of Seminar
                </label>
                <div className="relative">
                  <button
                    type="button"
                    className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded-lg p-2.5 text-left flex justify-between items-center focus:ring-1 focus:ring-[#143694] outline-none transition-all duration-200 min-h-[42px] text-sm"
                    onClick={() => toggleDropdown('seminars')}
                  >
                    <span className={seminarTypes.length > 0 ? 'text-gray-900' : 'text-gray-500'}>
                      {seminarTypes.length > 0 ? seminarTypes.join(', ') : 'Select seminars'}
                    </span>
                    <ChevronDown size={16} className={`text-[#1e4ed8] transition-transform ${isSeminarsDropdownOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isSeminarsDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white/90 backdrop-blur-sm border border-white/50 rounded-lg shadow-lg shadow-blue-50/50 overflow-hidden">
                      {seminarOptions.map((option) => (
                        <div
                          key={option}
                          className="px-3 py-2 hover:bg-[#143694]/10 cursor-pointer border-b border-white/50 last:border-b-0 transition-colors duration-200 text-sm"
                          onClick={() => toggleSeminar(option)}
                        >
                          <div className="flex items-center">
                            <div className={`w-4 h-4 border-2 rounded mr-2 flex items-center justify-center ${seminarTypes.includes(option) ? 'bg-[#1e4ed8] border-[#1e4ed8]' : 'border-gray-300'}`}>
                              {seminarTypes.includes(option) && <CheckSquare size={10} className="text-white" />}
                            </div>
                            <span className={seminarTypes.includes(option) ? "text-[#1e4ed8] font-medium" : "text-gray-700"}>{option}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Row 2: Evaluation based on and Duration */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Evaluation based on */}
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm flex items-center gap-1.5">
                  <BarChart className="w-4 h-4 text-[#1e4ed8]" />
                  Evaluation based on
                </label>
                <div className="flex gap-2">
                  {["Examination", "Project"].map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      className={`flex-1 px-3 py-2 rounded-lg border text-sm transition-all duration-200 font-medium ${
                        evaluationType === mode 
                          ? 'bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white border-transparent' 
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
                <label className="block text-gray-700 font-medium mb-2 text-sm flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#1e4ed8]" />
                  Number of Hours/Days
                </label>
                <div className="relative">
                  <button
                    type="button"
                    className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded-lg p-2.5 text-left flex justify-between items-center focus:ring-1 focus:ring-[#143694] outline-none transition-all duration-200 min-h-[42px] text-sm"
                    onClick={() => toggleDropdown('hours')}
                  >
                    <span className={duration ? 'text-gray-900' : 'text-gray-500'}>
                      {duration || 'Select duration'}
                    </span>
                    <ChevronDown size={16} className={`text-[#1e4ed8] transition-transform ${isHoursDropdownOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isHoursDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white/90 backdrop-blur-sm border border-white/50 rounded-lg shadow-lg shadow-blue-50/50 overflow-hidden">
                      {hoursOptions.map((option) => (
                        <div
                          key={option}
                          className="px-3 py-2 hover:bg-[#143694]/10 cursor-pointer border-b border-white/50 last:border-b-0 transition-colors duration-200 text-sm"
                          onClick={() => {
                            setDuration(option);
                            setIsHoursDropdownOpen(false);
                          }}
                        >
                          <div className="flex items-center">
                            <div className={`w-4 h-4 border-2 rounded mr-2 flex items-center justify-center ${duration === option ? 'bg-[#1e4ed8] border-[#1e4ed8]' : 'border-gray-300'}`}>
                              {duration === option && <CheckSquare size={10} className="text-white" />}
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

            {/* Row 3: Description - Full Width */}
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-[#1e4ed8]" />
                Seminar Requirements / Additional Information
              </label>
              <textarea 
                className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded-lg px-2.5 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#143694] focus:border-transparent resize-none" 
                placeholder="Additional information about seminar topics, speaker preferences, or specific requirements..." 
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
                disabled={isSubmitting}
                className="group flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white rounded-lg hover:shadow-lg hover:shadow-[#143694]/40 transition-all duration-200 text-sm font-medium disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? 'Submitting...' : 'Register'}
              </button>
            </div>
          </div>
        </div>

        {/* Local Submissions Display (for testing) */}
        {submissions.length > 0 && (
          <div className="mt-8 bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-blue-50/50 p-6 max-w-md mx-auto">
            <h3 className="text-lg font-bold text-[#1e4ed8] mb-4">Recent Submissions ({submissions.length}):</h3>
            <div className="space-y-4">
              {submissions.slice(-3).map((sub) => (
                <div 
                  key={sub.id} 
                  className="p-4 bg-gradient-to-r from-[#143694]/10 to-[#1e4ed8]/5 rounded-xl border border-[#143694]/20"
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