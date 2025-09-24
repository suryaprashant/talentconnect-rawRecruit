import React from 'react';
import { DashboardIcon, RequestsIcon, UsersIcon, JobPostingsIcon, ReportsIcon, SettingsIcon } from '../Icons.jsx';

const Sidebar = ({ activePage, setActivePage, onLogout, selectedUser, setSelectedUser }) => {
  const handleNavigation = (page) => {
    setActivePage(page);
    setSelectedUser(null);
  };

  return (
    <aside className="sidebar">
      <div className="logo">Logo</div>
      <nav>
        <button 
          onClick={() => handleNavigation('dashboard')} 
          className={activePage === 'dashboard' && !selectedUser ? 'active' : ''}
        >
          <DashboardIcon width={18} height={18}/> Dashboard
        </button>
        <button 
          onClick={() => handleNavigation('requests')} 
          className={activePage === 'requests' ? 'active' : ''}
        >
          <RequestsIcon width={18} height={18}/> Requests
        </button>
        <button 
          onClick={() => handleNavigation('users')} 
          className={activePage === 'users' || selectedUser ? 'active' : ''}
        >
          <UsersIcon width={18} height={18}/> Users
        </button>
        <button 
          onClick={() => handleNavigation('jobs')} 
          className={activePage === 'jobs' ? 'active' : ''}
        >
          <JobPostingsIcon width={18} height={18}/> Job Postings
        </button>
        <button 
          onClick={() => handleNavigation('reports')} 
          className={activePage === 'reports' ? 'active' : ''}
        >
          <ReportsIcon width={18} height={18}/> Reports
        </button>
        <button 
          onClick={() => handleNavigation('referrals')} 
          className={activePage === 'referrals' ? 'active' : ''}
        >
          ↗ Referral Jobs
        </button>
        <button 
          onClick={() => handleNavigation('settings')} 
          className={activePage === 'settings' ? 'active' : ''}
        >
          <SettingsIcon width={18} height={18}/> Settings
        </button>
      </nav>
      <button className="sidebar nav button logout-btn" onClick={onLogout}>Logout</button>
    </aside>
  );
};

export default Sidebar;