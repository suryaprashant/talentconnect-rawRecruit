import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Trophy, Clock, DollarSign, FileText, Globe, Target, Plus, X } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const HostWorkshop = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    logo: '',
    title: '',
    subTitle: '',
    mode: '',
    visibility: '',
    participationType: '',
    eventDate: '',
    eventTime: '',
    description: '',
    problemStatements: [{
      title: '',
      description: '',
      technology: []
    }],
    startDate: '',
    endDate: '',
    location: '',
    maxParticipants: '',
    maxTeams: '',
    minTeamMembers: '',
    maxTeamMembers: '',
    numberOfRounds: 1,
    rounds: [
      {
        roundNumber: 1,
        roundName: 'Round 1',
        description: '',
        startDate: '',
        endDate: ''
      }
    ],
    rewards: {
      rewardType: 'Amount',
      firstPlace: '',
      secondPlace: '',
      thirdPlace: '',
      specialAwards: []
    },
    registrationDeadline: '',
    requirements: '',
    rules: '',
    website: '',
    contactEmail: '',
    tags: '',
    domains: ['']
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1);
  const [faqs, setFaqs] = useState([{ question: '', answer: '' }]);
  const [panelMembers, setPanelMembers] = useState([]);
  const [panelInput, setPanelInput] = useState('');

  // Helper functions for rounds management
  const updateNumberOfRounds = (count) => {
    const newRounds = [];
    for (let i = 1; i <= count; i++) {
      newRounds.push({
        roundNumber: i,
        roundName: formData.rounds[i-1]?.roundName || `Round ${i}`,
        description: formData.rounds[i-1]?.description || '',
        startDate: formData.rounds[i-1]?.startDate || '',
        endDate: formData.rounds[i-1]?.endDate || ''
      });
    }
    setFormData(prev => ({
      ...prev,
      numberOfRounds: count,
      rounds: newRounds
    }));
  };

  const updateRoundData = (roundIndex, field, value) => {
    const updatedRounds = [...formData.rounds];
    updatedRounds[roundIndex] = {
      ...updatedRounds[roundIndex],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      rounds: updatedRounds
    }));
  };

  // Helper functions for special awards management
  const addSpecialAward = () => {
    const newAward = { name: '', amount: '', perk: '' };
    setFormData(prev => ({
      ...prev,
      rewards: {
        ...prev.rewards,
        specialAwards: [...prev.rewards.specialAwards, newAward]
      }
    }));
  };

  const updateSpecialAward = (index, field, value) => {
    const updatedAwards = [...formData.rewards.specialAwards];
    updatedAwards[index] = {
      ...updatedAwards[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      rewards: {
        ...prev.rewards,
        specialAwards: updatedAwards
      }
    }));
  };

  const removeSpecialAward = (index) => {
    const updatedAwards = formData.rewards.specialAwards.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      rewards: {
        ...prev.rewards,
        specialAwards: updatedAwards
      }
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    // Replace goal validation with problem statements validation
    if (!formData.problemStatements.length) {
      newErrors.problemStatements = 'At least one problem statement is required';
    } else {
      formData.problemStatements.forEach((problem, index) => {
        if (!problem.title.trim()) {
          newErrors[`problemTitle${index}`] = 'Problem title is required';
        }
        if (!problem.description.trim()) {
          newErrors[`problemDescription${index}`] = 'Problem description is required';
        }
        if (!problem.technology.length) {
          newErrors[`problemTechnology${index}`] = 'At least one technology is required';
        }
      });
    }
    
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    
    // Validate participation fields based on participation type
    if (formData.participationType === 'Individual' || formData.participationType === 'Both') {
    if (!formData.maxParticipants) newErrors.maxParticipants = 'Max participants is required';
    }
    
    if (formData.participationType === 'Team' || formData.participationType === 'Both') {
      if (!formData.maxTeams) newErrors.maxTeams = 'Max teams is required';
      if (!formData.minTeamMembers) newErrors.minTeamMembers = 'Min team members is required';
      if (!formData.maxTeamMembers) newErrors.maxTeamMembers = 'Max team members is required';
    }
    
    if (!formData.rewards.firstPlace) newErrors.firstPlace = 'First place reward is required';
    if (!formData.rewards.secondPlace) newErrors.secondPlace = 'Second place reward is required';
    if (!formData.rewards.thirdPlace) newErrors.thirdPlace = 'Third place reward is required';
    if (!formData.registrationDeadline) newErrors.registrationDeadline = 'Registration deadline is required';
    if (!formData.contactEmail.trim()) newErrors.contactEmail = 'Contact email is required';
    
    // Validate rounds
    formData.rounds.forEach((round, index) => {
      if (!round.startDate) newErrors[`round${index}StartDate`] = `Round ${index + 1} start date is required`;
      if (!round.endDate) newErrors[`round${index}EndDate`] = `Round ${index + 1} end date is required`;
    });
    
    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    
    // Debug logging
    console.log('Form validation result:', isValid);
    if (!isValid) {
      console.log('Validation errors:', newErrors);
    }
    
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submit button clicked!');
    console.log('Form data:', formData);
    console.log('Location specifically:', formData.location);
  
    if (!validateForm()) {
      console.log('Form validation failed, stopping submission');
      return;
    }
  
    console.log('Form validation passed, proceeding with submission');
    console.log('Data being sent to backend:', JSON.stringify(formData, null, 2));
    setLoading(true);
    
    try {
      const backendUrl = import.meta.env.VITE_Backend_URL || "http://localhost:5000";
      const payload = {
        ...formData,
        faqs,
        panelMembers,
      };

      // Debug logging
      console.log('Backend URL:', backendUrl);
      console.log('Full API endpoint:', `${backendUrl}/workshop/create`); // Updated endpoint
      console.log('Request payload:', JSON.stringify(payload, null, 2));
      console.log('Request headers:', {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      });

      const response = await axios.post(
        `${backendUrl}/workshop/create`, // Updated endpoint
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );
  
      if (response.status === 201 || response.status === 200) {
        toast.success("Workshop created successfully!");
        console.log("Workshop created successfully:", response.data);
        navigate("/company-profile");
      }
    } catch (err) {
      // Enhanced error logging
      console.error('Error creating workshop:', {
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        responseData: err.response?.data,
        requestURL: err.config?.url,
        requestMethod: err.config?.method,
        requestHeaders: err.config?.headers,
      });

      // Log the full error object
      console.error('Full error object:', err);

      const errorMessage = err.response?.data?.message || "Failed to create workshop.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/company-profile');
  };

  // FAQ handlers
  const handleFaqChange = (idx, field, value) => {
    const updatedFaqs = [...faqs];
    updatedFaqs[idx][field] = value;
    setFaqs(updatedFaqs);
  };
  const addFaq = () => setFaqs([...faqs, { question: '', answer: '' }]);
  const removeFaq = (idx) => setFaqs(faqs.filter((_, i) => i !== idx));

  // Panel member handlers
  const handlePanelInputChange = (e) => {
    setPanelInput(e.target.value);
  };

  const addPanelMember = () => {
    const email = panelInput.trim();
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && emailRegex.test(email) && !panelMembers.includes(email)) {
      setPanelMembers([...panelMembers, email]);
      setPanelInput('');
    }
  };

  const removePanelMember = (email) => setPanelMembers(panelMembers.filter(pid => pid !== email));

  // Domain handlers
  const addDomain = () => {
    setFormData(prev => ({
      ...prev,
      domains: [...prev.domains, '']
    }));
  };

  const updateDomain = (index, value) => {
    const updatedDomains = [...formData.domains];
    updatedDomains[index] = value;
    setFormData(prev => ({
      ...prev,
      domains: updatedDomains
    }));
  };

  const removeDomain = (index) => {
    setFormData(prev => ({
      ...prev,
      domains: prev.domains.filter((_, i) => i !== index)
    }));
  };

  // Add handlers for problem statements
  const addProblemStatement = () => {
    setFormData(prev => ({
      ...prev,
      problemStatements: [...prev.problemStatements, {
        title: '',
        description: '',
        technology: []
      }]
    }));
  };

  const updateProblemStatement = (index, field, value) => {
    const updatedStatements = [...formData.problemStatements];
    updatedStatements[index] = {
      ...updatedStatements[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      problemStatements: updatedStatements
    }));
  };

  const removeProblemStatement = (index) => {
    setFormData(prev => ({
      ...prev,
      problemStatements: prev.problemStatements.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Host a Workshop</h1>
          </div>
          <p className="text-gray-600">
            Create an exciting workshop event to engage with talented developers and innovators.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 1 && (  
            <>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Basic Information
                </h2>
                
                {/*Grid*/}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/*Title*/}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Workshop Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 bg-white text-black border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500  ${
                        errors.title ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter workshop title"
                    />
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                  </div>
                  {/*Subtitle*/}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Workshop Sub-Title *
                    </label>
                    <input
                      type="text"
                      name="subTitle"
                      value={formData.subTitle}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 bg-white text-black border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.subTitle ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter workshop sub-title"
                    />
                    {errors.subTitle && <p className="text-red-500 text-sm mt-1">{errors.subTitle}</p>}
                  </div>
                
                {/*Problem Statements*/}
                <div className="md:col-span-2">
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      <Target className="inline h-4 w-4 mr-1" />
                      Problem Statements *
                    </label>
                    <button
                      type="button"
                      onClick={addProblemStatement}
                      className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                    >
                      <Plus className="h-4 w-4" />
                      Add Problem Statement
                    </button>
                  </div>
                  <div className="space-y-4">
                    {formData.problemStatements.map((problem, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <input
                              type="text"
                              value={problem.title}
                              onChange={(e) => updateProblemStatement(index, 'title', e.target.value)}
                              className={`w-full px-3 py-2 bg-white text-black border border-gray-700 rounded-md ${
                                errors[`problemTitle${index}`] ? 'border-red-500' : ''
                              }`}
                              placeholder="Problem Title"
                            />
                            {errors[`problemTitle${index}`] && (
                              <p className="text-red-500 text-sm mt-1">{errors[`problemTitle${index}`]}</p>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => removeProblemStatement(index)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-md ml-2"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <textarea
                              value={problem.description}
                              onChange={(e) => updateProblemStatement(index, 'description', e.target.value)}
                              className={`w-full px-3 py-2 bg-white text-black border border-gray-700 rounded-md ${
                                errors[`problemDescription${index}`] ? 'border-red-500' : ''
                              }`}
                              rows={3}
                              placeholder="Problem Description"
                            />
                            {errors[`problemDescription${index}`] && (
                              <p className="text-red-500 text-sm mt-1">{errors[`problemDescription${index}`]}</p>
                            )}
                          </div>
                          
                          <div>
                            <input
                              type="text"
                              value={problem.technology.join(', ')}
                              onChange={(e) => updateProblemStatement(index, 'technology', e.target.value.split(',').map(t => t.trim()))}
                              className={`w-full px-3 py-2 bg-white text-black border border-gray-700 rounded-md ${
                                errors[`problemTechnology${index}`] ? 'border-red-500' : ''
                              }`}
                              placeholder="Required Technologies (comma-separated e.g. Python, React, Node.js)"
                            />
                            {errors[`problemTechnology${index}`] && (
                              <p className="text-red-500 text-sm mt-1">{errors[`problemTechnology${index}`]}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                  {/*Contact Email*/}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Email *
                    </label>
                    <input
                      type="email"
                      name="contactEmail"
                      value={formData.contactEmail}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 bg-white text-black border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.contactEmail ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="contact@company.com"
                    />
                    {errors.contactEmail && <p className="text-red-500 text-sm mt-1">{errors.contactEmail}</p>}
                  </div>
                </div>
                {/*discription*/}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className={`w-full px-3 py-2 bg-white text-black border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Describe your workshop, themes, and what participants can expect..."
                  />
                  {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </div>
              </div>

              {/* Logo */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Logo
                </h2>

                <div className="flex flex-col items-start">
                  {/* Circular upload area */}
                  <div className="relative">
                    <label
                      htmlFor="logo-upload"
                      className="flex items-center justify-center h-32 w-32 rounded-full border-2 border-dashed border-gray-400 cursor-pointer overflow-hidden bg-gray-50 hover:bg-gray-100"
                    >
                      {formData.logoPreview ? (
                        <img
                          src={formData.logoPreview}
                          alt="Logo Preview"
                          className="h-full w-full object-cover rounded-full"
                        />
                      ) : (
                        <span className="text-gray-500 text-sm">Upload Logo</span>
                      )}
                    </label>

                    {/* Hidden file input */}
                    <input
                      id="logo-upload"
                      type="file"
                      name="logo"
                      accept="image/png, image/jpeg, image/jpg, image/gif, image/webp, image/svg+xml"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setFormData((prev) => ({
                              ...prev,
                              logo: file,
                              logoPreview: reader.result, // save preview URL
                            }));
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </div>

                  {errors.logo && (
                    <p className="text-red-500 text-sm mt-2">{errors.logo}</p>
                  )}
                </div>
              </div>

              {/*Eligibility*/}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Eligibility
                </h2>
                <div className="w-full">
                  <textarea
                    name="eligibility"
                    value={formData.eligibility}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 bg-white text-black border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Specify who can participate in this workshop..."
                  />
                </div>
              </div>

              {/* Domains Section */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Domains
                  </h2>
                  <button
                    type="button"
                    onClick={addDomain}
                    className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                  >
                    <Plus className="h-4 w-4" />
                    Add Domain
                  </button>
                </div>
                <div className="space-y-3">
                  {formData.domains.map((domain, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={domain}
                        onChange={(e) => updateDomain(index, e.target.value)}
                        className="flex-1 px-3 py-2 bg-white text-black border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter domain (e.g., AI/ML, Web Development)"
                      />
                      {formData.domains.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeDomain(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/*Visibility*/}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Visibility
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Visibility *
                    </label>
                    <select
                      name="visibility"
                      value={formData.visibility}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 bg-white text-black border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.visibility ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select visibility</option>
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                      <option value="invite-only">Invite Only</option>
                    </select>
                    {errors.visibility && (
                      <p className="text-red-500 text-sm mt-1">{errors.visibility}</p>
                    )}
                  </div>
                  {/*mode*/}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mode *
                    </label>
                    <select
                      name="mode"
                      value={formData.mode}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 bg-white text-black border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.mode ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select mode</option>
                      <option value="public">Online</option>
                      <option value="private">Private</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                    {errors.mode && (
                      <p className="text-red-500 text-sm mt-1">{errors.mode}</p>
                    )}
                  </div>

                  {/*participation type*/}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Participation Type *
                    </label>
                    <select
                      name="participationType"
                      value={formData.participationType}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 bg-white text-black border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.participationType ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select participation type</option>
                      <option value="Individual">Individual</option>
                      <option value="Team">Team</option>
                      <option value="Both">Both</option>
                    </select>
                    {errors.participationType && (
                      <p className="text-red-500 text-sm mt-1">{errors.participationType}</p>
                    )}
                  </div>
                </div>
                
              </div>
              
              {/* Event Details */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Event Details
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date *
                    </label>
                    <input
                      type="datetime-local"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 bg-white text-black border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.startDate ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date *
                    </label>
                    <input
                      type="datetime-local"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 bg-white text-black border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.endDate ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Registration Deadline *
                    </label>
                    <input
                      type="datetime-local"
                      name="registrationDeadline"
                      value={formData.registrationDeadline}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 bg-white text-black border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.registrationDeadline ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.registrationDeadline && <p className="text-red-500 text-sm mt-1">{errors.registrationDeadline}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="inline h-4 w-4 mr-1" />
                      Location *
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 bg-white text-black border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.location ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="City, State or Virtual"
                    />
                    {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                  </div>
                </div>
              </div>

              {/* Rounds Management */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Workshop Rounds
                </h2>
                
                <div className="space-y-6">
                  {/* Number of Rounds */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Rounds *
                    </label>
                    <select
                      value={formData.numberOfRounds}
                      onChange={(e) => updateNumberOfRounds(parseInt(e.target.value))}
                      className="w-full px-3 py-2 bg-white text-black border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {[1, 2, 3, 4, 5].map(num => (
                        <option key={num} value={num}>{num} Round{num > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>

                  {/* Individual Rounds */}
                  {formData.rounds.map((round, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        {round.roundName}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Round Name
                          </label>
                          <input
                            type="text"
                            value={round.roundName}
                            onChange={(e) => updateRoundData(index, 'roundName', e.target.value)}
                            className="w-full px-3 py-2 bg-white text-black border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder={`Round ${index + 1}`}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Start Date *
                          </label>
                          <input
                            type="datetime-local"
                            value={round.startDate}
                            onChange={(e) => updateRoundData(index, 'startDate', e.target.value)}
                            className={`w-full px-3 py-2 bg-white text-black border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              errors[`round${index}StartDate`] ? 'border-red-500' : ''
                            }`}
                          />
                          {errors[`round${index}StartDate`] && (
                            <p className="text-red-500 text-sm mt-1">{errors[`round${index}StartDate`]}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            End Date *
                          </label>
                          <input
                            type="datetime-local"
                            value={round.endDate}
                            onChange={(e) => updateRoundData(index, 'endDate', e.target.value)}
                            className={`w-full px-3 py-2 bg-white text-black border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              errors[`round${index}EndDate`] ? 'border-red-500' : ''
                            }`}
                          />
                          {errors[`round${index}EndDate`] && (
                            <p className="text-red-500 text-sm mt-1">{errors[`round${index}EndDate`]}</p>
                          )}
                        </div>
                        <div className="md:col-span-1">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                          </label>
                          <input
                            type="text"
                            value={round.description}
                            onChange={(e) => updateRoundData(index, 'description', e.target.value)}
                            className="w-[783px] px-3 py-2 bg-white text-black border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Brief about this round"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons for Step 1 */}
              <div className="bg-white rounded-lg shadow-sm p-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Next
                </button>
              </div>
          </>
          )}
          {step === 2 && (
            <>
          {/* Participation */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="h-5 w-5" />
              Participation
            </h2>
            
            <div className="space-y-4">
              {/* Individual Participation */}
              {(formData.participationType === 'Individual' || formData.participationType === 'Both') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Users className="inline h-4 w-4 mr-1" />
                    Max Individual Participants *
                </label>
                <input
                  type="number"
                  name="maxParticipants"
                  value={formData.maxParticipants}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 bg-white text-black border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.maxParticipants ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., 100"
                  min="1"
                />
                {errors.maxParticipants && <p className="text-red-500 text-sm mt-1">{errors.maxParticipants}</p>}
                </div>
              )}

              {/* Team Participation */}
              {(formData.participationType === 'Team' || formData.participationType === 'Both') && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Users className="inline h-4 w-4 mr-1" />
                      Max Teams *
                    </label>
                    <input
                      type="number"
                      name="maxTeams"
                      value={formData.maxTeams}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 bg-white text-black border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.maxTeams ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="e.g., 25"
                      min="1"
                    />
                    {errors.maxTeams && <p className="text-red-500 text-sm mt-1">{errors.maxTeams}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Min Team Members *
                      </label>
                      <input
                        type="number"
                        name="minTeamMembers"
                        value={formData.minTeamMembers}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 bg-white text-black border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.minTeamMembers ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="e.g., 2"
                        min="1"
                      />
                      {errors.minTeamMembers && <p className="text-red-500 text-sm mt-1">{errors.minTeamMembers}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                        Max Team Members *
                </label>
                <input
                  type="number"
                        name="maxTeamMembers"
                        value={formData.maxTeamMembers}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 bg-white text-black border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.maxTeamMembers ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="e.g., 5"
                        min="1"
                      />
                      {errors.maxTeamMembers && <p className="text-red-500 text-sm mt-1">{errors.maxTeamMembers}</p>}
                    </div>
                  </div>
                </>
              )}

              {/* Show message when no participation type is selected */}
              {!formData.participationType && (
                <div className="text-gray-500 text-sm bg-gray-50 p-4 rounded-lg">
                  Please select a participation type in Step 1 to configure participation limits.
                </div>
              )}
            </div>
          </div>

          {/* Rewards & Prizes */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Rewards & Prizes
            </h2>
            
            <div className="space-y-6">
              {/* Reward Type Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reward Type</label>
                <select
                  value={formData.rewards.rewardType}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    rewards: { ...prev.rewards, rewardType: e.target.value }
                  }))}
                  className="w-full px-3 py-2 bg-white text-black border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Amount">Amount</option>
                  <option value="Perks">Perks/Gifts</option>
                </select>
              </div>  
              {/* Main Prizes */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Main Prizes</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🥇 1st Place *
                    </label>
                    {formData.rewards.rewardType === 'Amount' ? (
                    <input
                      type="number"
                      value={formData.rewards.firstPlace}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        rewards: { ...prev.rewards, firstPlace: e.target.value }
                      }))}
                      className={`w-full px-3 py-2 bg-white text-black border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.firstPlace ? 'border-red-500' : ''
                      }`}
                      placeholder="e.g., 50000"
                      min="0"
                    />
                  ) : (
                    <input
                      type="text"
                      value={formData.rewards.firstPlace}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        rewards: { ...prev.rewards, firstPlace: e.target.value }
                      }))}
                      className={`w-full px-3 py-2 bg-white text-black border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.firstPlace ? 'border-red-500' : ''
                     }`}
                      placeholder="e.g., MacBook, Gift Hamper"
                    />
                  )}                 
                    {errors.firstPlace && <p className="text-red-500 text-sm mt-1">{errors.firstPlace}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🥈 2nd Place *
                    </label>
                    {formData.rewards.rewardType === 'Amount' ? (
                    <input
                      type="number"
                      value={formData.rewards.secondPlace}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        rewards: { ...prev.rewards, secondPlace: e.target.value }
                      }))}
                      className={`w-full px-3 py-2 bg-white text-black border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.secondPlace ? 'border-red-500' : ''
                      }`}
                      placeholder="e.g., 30000"
                      min="0"
                    />
                  ) : (
                    <input
                      type="text"
                      value={formData.rewards.secondPlace}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        rewards: { ...prev.rewards, secondPlace: e.target.value }
                      }))}
                      className={`w-full px-3 py-2 bg-white text-black border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.secondPlace ? 'border-red-500' : ''
                      }`}
                      placeholder="e.g., Headphones, Swag Kit"
                    />
                  )}
                    {errors.secondPlace && <p className="text-red-500 text-sm mt-1">{errors.secondPlace}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🥉 3rd Place *
                    </label>
                    {formData.rewards.rewardType === 'Amount' ? (
                    <input
                      type="number"
                      value={formData.rewards.thirdPlace}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        rewards: { ...prev.rewards, thirdPlace: e.target.value }
                      }))}
                      className={`w-full px-3 py-2 bg-white text-black border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.thirdPlace ? 'border-red-500' : ''
                      }`}
                      placeholder="e.g., 20000"
                      min="0"
                    />
                  ) : (
                    <input
                      type="text"
                      value={formData.rewards.thirdPlace}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        rewards: { ...prev.rewards, thirdPlace: e.target.value }
                      }))}
                      className={`w-full px-3 py-2 bg-white text-black border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.thirdPlace ? 'border-red-500' : ''
                      }`}
                      placeholder="e.g., Gift Vouchers"
                    />
                  )}
                    {errors.thirdPlace && <p className="text-red-500 text-sm mt-1">{errors.thirdPlace}</p>}
                  </div>
                </div>
              </div>

              {/* Special Awards */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Special Awards</h3>
                  <button
                    type="button"
                    onClick={addSpecialAward}
                    className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                  >
                    <Plus className="h-4 w-4" />
                    Add Award
                  </button>
                </div>

                {formData.rewards.specialAwards.length === 0 ? (
                  <p className="text-gray-500 text-sm">No special awards added yet.</p>
                ) : (
                  <div className="space-y-3">
                    {formData.rewards.specialAwards.map((award, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
                        <div className="flex-1">
                          <input
                            type="text"
                            value={award.name}
                            onChange={(e) => updateSpecialAward(index, 'name', e.target.value)}
                            className="w-full px-3 py-2 bg-white text-black border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Award name (e.g., Best Innovation, Most Creative)"
                          />
                        </div>
                        {formData.rewards.rewardType === 'Amount' ? (
                        <div className="w-32">
                          <input
                            type="number"
                            value={award.amount}
                            onChange={(e) => updateSpecialAward(index, 'amount', e.target.value)}
                            className="w-full px-3 py-2 bg-white text-black border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Amount"
                            min="0"
                          />
                        </div>
                      ) : (
                        <div className="flex-1">
                          <input
                            type="text"
                            value={award.perk}
                            onChange={(e) => updateSpecialAward(index, 'perk', e.target.value)}
                            className="w-full px-3 py-2 bg-white text-black border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Perk/Gift description"
                          />
                        </div>
                      )}
                        <button
                          type="button"
                          onClick={() => removeSpecialAward(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              FAQs
            </h2>
            {faqs.map((faq, idx) => (
              <div key={idx} className="mb-4 flex gap-2 items-start">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Question"
                    value={faq.question}
                    onChange={e => handleFaqChange(idx, 'question', e.target.value)}
                    className="w-full px-3 py-2 mb-2 bg-white text-black border border-gray-700 rounded-md"
                  />
                  <textarea
                    placeholder="Answer"
                    value={faq.answer}
                    onChange={e => handleFaqChange(idx, 'answer', e.target.value)}
                    className="w-full px-3 py-2 bg-white text-black border border-gray-700 rounded-md"
                    rows={2}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeFaq(idx)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-md mt-2"
                  disabled={faqs.length === 1}
                  title="Remove FAQ"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addFaq}
              className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
            >
              <Plus className="h-4 w-4" />
              Add FAQ
            </button>
          </div>

          {/* Panel Members Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="h-5 w-5" />
              Panel Members
            </h2>
            <div className="flex gap-2 mb-4">
              <input
                type="email"
                placeholder="Enter Panel Member Email"
                value={panelInput}
                onChange={handlePanelInputChange}
                className="flex-1 px-3 py-2 bg-white text-black border border-gray-700 rounded-md"
              />
              <button
                type="button"
                onClick={addPanelMember}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add
              </button>
            </div>
            {panelMembers.length > 0 && (
              <ul className="list-disc pl-6">
                {panelMembers.map((email, idx) => (
                  <li key={idx} className="flex items-center gap-2 mb-1">
                    <span>{email}</span>
                    <button
                      type="button"
                      onClick={() => removePanelMember(email)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded-md"
                      title="Remove"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Additional Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Additional Information
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Requirements
                </label>
                <textarea
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 bg-white text-black border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Technical requirements, skills needed, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rules & Guidelines
                </label>
                <textarea
                  name="rules"
                  value={formData.rules}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 bg-white text-black border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Workshop rules, submission guidelines, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website URL
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white text-black border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://your-workshop-website.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white text-black border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="AI, Web Development, Mobile App, etc. (comma separated)"
                />
              </div>
            </div>
          </div>
          {/* Action Buttons for Step 2 */}
          <div className="bg-white rounded-lg shadow-sm p-6 flex justify-between">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Trophy className="h-4 w-4" />
                  Create Workshop
                </>
              )}
            </button>
          </div>
          </>
          )}

          
        </form>
      </div>
    </div>
  );
};

export default HostWorkshop;
