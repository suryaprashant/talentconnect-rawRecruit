import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Calendar, MapPin, Users, Trophy, Clock, DollarSign, FileText, Globe, Target, Plus, X, Briefcase, BookOpen, Award, GraduationCap, Link, Mail } from 'lucide-react';
import axiosClient from "@/lib/Company_AxiosInstance";
import toast from 'react-hot-toast';
import { scrollToFirstError } from '../../../utils/scrollToError';
import { getCasestudyById, updateCasestudy } from '@/lib/Company_AxiosInstance';

const HostCasestudies = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { editMode, eventId, eventData } = location.state || {};
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
        endDate: '',
        inputType: ''
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
    domains: [''],
    eligibility: ''
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1);
  const [shouldScrollToError, setShouldScrollToError] = useState(false);
  const [faqs, setFaqs] = useState([{ question: '', answer: '' }]);
  const [panelMembers, setPanelMembers] = useState([]);
  const [panelInput, setPanelInput] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [casestudyId, setCasestudyId] = useState(null);
  const formRef = useRef(null);

  // Load existing case study data if in edit mode
  useEffect(() => {
    const loadCasestudyData = async () => {
      if (editMode && eventId) {
        setIsEditMode(true);
        setCasestudyId(eventId);
        setLoading(true);

        try {
          // First try to use the eventData passed from hosting management
          if (eventData && Object.keys(eventData).length > 0) {
            console.log('Using eventData from hosting management:', eventData);
            const data = eventData;

            // Transform the data to match form structure
            setFormData({
              logo: data.bannerImage || '',
              title: data.title || '',
              subTitle: data.subTitle || '',
              mode: data.mode || '',
              visibility: data.visibility || '',
              participationType: data.participationType || '',
              eventDate: data.eventDate || '',
              eventTime: data.eventTime || '',
              description: data.description || '',
              problemStatements: data.problemStatements || [{ title: '', description: '', technology: [] }],
              startDate: data.startDate ? new Date(data.startDate).toISOString().slice(0, 16) : '',
              endDate: data.endDate ? new Date(data.endDate).toISOString().slice(0, 16) : '',
              location: data.location || '',
              maxParticipants: data.maxParticipants || '',
              maxTeams: data.maxTeams || '',
              minTeamMembers: data.minTeamMembers || '',
              maxTeamMembers: data.maxTeamMembers || '',
              numberOfRounds: data.numberOfRounds || 1,
              rounds: data.rounds || [{ 
                roundNumber: 1, 
                roundName: 'Round 1', 
                description: '', 
                startDate: '', 
                endDate: '',
                inputType: ''
              }],
              rewards: {
                rewardType: data.rewardsAndBenefits?.[0]?.type === 'Cash' ? 'Amount' : 'Other',
                firstPlace: data.rewardsAndBenefits?.find(r => r.rank === 'Winner')?.amount || '',
                secondPlace: data.rewardsAndBenefits?.find(r => r.rank === '1st RunnerUp')?.amount || '',
                thirdPlace: data.rewardsAndBenefits?.find(r => r.rank === '2nd RunnerUp')?.amount || '',
                specialAwards: data.rewardsAndBenefits?.filter(r => !['Winner', '1st RunnerUp', '2nd RunnerUp'].includes(r.rank)) || []
              },
              registrationDeadline: data.registrationDeadline ? new Date(data.registrationDeadline).toISOString().slice(0, 16) : '',
              requirements: data.requirements || '',
              rules: data.rules || '',
              website: data.website || '',
              contactEmail: data.contactEmail || '',
              tags: data.tags?.join(', ') || '',
              domains: data.domains || [''],
              eligibility: data.eligibility || '',
              logoPreview: data.bannerImage || ''
            });

            setFaqs(data.faqs || [{ question: '', answer: '' }]);
            setPanelMembers(data.panelMembers || []);
            setLoading(false);
            return;
          }

          // Fallback to API call if eventData is not available
          console.log('Fetching case study data from API');
          const response = await getCasestudyById(eventId);
          if (response?.data?.success) {
            const data = response.data.data;

            // Transform the data to match form structure
            setFormData({
              logo: data.bannerImage || '',
              title: data.title || '',
              subTitle: data.subTitle || '',
              mode: data.mode || '',
              visibility: data.visibility || '',
              participationType: data.participationType || '',
              eventDate: data.eventDate || '',
              eventTime: data.eventTime || '',
              description: data.description || '',
              problemStatements: data.problemStatements || [{ title: '', description: '', technology: [] }],
              startDate: data.startDate ? new Date(data.startDate).toISOString().slice(0, 16) : '',
              endDate: data.endDate ? new Date(data.endDate).toISOString().slice(0, 16) : '',
              location: data.location || '',
              maxParticipants: data.maxParticipants || '',
              maxTeams: data.maxTeams || '',
              minTeamMembers: data.minTeamMembers || '',
              maxTeamMembers: data.maxTeamMembers || '',
              numberOfRounds: data.numberOfRounds || 1,
              rounds: data.rounds || [{ 
                roundNumber: 1, 
                roundName: 'Round 1', 
                description: '', 
                startDate: '', 
                endDate: '',
                inputType: ''
              }],
              rewards: {
                rewardType: data.rewardsAndBenefits?.[0]?.type === 'Cash' ? 'Amount' : 'Other',
                firstPlace: data.rewardsAndBenefits?.find(r => r.rank === 'Winner')?.amount || '',
                secondPlace: data.rewardsAndBenefits?.find(r => r.rank === '1st RunnerUp')?.amount || '',
                thirdPlace: data.rewardsAndBenefits?.find(r => r.rank === '2nd RunnerUp')?.amount || '',
                specialAwards: data.rewardsAndBenefits?.filter(r => !['Winner', '1st RunnerUp', '2nd RunnerUp'].includes(r.rank)) || []
              },
              registrationDeadline: data.registrationDeadline ? new Date(data.registrationDeadline).toISOString().slice(0, 16) : '',
              requirements: data.requirements || '',
              rules: data.rules || '',
              website: data.website || '',
              contactEmail: data.contactEmail || '',
              tags: data.tags?.join(', ') || '',
              domains: data.domains || [''],
              eligibility: data.eligibility || '',
              logoPreview: data.bannerImage || ''
            });

            setFaqs(data.faqs || [{ question: '', answer: '' }]);
            setPanelMembers(data.panelMembers || []);
          } else {
            toast.error('Failed to load case study data');
            navigate('/hosting-management');
          }
        } catch (error) {
          console.error('Error loading case study:', error);
          toast.error('Failed to load case study data');
          navigate('/hosting-management');
        } finally {
          setLoading(false);
        }
      }
    };

    loadCasestudyData();
  }, [editMode, eventId, eventData, navigate]);

  // Decide which step an error belongs to
  const determineErrorStep = (errs = {}) => {
    const step2Keys = new Set([
      'maxParticipants',
      'maxTeams',
      'minTeamMembers',
      'maxTeamMembers',
      'firstPlace',
      'secondPlace',
      'thirdPlace',
      'website',
      'requirements',
      'rules',
    ]);
    for (const key of Object.keys(errs)) {
      if (step2Keys.has(key)) return 2;
    }
    return 1; // default to step 1 for all other fields
  };

  // Scroll to the first error only when shouldScrollToError is true
  useEffect(() => {
    if (errors && Object.keys(errors).length > 0 && shouldScrollToError) {
      const targetStep = determineErrorStep(errors);
      if (step !== targetStep) {
        setStep(targetStep);
        return; // wait for step UI to render, effect will run again
      }
      requestAnimationFrame(() => {
        scrollToFirstError({ container: formRef.current || document, block: 'center' });
        setShouldScrollToError(false); // Reset after scrolling
      });
    }
  }, [errors, step, shouldScrollToError]);

  // Helper functions for rounds management
  const updateNumberOfRounds = (count) => {
    const newRounds = [];
    for (let i = 1; i <= count; i++) {
      newRounds.push({
        roundNumber: i,
        roundName: formData.rounds[i - 1]?.roundName || `Round ${i}`,
        description: formData.rounds[i - 1]?.description || '',
        startDate: formData.rounds[i - 1]?.startDate || '',
        endDate: formData.rounds[i - 1]?.endDate || '',
        inputType: formData.rounds[i - 1]?.inputType || ''
      });
    }
    setFormData((prev) => ({
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
    setFormData((prev) => ({
      ...prev,
      rounds: updatedRounds
    }));

    // Clear the specific error when a round field is updated
    const errorKey = `round${roundIndex}${field.charAt(0).toUpperCase() + field.slice(1)}`;
    if (errors[errorKey]) {
      setErrors((prev) => ({
        ...prev,
        [errorKey]: ''
      }));
    }

    // Clear date-related errors when dates are updated
    if (field === 'startDate' || field === 'endDate') {
      // Clear start date error if start date is being updated
      if (field === 'startDate' && errors[`round${roundIndex}StartDate`]) {
        setErrors(prev => ({
          ...prev,
          [`round${roundIndex}StartDate`]: ''
        }));
      }
      
      // Clear end date error if end date is being updated
      if (field === 'endDate' && errors[`round${roundIndex}EndDate`]) {
        setErrors(prev => ({
          ...prev,
          [`round${roundIndex}EndDate`]: ''
        }));
      }
      
      // Clear round name error if it exists and we're updating dates
      if (errors[`round${roundIndex}Name`]) {
        setErrors(prev => ({
          ...prev,
          [`round${roundIndex}Name`]: ''
        }));
      }
    }
    
    // Clear user input error if user input is being updated
    if (field === 'inputType' && errors[`round${roundIndex}InputType`]) {
      setErrors(prev => ({
        ...prev,
        [`round${roundIndex}InputType`]: ''
      }));
    }
  };

  // Helper functions for special awards management
  const addSpecialAward = () => {
    const newAward = { name: '', amount: '', perk: '', rewardType: 'Perks' };
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
    
    // Basic Information Validation
    if (!formData.title.trim()) {
      newErrors.title = 'Case study title is required';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title cannot exceed 100 characters';
    }
    
    if (!formData.subTitle.trim()) {
      newErrors.subTitle = 'Sub-title is required';
    } else if (formData.subTitle.length > 200) {
      newErrors.subTitle = 'Sub-title cannot exceed 200 characters';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length > 5000) {
      newErrors.description = 'Description cannot exceed 5000 characters';
    }
    
    // Problem Statements Validation
    if (!formData.problemStatements.length) {
      newErrors.problemStatements = 'At least one problem statement is required';
    } else {
      formData.problemStatements.forEach((problem, index) => {
        if (!problem.title.trim()) {
          newErrors[`problemTitle${index}`] = 'Problem title is required';
        } else if (problem.title.length > 200) {
          newErrors[`problemTitle${index}`] = 'Problem title cannot exceed 200 characters';
        }
        
        if (!problem.description.trim()) {
          newErrors[`problemDescription${index}`] = 'Problem description is required';
        } else if (problem.description.length > 2000) {
          newErrors[`problemDescription${index}`] = 'Problem description cannot exceed 2000 characters';
        }
        
        if (!problem.technology.length || (problem.technology.length === 1 && !problem.technology[0].trim())) {
          newErrors[`problemTechnology${index}`] = 'At least one technology is required';
        }
      });
    }
    
    // Contact Email Validation
    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = 'Contact email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.contactEmail)) {
        newErrors.contactEmail = 'Please enter a valid email address';
      }
    }
    
    // Mode and Visibility Validation
    if (!formData.mode) {
      newErrors.mode = 'Mode is required';
    }
    
    if (!formData.visibility) {
      newErrors.visibility = 'Visibility is required';
    }
    
    if (!formData.participationType) {
      newErrors.participationType = 'Participation type is required';
    }
    
    // Date Validation
    const now = new Date();
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    const registrationDeadline = new Date(formData.registrationDeadline);
    
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    } else if (isNaN(startDate.getTime())) {
      newErrors.startDate = 'Please enter a valid start date';
    } else if (startDate < now) {
      newErrors.startDate = 'Start date cannot be in the past';
    }
    
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    } else if (isNaN(endDate.getTime())) {
      newErrors.endDate = 'Please enter a valid end date';
    } else if (formData.startDate && endDate <= startDate) {
      newErrors.endDate = 'End date must be after start date';
    }
    
    if (!formData.registrationDeadline) {
      newErrors.registrationDeadline = 'Registration deadline is required';
    } else if (isNaN(registrationDeadline.getTime())) {
      newErrors.registrationDeadline = 'Please enter a valid registration deadline';
    } else if (registrationDeadline < now) {
      newErrors.registrationDeadline = 'Registration deadline cannot be in the past';
    } else if (formData.startDate && registrationDeadline > startDate) {
      newErrors.registrationDeadline = 'Registration deadline must be before start date';
    }
    
    // Location Validation
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    } else if (formData.location.length > 200) {
      newErrors.location = 'Location cannot exceed 200 characters';
    }
    
    // Participation Fields Validation
    if (formData.participationType === 'Individual' || formData.participationType === 'Both') {
      if (!formData.maxParticipants) {
        newErrors.maxParticipants = 'Max participants is required';
      } else if (isNaN(formData.maxParticipants) || formData.maxParticipants < 1) {
        newErrors.maxParticipants = 'Max participants must be a positive number';
      }
    }
    
    if (formData.participationType === 'Team' || formData.participationType === 'Both') {
      if (!formData.maxTeams) {
        newErrors.maxTeams = 'Max teams is required';
      } else if (isNaN(formData.maxTeams) || formData.maxTeams < 1) {
        newErrors.maxTeams = 'Max teams must be a positive number';
      }
      
      if (!formData.minTeamMembers) {
        newErrors.minTeamMembers = 'Min team members is required';
      } else if (isNaN(formData.minTeamMembers) || formData.minTeamMembers < 1) {
        newErrors.minTeamMembers = 'Min team members must be a positive number';
      }
      
      if (!formData.maxTeamMembers) {
        newErrors.maxTeamMembers = 'Max team members is required';
      } else if (isNaN(formData.maxTeamMembers) || formData.maxTeamMembers < 1) {
        newErrors.maxTeamMembers = 'Max team members must be a positive number';
      } else if (formData.minTeamMembers && parseInt(formData.maxTeamMembers) < parseInt(formData.minTeamMembers)) {
        newErrors.maxTeamMembers = 'Max team members must be greater than or equal to min team members';
      }
    }
    
    // Rewards Validation
    if (!formData.rewards.firstPlace) {
      newErrors.firstPlace = 'First place reward is required';
    }
    if (!formData.rewards.secondPlace) {
      newErrors.secondPlace = 'Second place reward is required';
    }
    if (!formData.rewards.thirdPlace) {
      newErrors.thirdPlace = 'Third place reward is required';
    }
    
    // Rounds Validation
    if (formData.numberOfRounds < 1 || formData.numberOfRounds > 10) {
      newErrors.numberOfRounds = 'Number of rounds must be between 1 and 10';
    }
    
    formData.rounds.forEach((round, index) => {
      const roundStartDate = new Date(round.startDate);
      const roundEndDate = new Date(round.endDate);
      
      if (!round.roundName.trim()) {
        newErrors[`round${index}Name`] = `Round ${index + 1} name is required`;
      }

      // Add validation for input type
      if (!round.inputType) {
        newErrors[`round${index}InputType`] = `Input type is required for Round ${index + 1}`;
      }
      
      if (!round.startDate) {
        newErrors[`round${index}StartDate`] = `Round ${index + 1} start date is required`;
      } else if (isNaN(roundStartDate.getTime())) {
        newErrors[`round${index}StartDate`] = `Round ${index + 1} start date is invalid`;
      } else if (formData.startDate && roundStartDate < startDate) {
        newErrors[`round${index}StartDate`] = `Round ${index + 1} start date cannot be before case study start date`;
      }
      
      if (!round.endDate) {
        newErrors[`round${index}EndDate`] = `Round ${index + 1} end date is required`;
      } else if (isNaN(roundEndDate.getTime())) {
        newErrors[`round${index}EndDate`] = `Round ${index + 1} end date is invalid`;
      } else if (round.startDate && roundEndDate <= roundStartDate) {
        newErrors[`round${index}EndDate`] = `Round ${index + 1} end date must be after start date`;
      } else if (formData.endDate && roundEndDate > endDate) {
        newErrors[`round${index}EndDate`] = `Round ${index + 1} end date cannot be after case study end date`;
      }
      
      if (round.description && round.description.length > 1000) {
        newErrors[`round${index}Description`] = `Round ${index + 1} description cannot exceed 1000 characters`;
      }
    });
    
    // Domain Validation
    if (!formData.domains.length || (formData.domains.length === 1 && !formData.domains[0].trim())) {
      newErrors.domains = 'At least one domain is required';
    } else {
      formData.domains.forEach((domain, index) => {
        if (domain.trim() && domain.length > 100) {
          newErrors[`domain${index}`] = `Domain ${index + 1} cannot exceed 100 characters`;
        }
      });
    }
    
    // Optional fields validation
    if (formData.website && formData.website.trim()) {
      const urlRegex = /^https?:\/\/.+/;
      if (!urlRegex.test(formData.website)) {
        newErrors.website = 'Website must be a valid URL starting with http:// or https://';
      }
    }
    
    if (formData.requirements && formData.requirements.length > 2000) {
      newErrors.requirements = 'Requirements cannot exceed 2000 characters';
    }
    
    if (formData.rules && formData.rules.length > 2000) {
      newErrors.rules = 'Rules cannot exceed 2000 characters';
    }
    
    if (formData.eligibility && formData.eligibility.length > 2000) {
      newErrors.eligibility = 'Eligibility description cannot exceed 2000 characters';
    }
    
    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    
    // Debug logging
    console.log('Form validation result:', isValid);
    if (!isValid) {
      console.log('Validation errors:', newErrors);
      // Show a toast message for validation errors
      toast.error('Please fix the validation errors before submitting');
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
      setShouldScrollToError(true); // Enable scrolling for validation errors
      return;
    }
  
    console.log('Form validation passed, proceeding with submission');
    console.log('Data being sent to backend:', JSON.stringify(formData, null, 2));
    setLoading(true);
    
    try {
      // const backendUrl = import.meta.env.VITE_Backend_URL || "http://localhost:5000";
      console.log('inputType from first round:', formData.rounds[0]?.inputType);
      const payload = {
        ...formData,
        faqs,
        panelMembers,
      };
      
      let response;
      if (isEditMode && casestudyId) {
        // Update existing case study
        response = await updateCasestudy(casestudyId, payload);
      } else {
        // Create new case study
        response = await axiosClient.post(
          "/casestudy/create",
          payload
        );
      }
  
      if (response.status === 201 || response.status === 200 || response?.data?.success) {
        toast.success(isEditMode ? "Case study updated successfully!" : "Case study created successfully!");
        console.log(isEditMode ? "Case study updated successfully:" : "Case study created successfully:", response.data);
        navigate("/hosting-management");
      }
     } catch (err) {
       const errorMessage =
         err.response?.data?.message || (isEditMode ? "Failed to update case study." : "Failed to create case study.");
       console.error(isEditMode ? "Error updating case study:" : "Error creating case study:", err);
       toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/hosting-management');
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
    console.log('Panel input changed:', e.target.value);
    setPanelInput(e.target.value);
  };

  const addPanelMember = () => {
    const link = panelInput.trim();
    console.log('Adding panel member:', link);
    console.log('Current panel members:', panelMembers);
    
    // Basic URL validation
    const urlRegex = /^https?:\/\/.+/;
    console.log('URL validation result:', urlRegex.test(link));
    console.log('Already exists:', panelMembers.includes(link));
    
    if (link && urlRegex.test(link) && !panelMembers.includes(link)) {
      const newPanelMembers = [...panelMembers, link];
      console.log('Setting new panel members:', newPanelMembers);
      setPanelMembers(newPanelMembers);
      setPanelInput('');
    } else {
      console.log('Validation failed - link:', link, 'valid:', urlRegex.test(link), 'exists:', panelMembers.includes(link));
    }
  };

  const removePanelMember = (link) => setPanelMembers(panelMembers.filter(pid => pid !== link));

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

  // handlers for problem statements
  const addProblemStatement = () => {
    setFormData(prev => ({
      ...prev,
      problemStatements: [...prev.problemStatements, {
        title: '',
        description: '',
        technology: []
      }]
    }));
    
    // Clear the general error when adding a new one
    if (errors.problemStatements) {
      setErrors(prev => ({
        ...prev,
        problemStatements: ''
      }));
    }
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

    // Clear the specific error when field is updated
    const errorKey = `problem${field.charAt(0).toUpperCase() + field.slice(1)}${index}`;
    if (errors[errorKey]) {
      setErrors(prev => ({
        ...prev,
        [errorKey]: ''
      }));
    }
    
    // Clear the general problem statements error if this was the last empty statement
    if (errors.problemStatements && value.trim()) {
      const hasOtherEmptyStatements = updatedStatements.some(
        (statement, i) => i !== index && (!statement.title.trim() || !statement.description.trim())
      );
      
      if (!hasOtherEmptyStatements) {
        setErrors(prev => ({
          ...prev,
          problemStatements: ''
        }));
      }
    }
  };

  const removeProblemStatement = (index) => {
    setFormData(prev => ({
      ...prev,
      problemStatements: prev.problemStatements.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#143694]/5 via-[#f093fb]/5 to-[#1e4ed8]/5 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-6 mb-8">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center mb-3">
              <div className="p-2 bg-gradient-to-br from-[#143694]/20 to-[#1e4ed8]/20 rounded-lg mr-3">
                <Trophy className="h-5 w-5 text-[#143694]" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-[#143694] to-[#1e4ed8] bg-clip-text text-transparent">
                {isEditMode ? 'Edit Case Study Event' : 'Host a Case Study Event'}
              </h1>
            </div>
            <p className="text-md text-gray-600 max-w-2xl mx-auto">
              {isEditMode 
                ? 'Update your case study event details to challenge participants with real-world business problems.'
                : 'Create an engaging case study event to challenge participants with real-world business problems.'}
            </p>
          </div>
        </div>

        {/* Form */}
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
          {step === 1 && (  
            <>
              {/* Basic Information */}
              <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
                  <Briefcase className="h-5 w-5 mr-2 text-[#143694]" />
                  Basic Information
                </h2>
                <p className="text-sm text-gray-600 mb-6">Provide the essential details about your case study event.</p>
                
                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Case Study Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#143694]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white ${
                        errors.title ? 'border-red-300' : 'border-gray-200'
                      }`}
                      placeholder="Enter case study title"
                    />
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                  </div>
                  
                  {/* Subtitle */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Case Study Sub-Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="subTitle"
                      value={formData.subTitle}
                      onChange={handleInputChange}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#143694]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white ${
                        errors.subTitle ? 'border-red-300' : 'border-gray-200'
                      }`}
                      placeholder="Enter case study sub-title"
                    />
                    {errors.subTitle && <p className="text-red-500 text-sm mt-1">{errors.subTitle}</p>}
                  </div>
                
                  {/* Contact Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-gray-500" />
                      Contact Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="contactEmail"
                      value={formData.contactEmail}
                      onChange={handleInputChange}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#143694]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white ${
                        errors.contactEmail ? 'border-red-300' : 'border-gray-200'
                      }`}
                      placeholder="contact@company.com"
                    />
                    {errors.contactEmail && <p className="text-red-500 text-sm mt-1">{errors.contactEmail}</p>}
                  </div>
                  
                  {/* Description */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description <span className="text-red-500">*</span></label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#143694]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white ${
                        errors.description ? 'border-red-300' : 'border-gray-200'
                      }`}
                      placeholder="Describe your case study, themes, and what participants can expect..."
                    />
                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                  </div>
                </div>
              </div>

              {/* Logo Upload */}
              <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-[#143694]" />
                  Event Logo
                </h2>
                <p className="text-sm text-gray-600 mb-6">Upload a logo for your case study event.</p>

                <div className="flex flex-col items-center">
                  {/* Circular upload area */}
                  <div className="relative mb-4">
                    <label
                      htmlFor="logo-upload"
                      className="flex items-center justify-center h-40 w-40 rounded-full border-2 border-dashed border-gray-300 cursor-pointer overflow-hidden bg-gradient-to-r from-gray-50 to-white hover:border-gray-400 transition-colors duration-200"
                    >
                      {formData.logoPreview ? (
                        <img
                          src={formData.logoPreview}
                          alt="Logo Preview"
                          className="h-full w-full object-cover rounded-full"
                        />
                      ) : (
                        <div className="text-center p-4">
                          <div className="mx-auto w-12 h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center mb-2">
                            <FileText className="h-6 w-6 text-gray-500" />
                          </div>
                          <span className="text-gray-500 text-sm">Click to upload logo</span>
                        </div>
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
                              logoPreview: reader.result,
                            }));
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </div>
                  
                  {formData.logoPreview && (
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, logo: '', logoPreview: '' }))}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Remove Logo
                    </button>
                  )}
                  
                  {errors.logo && (
                    <p className="text-red-500 text-sm mt-2">{errors.logo}</p>
                  )}
                </div>
              </div>

              {/* Problem Statements */}
              <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                    <Target className="h-5 w-5 mr-2 text-[#143694]" />
                    Problem Statements
                  </h2>
                  <button
                    type="button"
                    onClick={addProblemStatement}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white rounded-lg hover:shadow-lg hover:shadow-[#143694]/30 focus:outline-none focus:ring-2 focus:ring-[#143694]/50 transition-all duration-200"
                  >
                    <Plus className="h-4 w-4" />
                    Add Problem
                  </button>
                </div>
                <div className="space-y-6">
                  {formData.problemStatements.map((problem, index) => (
                    <div key={index} className="border border-gray-200 rounded-xl p-6 bg-gradient-to-r from-gray-50 to-white">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <input
                            type="text"
                            value={problem.title}
                            onChange={(e) => updateProblemStatement(index, 'title', e.target.value)}
                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#143694]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-white ${
                              errors[`problemTitle${index}`] ? 'border-red-300' : 'border-gray-200'
                            }`}
                            placeholder="Problem Title"
                          />
                          {errors[`problemTitle${index}`] && (
                            <p className="text-red-500 text-sm mt-1">{errors[`problemTitle${index}`]}</p>
                          )}
                        </div>
                        {formData.problemStatements.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeProblemStatement(index)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg ml-2 transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <textarea
                            value={problem.description}
                            onChange={(e) => updateProblemStatement(index, 'description', e.target.value)}
                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#143694]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-white ${
                              errors[`problemDescription${index}`] ? 'border-red-300' : 'border-gray-200'
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
                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#143694]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-white ${
                              errors[`problemTechnology${index}`] ? 'border-red-300' : 'border-gray-200'
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

              {/* Eligibility */}
              <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
                  <GraduationCap className="h-5 w-5 mr-2 text-[#143694]" />
                  Eligibility
                </h2>
                <p className="text-sm text-gray-600 mb-4">Specify who can participate in this case study.</p>
                <textarea
                  name="eligibility"
                  value={formData.eligibility}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#143694]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white"
                  placeholder="Specify who can participate in this case study..."
                />
              </div>

              {/* Domains */}
              <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                    <BookOpen className="h-5 w-5 mr-2 text-[#143694]" />
                    Domains
                  </h2>
                  <button
                    type="button"
                    onClick={addDomain}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white rounded-lg hover:shadow-lg hover:shadow-[#143694]/30 focus:outline-none focus:ring-2 focus:ring-[#143694]/50 transition-all duration-200"
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
                        className="flex-1 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#143694]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white"
                        placeholder="Enter domain (e.g., AI/ML, Web Development)"
                      />
                      {formData.domains.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeDomain(index)}
                          className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Visibility Settings */}
              <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
                  <Globe className="h-5 w-5 mr-2 text-[#143694]" />
                  Visibility & Mode
                </h2>
                <p className="text-sm text-gray-600 mb-6">Configure how your case study will be accessed and conducted.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Visibility */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Visibility <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="visibility"
                      value={formData.visibility}
                      onChange={handleInputChange}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#143694]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white ${
                        errors.visibility ? 'border-red-300' : 'border-gray-200'
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
                  
                  {/* Mode */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mode <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="mode"
                      value={formData.mode}
                      onChange={handleInputChange}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#143694]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white ${
                        errors.mode ? 'border-red-300' : 'border-gray-200'
                      }`}
                    >
                      <option value="">Select mode</option>
                      <option value="Online">Online</option>
                      <option value="Offline">Offline</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                    {errors.mode && (
                      <p className="text-red-500 text-sm mt-1">{errors.mode}</p>
                    )}
                  </div>

                  {/* Participation Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Participation Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="participationType"
                      value={formData.participationType}
                      onChange={handleInputChange}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#143694]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white ${
                        errors.participationType ? 'border-red-300' : 'border-gray-200'
                      }`}
                    >
                      <option value="">Select type</option>
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
              <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-[#143694]" />
                  Event Details
                </h2>
                <p className="text-sm text-gray-600 mb-6">Set the timeline and location for your case study.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Start Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#143694]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white ${
                        errors.startDate ? 'border-red-300' : 'border-gray-200'
                      }`}
                    />
                    {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
                  </div>

                  {/* End Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#143694]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white ${
                        errors.endDate ? 'border-red-300' : 'border-gray-200'
                      }`}
                    />
                    {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
                  </div>

                  {/* Registration Deadline */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Registration Deadline <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      name="registrationDeadline"
                      value={formData.registrationDeadline}
                      onChange={handleInputChange}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#143694]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white ${
                        errors.registrationDeadline ? 'border-red-300' : 'border-gray-200'
                      }`}
                    />
                    {errors.registrationDeadline && <p className="text-red-500 text-sm mt-1">{errors.registrationDeadline}</p>}
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                      Location <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#143694]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white ${
                        errors.location ? 'border-red-300' : 'border-gray-200'
                      }`}
                      placeholder="City, State or Virtual"
                    />
                    {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                  </div>
                </div>
              </div>

              {/* Case Study Rounds */}
              <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-[#143694]" />
                  Case Study Rounds
                </h2>
                <p className="text-sm text-gray-600 mb-6">Configure the stages of your case study competition.</p>
                
                <div className="space-y-6">
                  {/* Number of Rounds */}
                  <div className="max-w-xs">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Rounds <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.numberOfRounds}
                      onChange={(e) => updateNumberOfRounds(parseInt(e.target.value))}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#143694]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white"
                    >
                      {[1, 2, 3, 4, 5].map(num => (
                        <option key={num} value={num}>{num} Round{num > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>

                  {/* Individual Rounds */}
                  {formData.rounds.map((round, index) => (
                    <div key={index} className="border border-gray-200 rounded-xl p-6 bg-gradient-to-r from-gray-50 to-white">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        {round.roundName}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Round Name
                          </label>
                          <input
                            type="text"
                            value={round.roundName}
                            onChange={(e) => updateRoundData(index, 'roundName', e.target.value)}
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#143694]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-white"
                            placeholder={`Round ${index + 1}`}
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                          </label>
                          <input
                            type="text"
                            value={round.description}
                            onChange={(e) => updateRoundData(index, 'description', e.target.value)}
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#143694]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-white"
                            placeholder="Brief about this round"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Start Date <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="datetime-local"
                            value={round.startDate}
                            onChange={(e) => updateRoundData(index, 'startDate', e.target.value)}
                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#143694]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-white ${
                              errors[`round${index}StartDate`] ? 'border-red-300' : 'border-gray-200'
                            }`}
                          />
                          {errors[`round${index}StartDate`] && (
                            <p className="text-red-500 text-sm mt-1">{errors[`round${index}StartDate`]}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            End Date <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="datetime-local"
                            value={round.endDate}
                            onChange={(e) => updateRoundData(index, 'endDate', e.target.value)}
                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#143694]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-white ${
                              errors[`round${index}EndDate`] ? 'border-red-300' : 'border-gray-200'
                            }`}
                          />
                          {errors[`round${index}EndDate`] && (
                            <p className="text-red-500 text-sm mt-1">{errors[`round${index}EndDate`]}</p>
                          )}
                        </div>
                        
                        {/* Input Type */}
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Input Type <span className="text-red-500">*</span>
                          </label>
                          <select
                            name="inputType"
                            value={round.inputType}
                            onChange={(e) => updateRoundData(index, 'inputType', e.target.value)}
                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#143694]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-white ${
                              errors[`round${index}InputType`] ? 'border-red-300' : 'border-gray-200' 
                            }`}
                          >
                            <option value="">Select input type</option>
                            <option value="link">Link</option>
                            <option value="doc">Document</option>
                            <option value="pdf">PDF</option>
                            <option value="ppt">PowerPoint</option>
                          </select>
                          {errors[`round${index}InputType`] && (
                            <p className="text-red-500 text-sm mt-1">{errors[`round${index}InputType`]}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next Button */}
              <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-8 py-3 bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white rounded-lg font-medium hover:shadow-lg hover:shadow-[#143694]/30 focus:outline-none focus:ring-2 focus:ring-[#143694]/50 transition-all duration-200"
                >
                  Next
                </button>
              </div>
            </>
          )}
          
          {step === 2 && (
            <>
              {/* Participation */}
              <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
                  <Users className="h-5 w-5 mr-2 text-[#143694]" />
                  Participation Limits
                </h2>
                <p className="text-sm text-gray-600 mb-6">Configure participation limits based on the selected type.</p>
                
                <div className="space-y-6">
                  {/* Individual Participation */}
                  {(formData.participationType === 'Individual' || formData.participationType === 'Both') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <Users className="h-4 w-4 mr-2 text-gray-500" />
                        Max Individual Participants <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="maxParticipants"
                        value={formData.maxParticipants}
                        onChange={handleInputChange}
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#143694]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white ${
                          errors.maxParticipants ? 'border-red-300' : 'border-gray-200'
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
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                          <Users className="h-4 w-4 mr-2 text-gray-500" />
                          Max Teams <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          name="maxTeams"
                          value={formData.maxTeams}
                          onChange={handleInputChange}
                          className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#143694]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white ${
                            errors.maxTeams ? 'border-red-300' : 'border-gray-200'
                          }`}
                          placeholder="e.g., 25"
                          min="1"
                        />
                        {errors.maxTeams && <p className="text-red-500 text-sm mt-1">{errors.maxTeams}</p>}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Min Team Members <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            name="minTeamMembers"
                            value={formData.minTeamMembers}
                            onChange={handleInputChange}
                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#143694]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white ${
                              errors.minTeamMembers ? 'border-red-300' : 'border-gray-200'
                            }`}
                            placeholder="e.g., 2"
                            min="1"
                          />
                          {errors.minTeamMembers && <p className="text-red-500 text-sm mt-1">{errors.minTeamMembers}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Max Team Members <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            name="maxTeamMembers"
                            value={formData.maxTeamMembers}
                            onChange={handleInputChange}
                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#143694]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white ${
                              errors.maxTeamMembers ? 'border-red-300' : 'border-gray-200'
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
              <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
                  <Trophy className="h-5 w-5 mr-2 text-[#143694]" />
                  Rewards & Prizes
                </h2>
                <p className="text-sm text-gray-600 mb-6">Set up rewards and prizes for the winners.</p>
                
                <div className="space-y-6">
                  {/* Reward Type Selector */}
                  <div className="max-w-xs">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Reward Type</label>
                    <select
                      value={formData.rewards.rewardType}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        rewards: { ...prev.rewards, rewardType: e.target.value }
                      }))}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#143694]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white"
                    >
                      <option value="Amount">Amount</option>
                      <option value="Perks">Perks/Gifts</option>
                    </select>
                  </div>  
                  
                  {/* Main Prizes */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Main Prizes</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* 1st Place */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          🥇 1st Place <span className="text-red-500">*</span>
                        </label>
                        {formData.rewards.rewardType === 'Amount' ? (
                          <input
                            type="number"
                            value={formData.rewards.firstPlace}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              rewards: { ...prev.rewards, firstPlace: e.target.value }
                            }))}
                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#143694]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white ${
                              errors.firstPlace ? 'border-red-300' : 'border-gray-200'
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
                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#143694]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white ${
                              errors.firstPlace ? 'border-red-300' : 'border-gray-200'
                            }`}
                            placeholder="e.g., MacBook, Gift Hamper"
                          />
                        )}                 
                        {errors.firstPlace && <p className="text-red-500 text-sm mt-1">{errors.firstPlace}</p>}
                      </div>

                      {/* 2nd Place */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          🥈 2nd Place <span className="text-red-500">*</span>
                        </label>
                        {formData.rewards.rewardType === 'Amount' ? (
                          <input
                            type="number"
                            value={formData.rewards.secondPlace}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              rewards: { ...prev.rewards, secondPlace: e.target.value }
                            }))}
                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#143694]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white ${
                              errors.secondPlace ? 'border-red-300' : 'border-gray-200'
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
                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#143694]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white ${
                              errors.secondPlace ? 'border-red-300' : 'border-gray-200'
                            }`}
                            placeholder="e.g., Headphones, Swag Kit"
                          />
                        )}
                        {errors.secondPlace && <p className="text-red-500 text-sm mt-1">{errors.secondPlace}</p>}
                      </div>

                      {/* 3rd Place */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          🥉 3rd Place <span className="text-red-500">*</span>
                        </label>
                        {formData.rewards.rewardType === 'Amount' ? (
                          <input
                            type="number"
                            value={formData.rewards.thirdPlace}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              rewards: { ...prev.rewards, thirdPlace: e.target.value }
                            }))}
                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#143694]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white ${
                              errors.thirdPlace ? 'border-red-300' : 'border-gray-200'
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
                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#143694]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white ${
                              errors.thirdPlace ? 'border-red-300' : 'border-gray-200'
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
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">Special Awards</h3>
                      <button
                        type="button"
                        onClick={addSpecialAward}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white rounded-lg hover:shadow-lg hover:shadow-[#143694]/30 focus:outline-none focus:ring-2 focus:ring-[#143694]/50 transition-all duration-200"
                      >
                        <Plus className="h-4 w-4" />
                        Add Award
                      </button>
                    </div>

                    {formData.rewards.specialAwards.length === 0 ? (
                      <p className="text-gray-500 text-sm bg-gray-50 p-4 rounded-lg">No special awards added yet.</p>
                    ) : (
                      <div className="space-y-4">
                        {formData.rewards.specialAwards.map((award, index) => (
                          <div key={index} className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl bg-gradient-to-r from-gray-50 to-white">
                            <div className="flex-1">
                              <input
                                type="text"
                                value={award.name}
                                onChange={(e) => updateSpecialAward(index, 'name', e.target.value)}
                                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#143694]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-white"
                                placeholder="Award name (e.g., Best Innovation, Most Creative)"
                              />
                            </div>
                            
                            {/* Reward Type Selector */}
                            <div className="w-40">
                              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                              <select
                                value={award.rewardType || 'Perks'}
                                onChange={(e) => updateSpecialAward(index, 'rewardType', e.target.value)}
                                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#143694]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-white"
                              >
                                <option value="Amount">Amount</option>
                                <option value="Perks">Perks/Gifts</option>
                              </select>
                            </div>
                            
                            {award.rewardType === 'Amount' ? (
                              <div className="w-32">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                                <input
                                  type="number"
                                  value={award.amount || ''}
                                  onChange={(e) => updateSpecialAward(index, 'amount', e.target.value)}
                                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#143694]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-white"
                                  placeholder="Amount"
                                  min="0"
                                />
                              </div>
                            ) : (
                              <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <input
                                  type="text"
                                  value={award.perk || ''}
                                  onChange={(e) => updateSpecialAward(index, 'perk', e.target.value)}
                                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#143694]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-white"
                                  placeholder="Perk/Gift description"
                                />
                              </div>
                            )} 
                          
                            <button
                              type="button"
                              onClick={() => removeSpecialAward(index)}
                              className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
              <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-[#143694]" />
                  FAQs
                </h2>
                <p className="text-sm text-gray-600 mb-6">Add frequently asked questions for participants.</p>
                
                {faqs.map((faq, idx) => (
                  <div key={idx} className="mb-4 flex gap-2 items-start">
                    <div className="flex-1 space-y-3">
                      <input
                        type="text"
                        placeholder="Question"
                        value={faq.question}
                        onChange={e => handleFaqChange(idx, 'question', e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#143694]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white"
                      />
                      <textarea
                        placeholder="Answer"
                        value={faq.answer}
                        onChange={e => handleFaqChange(idx, 'answer', e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#143694]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white"
                        rows={2}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFaq(idx)}
                      className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-2"
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
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white rounded-lg hover:shadow-lg hover:shadow-[#143694]/30 focus:outline-none focus:ring-2 focus:ring-[#143694]/50 transition-all duration-200"
                >
                  <Plus className="h-4 w-4" />
                  Add FAQ
                </button>
              </div>

              {/* Panel Members Section */}
              <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
                  <Users className="h-5 w-5 mr-2 text-[#143694]" />
                  Panel Members
                </h2>
                <p className="text-sm text-gray-600 mb-6">Add links to panel members' profiles (LinkedIn, Portfolio, etc.)</p>
                
                <div className="flex gap-2 mb-4">
                  <input
                    type="url"
                    placeholder="Enter Panel Member Link (LinkedIn, Portfolio, etc.)"
                    value={panelInput}
                    onChange={handlePanelInputChange}
                    className="flex-1 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#143694]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      addPanelMember();
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white rounded-lg hover:shadow-lg hover:shadow-[#143694]/30 focus:outline-none focus:ring-2 focus:ring-[#143694]/50 transition-all duration-200"
                  >
                    Add
                  </button>
                </div>
                
                {panelMembers.length > 0 && (
                  <div className="space-y-2">
                    {panelMembers.map((link, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gradient-to-r from-gray-50 to-white">
                        <div className="flex items-center gap-2">
                          <Link className="h-4 w-4 text-gray-500" />
                          <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate">
                            {link}
                          </a>
                        </div>
                        <button
                          type="button"
                          onClick={() => removePanelMember(link)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Additional Information */}
              <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
                  <Globe className="h-5 w-5 mr-2 text-[#143694]" />
                  Additional Information
                </h2>
                <p className="text-sm text-gray-600 mb-6">Provide additional details, requirements, and rules for participants.</p>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Requirements</label>
                    <textarea
                      name="requirements"
                      value={formData.requirements}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#143694]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white"
                      placeholder="Technical requirements, skills needed, etc."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rules & Guidelines</label>
                    <textarea
                      name="rules"
                      value={formData.rules}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#143694]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white"
                      placeholder="Case study rules, submission guidelines, etc."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                    <input
                      type="text"
                      name="tags"
                      value={formData.tags}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#143694]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white"
                      placeholder="AI, Web Development, Mobile App, etc. (comma separated)"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-6 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200"
                >
                  Back to Basic Details
                </button>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white rounded-lg font-medium hover:shadow-lg hover:shadow-[#143694]/30 focus:outline-none focus:ring-2 focus:ring-[#143694]/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        {isEditMode ? 'Updating...' : 'Creating...'}
                      </>
                    ) : (
                      <>
                        <Trophy className="h-4 w-4" />
                        {isEditMode ? 'Update Case Study' : 'Create Case Study'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default HostCasestudies;
