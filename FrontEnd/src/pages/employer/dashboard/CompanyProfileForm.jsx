import React, { useState, useEffect } from 'react';
import axios from '../../../lib/axiosInstance';
import { Mail, Phone, Globe, Linkedin, Save, Edit, ChevronDown } from 'lucide-react';
import Select from 'react-select';

// Helper function to convert form data to JSON and FormData for files
const buildFormData = (data, files) => {
  const formData = new FormData();

  formData.append('employerDetails', JSON.stringify(data.employerDetails));
  formData.append('companyDetails', JSON.stringify(data.companyDetails));
  formData.append('hiringPreferences', JSON.stringify(data.hiringPreferences));

  // ONLY append files if they are actually selected in this form
  if (files.profileImage) {
    formData.append('profileImage', files.profileImage);
  }
  if (files.backgroundImage) {
    formData.append('backgroundImage', files.backgroundImage);
  }
  return formData;
};

// Country, State, City data (you can expand this list or fetch from an API)
const countryData = [
  {
    name: 'United States',
    states: [
      { name: 'California', cities: ['Los Angeles', 'San Francisco', 'San Diego'] },
      { name: 'New York', cities: ['New York City', 'Buffalo', 'Rochester'] },
      { name: 'Texas', cities: ['Houston', 'Dallas', 'Austin'] },
    ]
  },
  {
    name: 'India',
    states: [
      { name: 'Maharashtra', cities: ['Mumbai', 'Pune', 'Nagpur'] },
      { name: 'Delhi', cities: ['New Delhi', 'North Delhi', 'South Delhi'] },
      { name: 'Karnataka', cities: ['Bangalore', 'Mysore', 'Hubli'] },
    ]
  },
  {
    name: 'United Kingdom',
    states: [
      { name: 'England', cities: ['London', 'Manchester', 'Birmingham'] },
      { name: 'Scotland', cities: ['Edinburgh', 'Glasgow', 'Aberdeen'] },
      { name: 'Wales', cities: ['Cardiff', 'Swansea', 'Newport'] },
    ]
  },
  {
    name: 'Canada',
    states: [
      { name: 'Ontario', cities: ['Toronto', 'Ottawa', 'Mississauga'] },
      { name: 'British Columbia', cities: ['Vancouver', 'Victoria', 'Surrey'] },
      { name: 'Quebec', cities: ['Montreal', 'Quebec City', 'Laval'] },
    ]
  },
  {
    name: 'Australia',
    states: [
      { name: 'New South Wales', cities: ['Sydney', 'Newcastle', 'Wollongong'] },
      { name: 'Victoria', cities: ['Melbourne', 'Geelong', 'Ballarat'] },
      { name: 'Queensland', cities: ['Brisbane', 'Gold Coast', 'Cairns'] },
    ]
  }
];

// Helper function to get country options for react-select
const getCountryOptions = () => {
  return countryData.map(country => ({
    value: country.name,
    label: country.name
  }));
};

// Helper function to get state options for selected country
const getStateOptions = (countryName) => {
  const country = countryData.find(c => c.name === countryName);
  if (!country) return [];
  return country.states.map(state => ({
    value: state.name,
    label: state.name
  }));
};

// Helper function to get city options for selected state and country
const getCityOptions = (countryName, stateName) => {
  const country = countryData.find(c => c.name === countryName);
  if (!country) return [];
  const state = country.states.find(s => s.name === stateName);
  if (!state) return [];
  return state.cities.map(city => ({
    value: city,
    label: city
  }));
};

export default function EmployerProfileForm({ profileData, onProfileUpdated }) {
  const [formData, setFormData] = useState({
    employerDetails: {
      name: '',
      designation: '',
      workEmail: '',
      mobile: '',
      linkedIn: '',
    },
    companyDetails: {
      companyName: '',
      state: '',
      city: '',
      country: '',
      pincode: '',
      companyType: '',
      industryType: '',
      establishedYear: '',
      contactNumber: '',
      description: '',
      companyWebsite: '',
    },
    hiringPreferences: {
      jobRoles: [],
      hiringLocations: [],
      lookingFor: [],
      employmentType: [],
    },
    profileImageUrl: '', 
    backgroundImageUrl: '',
  });

  const [files, setFiles] = useState({
    profileImage: null,
    backgroundImage: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // State for dropdown options
  const [stateOptions, setStateOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);

  useEffect(() => {
    if (profileData) {
      setFormData({
        employerDetails: {
          name: profileData.employerDetails?.name || '',
          designation: profileData.employerDetails?.designation || '',
          workEmail: profileData.employerDetails?.workEmail || '',
          mobile: profileData.employerDetails?.mobile || '',
          linkedIn: profileData.employerDetails?.linkedIn || ''
        },

        companyDetails: {
          companyName: profileData.companyDetails?.companyName || '',
          state: profileData.companyDetails?.state || '',
          city: profileData.companyDetails?.city || '',
          country: profileData.companyDetails?.country || '',
          pincode: profileData.companyDetails?.pincode || '',
          companyType: profileData.companyDetails?.companyType || '',
          industryType: profileData.companyDetails?.industryType || '',
          establishedYear: profileData.companyDetails?.establishedYear || '',
          contactNumber: profileData.companyDetails?.contactNumber || '',
          description: profileData.companyDetails?.description || '',
          companyWebsite: profileData.companyDetails?.companyWebsite || ''
        },

        hiringPreferences: {
          jobRoles: profileData.hiringPreferences?.jobRoles || [],
          hiringLocations: profileData.hiringPreferences?.hiringLocations || [],
          lookingFor: Array.isArray(profileData.hiringPreferences?.lookingFor)
            ? profileData.hiringPreferences.lookingFor
            : profileData.hiringPreferences?.lookingFor
              ? [profileData.hiringPreferences.lookingFor]
              : [],
          employmentType: profileData.hiringPreferences?.employmentType || []
        }
      });

      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  }, [profileData]);

  // Update state dropdown when country changes
  useEffect(() => {
    if (formData.companyDetails.country) {
      const options = getStateOptions(formData.companyDetails.country);
      setStateOptions(options);
      
      // Reset state and city when country changes
      if (!options.find(opt => opt.value === formData.companyDetails.state)) {
        setFormData(prev => ({
          ...prev,
          companyDetails: {
            ...prev.companyDetails,
            state: '',
            city: ''
          }
        }));
        setCityOptions([]);
      }
    } else {
      setStateOptions([]);
      setCityOptions([]);
    }
  }, [formData.companyDetails.country]);

  // Update city dropdown when state changes
  useEffect(() => {
    if (formData.companyDetails.country && formData.companyDetails.state) {
      const options = getCityOptions(formData.companyDetails.country, formData.companyDetails.state);
      setCityOptions(options);
      
      // Reset city when state changes
      if (!options.find(opt => opt.value === formData.companyDetails.city)) {
        setFormData(prev => ({
          ...prev,
          companyDetails: {
            ...prev.companyDetails,
            city: ''
          }
        }));
      }
    } else {
      setCityOptions([]);
    }
  }, [formData.companyDetails.country, formData.companyDetails.state]);

  const handleEmployerDetailsChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      employerDetails: {
        ...prev.employerDetails,
        [name]: value,
      },
    }));
  };

  const handleCompanyDetailsChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      companyDetails: {
        ...prev.companyDetails,
        [name]: value,
      },
    }));
  };

  // Handle dropdown changes
  const handleCountryChange = (selectedOption) => {
    setFormData(prev => ({
      ...prev,
      companyDetails: {
        ...prev.companyDetails,
        country: selectedOption ? selectedOption.value : '',
        state: '',
        city: ''
      }
    }));
  };

  const handleStateChange = (selectedOption) => {
    setFormData(prev => ({
      ...prev,
      companyDetails: {
        ...prev.companyDetails,
        state: selectedOption ? selectedOption.value : '',
        city: ''
      }
    }));
  };

  const handleCityChange = (selectedOption) => {
    setFormData(prev => ({
      ...prev,
      companyDetails: {
        ...prev.companyDetails,
        city: selectedOption ? selectedOption.value : ''
      }
    }));
  };

  // Specific handler for Looking For to manage Array conversion
  const handleLookingForChange = (e) => {
    const value = e.target.value;
    let newArray = [];

    if (value === 'both') {
      newArray = ['job', 'internship'];
    } else if (value) {
      newArray = [value];
    }

    setFormData((prev) => ({
      ...prev,
      hiringPreferences: {
        ...prev.hiringPreferences,
        lookingFor: newArray,
      },
    }));
  };

  const handleHiringPreferencesChange = (e) => {
    const { name, value } = e.target;
    if (name === 'jobRoles' || name === 'hiringLocations' || name === 'employmentType') {
      setFormData((prev) => ({
        ...prev,
        hiringPreferences: {
          ...prev.hiringPreferences,
          [name]: value.split(',').map(item => item.trim()).filter(item => item !== ''),
        },
      }));
    } else if (name !== 'lookingFor') {
      setFormData((prev) => ({
        ...prev,
        hiringPreferences: {
          ...prev.hiringPreferences,
          [name]: value,
        },
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const dataToSend = buildFormData(formData, files);
      let response;
      if (profileData) {
        response = await axios.put(
          `${import.meta.env.VITE_Backend_URL}/api/dashboard/update-employer`,
          dataToSend,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
            withCredentials: true,
          }
        );
      } else {
        response = await axios.post(
          `${import.meta.env.VITE_Backend_URL}/api/dashboard/employerOnboarding`,
          dataToSend,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
            withCredentials: true,
          }
        );
      }

      setSuccess(true);
      setFiles({ profileImage: null, backgroundImage: null });
      setIsEditing(false);

      if (onProfileUpdated) {
        onProfileUpdated(response.data.profile);
      }
    } catch (err) {
      console.error('Error saving employer profile:', err);
      setError(err.response?.data?.message || 'Failed to save profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setSuccess(false);
    setError(null);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    if (profileData) {
      setFormData({
        employerDetails: profileData.employerDetails || {},
        companyDetails: profileData.companyDetails || {},
        hiringPreferences: profileData.hiringPreferences || {},
      });
    } else {
      setFormData({
        employerDetails: { name: '', designation: '', workEmail: '', mobile: '', linkedIn: '' },
        companyDetails: { companyName: '', state: '', city: '', country: '', pincode: '', companyType: '', industryType: '', establishedYear: '', contactNumber: '', description: '', companyWebsite: '' },
        hiringPreferences: { jobRoles: [], hiringLocations: [], lookingFor: [], employmentType: [] },
      });
    }
    setFiles({ profileImage: null, backgroundImage: null });
    setError(null);
    setSuccess(false);
  };

  // Helper to determine the string value for the Looking For Select dropdown
  const getLookingForValue = () => {
    const arr = formData.hiringPreferences.lookingFor || [];
    if (arr.includes('job') && arr.includes('internship')) return 'both';
    if (arr.includes('job')) return 'job';
    if (arr.includes('internship')) return 'internship';
    return '';
  };

  const inputClass = `mt-1 block w-full border border-gray-200 p-2.5 rounded-xl focus:ring-2 focus:ring-[#143694]/50 focus:border-transparent focus:outline-none transition-all duration-200 ${
    isEditing ? 'bg-white' : 'bg-gradient-to-r from-gray-50 to-white text-gray-700'
  }`;
  const selectClass = `mt-1 block w-full border border-gray-200 p-2.5 rounded-xl focus:ring-2 focus:ring-[#143694]/50 focus:border-transparent focus:outline-none transition-all duration-200 ${
    isEditing ? 'bg-white' : 'bg-gradient-to-r from-gray-50 to-white text-gray-700'
  }`;

  // Custom styles for react-select
  const customSelectStyles = {
    control: (base, state) => ({
      ...base,
      borderRadius: '0.75rem',
      borderWidth: '1px',
      borderColor: state.isFocused ? '#143694' : '#e5e7eb',
      padding: '2px 4px',
      boxShadow: state.isFocused ? '0 0 0 2px rgba(102, 126, 234, 0.5)' : 'none',
      backgroundColor: isEditing ? 'white' : 'linear-gradient(to right, #f9fafb, white)',
      '&:hover': {
        borderColor: '#143694'
      }
    }),
    menu: (base) => ({
      ...base,
      borderRadius: '0.75rem',
      marginTop: '4px'
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? '#143694' : state.isFocused ? '#f3f4f6' : 'white',
      color: state.isSelected ? 'white' : '#374151',
      '&:hover': {
        backgroundColor: '#f3f4f6'
      }
    })
  };

  return (
    <div className="flex flex-col w-full bg-gradient-to-br from-[#143694]/10 via-[#f093fb]/5 to-[#1e4ed8]/10 min-h-screen">
      <div className="container mx-auto py-6 px-4">
        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-2xl shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-green-800 font-medium">Profile saved successfully!</p>
                <p className="text-green-600 text-sm">Your changes have been saved.</p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-2xl shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-red-800 font-medium">Error</p>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg overflow-hidden">
          <div className="p-8">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-[#143694] to-[#1e4ed8] bg-clip-text text-transparent mb-6">
              {profileData ? 'Edit Employer Profile' : 'Create Employer Profile'}
            </h2>

            <form onSubmit={handleSubmit}>
              {/* Employer Details */}
              <div className="mb-8">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-gradient-to-br from-[#143694]/20 to-[#1e4ed8]/20 rounded-xl mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#143694" className="w-5 h-5">
                      <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Your Details</h3>
                    <p className="text-sm text-gray-600">Your personal information and contact details.</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block mb-1 text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.employerDetails.name || ''}
                      onChange={handleEmployerDetailsChange}
                      className={inputClass}
                      required
                      readOnly={!isEditing}
                    />
                  </div>
                  <div>
                    <label htmlFor="designation" className="block mb-1 text-sm font-medium text-gray-700">Designation</label>
                    <input
                      type="text"
                      id="designation"
                      name="designation"
                      value={formData.employerDetails.designation || ''}
                      onChange={handleEmployerDetailsChange}
                      className={inputClass}
                      required
                      readOnly={!isEditing}
                    />
                  </div>
                  <div>
                    <label htmlFor="workEmail" className="block mb-1 text-sm font-medium text-gray-700">Work Email</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Mail size={16} className="text-gray-500" />
                      </div>
                      <input
                        type="email"
                        id="workEmail"
                        name="workEmail"
                        value={formData.employerDetails.workEmail || ''}
                        onChange={handleEmployerDetailsChange}
                        className={`${inputClass} pl-10`}
                        required
                        readOnly={!isEditing}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="mobile" className="block mb-1 text-sm font-medium text-gray-700">Mobile</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Phone size={16} className="text-gray-500" />
                      </div>
                      <input
                        type="text"
                        id="mobile"
                        name="mobile"
                        value={formData.employerDetails.mobile || ''}
                        onChange={handleEmployerDetailsChange}
                        className={`${inputClass} pl-10`}
                        required
                        readOnly={!isEditing}
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="linkedIn" className="block mb-1 text-sm font-medium text-gray-700">LinkedIn Profile URL</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Linkedin size={16} className="text-[#143694]" />
                      </div>
                      <input
                        type="url"
                        id="linkedIn"
                        name="linkedIn"
                        value={formData.employerDetails.linkedIn || ''}
                        onChange={handleEmployerDetailsChange}
                        className={`${inputClass} pl-10`}
                        readOnly={!isEditing}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Company Details */}
              <div className="mb-8">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-xl mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#f59e0b" className="w-5 h-5">
                      <path fillRule="evenodd" d="M4.5 2.25a.75.75 0 000 1.5v16.5h-.75a.75.75 0 000 1.5h16.5a.75.75 0 000-1.5h-.75V3.75a.75.75 0 000-1.5h-15zM9 6a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5H9zm-.75 3.75A.75.75 0 019 9h1.5a.75.75 0 010 1.5H9a.75.75 0 01-.75-.75zM9 12a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5H9zm3.75-5.25A.75.75 0 0113.5 6H15a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zM13.5 9a.75.75 0 000 1.5H15A.75.75 0 0015 9h-1.5zm-.75 3.75a.75.75 0 01.75-.75H15a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zM9 19.5v-2.25a.75.75 0 01.75-.75h4.5a.75.75 0 01.75.75v2.25a.75.75 0 01-.75.75h-4.5A.75.75 0 019 19.5z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Company Details</h3>
                    <p className="text-sm text-gray-600">Your company's basic information and contact details.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="companyName" className="block mb-1 text-sm font-medium text-gray-700">Company Name</label>
                    <input
                      type="text"
                      id="companyName"
                      name="companyName"
                      value={formData.companyDetails.companyName || ''}
                      onChange={handleCompanyDetailsChange}
                      className={inputClass}
                      readOnly={!isEditing}
                    />
                  </div>
                  
                  {/* Country Dropdown */}
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Country</label>
                    <Select
                      options={getCountryOptions()}
                      value={formData.companyDetails.country ? { 
                        value: formData.companyDetails.country, 
                        label: formData.companyDetails.country 
                      } : null}
                      onChange={handleCountryChange}
                      placeholder="Select Country"
                      isDisabled={!isEditing}
                      styles={customSelectStyles}
                      className="react-select-container"
                      classNamePrefix="react-select"
                    />
                  </div>
                  
                  {/* State Dropdown */}
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">State</label>
                    <Select
                      options={stateOptions}
                      value={formData.companyDetails.state ? { 
                        value: formData.companyDetails.state, 
                        label: formData.companyDetails.state 
                      } : null}
                      onChange={handleStateChange}
                      placeholder="Select State"
                      isDisabled={!isEditing || !formData.companyDetails.country}
                      styles={customSelectStyles}
                      className="react-select-container"
                      classNamePrefix="react-select"
                    />
                  </div>
                  
                  {/* City Dropdown */}
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">City</label>
                    <Select
                      options={cityOptions}
                      value={formData.companyDetails.city ? { 
                        value: formData.companyDetails.city, 
                        label: formData.companyDetails.city 
                      } : null}
                      onChange={handleCityChange}
                      placeholder="Select City"
                      isDisabled={!isEditing || !formData.companyDetails.state}
                      styles={customSelectStyles}
                      className="react-select-container"
                      classNamePrefix="react-select"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="pincode" className="block mb-1 text-sm font-medium text-gray-700">Pincode</label>
                    <input
                      type="text"
                      id="pincode"
                      name="pincode"
                      value={formData.companyDetails.pincode || ''}
                      onChange={handleCompanyDetailsChange}
                      className={inputClass}
                      readOnly={!isEditing}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="companyType" className="block mb-1 text-sm font-medium text-gray-700">Company Type</label>
                    <input
                      type="text"
                      id="companyType"
                      name="companyType"
                      value={formData.companyDetails.companyType || ''}
                      onChange={handleCompanyDetailsChange}
                      className={inputClass}
                      readOnly={!isEditing}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="industryType" className="block mb-1 text-sm font-medium text-gray-700">Industry Type</label>
                    <input
                      type="text"
                      id="industryType"
                      name="industryType"
                      value={formData.companyDetails.industryType || ''}
                      onChange={handleCompanyDetailsChange}
                      className={inputClass}
                      readOnly={!isEditing}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="establishedYear" className="block mb-1 text-sm font-medium text-gray-700">Established Year</label>
                    <input
                      type="text"
                      id="establishedYear"
                      name="establishedYear"
                      value={formData.companyDetails.establishedYear || ''}
                      onChange={handleCompanyDetailsChange}
                      className={inputClass}
                      readOnly={!isEditing}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="contactNumber" className="block mb-1 text-sm font-medium text-gray-700">Contact Number</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Phone size={16} className="text-gray-500" />
                      </div>
                      <input
                        type="text"
                        id="contactNumber"
                        name="contactNumber"
                        value={formData.companyDetails.contactNumber || ''}
                        onChange={handleCompanyDetailsChange}
                        className={`${inputClass} pl-10`}
                        readOnly={!isEditing}
                      />
                    </div>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="companyWebsite" className="block mb-1 text-sm font-medium text-gray-700">Company Website URL</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Globe size={16} className="text-gray-700" />
                      </div>
                      <input
                        type="url"
                        id="companyWebsite"
                        name="companyWebsite"
                        value={formData.companyDetails.companyWebsite || ''}
                        onChange={handleCompanyDetailsChange}
                        className={`${inputClass} pl-10`}
                        readOnly={!isEditing}
                      />
                    </div>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="description" className="block mb-1 text-sm font-medium text-gray-700">Company Description</label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.companyDetails.description || ''}
                      onChange={handleCompanyDetailsChange}
                      rows="4"
                      className={`${inputClass} resize-none`}
                      readOnly={!isEditing}
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Hiring Preferences */}
              <div className="mb-8">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#10b981" className="w-5 h-5">
                      <path fillRule="evenodd" d="M7.5 5.25a3 3 0 013-3h3a3 0 013 3v.205c.933.085 1.857.197 2.774.334 1.454.218 2.476 1.483 2.476 2.917v3.033c0 1.211-.734 2.352-1.936 2.752A24.726 24.726 0 0112 15.75c-2.73 0-5.357-.442-7.814-1.259-1.202-.4-1.936-1.541-1.936-2.752V8.706c0-1.434 1.022-2.7 2.476-2.917A48.814 48.814 0 017.5 5.455V5.25zm7.5 0v.09a49.488 49.488 0 00-6 0v-.09a1.5 1.5 0 011.5-1.5h3a1.5 1.5 0 011.5 1.5zm-3 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                      <path d="M3 18.4v-2.796a4.3 4.3 0 00.713.31A26.226 26.226 0 0012 17.25c2.892 0 5.68-.468 8.287-1.335.252-.084.49-.189.713-.311V18.4c0 1.452-1.047 2.728-2.523 2.923-2.12.282-4.282.427-6.477.427a49.19 49.19 0 01-6.477-.427C4.047 21.128 3 19.852 3 18.4z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Hiring Preferences</h3>
                    <p className="text-sm text-gray-600">Define your hiring needs and preferred candidate criteria.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="jobRoles" className="block mb-1 text-sm font-medium text-gray-700">Job Roles (comma-separated)</label>
                    <input
                      type="text"
                      id="jobRoles"
                      name="jobRoles"
                      value={formData.hiringPreferences.jobRoles.join(', ') || ''}
                      onChange={handleHiringPreferencesChange}
                      className={inputClass}
                      readOnly={!isEditing}
                    />
                  </div>
                  <div>
                    <label htmlFor="hiringLocations" className="block mb-1 text-sm font-medium text-gray-700">Hiring Locations (comma-separated)</label>
                    <input
                      type="text"
                      id="hiringLocations"
                      name="hiringLocations"
                      value={formData.hiringPreferences.hiringLocations.join(', ') || ''}
                      onChange={handleHiringPreferencesChange}
                      className={inputClass}
                      readOnly={!isEditing}
                    />
                  </div>
                  <div>
                    <label htmlFor="lookingFor" className="block mb-1 text-sm font-medium text-gray-700">Looking for</label>
                    <div className="relative">
                      <select
                        id="lookingFor"
                        name="lookingFor"
                        value={getLookingForValue()}
                        onChange={handleLookingForChange}
                        className={`${selectClass} pr-10 appearance-none`}
                        disabled={!isEditing}
                      >
                        <option value="">Select</option>
                        <option value="job">Job</option>
                        <option value="internship">Internship</option>
                        <option value="both">Both</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                        <ChevronDown size={16} className="text-gray-400" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="employmentType" className="block mb-1 text-sm font-medium text-gray-700">Employment Types (comma-separated)</label>
                    <input
                      type="text"
                      id="employmentType"
                      name="employmentType"
                      value={formData.hiringPreferences.employmentType.join(', ') || ''}
                      onChange={handleHiringPreferencesChange}
                      className={inputClass}
                      readOnly={!isEditing}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
                {isEditing ? (
                  <>
                    <button
                      type="button"
                      onClick={handleCancelClick}
                      className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300"
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white rounded-xl hover:shadow-lg hover:shadow-[#143694]/30 transition-all duration-300 flex items-center gap-2"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save size={18} />
                          {profileData ? 'Save Changes' : 'Create Profile'}
                        </>
                      )}
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={handleEditClick}
                    className="px-6 py-2.5 bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white rounded-xl hover:shadow-lg hover:shadow-[#143694]/30 transition-all duration-300 flex items-center gap-2"
                  >
                    <Edit size={18} />
                    Edit Profile
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}