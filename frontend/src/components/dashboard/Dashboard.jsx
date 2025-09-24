import React, { useState } from 'react';
import Sidebar from './Sidebar';
import DashboardHeader from './DashboardHeader';
import DashboardOverview from './DashboardOverview';
import UserManagement from './UserManagement';
import UserProfile from './UserProfile';

const Dashboard = ({ onLogout }) => {
  const [activePage, setActivePage] = useState('dashboard');
  const [selectedUser, setSelectedUser] = useState(null);

  const handleUserSelect = (user) => setSelectedUser(user);
  const handleBackToUsers = () => setSelectedUser(null);
  
  const renderContent = () => {
    if (selectedUser) {
      return <UserProfile user={selectedUser} onBack={handleBackToUsers} />;
    }
    
    switch (activePage) {
      case 'dashboard': 
        return <DashboardOverview />;
      case 'users': 
        return <UserManagement onUserSelect={handleUserSelect} />;
      case 'requests': 
        return (<><h2>Requests</h2><p>All incoming verification and access requests will appear here.</p></>);
      case 'jobs': 
        return (<><h2>Job Postings</h2><p>Manage and review job postings here.</p></>);
      case 'reports': 
        return (<><h2>Reports</h2><p>Generate analytics and export CSV/PDF reports.</p></>);
      case 'referrals': 
        return (<><h2>Referral Jobs</h2><p>Track and manage referral job postings.</p></>);
      case 'settings': 
        return (<><h2>Settings</h2><p>Organization settings and preferences.</p></>);
      default: 
        return <DashboardOverview />;
    }
  };
  
  return (
    <div className="dashboard-layout">
      <Sidebar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        onLogout={onLogout} 
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
      />
      <div className="main-content">
        <DashboardHeader />
        <main className="page-content">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;