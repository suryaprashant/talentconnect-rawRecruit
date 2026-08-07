import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLegacyAuth } from '../../../../context/AuthProvider';
import MainPage from './MainPage';
import RegisterPage from './RegisterPage';
import RequestInfo from './RequestInfo';

export default function OnCampusHiring() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
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
    termsAccepted: false
  };
  
  const [formData, setFormData] = useState(initialFormData);

  // Authentication check for button clicks
  const checkAuthentication = (actionType) => {
    const token = localStorage.getItem('token');
    const authUser = localStorage.getItem('ChatAppUser');

    const isAuthenticated = token && authUser;
    
    if (!isAuthenticated) {
      sessionStorage.removeItem('tempSelectedRole');
      localStorage.setItem('redirectAfterAuth', '/hiring-channels/on-campus-hiring');
      localStorage.setItem('intendedAction', actionType);
      
      navigate('/userselection');
      return false;
    }
    return true;
  };

  const view = searchParams.get('view');

  // Updated click handlers to check authentication
  const handleRegisterClick = () => {
    if (checkAuthentication('register')) {
      setSearchParams({ view: 'register' });
      setSubmitError('');
    }
  };

  const handleRequestInfoClick = () => {
    
      setSearchParams({ view: 'requestInfo' });
      setSubmitError('');
    
  };

  const handleBackClick = () => {
    setSearchParams({});
    setSubmitError('');
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
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
        type:"on-campus",
        message: formData.message.trim(),
        acceptTerms: formData.acceptTerms
      };

      console.log('Submitting payload:', payload);

      const response = await fetch(`${import.meta.env.VITE_Backend_URL}/api/rawrecruit/reqinfo`, {
        method: "POST",
        withCredentials: true,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Form submitted successfully!");
        setFormData(initialFormData);
        setSearchParams({});
      } else {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { error: errorText };
        }
        setSubmitError(errorData.error || "Submission failed");
      }
    } catch (err) {
      console.error("Error submitting request:", err);
      setSubmitError(`An error occurred: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {view === 'register' ? (
        <RequestInfo 
          onBackClick={handleBackClick}
          formData={formData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitError={submitError}
        />
      ) : view === 'requestInfo' ? (
        <RegisterPage 
          onBackClick={handleBackClick}
          formData={formData}
          handleInputChange={handleInputChange}
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