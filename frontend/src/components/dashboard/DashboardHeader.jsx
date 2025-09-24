import React from 'react';

const DashboardHeader = () => {
  return (
    <header className="dashboard-header">
      <div className="search-bar">
        <input type="text" placeholder="Search..." />
      </div>
      <div className="header-profile">
        <div className="profile-avatar"></div>
        <span>Aanya Verma</span>
      </div>
    </header>
  );
};

export default DashboardHeader;