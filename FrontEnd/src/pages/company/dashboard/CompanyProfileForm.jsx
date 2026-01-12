import { useState, useEffect, useRef } from 'react';
import { Mail, Phone, Upload, Globe, Linkedin, X, Save, Edit } from 'lucide-react';
import axios from 'axios';
import { Country, State, City } from 'country-state-city';

export default function CompanyProfileForm({ profileData, onProfileUpdate }) {
  const [formData, setFormData] = useState({
    companyDetails: {
      companyName: '',
      description: '',
      companyType: '',
      industryType: '',
      numberOfEmployees: '',
      establishedYear: '',
      companyLinkedin: '',
      websiteUrl: '',
      phoneNumber: '',
      alternatePhoneNumber: '',
      companyLocation: '',
      state: '',
      city: '',
      country: '',
      pincode: '',
      collegeWebsite: '',
      linkedinUrl: ''
    },
    hiringPreferences: {
      hiringPara: '',
      jobRoles: [],
      hiringLocations: [],
      lookingFor: [],
      employmentType: []
    },
    kycDetails: {
      kycDocuments: [],
      TAN: '',
      GSTNumber: '',
      companyRegistrationNumber: '',
      kycStatus: '',
      photoVerificationStatus: '',
      addressLabel: '',
      address: '',
      country: '',
      state: '',
      city: '',
      pincode: '',
      GSTIN: ''
    }
  });

  const [isEditing, setIsEditing] = useState(false);
  const [kycFiles, setKycFiles] = useState([]);
  const [customJobRole, setCustomJobRole] = useState('');
  const [customHiringLocation, setCustomHiringLocation] = useState('');

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const kycFileInputRef = useRef(null);

  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

  useEffect(() => {
    const selectedCountry = countries.find(c => c.name === formData.companyDetails.country);
    setStates(selectedCountry ? State.getStatesOfCountry(selectedCountry.isoCode) : []);
    setCities([]);
  }, [formData.companyDetails.country, countries]);
  
  useEffect(() => {
    const selectedCountry = countries.find(c => c.name === formData.companyDetails.country);
    const selectedState = states.find(s => s.name === formData.companyDetails.state);
    setCities(selectedCountry && selectedState ? City.getCitiesOfState(selectedCountry.isoCode, selectedState.isoCode) : []);
  }, [formData.companyDetails.state, formData.companyDetails.country, states]);

  useEffect(() => {
    if (profileData) {
      setFormData({
        companyDetails: profileData.companyDetails || {},
        hiringPreferences: profileData.hiringPreferences || {},
        kycDetails: {
          ...profileData.kycDetails || {},
          kycDocuments: profileData.kycDetails?.kycDocuments || []
        }
      });
    }
  }, [profileData]);

  const handleChange = (e, section, field) => {
    const { value, type, checked } = e.target;

    if (field === 'lookingFor') {
      let newValue = [];
      if (value === 'both') {
        newValue = ['job', 'internship'];
      } else {
        newValue = [value];
      }
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: newValue
        }
      }));
      return;
    }

    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: checked
            ? [...(prev[section][field] || []), value]
            : (prev[section][field] || []).filter(item => item !== value)
        }
      }));
    } else if (type === 'select-multiple') {
      const selectedOptions = Array.from(e.target.options)
        .filter(option => option.selected)
        .map(option => option.value);
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: selectedOptions
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    }
  };

  const handleKycFileChange = (e) => {
    setKycFiles(Array.from(e.target.files));
  };

  const handleRemoveKycFile = (indexToRemove) => {
    setKycFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  };
  
  const handleAddCustomItem = (section, field, customValue, setCustomValue) => {
    if (customValue.trim() !== '') {
        setFormData(prev => {
            const currentItems = prev[section][field] || [];
            if (!currentItems.includes(customValue.trim())) {
                return {
                    ...prev,
                    [section]: {
                        ...prev[section],
                        [field]: [...currentItems, customValue.trim()]
                    }
                };
            }
            return prev;
        });
        setCustomValue('');
    }
  };

  const handleEditToggle = () => {
    setIsEditing(prev => !prev);
  };
  
  const backendUrl = import.meta.env.VITE_Backend_URL || 'http://localhost:5000';

  const handleSubmit = async () => {
    try {
      const dataToSubmit = new FormData();
       if (Object.keys(formData.companyDetails).length > 0) {
            dataToSubmit.append('companyDetails', JSON.stringify(formData.companyDetails));
        }
        
        if (Object.keys(formData.hiringPreferences).length > 0) {
            dataToSubmit.append('hiringPreferences', JSON.stringify(formData.hiringPreferences));
        }

      kycFiles.forEach(file => {
        dataToSubmit.append('kycDocuments', file);
      });

      const kycDetailsWithoutDocs = { ...formData.kycDetails };
      delete kycDetailsWithoutDocs.kycDocuments;
      if (Object.keys(kycDetailsWithoutDocs).length > 0) {
            dataToSubmit.append('kycDetails', JSON.stringify(kycDetailsWithoutDocs));
        }

       
      const response = await axios.put(`${backendUrl}/api/companyDashboard/updateInformation`, dataToSubmit, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },timeout: 30000

      });
      
      alert('Company profile updated successfully!');
      onProfileUpdate();
      setIsEditing(false);
      setKycFiles([]);
    } catch (error) {
      console.error('Error updating company profile:', error);
      alert('Failed to update company profile. Please try again.');
    }
  };

  const renderDisplayField = (label, value) => (
    <div>
      <label className="block mb-1 text-sm font-medium text-gray-700">{label}</label>
      <div className="w-full border border-gray-200 p-2.5 rounded-xl bg-gradient-to-r from-gray-50 to-white text-gray-700 min-h-[42px] flex items-center">
        {value || <span className="text-gray-400">Not provided</span>}
      </div>
    </div>
  );

  const getDisplayValue = (value, options) => {
    if (!options || options.length === 0) return value;
    const option = options.find(opt => opt.value === value);
    return option ? option.label : value;
  };

  const getLookingForDisplayValue = (lookingForArray) => {
    if (!lookingForArray || lookingForArray.length === 0) return 'Not provided';
    if (lookingForArray.includes('job') && lookingForArray.includes('internship')) return 'Both';
    if (lookingForArray.includes('job')) return 'Job';
    if (lookingForArray.includes('internship')) return 'Internship';
    return 'Not provided';
  };

  const renderInputField = (section, field, label, type = 'text', placeholder = '', options = [], isRequired = false) => {
    const value = formData[section]?.[field] || '';
    const inputProps = {
      className: "w-full border bg-white border-gray-200 p-2.5 rounded-xl focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none transition-all duration-200",
      value: value,
      onChange: (e) => handleChange(e, section, field),
      readOnly: !isEditing,
      disabled: !isEditing
    };

    if (type === 'textarea') {
      return (
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700"> {label} {isRequired && <span className="text-red-500">*</span>} </label>
          <textarea {...inputProps} rows="4" placeholder={placeholder}></textarea>
        </div>
      );
    } else if (type === 'select') {
      return (
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700"> {label} {isRequired && <span className="text-red-500">*</span>} </label>
          <div className="relative">
            <select {...inputProps} className={`${inputProps.className} pr-10 appearance-none`}>
              <option value="">{placeholder}</option>
              {options.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-gray-400">
                <path fillRule="evenodd" d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      );
    } else if (type === 'custom-multiselect') {
        const selectedValues = formData[section]?.[field] || [];
        return (
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">{label}</label>
            <div className="relative border border-gray-200 rounded-xl p-2.5 flex flex-wrap gap-2 items-center min-h-[42px] bg-gradient-to-r from-gray-50 to-white">
              {selectedValues.length > 0 ? (
                selectedValues.map((val) => {
                  const optionLabel = options.find(opt => opt.value === val)?.label || val;
                  return (
                    <span key={val} className="flex items-center bg-gradient-to-r from-[#667eea]/10 to-[#764ba2]/10 text-[#667eea] px-3 py-1 rounded-full text-sm font-medium">
                      {optionLabel}
                      {isEditing && (
                        <button type="button" onClick={() => handleChange({ target: { value: val, type: 'checkbox', checked: false } }, section, field)} className="ml-2 text-gray-600 hover:text-gray-800">
                          <X size={14} />
                        </button>
                      )}
                    </span>
                  );
                })
              ) : (<span className="text-gray-400">{placeholder}</span>)}
              <select multiple className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" value={selectedValues} onChange={(e) => handleChange(e, section, field)} disabled={!isEditing}>
                {options.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
              </select>
            </div>
          </div>
        );
      } else if (type === 'radio-group') {
      let activeValue = value;
      if (field === 'lookingFor' && Array.isArray(value)) {
        if (value.includes('job') && value.includes('internship')) activeValue = 'both';
        else if (value.includes('job')) activeValue = 'job';
        else if (value.includes('internship')) activeValue = 'internship';
      }

      return (
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">{label}</label>
          <div className="flex gap-2">
            {options.map((opt) => (
              <button key={opt.value} type="button" className={`px-4 py-2 text-sm rounded-xl transition-all duration-200 ${activeValue === opt.value ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} ${!isEditing ? 'opacity-60 cursor-not-allowed' : ''}`} onClick={() => isEditing && handleChange({ target: { value: opt.value } }, section, field)} disabled={!isEditing}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      );
    } else if (type === 'checkbox-group') {
      const currentValues = Array.isArray(value) ? value : [];
      return (
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">{label}</label>
          <div className="flex flex-wrap gap-2">
            {options.map((opt) => (
              <label key={opt.value} className={`flex items-center px-4 py-2 text-sm rounded-xl cursor-pointer transition-all duration-200 ${currentValues.includes(opt.value) ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} ${!isEditing ? 'opacity-60 cursor-not-allowed' : ''}`}>
                <input type="checkbox" value={opt.value} checked={currentValues.includes(opt.value)} onChange={(e) => handleChange(e, section, field)} className="hidden" disabled={!isEditing} />
                {opt.label}
              </label>
            ))}
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700"> {label} {isRequired && <span className="text-red-500">*</span>} </label>
          <div className="relative">
            {(label.includes('Number') || label.includes('Phone')) && (<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"><Phone size={16} className="text-gray-500" /></div>)}
            {label.includes('LinkedIn') && (<div className="absolute inset-y-0 left-0 flex items-center pl-3"><Linkedin size={16} className="text-blue-700" /></div>)}
            {label.includes('Website') && (<div className="absolute inset-y-0 left-0 flex items-center pl-3"><Globe size={16} className="text-gray-700" /></div>)}
            <input type={type} {...inputProps} placeholder={placeholder} className={`${inputProps.className} ${label.includes('Number') || label.includes('Phone') || label.includes('LinkedIn') || label.includes('Website') ? 'pl-10' : ''}`} />
          </div>
        </div>
      );
    }
  };

  const formatLocationOptions = (data) => {
      if (!data) return [];
      return data.map(item => ({ value: item.name, label: item.name }));
  };

  const countryOptions = formatLocationOptions(countries);
  const stateOptions = formatLocationOptions(states);
  const cityOptions = formatLocationOptions(cities);

  const companyTypeOptions = [ { value: 'TCS', label: 'TCS' }, { value: 'Google', label: 'Google' }, { value: 'Microsoft', label: 'Microsoft' }];
  const industryTypeOptions = [ { value: 'it', label: 'IT' }, { value: 'finance', label: 'Finance' }, { value: 'healthcare', label: 'Healthcare' }];
  const employeeCountOptions = [ { value: '1-10', label: '1-10' }, { value: '11-50', label: '11-50' }, { value: '51-200', label: '51-200' }, { value: '201-500', label: '201-500' }, { value: '500+', label: '500+' }];
  const establishedYearOptions = Array.from({ length: 70 }, (_, i) => ({ value: String(new Date().getFullYear() - i), label: String(new Date().getFullYear() - i) }));
  const staticLocationOptions = [ { value: 'delhi', label: 'Delhi' }, { value: 'mumbai', label: 'Mumbai' }, { value: 'bangalore', label: 'Bangalore' }];
  const jobRoleOptions = [ { value: 'software_engineer', label: 'Software Engineer' }, { value: 'data_scientist', label: 'Data Scientist' }, { value: 'product_manager', label: 'Product Manager' }, { value: 'hr_manager', label: 'HR Manager' }, { value: 'marketing_specialist', label: 'Marketing Specialist' }];
  const lookingForOptions = [ { value: 'job', label: 'Job' }, { value: 'internship', label: 'Internship' }, { value: 'both', label: 'Both (Job+Internship)' }];
  const employmentTypeOptions = [ { value: 'part-time', label: 'Part-time' }, { value: 'full-time', label: 'Full-time' }, { value: 'contract', label: 'Contract' }];

  return (
    <div className="flex flex-col w-full bg-gradient-to-br from-[#667eea]/10 via-[#f093fb]/5 to-[#764ba2]/10 min-h-screen">
      <div className="container mx-auto py-6 px-4">
        <div className="mb-6 bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-2">About</h2>
          <p className="text-gray-600 mb-6 break-words p-4 bg-gradient-to-r from-[#667eea]/5 to-transparent rounded-xl"> 
            {formData.companyDetails.description || 'No description provided.'} 
          </p>
        </div>

        <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg overflow-hidden">
          {/* Company Details Section */}
          <div className="border-b border-gray-100">
            <div className="grid md:grid-cols-12 gap-4 p-6">
              <div className="md:col-span-3">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-gradient-to-br from-[#667eea]/20 to-[#764ba2]/20 rounded-xl mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#667eea" className="w-5 h-5">
                      <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Company Details</h3>
                    <p className="text-sm text-gray-600">Manage your company's basic information and contact details.</p>
                  </div>
                </div>
              </div>

              <div className="md:col-span-9">
                <div className="space-y-4">
                  {isEditing ? renderInputField('companyDetails', 'companyName', 'Company Name', 'select', 'Select Company', companyTypeOptions, true) : renderDisplayField('Company Name', getDisplayValue(formData.companyDetails.companyName, companyTypeOptions))}
                  {isEditing ? renderInputField('companyDetails', 'description', 'Description', 'textarea', 'Tell us about your company...', true) : renderDisplayField('Description', formData.companyDetails.description)}
                  {isEditing ? renderInputField('companyDetails', 'companyType', 'Company Type', 'select', 'Select Type', companyTypeOptions, true) : renderDisplayField('Company Type', getDisplayValue(formData.companyDetails.companyType, companyTypeOptions))}
                  {isEditing ? renderInputField('companyDetails', 'industryType', 'Industry Type', 'select', 'Select Industry', industryTypeOptions, true) : renderDisplayField('Industry Type', getDisplayValue(formData.companyDetails.industryType, industryTypeOptions))}
                  {isEditing ? renderInputField('companyDetails', 'numberOfEmployees', 'Number of Employees', 'select', 'Select Range', employeeCountOptions, true) : renderDisplayField('Number of Employees', getDisplayValue(formData.companyDetails.numberOfEmployees, employeeCountOptions))}
                  {isEditing ? renderInputField('companyDetails', 'establishedYear', 'Established Year', 'select', 'Select Year', establishedYearOptions, true) : renderDisplayField('Established Year', getDisplayValue(formData.companyDetails.establishedYear, establishedYearOptions))}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {isEditing ? renderInputField('companyDetails', 'phoneNumber', 'Contact Number', 'tel', '1234567890', [], true) : renderDisplayField('Contact Number', formData.companyDetails.phoneNumber)}
                    {isEditing ? renderInputField('companyDetails', 'alternatePhoneNumber', 'Alternate Number', 'tel', '1234567890', [], true) : renderDisplayField('Alternate Number', formData.companyDetails.alternatePhoneNumber)}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {isEditing ? (
                      <div>
                          <label className="block mb-1 text-sm font-medium text-gray-700">Country</label>
                          <select className="w-full border border-gray-200 p-2.5 rounded-xl focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none" value={formData.companyDetails.country} onChange={(e) => {
                           handleChange(e, 'companyDetails', 'country');
                           handleChange({ target: { value: '' } }, 'companyDetails', 'state');
                           handleChange({ target: { value: '' } }, 'companyDetails', 'city');
                          }}>
                            <option value="">Select Country</option>
                            {countryOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                          </select>
                      </div>
                    ) : renderDisplayField('Country', formData.companyDetails.country)}

                    {isEditing ? (
                      <div>
                          <label className="block mb-1 text-sm font-medium text-gray-700">State</label>
                          <select className="w-full border border-gray-200 p-2.5 rounded-xl focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none disabled:opacity-50" value={formData.companyDetails.state} disabled={!formData.companyDetails.country || states.length === 0} onChange={(e) => {
                           handleChange(e, 'companyDetails', 'state');
                           handleChange({ target: { value: '' } }, 'companyDetails', 'city');
                          }}>
                            <option value="">Select State</option>
                            {stateOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                          </select>
                      </div>
                    ) : renderDisplayField('State', formData.companyDetails.state)}
                    
                    {isEditing ? (
                      <div>
                          <label className="block mb-1 text-sm font-medium text-gray-700">City</label>
                          <select className="w-full border border-gray-200 p-2.5 rounded-xl focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none disabled:opacity-50" value={formData.companyDetails.city} disabled={!formData.companyDetails.state || cities.length === 0} onChange={(e) => handleChange(e, 'companyDetails', 'city')}>
                            <option value="">Select City</option>
                            {cityOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                          </select>
                      </div>
                    ) : renderDisplayField('City', formData.companyDetails.city)}
                    
                    {isEditing ? renderInputField('companyDetails', 'pincode', 'Pincode', 'text', 'Pincode') : renderDisplayField('Pincode', formData.companyDetails.pincode)}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end p-4 border-t border-gray-100">
              <button 
                className="px-6 py-2.5 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-xl hover:shadow-lg hover:shadow-[#667eea]/30 transition-all duration-300 flex items-center gap-2"
                onClick={isEditing ? handleSubmit : handleEditToggle}
              >
                {isEditing ? (
                  <>
                    <Save size={18} />
                    Save Changes
                  </>
                ) : (
                  <>
                    <Edit size={18} />
                    Edit
                  </>
                )}
              </button>
            </div>
          </div>
          
          {/* Hiring Preferences Section */}
          <div className="border-b border-gray-100">
            <div className="grid md:grid-cols-12 gap-4 p-6">
              <div className="md:col-span-3">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-xl mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#f59e0b" className="w-5 h-5">
                      <path fillRule="evenodd" d="M7.5 5.25a3 3 0 013-3h3a3 3 0 013 3v.205c.933.085 1.857.197 2.774.334 1.454.218 2.476 1.483 2.476 2.917v3.033c0 1.211-.734 2.352-1.936 2.752A24.726 24.726 0 0112 15.75c-2.73 0-5.357-.442-7.814-1.259-1.202-.4-1.936-1.541-1.936-2.752V8.706c0-1.434 1.022-2.7 2.476-2.917A48.814 48.814 0 017.5 5.455V5.25zm7.5 0v.09a49.488 49.488 0 00-6 0v-.09a1.5 1.5 0 011.5-1.5h3a1.5 1.5 0 011.5 1.5zm-3 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                      <path d="M3 18.4v-2.796a4.3 4.3 0 00.713.31A26.226 26.226 0 0012 17.25c2.892 0 5.68-.468 8.287-1.335.252-.084.49-.189.713-.311V18.4c0 1.452-1.047 2.728-2.523 2.923-2.12.282-4.282.427-6.477.427a49.19 49.19 0 01-6.477-.427C4.047 21.128 3 19.852 3 18.4z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Hiring Preferences</h3>
                    <p className="text-sm text-gray-600">Define your hiring needs and preferred candidate criteria.</p>
                  </div>
                </div>
              </div>
              <div className="md:col-span-9">
                <div className="space-y-4">
                  <div>
                    {renderInputField('hiringPreferences', 'jobRoles', 'Job Roles You Hire For', 'custom-multiselect', 'Select roles...', jobRoleOptions)}
                    {isEditing && (
                      <div className="flex items-center gap-2 mt-2">
                        <input type="text" placeholder="Add other job role..." value={customJobRole} onChange={(e) => setCustomJobRole(e.target.value)} className="w-full border border-gray-200 p-2.5 rounded-xl focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none" onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCustomItem('hiringPreferences', 'jobRoles', customJobRole, setCustomJobRole); } }}/>
                        <button type="button" onClick={() => handleAddCustomItem('hiringPreferences', 'jobRoles', customJobRole, setCustomJobRole)} className="px-4 py-2.5 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-xl hover:shadow-md whitespace-nowrap">Add</button>
                      </div>
                    )}
                  </div>
                  <div>
                    {renderInputField('hiringPreferences', 'hiringLocations', 'Preferred Hiring Locations', 'custom-multiselect', 'Select locations...', staticLocationOptions)}
                    {isEditing && (
                      <div className="flex items-center gap-2 mt-2">
                        <input type="text" placeholder="Add other location..." value={customHiringLocation} onChange={(e) => setCustomHiringLocation(e.target.value)} className="w-full border border-gray-200 p-2.5 rounded-xl focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none" onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCustomItem('hiringPreferences', 'hiringLocations', customHiringLocation, setCustomHiringLocation); } }}/>
                        <button type="button" onClick={() => handleAddCustomItem('hiringPreferences', 'hiringLocations', customHiringLocation, setCustomHiringLocation)} className="px-4 py-2.5 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-xl hover:shadow-md whitespace-nowrap">Add</button>
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {isEditing ? renderInputField('hiringPreferences', 'lookingFor', 'Looking for', 'radio-group', '', lookingForOptions) : renderDisplayField('Looking for', getLookingForDisplayValue(formData.hiringPreferences.lookingFor))}
                    {isEditing ? renderInputField('hiringPreferences', 'employmentType', 'Employment type', 'checkbox-group', '', employmentTypeOptions) : renderDisplayField('Employment type', (formData.hiringPreferences.employmentType || []).map(type => getDisplayValue(type, employmentTypeOptions)).join(', ') || null)}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end p-4 border-t border-gray-100">
              <button 
                className="px-6 py-2.5 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-xl hover:shadow-lg hover:shadow-[#667eea]/30 transition-all duration-300 flex items-center gap-2"
                onClick={isEditing ? handleSubmit : handleEditToggle}
              >
                {isEditing ? (
                  <>
                    <Save size={18} />
                    Save Changes
                  </>
                ) : (
                  <>
                    <Edit size={18} />
                    Edit
                  </>
                )}
              </button>
            </div>
          </div>
          
          {/* Company Verification & KYC Section */}
          <div className="border-b border-gray-100">
            <div className="grid md:grid-cols-12 gap-4 p-6">
              <div className="md:col-span-3">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#10b981" className="w-5 h-5">
                      <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Company Verification & KYC</h3>
                    <p className="text-sm text-gray-600">Upload necessary documents for company verification.</p>
                  </div>
                </div>
              </div>
              <div className="md:col-span-9">
                <div className="space-y-4">
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Upload Verification Documents (Choose any one for verification)</label>
                    <div className={`w-full border border-gray-200 p-3 rounded-xl flex justify-between items-center transition-all duration-200 ${isEditing ? 'cursor-pointer hover:border-[#667eea] bg-gradient-to-r from-gray-50 to-white' : 'cursor-not-allowed bg-gradient-to-r from-gray-50/50 to-white/50'}`} onClick={() => isEditing && kycFileInputRef.current.click()}>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-[#667eea]/20 to-[#764ba2]/20 rounded-lg">
                          <Upload size={20} className="text-[#667eea]" />
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">{kycFiles.length > 0 ? `${kycFiles.length} file(s) selected` : 'Upload Document'}</span>
                          <p className="text-sm text-gray-500">PDF, DOC, JPG, PNG</p>
                        </div>
                      </div>
                    </div>
                    <input type="file" multiple accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" onChange={handleKycFileChange} className="hidden" ref={kycFileInputRef} disabled={!isEditing}/>
                    <div className="mt-2 text-sm text-gray-600">
                      {kycFiles.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {kycFiles.map((file, index) => (
                            <span key={index} className="flex items-center bg-gradient-to-r from-blue-100 to-blue-50 text-blue-800 px-3 py-1.5 rounded-lg text-sm">
                              {file.name}
                              {isEditing && (
                                <button type="button" onClick={() => handleRemoveKycFile(index)} className="ml-2 text-blue-600 hover:text-blue-800">
                                  <X size={14} />
                                </button>
                              )}
                            </span>
                          ))}
                        </div>
                      )}
                      {formData.kycDetails.kycDocuments && formData.kycDetails.kycDocuments.length > 0 && kycFiles.length === 0 && (
                        <div className="mt-2">
                          <p className="text-sm font-medium text-gray-700 mb-1">Currently uploaded:</p>
                          <div className="flex flex-wrap gap-2">
                            {formData.kycDetails.kycDocuments.map((doc, index) => (
                              <a key={index} href={doc.url || doc} target="_blank" rel="noopener noreferrer" className="flex items-center bg-gradient-to-r from-green-100 to-green-50 text-green-800 px-3 py-1.5 rounded-lg text-sm hover:shadow-md">
                                📄 {doc.name || `Document ${index + 1}`}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                      {kycFiles.length === 0 && (!formData.kycDetails.kycDocuments || formData.kycDetails.kycDocuments.length === 0) && (
                        <p className="mt-2 text-gray-500">No documents selected.</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1  md:grid-cols-2 gap-4">
                    {renderInputField('kycDetails', 'TAN', 'TAN (Tax Deduction and Collection Account Number)', 'text', '10-digit alphanumeric')}
                    {renderInputField('kycDetails', 'GSTNumber', 'GST Number', 'text', '15-digit alphanumeric')}
                    {renderInputField('kycDetails', 'companyRegistrationNumber', 'Company Registration Number (CIN/LLPIN)', 'text', '21-digit alphanumeric')}
                    {renderInputField('kycDetails', 'GSTIN', 'GSTIN', 'text', 'GSTIN')}
                  </div>
                  
                  {renderInputField('kycDetails', 'address', 'Registered Address', 'textarea', 'Company\'s registered address')}
                </div>
              </div>
            </div>
            <div className="flex justify-end p-4 border-t border-gray-100">
              <button 
                className="px-6 py-2.5 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-xl hover:shadow-lg hover:shadow-[#667eea]/30 transition-all duration-300 flex items-center gap-2"
                onClick={isEditing ? handleSubmit : handleEditToggle}
              >
                {isEditing ? (
                  <>
                    <Save size={18} />
                    Save Changes
                  </>
                ) : (
                  <>
                    <Edit size={18} />
                    Edit
                  </>
                )}
              </button>
            </div>
          </div>
          
          {/* Company Profile Section */}
          <div>
            <div className="grid md:grid-cols-12 gap-4 p-6">
              <div className="md:col-span-3">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-gradient-to-br from-[#4facfe]/20 to-[#00f2fe]/20 rounded-xl mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#4facfe" className="w-5 h-5">
                      <path d="M15.75 8.25a.75.75 0 01.75.75c0 1.12-.492 2.126-1.27 2.812a.75.75 0 11-.992-1.124A2.243 2.243 0 0015 9a.75.75 0 01.75-.75z" />
                      <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM4.575 15.6a8.25 8.25 0 009.348 4.425 1.966 1.966 0 00-1.84-1.275.983.983 0 01-.97-.822l-.073-.437c-.094-.565.25-1.11.8-1.267l.99-.282c.427-.123.783-.418.982-.816l.036-.073a1.453 1.453 0 012.328-.377L16.5 15h.628a2.25 2.25 0 011.983 1.186 8.25 8.25 0 00-6.345-12.4c.044.262.18.503.389.676l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 01-1.161.886l-.143.048a1.107 1.107 0 00-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 01-1.652.928l-.679-.906a1.125 1.125 0 00-1.906.172L4.575 15.6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Company Profiles</h3>
                    <p className="text-sm text-gray-600">Links to your company's social media and website profiles.</p>
                  </div>
                </div>
              </div>
              <div className="md:col-span-9">
                <div className="space-y-4">
                  <div>
                    <label className="flex items-center gap-2 mb-1 text-sm font-medium text-gray-700">
                      <div className="p-2 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg">
                        <Linkedin size={16} className="text-blue-700" />
                      </div>
                      LinkedIn
                    </label>
                    <div className="flex">
                      
                      <input type="text" className="w-full border bg-white border-gray-200 p-2.5 rounded-xl focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none" placeholder="www.linkedin.com/company/your-company" value={formData.companyDetails.companyLinkedin || ''} onChange={(e) => handleChange(e, 'companyDetails', 'companyLinkedin')} readOnly={!isEditing} disabled={!isEditing} />
                    </div>
                  </div>
                  <div>
                    <label className="flex items-center gap-2 mb-1 text-sm font-medium text-gray-700">
                      <div className="p-2 bg-gradient-to-br from-gray-100 to-white rounded-lg">
                        <Globe size={16} className="text-gray-700" />
                      </div>
                      Website
                    </label>
                    <div className="flex">
                     
                      <input type="text" className="w-full border bg-white border-gray-200 p-2.5 rounded-xl focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none" placeholder="www.yourcompany.com" value={formData.companyDetails.websiteUrl || ''} onChange={(e) => handleChange(e, 'companyDetails', 'websiteUrl')} readOnly={!isEditing} disabled={!isEditing} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end p-4 border-t border-gray-100">
              <button 
                className="px-6 py-2.5 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-xl hover:shadow-lg hover:shadow-[#667eea]/30 transition-all duration-300 flex items-center gap-2"
                onClick={isEditing ? handleSubmit : handleEditToggle}
              >
                {isEditing ? (
                  <>
                    <Save size={18} />
                    Save Changes
                  </>
                ) : (
                  <>
                    <Edit size={18} />
                    Edit
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}