import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // NEW: Added useNavigate
import { useLegacyAuth } from '../../../../context/AuthProvider'; // NEW: Added useAuth
import MainPage from './MainPage';
import RegisterPage from './RegisterPage';
import RequestInfo from './RequestInfo';
import { createCollegeSeminarRequest } from '@/lib/College_AxiosIntance';

export default function Seminar() {
  const navigate = useNavigate(); 
  const [authUser] = useLegacyAuth(); 
  const [showRegistration, setShowRegistration] = useState(false);
  const [showRequestInfo, setShowRequestInfo] = useState(false);
  const initialFormData = {
    date: "",
    time: "",
    message: "",
    acceptTerms: false
  };
  const [formData, setFormData] = useState(initialFormData);

  const checkAuthentication = (actionType) => {
  const token = localStorage.getItem('token');
  const authUser = localStorage.getItem('ChatAppUser');

  const isAuthenticated = token && authUser;
  
  if (!isAuthenticated) {
    sessionStorage.removeItem('tempSelectedRole');
    localStorage.setItem('redirectAfterAuth', '/service-request/seminars');
    localStorage.setItem('intendedAction', actionType);
    
    navigate('/userselection');
    return false;
  }
  return true;
};

  // NEW: Updated click handlers to check authentication
  const handleRegisterClick = () => {
    if (checkAuthentication('register')) {
      setShowRegistration(true);
    }
  };

  const handleRequestInfoClick = () => {
    if (checkAuthentication('requestInfo')) {
      setShowRequestInfo(true);
    }
  };

  const handleBackClick = () => {
    setShowRegistration(false);
    setShowRequestInfo(false);
  };

const handleInputChange = (e) => {
  const { name, value, type, checked } = e.target;
  setFormData({
    ...formData,
    [name]: type === 'checkbox' ? checked : value,
  });
};


// const handleSubmitRegisterPage = async () => {
//   try {
//     const response = await fetch(`${import.meta.env.VITE_Backend_URL}/api/rawrecruit/seminarrequest`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(formData),
//     });

//     if (response.ok) {
//       alert("Seminar Request submitted!");
//       setShowRegistration(false);
//     } else {
//       const error = await response.text();
//       alert("Submission failed: " + error);
//     }
//   } catch (err) {
//     console.error("Submission error:", err);
//     alert("Error submitting form: " + err.message);
//   }
// };


const handleSubmitRequestInfo = async () => {
       if (!formData.acceptTerms) {
        alert("You must accept the terms before submitting.");
        return;
      }
      if (!formData.date || !formData.time) {
        alert("Please select a date and time.");
        return;
      }
      try{
       const response = await createCollegeSeminarRequest(formData);
        alert("Request submitted successfully!");
        setFormData(initialFormData);
        setShowRequestInfo(false);
      }
      catch(error){
        console.error("Error submitting request:", error);
        alert("Failed to submit request. Please try again.");
      }
    };


  return (
  <div className="min-h-screen bg-gray-50 font-sans">
    {showRequestInfo ? (
      <RequestInfo 
        onBackClick={handleBackClick}
        handleSubmit={handleSubmitRequestInfo}
      />
    ) : showRegistration ? (
      <RegisterPage 
        onBackClick={handleBackClick}
        formData={formData}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmitRequestInfo} // separate handler for this
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