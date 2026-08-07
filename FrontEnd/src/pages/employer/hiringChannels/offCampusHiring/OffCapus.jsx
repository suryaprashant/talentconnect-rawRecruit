import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLegacyAuth } from "../../../../context/AuthProvider";
import MainPage from "./MainPage";
import RegisterPage from "./RegisterPage";
import RequestInfo from "./RequestInfo";

export default function EmployerOffCampus() {
  const navigate = useNavigate();
  const [authUser] = useLegacyAuth();
  const [showRegistration, setShowRegistration] = useState(false);
  const [showRequestInfo, setShowRequestInfo] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    date: "",
    time: "",
    message: "",
    acceptTerms: false,
  });

  const checkAuthentication = (actionType) => {
    const token = localStorage.getItem("token");
    const authUser = localStorage.getItem("ChatAppUser");

    const isAuthenticated = token && authUser;

    if (!isAuthenticated) {
      sessionStorage.removeItem("tempSelectedRole");
      localStorage.setItem(
        "redirectAfterAuth",
        "/hiring-channels/off-campus-hiring/employer",
      );
      localStorage.setItem("intendedAction", actionType);

      navigate("/userselection");
      return false;
    }
    return true;
  };

  const handleRegisterClick = () => {
    
      setShowRegistration(true);
      setSubmitError("");
    
  };

  const handleRequestInfoClick = () => {
    if (checkAuthentication("register")) {
      setShowRequestInfo(true);
      setSubmitError("");
    }
  };

  const handleBackClick = () => {
    setShowRegistration(false);
    setShowRequestInfo(false);
    setSubmitError("");
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
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
    setSubmitError("");

    try {
      // Get token from localStorage
      const token = localStorage.getItem("token");
      const authUser = JSON.parse(localStorage.getItem("ChatAppUser") || "{}");

      // Prepare payload with all form data
      const payload = {
        name: formData.name.trim(),
        email: formData.email.toLowerCase().trim(),
        date: formData.date,
        time: formData.time,
        message: formData.message.trim(),
        acceptTerms: formData.acceptTerms,
        type: "off-campus",
        
      };

      console.log("Submitting payload:", payload);

      // API Call - Replace with your actual API endpoint
      const response = await fetch("/api/off-campus-hiring/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle validation errors from backend
        if (data.errors) {
          const errorMessages = data.errors.map(err => err.message).join(", ");
          throw new Error(errorMessages);
        }
        throw new Error(data.message || "Submission failed");
      }

      // Success
      console.log("Success:", data);
      alert("Your request has been submitted successfully! Our team will contact you soon.");
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        date: "",
        time: "",
        message: "",
        acceptTerms: false,
      });
      
      // Navigate back to main page after success
      setShowRegistration(false);
      
    } catch (error) {
      console.error("Submission error:", error);
      setSubmitError(error.message || "Network error. Please check your connection and try again.");
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
        />
      ) : showRegistration ? (
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