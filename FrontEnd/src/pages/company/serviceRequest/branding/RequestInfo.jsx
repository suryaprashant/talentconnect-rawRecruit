import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { createBrandingRegistration } from '@/lib/Company_AxiosInstance';

export default function RequestInfo({ onBackClick }) {
  // Define initial form state
  const initialFormState = {
    numberOfEmployees: '',
    skillTypes: [],
    trainingMode: '',
    evaluationType: '',
    hoursOrDays: '',
  };

  const [formData, setFormData] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isEmployeeDropdownOpen, setIsEmployeeDropdownOpen] = useState(false);
  const [isSkillsDropdownOpen, setIsSkillsDropdownOpen] = useState(false);
  const [isHoursDropdownOpen, setIsHoursDropdownOpen] = useState(false);

  const employeeOptions = ['1-10', '11-50', '51-100', '100+'];
  const skillOptions = ['Technical Skills', 'Soft Skills', 'Leadership', 'Domain-Specific'];
  const hoursOptions = ['1-8 hours', '9-16 hours', '2-5 days', '1 week+'];

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.numberOfEmployees || formData.skillTypes.length === 0 || !formData.hoursOrDays) {
      alert("Please fill in all required fields.");
      return;
    }

 const submitData = {
    numOfEmployees: formData.numberOfEmployees,
    typeOfSkill: formData.skillTypes.join(', '), 
    modeOfTraining: formData.trainingMode.toLowerCase(), 
    evaluationBasedOn: formData.evaluationType.toLowerCase(), 
    numOfHoursPerDay: formData.hoursOrDays 
  };

  console.log("Form data to be submitted:", submitData);

    setIsSubmitting(true);
    
    try {
      const response = await createBrandingRegistration(submitData);
      alert("Employer branding registration submitted successfully!");
      console.log("Response:", response.data);
      
      // Reset form after successful submission
      setFormData(initialFormState);
      
    } catch (error) {
      console.error("Submission error:", error);
      alert("Failed to submit registration. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper functions to update form data
  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSkillToggle = (skill) => {
    setFormData(prev => ({
      ...prev,
      skillTypes: prev.skillTypes.includes(skill) 
        ? prev.skillTypes.filter(item => item !== skill)
        : [...prev.skillTypes, skill]
    }));
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white px-4">
              <div className="mb-6">
                                      <button
                                        type="button"
                                        onClick={onBackClick}
                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-[#4B5563] hover:bg-white/60 transition-all font-medium"
                                      >
                                        ← Back
                                      </button>
                                    </div>
      <div className="max-w-3xl w-full">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Employer Branding: <span>Be the brand they want to work for</span>
          </h1>
          <p className="text-sm text-gray-700 max-w-2xl mx-auto">
            Stand out in a competitive hiring market by building strong brand recall among students and early-career professional. <br />
            Our Employer Branding solutions help you position your company presence, curated events and digital visibility-making top talent come to you.
          </p>
        </div>

        {/* Form Section */}
        <div className="bg-white p-6 rounded-lg shadow border max-w-md mx-auto">
          <h2 className="text-xl font-bold mb-2 text-center">Register for Employer Branding</h2>
          <p className="text-sm text-gray-600 mb-6 text-center">Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>

          <div className="space-y-4">
            {/* Number of Employees */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Number of Employees</label>
              <div className="relative">
                <button
                  type="button"
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded text-left flex justify-between items-center"
                  onClick={() => setIsEmployeeDropdownOpen(!isEmployeeDropdownOpen)}
                >
                  <span>{formData.numberOfEmployees || 'Select an option'}</span>
                  <ChevronDown size={16} />
                </button>
                {isEmployeeDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg">
                    {employeeOptions.map((option) => (
                      <div
                        key={option}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          updateFormData('numberOfEmployees', option);
                          setIsEmployeeDropdownOpen(false);
                        }}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Types of Skills */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Types of Skills</label>
              <div className="relative">
                <button
                  type="button"
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded text-left flex justify-between items-center"
                  onClick={() => setIsSkillsDropdownOpen(!isSkillsDropdownOpen)}
                >
                  <span>{formData.skillTypes.length > 0 ? formData.skillTypes.join(', ') : 'Select skills'}</span>
                  <ChevronDown size={16} />
                </button>
                {isSkillsDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg">
                    {skillOptions.map((option) => (
                      <div
                        key={option}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleSkillToggle(option)}
                      >
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.skillTypes.includes(option)}
                            readOnly
                            className="mr-2"
                          />
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Mode of Training</label>
              <div className="flex gap-2">
                {['Virtual', 'Classroom'].map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    className={`px-4 py-2 border border-gray-300 ${
                      formData.trainingMode === mode ? 'bg-black text-white' : 'bg-gray-100'
                    }`}
                    onClick={() => updateFormData('trainingMode', mode)}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Evaluation based on */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Evaluation based on</label>
              <div className="flex gap-2">
                {['Examination', 'Project'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    className={`px-4 py-2 border border-gray-300 ${
                      formData.evaluationType === type ? 'bg-black text-white' : 'bg-gray-100'
                    }`}
                    onClick={() => updateFormData('evaluationType', type)}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Number of Hours/Days */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Number of Hours/Days</label>
              <div className="relative">
                <button
                  type="button"
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded text-left flex justify-between items-center"
                  onClick={() => setIsHoursDropdownOpen(!isHoursDropdownOpen)}
                >
                  <span>{formData.hoursOrDays || 'Select duration'}</span>
                  <ChevronDown size={16} />
                </button>
                {isHoursDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg">
                    {hoursOptions.map((option) => (
                      <div
                        key={option}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          updateFormData('hoursOrDays', option);
                          setIsHoursDropdownOpen(false);
                        }}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Register Button */}
            <div className="flex justify-center pt-4">
              {/* <button 
                type="button"
                onClick={onBackClick}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                ← Back to Home
              </button>   */}
              <button
                type="button"
                disabled={isSubmitting}
                className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
                onClick={handleSubmit}
              >
                {isSubmitting ? 'Submitting...' : 'Register'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}