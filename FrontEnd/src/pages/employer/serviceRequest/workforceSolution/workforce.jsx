import { useState } from "react";
import { useNavigate } from "react-router-dom"; // NEW: Added useNavigate
import { useLegacyAuth } from "../../../../context/AuthProvider";
import MainPage from "./Main";
import RegisterPage from "./RegisterPage";
import RequestInfo from "./RequestInfo";
import "react-datepicker/dist/react-datepicker.css";
import { createWorkforceRequest } from "@/lib/Company_AxiosInstance";

export default function EmployerWorkforce() {
  const navigate = useNavigate();
  const [authUser] = useLegacyAuth();
  const [showRegistration, setShowRegistration] = useState(false);
  const [showRequestInfo, setShowRequestInfo] = useState(false);

  const initialFormData = {
    date: "",
    time: "",
    message: "",
    acceptTerms: false,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [startDate, setStartDate] = useState(null);

  // --- Handlers ---
  const checkAuthentication = (actionType) => {
    const token = localStorage.getItem("token");
    const authUser = localStorage.getItem("ChatAppUser");

    const isAuthenticated = token && authUser;

    if (!isAuthenticated) {
      sessionStorage.removeItem("tempSelectedRole");
      localStorage.setItem(
        "redirectAfterAuth",
        "/service-request/workforce-solution",
      );
      localStorage.setItem("intendedAction", actionType);

      navigate("/userselection");
      return false;
    }
    return true;
  };

  const handleRegisterClick = () => {
    
      setShowRegistration(true);
    
  };

  // const handleRequestInfoClick = () => {

  //     setShowRequestInfo(true);

  // };

  const handleRequestInfoClick = () => {
    if (checkAuthentication("register")) {
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
    if (!formData.acceptTerms) {
      alert("You must accept the terms before submitting.");
      return;
    }

    if (!formData.date || !formData.time) {
      alert("Please select a date and time.");
      return;
    }

    try {
      const response = await createWorkforceRequest(formData);
      alert("Request submitted successfully!");
      setFormData(initialFormData);
      setStartDate(null);
      setShowRegistration(false);
    } catch (error) {
      console.error("Error submitting request:", error);
      alert("Failed to submit request. Please try again.");
    }
  };

  // --- Render ---
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {showRequestInfo ? (
        <RequestInfo onBackClick={handleBackClick} />
      ) : showRegistration ? (
        <RegisterPage
          onBackClick={handleBackClick}
          formData={formData}
          handleInputChange={handleInputChange}
          startDate={startDate}
          handleDateChange={handleDateChange}
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
