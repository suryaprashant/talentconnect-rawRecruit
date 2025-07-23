import { useState } from 'react';
import axios from 'axios';
import { ChevronDown, Mail, Phone, Link, Calendar as CalendarIcon } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const CustomDatePickerStyles = `
  .react-datepicker-wrapper {
    width: 100%;
  }
  .react-datepicker__input-container input {
    width: 100%;
    padding: 0.5rem 2.5rem 0.5rem 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    appearance: none;
    background-color: white;
  }
  .react-datepicker__input-container input:focus {
    outline: 2px solid transparent;
    outline-offset: 2px;
    border-color: #3b82f6;
  }
  .react-datepicker-popper {
    z-index: 10;
  }
`;

const initialFormData = {
  degree: '',
  locations: '',
  lookingFor: 'job',
  employmentType: 'full-time',
  minimumSalary: '',
  startDate: null,
  endDate: null,
  rounds: '',
  selectionProcess: '',
  contactName: '',
  contactDesignation: '',
  contactEmail: '',
  contactMobile: '',
  contactLinkedIn: '',
  minimumStudents: ''
};

export default function RequestInfo() {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  const handleDateChange = (date, fieldName) => {
    setFormData(prev => ({ ...prev, [fieldName]: date }));
  };
  
  const handleOptionSelect = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.contactDesignation.trim()) {
      newErrors.contactDesignation = 'Contact designation is required.';
    }
    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = 'Contact email is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Please enter a valid email address.';
    }
    if (!formData.contactMobile.trim()) {
      newErrors.contactMobile = 'Contact mobile number is required.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      alert('Please fill all the required fields marked with an asterisk (*).');
      return;
    }

    setIsLoading(true);

    const payload = {
      degree: formData.degree ? [formData.degree] : [],
      preferredLocations: formData.locations ? [formData.locations] : [],
      lookingFor: formData.lookingFor,
      employmentType: formData.employmentType,
      minimumSalary: formData.minimumSalary,
      startDate: formData.startDate ? formData.startDate.toISOString() : '',
      endDate: formData.endDate ? formData.endDate.toISOString() : '',
      rounds: formData.rounds ? [formData.rounds] : [],
      selectionProcess: formData.selectionProcess ? [formData.selectionProcess] : [],
      contactPerson: formData.contactName,
      contactDesignation: formData.contactDesignation,
      email: formData.contactEmail,
      mobile: formData.contactMobile,
      linkedin: formData.contactLinkedIn,
      minimumStudents: formData.minimumStudents ? [formData.minimumStudents] : [],
    };

    try {
      const token = localStorage.getItem('token') || document.cookie.split('; ').find(row => row.startsWith('jwt='))?.split('=')[1];
      if (!token) {
        setIsLoading(false);
        alert('Authentication error. Please log in again.');
        return;
      }

      const backendUrl = import.meta.env.VITE_Backend_URL || 'http://localhost:5000';
      
      console.log("Sending request to:", `${backendUrl}/api/HiringChannels/create-Oncampusjob`);
      console.log("Payload:", payload);

      const response = await axios.post(
        `${backendUrl}/api/HiringChannels/create-Oncampusjob`, 
        payload, 
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );
      
      console.log("Response:", response);
      alert('On-Campus Job posted successfully!');
      setFormData(initialFormData);

    } catch (error) {
      console.error('Error details:', error);
      console.error('Error response:', error.response);
      
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'An unexpected error occurred. Please try again.';
      alert(`Submission Failed: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <style>{CustomDatePickerStyles}</style>
      <div className="max-w-4xl mx-auto p-6 sm:p-8 bg-white rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row justify-between items-start mb-8">
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl font-bold text-gray-800">OnCampus Connect:</h1>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Hire Smarter</h2>
          </div>
          <div className="max-w-md">
            <p className="text-sm text-gray-600">
              Our OnCampus service brings career opportunities directly to students, connecting them with top employers through campus recruitment drives and job events.
            </p>
          </div>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Register for On-Campus Hiring</h2>
          <p className="text-gray-500 mt-2">Please fill in the details below to register for the hiring event.</p>
        </div>

        <div className="space-y-6">
          {/* Degree */}
          <div>
            <label htmlFor="degree" className="block mb-2 font-medium text-gray-700">Degree</label>
            <div className="relative">
              <select
                id="degree"
                name="degree"
                className="w-full p-2.5 border border-gray-300 rounded-md appearance-none bg-white pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.degree}
                onChange={handleInputChange}
              >
                <option value="" disabled>Select degree</option>
                <option value="bachelors">Bachelor's</option>
                <option value="masters">Master's</option>
                <option value="phd">PhD</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
            </div>
          </div>

          {/* Preferred Hiring Locations */}
          <div>
            <label htmlFor="locations" className="block mb-2 font-medium text-gray-700">Preferred Hiring Locations</label>
            <div className="relative">
              <select
                id="locations"
                name="locations"
                className="w-full p-2.5 border border-gray-300 rounded-md appearance-none bg-white pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.locations}
                onChange={handleInputChange}
              >
                <option value="" disabled>Select location</option>
                <option value="remote">Remote</option>
                <option value="onsite">On-site</option>
                <option value="hybrid">Hybrid</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
            </div>
          </div>

          {/* Looking for */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">Looking for</label>
            <div className="flex flex-wrap gap-2">
              <button type="button" className={`px-4 py-2 text-sm font-medium border rounded-md transition-colors ${formData.lookingFor === 'job' ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`} onClick={() => handleOptionSelect('lookingFor', 'job')}>Job</button>
              <button type="button" className={`px-4 py-2 text-sm font-medium border rounded-md transition-colors ${formData.lookingFor === 'internship' ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`} onClick={() => handleOptionSelect('lookingFor', 'internship')}>Internship</button>
              <button type="button" className={`px-4 py-2 text-sm font-medium border rounded-md transition-colors ${formData.lookingFor === 'both' ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`} onClick={() => handleOptionSelect('lookingFor', 'both')}>Both</button>
            </div>
          </div>

          {/* Employment type */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">Employment type</label>
            <div className="flex flex-wrap gap-2">
                <button type="button" className={`px-4 py-2 text-sm font-medium border rounded-md transition-colors ${formData.employmentType === 'part-time' ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`} onClick={() => handleOptionSelect('employmentType', 'part-time')}>Part-time</button>
                <button type="button" className={`px-4 py-2 text-sm font-medium border rounded-md transition-colors ${formData.employmentType === 'full-time' ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`} onClick={() => handleOptionSelect('employmentType', 'full-time')}>Full-time</button>
                <button type="button" className={`px-4 py-2 text-sm font-medium border rounded-md transition-colors ${formData.employmentType === 'contract' ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`} onClick={() => handleOptionSelect('employmentType', 'contract')}>Contract</button>
            </div>
          </div>

          {/* Minimum Salary Offered */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">Minimum Salary Offered</label>
            <div className="flex">
              <div className="relative w-28">
                <select 
                  id="currency" 
                  name="currency"
                  className="w-full h-full p-2.5 border border-r-0 border-gray-300 rounded-l-md appearance-none bg-white pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="INR">INR</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
              </div>
              <input
                type="number"
                name="minimumSalary"
                placeholder="e.g., 50000"
                className="flex-1 p-2.5 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.minimumSalary}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          {/* Tentative Date of Placement / Hiring */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">Tentative Date of Placement / Hiring</label>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="w-full sm:w-1/2">
                    <label className="block mb-1 text-sm font-medium text-gray-600">Start Date</label>
                    <div className="relative">
                        <DatePicker
                            selected={formData.startDate}
                            onChange={(date) => handleDateChange(date, 'startDate')}
                            selectsStart
                            startDate={formData.startDate}
                            endDate={formData.endDate}
                            placeholderText="Select start date"
                            className="w-full" // The custom style will be applied
                        />
                        <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                    </div>
                </div>
                <div className="w-full sm:w-1/2">
                    <label className="block mb-1 text-sm font-medium text-gray-600">End Date</label>
                    <div className="relative">
                        <DatePicker
                            selected={formData.endDate}
                            onChange={(date) => handleDateChange(date, 'endDate')}
                            selectsEnd
                            startDate={formData.startDate}
                            endDate={formData.endDate}
                            minDate={formData.startDate}
                            placeholderText="Select end date"
                            className="w-full" // The custom style will be applied
                        />
                        <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                    </div>
                </div>
            </div>
          </div>

          {/* Number of Rounds */}
          <div>
            <label htmlFor="rounds" className="block mb-2 font-medium text-gray-700">Number of Rounds</label>
            <div className="relative">
              <select 
                id="rounds" 
                name="rounds"
                className="w-full p-2.5 border border-gray-300 rounded-md appearance-none bg-white pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.rounds}
                onChange={handleInputChange}
              >
                <option value="" disabled>Select number of rounds</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5+">5+</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
            </div>
          </div>

          {/* Process of Selection */}
          <div>
            <label htmlFor="selectionProcess" className="block mb-2 font-medium text-gray-700">Process of Selection</label>
            <div className="relative">
              <select 
                id="selectionProcess" 
                name="selectionProcess"
                className="w-full p-2.5 border border-gray-300 rounded-md appearance-none bg-white pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.selectionProcess}
                onChange={handleInputChange}
              >
                <option value="" disabled>Select process</option>
                <option value="interview">Interview</option>
                <option value="technical-test">Technical Test</option>
                <option value="assignment">Assignment</option>
                <option value="group-discussion">Group Discussion</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
            </div>
          </div>

          {/* Contact Person */}
          <div>
            <label htmlFor="contactName" className="block mb-2 font-medium text-gray-700">Contact Person</label>
            <input type="text" id="contactName" name="contactName" placeholder="Name" className="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" value={formData.contactName} onChange={handleInputChange} />
          </div>
          
          {/* Contact person designation */}
          <div>
            <label htmlFor="contactDesignation" className="block mb-2 font-medium text-gray-700">Contact person designation <span className="text-red-500">*</span></label>
            <div className="relative">
              <input type="text" id="contactDesignation" name="contactDesignation" placeholder="e.g., HR Manager" className={`w-full p-2.5 border ${errors.contactDesignation ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 ${errors.contactDesignation ? 'focus:ring-red-500' : 'focus:ring-blue-500'}`} value={formData.contactDesignation} onChange={handleInputChange} />
            </div>
            {errors.contactDesignation && <p className="text-red-500 text-sm mt-1">{errors.contactDesignation}</p>}
          </div>

          {/* Contact person email */}
          <div>
            <label htmlFor="contactEmail" className="block mb-2 font-medium text-gray-700">Contact person email <span className="text-red-500">*</span></label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input type="email" id="contactEmail" name="contactEmail" placeholder="hello@xyz.com" className={`w-full p-2.5 pl-10 border ${errors.contactEmail ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 ${errors.contactEmail ? 'focus:ring-red-500' : 'focus:ring-blue-500'}`} value={formData.contactEmail} onChange={handleInputChange} />
            </div>
            {errors.contactEmail && <p className="text-red-500 text-sm mt-1">{errors.contactEmail}</p>}
          </div>

          {/* Contact person mobile no */}
          <div>
            <label htmlFor="contactMobile" className="block mb-2 font-medium text-gray-700">Contact person mobile no <span className="text-red-500">*</span></label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input type="tel" id="contactMobile" name="contactMobile" placeholder="1234567890" className={`w-full p-2.5 pl-10 border ${errors.contactMobile ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 ${errors.contactMobile ? 'focus:ring-red-500' : 'focus:ring-blue-500'}`} value={formData.contactMobile} onChange={handleInputChange} />
            </div>
            {errors.contactMobile && <p className="text-red-500 text-sm mt-1">{errors.contactMobile}</p>}
          </div>

          {/* Contact person LinkedIn Profile */}
          <div>
            <label htmlFor="contactLinkedIn" className="block mb-2 font-medium text-gray-700">Contact person LinkedIn Profile</label>
            <div className="relative">
              <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input type="url" id="contactLinkedIn" name="contactLinkedIn" placeholder="https://linkedin.com/in/..." className="w-full p-2.5 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" value={formData.contactLinkedIn} onChange={handleInputChange} />
            </div>
          </div>

          {/* Minimum Students to be Hired */}
          <div>
            <label htmlFor="minimumStudents" className="block mb-2 font-medium text-gray-700">Minimum Students to be Hired</label>
            <div className="relative">
              <select 
                id="minimumStudents" 
                name="minimumStudents"
                className="w-full p-2.5 border border-gray-300 rounded-md appearance-none bg-white pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.minimumStudents}
                onChange={handleInputChange}
              >
                <option value="" disabled>Select number of students</option>
                <option value="1-5">1-5</option>
                <option value="6-10">6-10</option>
                <option value="11-20">11-20</option>
                <option value="21+">21+</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-8 py-3 bg-gray-800 text-white font-semibold rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 transition-colors"
            >
              {isLoading ? 'Registering...' : 'Register'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
