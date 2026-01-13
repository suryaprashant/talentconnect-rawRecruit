import { useState, useRef, useEffect  } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, X, Building2, Users, Target, Clock, Monitor, BookOpen } from 'lucide-react';
import { createEmployeeTrainingRegistration } from '@/lib/Company_AxiosInstance';


export default function RequesInfo({ onBackClick }) {
  const navigate=useNavigate();
  // Define initial form state
  const initialFormState = {
    numberOfEmployees: '',
    skillTypes: [],
    trainingMode: 'Virtual',
    evaluationType: 'Examination',
    hoursOrDays: '',
  };

  const [formData, setFormData] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [dropdownOpen, setDropdownOpen] = useState({
    numberOfEmployees: false,
    skillTypes: false,
    hoursOrDays: false
  });

  const employeeOptions = ['1-10', '11-50', '51-100', '100+'];
  const skillOptions = ['Technical Skills', 'Soft Skills', 'Leadership', 'Domain-Specific'];
  const hoursOptions = ['1-8 hours', '9-16 hours', '2-5 days', '1 week+'];

  // Refs for dropdowns
  const employeeRef = useRef(null);
  const skillsRef = useRef(null);
  const hoursRef = useRef(null);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      const dropdownRefs = {
        numberOfEmployees: employeeRef,
        skillTypes: skillsRef,
        hoursOrDays: hoursRef
      };

      for (const key in dropdownRefs) {
        if (dropdownRefs[key].current && !dropdownRefs[key].current.contains(event.target)) {
          setDropdownOpen(prev => ({ ...prev, [key]: false }));
        }
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Toggle dropdown
  const toggleDropdown = (dropdown) => {
    setDropdownOpen(prev => ({
      ...Object.keys(prev).reduce((acc, key) => ({ ...acc, [key]: false }), {}),
      [dropdown]: !prev[dropdown]
    }));
  };

  // Update form data
  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle skill toggle with multi-select
  const handleSkillToggle = (skill) => {
    setFormData(prev => ({
      ...prev,
      skillTypes: prev.skillTypes.includes(skill) 
        ? prev.skillTypes.filter(item => item !== skill)
        : [...prev.skillTypes, skill]
    }));
  };

  // Remove selected skill
  const removeSkill = (skill) => {
    setFormData(prev => ({
      ...prev,
      skillTypes: prev.skillTypes.filter(item => item !== skill)
    }));
  };

  // Submit handler
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    // Validate required fields
    if (!formData.numberOfEmployees || formData.skillTypes.length === 0 || !formData.hoursOrDays) {
      alert("Please fill in all required fields.");
      return;
    }

    // Convert employee range to number
    const getEmployeeCount = (range) => {
      const rangeMap = {
        '1-10': 10,
        '11-50': 50,
        '51-100': 100,
        '100+': 150
      };
      return rangeMap[range] || 0;
    };

    const submitData = {
      numOfEmployees: getEmployeeCount(formData.numberOfEmployees),
      typeOfSkill: formData.skillTypes.join(', '),
      modeOfTraining: formData.trainingMode.toLowerCase(),
      evaluationBasedOn: formData.evaluationType.toLowerCase(),
      numOfHoursPerDay: formData.hoursOrDays
    };

    console.log("Form data to be submitted:", submitData);

    setIsSubmitting(true);
    
    try {
      const response = await createEmployeeTrainingRegistration(submitData);
      alert("Training request submitted successfully!");
      console.log("Response:", response.data);
      
      // Reset form after successful submission
      setFormData(initialFormState);
      
    } catch (error) {
      console.error("Submission error:", error);
      alert("Failed to submit request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea]/5 via-[#f093fb]/5 to-[#764ba2]/5">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header Section */}
        <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-8 mb-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-gradient-to-br from-[#667eea]/20 to-[#764ba2]/20 rounded-xl mr-4">
                <Building2 className="h-6 w-6 text-[#667eea]" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
                OnDemand Training: Upskill with Purpose
              </h1>
            </div>
            <p className="text-md text-gray-600 max-w-4xl mx-auto mt-4 leading-relaxed">
              Bridge the gap between potential and performance with tailored training programs. 
              OnDemand Training empowers companies to offer job-ready learning experiences for 
              students or newly hired employees.
            </p>
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-8">
          {/* Form heading */}
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
              Register for On-Demand Training
            </h2>
            <p className="text-gray-500 mt-2">Fill in your training requirements to get started</p>
          </div>

          <div className="space-y-6">
            {/* Row 1: Number of Employees and Skills in one row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Number of Employees */}
              <div>
                <label className="block font-medium mb-3 text-gray-700 text-lg">Number of Employees</label>
                <div ref={employeeRef} className="relative">
                  <div
                    className="flex items-center justify-between p-4 w-full border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-colors bg-gradient-to-r from-gray-50 to-white"
                    onClick={() => toggleDropdown('numberOfEmployees')}
                  >
                    <div className="flex items-center">
                      <Users className="h-5 w-5 text-gray-400 mr-3" />
                      <span className={formData.numberOfEmployees ? "text-gray-700 font-medium" : "text-gray-500"}>
                        {formData.numberOfEmployees || 'Select number of employees'}
                      </span>
                    </div>
                    <ChevronDown className={`w-5 h-5 transition-transform ${dropdownOpen.numberOfEmployees ? "rotate-180" : ""} text-gray-400`} />
                  </div>
                  {dropdownOpen.numberOfEmployees && (
                    <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
                      {employeeOptions.map((option) => (
                        <div
                          key={option}
                          onClick={() => {
                            updateFormData('numberOfEmployees', option);
                            setDropdownOpen(prev => ({ ...prev, numberOfEmployees: false }));
                          }}
                          className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${formData.numberOfEmployees === option ? "bg-blue-50" : ""}`}
                        >
                          <div className="flex items-center justify-between">
                            <span className={formData.numberOfEmployees === option ? "text-[#667eea] font-medium" : "text-gray-700"}>
                              {option}
                            </span>
                            {formData.numberOfEmployees === option && <span className="text-[#667eea]">✓</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Types of Skills - Multi-select */}
              <div>
                <label className="block font-medium mb-3 text-gray-700 text-lg">Types of Skills</label>
                <div ref={skillsRef} className="relative">
                  
                  {/* Selected Skills Display */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {formData.skillTypes.map(skill => (
                      <div key={skill} className="flex items-center bg-gradient-to-r from-gray-100 to-white border border-gray-200 text-gray-700 text-sm px-3 py-1 rounded-full">
                        <Target className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{skill}</span>
                        <button 
                          type="button" 
                          onClick={() => removeSkill(skill)} 
                          className="ml-2 text-gray-500 hover:text-gray-700"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Dropdown Trigger */}
                  <div
                    className="flex items-center justify-between p-4 w-full border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-colors bg-gradient-to-r from-gray-50 to-white"
                    onClick={() => toggleDropdown('skillTypes')}
                  >
                    <div className="flex items-center">
                      <BookOpen className="h-5 w-5 text-gray-400 mr-3" />
                      <span className={formData.skillTypes.length > 0 ? "text-gray-700 font-medium" : "text-gray-500"}>
                        {formData.skillTypes.length > 0 ? `${formData.skillTypes.length} skills selected` : 'Select skills'}
                      </span>
                    </div>
                    <ChevronDown className={`w-5 h-5 transition-transform ${dropdownOpen.skillTypes ? "rotate-180" : ""} text-gray-400`} />
                  </div>

                  {/* Dropdown Content */}
                  {dropdownOpen.skillTypes && (
                    <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                      {skillOptions.map((option) => (
                        <div
                          key={option}
                          onClick={() => handleSkillToggle(option)}
                          className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${formData.skillTypes.includes(option) ? "bg-blue-50" : ""}`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                checked={formData.skillTypes.includes(option)}
                                readOnly
                                className="mr-3 h-4 w-4 text-[#667eea] border-gray-300 rounded focus:ring-[#667eea]"
                              />
                              <span className={formData.skillTypes.includes(option) ? "text-[#667eea] font-medium" : "text-gray-700"}>
                                {option}
                              </span>
                            </div>
                            {formData.skillTypes.includes(option) && <span className="text-[#667eea]">✓</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Row 2: Training Mode & Evaluation Type - Side by side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Mode of Training */}
              <div>
                <label className="block font-medium mb-3 text-gray-700 text-lg">Mode of Training</label>
                <div className="flex gap-2">
                  {['Virtual', 'Classroom'].map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      className={`flex items-center justify-center px-4 py-3 border rounded-lg transition-colors flex-1 ${
                        formData.trainingMode === mode 
                          ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white border-transparent' 
                          : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => updateFormData('trainingMode', mode)}
                    >
                      <Monitor className={`h-5 w-5 mr-2 ${formData.trainingMode === mode ? 'text-white' : 'text-gray-400'}`} />
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Evaluation based on */}
              <div>
                <label className="block font-medium mb-3 text-gray-700 text-lg">Evaluation based on</label>
                <div className="flex gap-2">
                  {['Examination', 'Project'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      className={`flex items-center justify-center px-4 py-3 border rounded-lg transition-colors flex-1 ${
                        formData.evaluationType === type 
                          ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white border-transparent' 
                          : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => updateFormData('evaluationType', type)}
                    >
                      <BookOpen className={`h-5 w-5 mr-2 ${formData.evaluationType === type ? 'text-white' : 'text-gray-400'}`} />
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Row 3: Number of Hours/Days - Full width but takes less space */}
            <div>
              <label className="block font-medium mb-3 text-gray-700 text-lg">Training Duration</label>
              <div ref={hoursRef} className="relative">
                <div
                  className="flex items-center justify-between p-4 w-full border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-colors bg-gradient-to-r from-gray-50 to-white"
                  onClick={() => toggleDropdown('hoursOrDays')}
                >
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-gray-400 mr-3" />
                    <span className={formData.hoursOrDays ? "text-gray-700 font-medium" : "text-gray-500"}>
                      {formData.hoursOrDays || 'Select training duration'}
                    </span>
                  </div>
                  <ChevronDown className={`w-5 h-5 transition-transform ${dropdownOpen.hoursOrDays ? "rotate-180" : ""} text-gray-400`} />
                </div>
                {dropdownOpen.hoursOrDays && (
                  <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
                    {hoursOptions.map((option) => (
                      <div
                        key={option}
                        onClick={() => {
                          updateFormData('hoursOrDays', option);
                          setDropdownOpen(prev => ({ ...prev, hoursOrDays: false }));
                        }}
                        className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${formData.hoursOrDays === option ? "bg-blue-50" : ""}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={formData.hoursOrDays === option ? "text-[#667eea] font-medium" : "text-gray-700"}>
                            {option}
                          </span>
                          {formData.hoursOrDays === option && <span className="text-[#667eea]">✓</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Row 4: Buttons */}
            <div className="flex justify-between pt-6 border-t border-gray-100">
              <button 
                type="button"
                onClick={onBackClick}
                className="px-6 py-3 text-[#667eea] hover:text-[#764ba2] font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                ← Back
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmit}
                className="px-8 py-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:shadow-[#667eea]/30 focus:outline-none focus:ring-2 focus:ring-[#667eea]/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Submitting...
                  </span>
                ) : 'Register'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}