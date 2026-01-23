// import { useState } from 'react';
// import MainPage from './MainPage';
// import RegisterPage from './RegisterPage';
// import RequestInfo from './RequestInfo';

// export default function OnCampusHiring() {
//   const [showRegistration, setShowRegistration] = useState(false);
//   const [showRequestInfo, setShowRequestInfo] = useState(false);
//   const [formData, setFormData] = useState({
//   date: "",
//   time: "",
//   message: "",
//   termsAccepted: false // 🔁 was `acceptTerms`
// });


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

//   const handleSubmit = async () => {
//   try {
//     const response = await fetch(`${import.meta.env.VITE_Backend_URL}/api/rawrecruit/oncampus`, {
//   method: "POST",
//   withCredentials: true, // Ensure cookies are sent with the request
//   credentials: "include", // Include credentials for cross-origin requests
//   headers: {
//     "Content-Type": "application/json",
//   },
//   body: JSON.stringify(formData),
// });


//     if (response.ok) {
//       alert("Form submitted successfully!");
//       setShowRegistration(false);
//     } else {
//       // Safely try to parse error JSON, or fall back to plain text
//       const errorText = await response.text();
//       let errorData;
//       try {
//         errorData = JSON.parse(errorText);
//       } catch {
//         errorData = { error: errorText };
//       }
//       alert(`Submission failed: ${errorData.error}`);
//     }
//   } catch (err) {
//     alert(`An error occurred: ${err.message}`);
//   }
// };

//   return (
//     <div className="min-h-screen bg-gray-50 font-sans">
//       {showRequestInfo ? (
//         <RequestInfo onBackClick={handleBackClick}
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
import { useLegacyAuth } from '../../../../context/AuthProvider'; // NEW: Added useAuth
import MainPage from './MainPage';
import RegisterPage from './RegisterPage';
import RequestInfo from './RequestInfo';

export default function OnCampusHiring() {
  const navigate = useNavigate(); // NEW: Added navigate
  const [authUser] = useLegacyAuth(); // NEW: Added auth context
  const [showRegistration, setShowRegistration] = useState(false);
  const [showRequestInfo, setShowRequestInfo] = useState(false);
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    message: "",
    termsAccepted: false
  });

  // NEW: Authentication check for button clicks
  const checkAuthentication = (actionType) => {
    const isAuthenticated = authUser?.user || localStorage.getItem('token');
    
    if (!isAuthenticated) {
      // Store the current hiring channel route for redirect after auth
      localStorage.setItem('redirectAfterAuth', '/hiring-channels/on-campus-hiring');
      // Store the intended action (register or requestInfo)
      localStorage.setItem('intendedAction', actionType);
      // Redirect to role selection for signup/login
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
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_Backend_URL}/api/rawrecruit/oncampus`, {
        method: "POST",
        withCredentials: true,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Form submitted successfully!");
        setShowRegistration(false);
      } else {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { error: errorText };
        }
        alert(`Submission failed: ${errorData.error}`);
      }
    } catch (err) {
      alert(`An error occurred: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {showRequestInfo ? (
        <RequestInfo onBackClick={handleBackClick} />
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