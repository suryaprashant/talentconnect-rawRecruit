import { useState } from 'react';
import MainPage from './Main';
import RegisterPage from './RegisterPage';
import RequestInfo from './RequestInfo';
import axios from 'axios';
import { createOnCampusPlacementRequest } from '@/lib/College_AxiosIntance';


export default function CampusPlacement() {
  const [showRegistration, setShowRegistration] = useState(false);
  const [showRequestInfo, setShowRequestInfo] = useState(false);
   const initialFormData = {
    date: "",
    time: "",
    message: "",
    acceptTerms: false
  };
  const [formData, setFormData] = useState(initialFormData);

  const handleRegisterClick = () => setShowRegistration(true);
  const handleRequestInfoClick = () => setShowRequestInfo(true);
  const handleBackClick = () => {
    setShowRegistration(false);
    setShowRequestInfo(false);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async () => {
     if (!formData.acceptTerms) {
      alert("You must accept the terms before submitting.");
      return;
    }
    if (!formData.date || !formData.time) {
      alert("Please select a date and time.");
      return;
    }
    try{
     const response = await createOnCampusPlacementRequest(formData);
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
          formData={formData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
        />
      ) : showRegistration ? (
        <RegisterPage 
          onBackClick={handleBackClick}
          formData={formData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
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
