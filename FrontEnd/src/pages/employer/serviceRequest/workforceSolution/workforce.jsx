import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useLegacyAuth } from '../../../../context/AuthProvider'; 
import MainPage from "./Main";
import RegisterPage from "./RegisterPage";
import RequestInfo from "./RequestInfo";
import "react-datepicker/dist/react-datepicker.css";

export default function EmployerWorkforce() {
  const navigate = useNavigate(); 
  const [authUser] = useLegacyAuth(); 
  const [showRegistration, setShowRegistration] = useState(false);
  const [showRequestInfo, setShowRequestInfo] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const initialFormData = {
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    message: "",
    acceptTerms: false,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [startDate, setStartDate] = useState(null);

  // --- Handlers ---
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
    if (checkAuthentication('register')) {
      setShowRegistration(true);
      setSubmitError('');
    }
  };

  const handleRequestInfoClick = () => {
    if (checkAuthentication('requestInfo')) {
      setShowRequestInfo(true);
      setSubmitError('');
    }
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
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleDateChange = (date) => {
    setStartDate(date);
    setFormData({
      ...formData,
      date: date ? date.toISOString().split("T")[0] : "",
    });
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.name || !formData.email || !formData.phone || !formData.date || !formData.time || !formData.message) {
      setSubmitError('Please fill all required fields.');
      return;
    }

    if (!formData.acceptTerms) {
      setSubmitError('Please accept the Terms & Conditions.');
      return;
    }

    // Email validation
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(formData.email)) {
      setSubmitError('Please enter a valid email address.');
      return;
    }

    // Phone validation (10 digits)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone.replace(/\D/g, ''))) {
      setSubmitError('Please enter a valid 10-digit phone number.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      // Prepare payload
      const payload = {
        name: formData.name.trim(),
        email: formData.email.toLowerCase().trim(),
        phone: formData.phone.trim(),
        date: formData.date,
        time: formData.time,
        type:"work-force",
        message: formData.message.trim(),
        acceptTerms: formData.acceptTerms
      };

      console.log('Submitting payload:', payload);

      // ✅ Direct API Call using /api/rawrecruit/reqinfo
      const response = await fetch(`${import.meta.env.VITE_Backend_URL}/api/rawrecruit/reqinfo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload)
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      let data;

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const textResponse = await response.text();
        if (textResponse.includes('<!DOCTYPE') || textResponse.includes('<html')) {
          throw new Error('API endpoint not found. Please check the URL.');
        }
        throw new Error(textResponse || 'Server returned invalid response');
      }

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

  // --- Render ---
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