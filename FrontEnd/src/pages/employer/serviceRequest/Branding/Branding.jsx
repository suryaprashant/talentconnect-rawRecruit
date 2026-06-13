// import { useState } from 'react';
// import MainPage from './MainPage';
// import RegisterPage from './RegisterPage';
// import RequestInfo from './RequestInfo';

// export default function EmployerBranding() {
//   const [showRegistration, setShowRegistration] = useState(false);
//   const [showRequestInfo, setShowRequestInfo] = useState(false);
//   const [formData, setFormData] = useState({
//     date: "",
//     time: "",
//     message: "",
//     acceptTerms: false
//   });

//   const handleRegisterClick = () => setShowRegistration(true);
//   const handleRequestInfoClick = () => setShowRequestInfo(true);
//   const handleBackClick = () => {
//     setShowRegistration(false);
//     setShowRequestInfo(false);
//   };

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData({
//       ...formData,
//       [name]: type === 'checkbox' ? checked : value
//     });
//   };

//   const handleSubmit = () => {
//     console.log("Form submitted:", formData);
//     alert("Form submitted successfully!");
//     setShowRegistration(false);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 font-sans">
//       {showRequestInfo ? (
//         <RequestInfo onBackClick={handleBackClick}
//         // formData={formData} 
//         // handleInputChange={handleInputChange}
//         // handleSubmit={handleSubmit}
//         />
//       ) : showRegistration ? (
//         <RegisterPage 
//           onBackClick={handleBackClick}
//           formData={formData}
//           handleInputChange={handleInputChange}
//           handleSubmit={handleSubmit}
//         />
//       ) : (
//         <MainPage 
//           onRegisterClick={handleRegisterClick}
//           onRequestInfoClick={handleRequestInfoClick}
//         />
//       )}
//     </div>
//   );
// }


import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // NEW: Added useNavigate
import { useLegacyAuth } from '../../../../context/AuthProvider'; 
import MainPage from './MainPage';
import RegisterPage from './RegisterPage';
import RequestInfo from './RequestInfo'
import { createBrandingRequest } from '@/lib/Company_AxiosInstance';

export default function Branding() {
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
    localStorage.setItem('redirectAfterAuth', '/service-request/branding');
    localStorage.setItem('intendedAction', actionType);
    
    navigate('/userselection');
    return false;
  }
  return true;
};

  
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
      [name]: type === 'checkbox' ? checked : value
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
      try{
       const response = await createBrandingRequest(formData);
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
        <RequestInfo onBackClick={handleBackClick}
        // formData={formData} 
        // handleInputChange={handleInputChange}
        // handleSubmit={handleSubmit}
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