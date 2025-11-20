


import { useState } from 'react';
import MainPage from './MainPage';
import RegisterPage from './RegisterPage';
import { createCollegeBrandingRequest } from '@/lib/College_AxiosIntance';
// Main CampusBranding component
export default function CampusBranding() {
  const [showRequestInfo, setShowRequestInfo] = useState(false);
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    message: "",
    acceptTerms: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleRequestInfoClick = () => setShowRequestInfo(true);
  const handleBackClick = () => {
    setShowRequestInfo(false);
    setSubmitError('');
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    // Clear error when user starts typing
    if (submitError) setSubmitError('');
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.date || !formData.time || !formData.message || !formData.acceptTerms) {
      setSubmitError('Please fill in all fields and accept the terms.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const response = await createCollegeBrandingRequest(formData);
      
      if (response.status === 200 || response.status === 201) {
        console.log("Form submitted successfully:", response.data);
        alert("Form submitted successfully!");
        setShowRequestInfo(false);
        // Reset form
        setFormData({
          date: "",
          time: "",
          message: "",
          acceptTerms: false
        });
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitError('Failed to submit form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {showRequestInfo ? (
        <RegisterPage
          onBackClick={handleBackClick}
          formData={formData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitError={submitError}
        />
      ) : (
        <MainPage onRequestInfoClick={handleRequestInfoClick} />
      )}
    </div>
  );
}