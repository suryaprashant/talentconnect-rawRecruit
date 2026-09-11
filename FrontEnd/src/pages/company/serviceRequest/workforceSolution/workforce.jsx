import { useState } from "react";
import { useNavigate } from 'react-router-dom'; 
import { useLegacyAuth } from '../../../../context/AuthProvider'; 
import MainPage from "./Main";
import RegisterPage from "./RegisterPage";  // ✅ Fixed import
import RequestInfo from "./RequestInfo";    // ✅ Fixed import
import "react-datepicker/dist/react-datepicker.css";

export default function Workforce() {
  const navigate = useNavigate(); 
  const [authUser] = useLegacyAuth(); 
  const [showRegistration, setShowRegistration] = useState(false);
  const [showRequestInfo, setShowRequestInfo] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const initialFormData = {
    name: "",
    email: "",
    date: "",
    time: "",
    message: "",
    acceptTerms: false
  };

  const [formData, setFormData] = useState(initialFormData);
  const [startDate, setStartDate] = useState(null);

  const checkAuthentication = (actionType) => {
    const token = localStorage.getItem('token');
    const authUser = localStorage.getItem('ChatAppUser');

    const isAuthenticated = token && authUser;
    
    if (!isAuthenticated) {
      sessionStorage.removeItem('tempSelectedRole');
      localStorage.setItem('redirectAfterAuth', '/service-request/workforce-solution');
      localStorage.setItem('intendedAction', actionType);

      navigate('/userselection');
      return false;
    }
    return true;
  };

  const handleRegisterClick = () => {
      setShowRegistration(true);
      setSubmitError('');
    
  };

  const handleRequestInfoClick = () => {
    
      setShowRequestInfo(true);
      setSubmitError('');
    
  };

  const handleBackClick = () => {
    setShowRegistration(false);
    setShowRequestInfo(false);
    setSubmitError('');
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleDateChange = (date) => {
    setStartDate(date); 
    setFormData({
      ...formData,
      date: date ? date.toISOString().split('T')[0] : "" 
    });
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.name || !formData.email || !formData.date || !formData.time || !formData.message) {
      setSubmitError("Please fill all required fields.");
      return;
    }

    if (!formData.acceptTerms) {
      setSubmitError("Please accept the Terms & Conditions.");
      return;
    }

    // Email validation
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(formData.email)) {
      setSubmitError("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      // Prepare payload
      const payload = {
        name: formData.name.trim(),
        email: formData.email.toLowerCase().trim(),
        date: formData.date,
        time: formData.time,
        type:"work-force",
        message: formData.message.trim(),
        acceptTerms: formData.acceptTerms
      };

      console.log('Submitting payload:', payload);

      // ✅ Using /api/rawrecruit/reqinfo
      const response = await fetch(`${import.meta.env.VITE_Backend_URL}/api/rawrecruit/reqinfo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          const errorMessages = data.errors.map(err => err.message).join(', ');
          throw new Error(errorMessages);
        }
        throw new Error(data.message || 'Submission failed');
      }

      // Success
      alert('Your request has been submitted successfully! Our team will contact you soon.');
      setFormData(initialFormData);
      setStartDate(null);
      setShowRegistration(false);
      setShowRequestInfo(false);
      
    } catch (error) {
      console.error('Error submitting request:', error);
      setSubmitError(error.message || 'Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {showRequestInfo ? (
        <RequestInfo 
          onBackClick={handleBackClick}
          formData={formData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitError={submitError}
          startDate={startDate}
          handleDateChange={handleDateChange}
        />
      ) : showRegistration ? (
        <RegisterPage
          onBackClick={handleBackClick}
          formData={formData}
          handleInputChange={handleInputChange}
          startDate={startDate}
          handleDateChange={handleDateChange}
          handleSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitError={submitError}
        />
      ) : (
        <MainPage
          onRegisterClick={handleRegisterClick}
          onRequestInfoClick={handleRequestInfoClick}
        />
      )}
    </div>
  );
}