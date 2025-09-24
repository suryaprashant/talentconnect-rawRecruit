import React, { useState } from 'react';
import './styles/GlobalStyles.css';
import AuthPage from './components/auth/AuthPage';
import Dashboard from './components/dashboard/Dashboard';

// --- Main App Component ---
function App() {
  const [currentPage, setCurrentPage] = useState('signup');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const handleAuthSuccess = () => setIsAuthenticated(true);
  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage('login');
  };
  const navigateTo = (page) => setCurrentPage(page);

  return (
    <>
      {!isAuthenticated ? (
        <AuthPage 
          onAuthSuccess={handleAuthSuccess} 
          onNavigate={navigateTo} 
          isLogin={currentPage === 'login'} 
        />
      ) : (
        <Dashboard 
          onLogout={handleLogout} 
          currentPage={currentPage} 
          navigateTo={navigateTo} 
        />
      )}
    </>
  );
}

export default App;