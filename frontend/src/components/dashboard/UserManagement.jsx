import React, { useState } from 'react';

const UserManagement = ({ onUserSelect }) => {
  const [activeCategory, setActiveCategory] = useState('all'); // students | all | freshers | professionals | companies
  
  const usersData = [
    { id: 'USR001', name: 'Jonathan Higgins', email: 'jonathan.higgins@gmail.com', type: 'Student', status: 'Active', joined: 'Jan 15, 2024' },
    { id: 'USR001', name: 'Devon Miles', email: 'devon.miles@gmail.com', type: 'Fresher', status: 'Active', joined: 'Feb 02, 2024' },
    { id: 'USR002', name: 'Col. Roderick Decker', email: 'roderick.decker@gmail.com', type: 'Professional', status: 'Inactive', joined: 'Mar 20, 2024' },
    { id: 'USR003', name: 'TalentConnect', email: 'talentconnect@gmail.com', type: 'Company', status: 'Active', joined: 'Apr 05, 2024' },
    { id: 'USR004', name: 'ABC College', email: 'abcollege@gmail.com', type: 'College', status: 'Active', joined: 'May 10, 2024' },
    { id: 'USR005', name: 'Alicia Sierra', email: 'alicia.sierra@gmail.com', type: 'Student', status: 'Active', joined: 'Jun 15, 2024' },
  ];
  
  const categoryCounts = {
    all: usersData.length,
    students: usersData.filter(u => u.type === 'Student').length,
    freshers: usersData.filter(u => u.type === 'Fresher').length,
    professionals: usersData.filter(u => u.type === 'Professional').length,
    companies: usersData.filter(u => u.type === 'Company').length,
  };
  
  const filteredUsers = usersData.filter(u => {
    switch(activeCategory){
      case 'students': return u.type === 'Student';
      case 'freshers': return u.type === 'Fresher';
      case 'professionals': return u.type === 'Professional';
      case 'companies': return u.type === 'Company';
      case 'all':
      default: return true;
    }
  });

  // SVG icons for user types
  const userTypeIcons = {
    Student: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    Fresher: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    Professional: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16 21V5C16 4.46957 15.7893 3.96086 15.4142 3.58579C15.0391 3.21071 14.5304 3 14 3H10C9.46957 3 8.96086 3.21071 8.58579 3.58579C8.21071 3.96086 8 4.46957 8 5V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    Company: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 21H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M5 21V7L13 3V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M19 21V12L13 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 9V9.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 13V13.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 17V17.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M17 17V17.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    College: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6 9.5V15.5C6 16.6 8.7 18 12 18C15.3 18 18 16.6 18 15.5V9.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  };
  
  return (
    <div>
      <div className="content-card" style={{border:'1px solid #e5e7eb', padding: '1.5rem'}}>
        <h2 style={{fontWeight: '600', fontSize:'1.25rem', marginBottom: '0.5rem'}}>User Management</h2>
        <p style={{color:'#6b7280', marginTop:'0.25rem'}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.</p>
      </div>

      <div style={{marginTop:'1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap'}}>
        <button 
          onClick={() => setActiveCategory('all')} 
          className={`category-tab ${activeCategory === 'all' ? 'active-tab' : ''}`}
          style={{
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            padding: '0.75rem 1rem',
            border: '1px solid #e5e7eb',
            borderRadius: '0.375rem',
            background: activeCategory === 'all' ? '#f9fafb' : 'white',
            fontWeight: activeCategory === 'all' ? '600' : '400'
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          All Users ({categoryCounts.all})
        </button>
        
        <button 
          onClick={() => setActiveCategory('students')} 
          className={`category-tab ${activeCategory === 'students' ? 'active-tab' : ''}`}
          style={{
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            padding: '0.75rem 1rem',
            border: '1px solid #e5e7eb',
            borderRadius: '0.375rem',
            background: activeCategory === 'students' ? '#f9fafb' : 'white',
            fontWeight: activeCategory === 'students' ? '600' : '400'
          }}
        >
          {userTypeIcons.Student}
          Students ({categoryCounts.students})
        </button>
        
        <button 
          onClick={() => setActiveCategory('freshers')} 
          className={`category-tab ${activeCategory === 'freshers' ? 'active-tab' : ''}`}
          style={{
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            padding: '0.75rem 1rem',
            border: '1px solid #e5e7eb',
            borderRadius: '0.375rem',
            background: activeCategory === 'freshers' ? '#f9fafb' : 'white',
            fontWeight: activeCategory === 'freshers' ? '600' : '400'
          }}
        >
          {userTypeIcons.Fresher}
          Freshers ({categoryCounts.freshers})
        </button>
        
        <button 
          onClick={() => setActiveCategory('professionals')} 
          className={`category-tab ${activeCategory === 'professionals' ? 'active-tab' : ''}`}
          style={{
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            padding: '0.75rem 1rem',
            border: '1px solid #e5e7eb',
            borderRadius: '0.375rem',
            background: activeCategory === 'professionals' ? '#f9fafb' : 'white',
            fontWeight: activeCategory === 'professionals' ? '600' : '400'
          }}
        >
          {userTypeIcons.Professional}
          Professionals ({categoryCounts.professionals})
        </button>
        
        <button 
          onClick={() => setActiveCategory('companies')} 
          className={`category-tab ${activeCategory === 'companies' ? 'active-tab' : ''}`}
          style={{
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            padding: '0.75rem 1rem',
            border: '1px solid #e5e7eb',
            borderRadius: '0.375rem',
            background: activeCategory === 'companies' ? '#f9fafb' : 'white',
            fontWeight: activeCategory === 'companies' ? '600' : '400'
          }}
        >
          {userTypeIcons.Company}
          Companies ({categoryCounts.companies})
        </button>
      </div>

      <div className="content-card" style={{marginTop:'1.5rem', border:'1px solid #e5e7eb', padding: '1rem'}}>
        <div style={{display:'flex', alignItems:'center', gap:'0.75rem', flexWrap:'wrap', justifyContent: 'space-between'}}>
          <div className="search-bar" style={{position: 'relative', width: '240px'}}>
            <svg style={{position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)'}} width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 21L16.65 16.65" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <input style={{width: '100%', paddingLeft: '2rem', height: '38px', borderRadius: '0.375rem', border: '1px solid #e5e7eb'}} type="text" placeholder="Search" />
          </div>
          
          <div style={{display: 'flex', gap: '0.75rem', alignItems: 'center'}}>
            <button className="submit-btn" style={{background:'white', color:'#111827', border:'1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '0.375rem'}}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 3H2L10 12.46V19L14 21V12.46L22 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Filters
            </button>
            
            <div style={{display:'flex', gap:'0.5rem', alignItems:'center'}}>
              <span style={{border:'1px solid #e5e7eb', borderRadius:'9999px', padding:'0.35rem 0.75rem', fontSize:'0.875rem', display: 'flex', alignItems: 'center', gap: '0.25rem'}}>
                Status
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <span style={{border:'1px solid #e5e7eb', borderRadius:'9999px', padding:'0.35rem 0.75rem', fontSize:'0.875rem', display: 'flex', alignItems: 'center', gap: '0.25rem'}}>
                User
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <span style={{border:'1px solid #e5e7eb', borderRadius:'9999px', padding:'0.35rem 0.75rem', fontSize:'0.875rem', display: 'flex', alignItems: 'center', gap: '0.25rem'}}>
                Tag
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="content-card" style={{marginTop: '1rem', border:'1px solid #e5e7eb', padding: '0'}}>
        <table className="user-table" style={{width: '100%', borderCollapse: 'collapse'}}>
          <thead style={{backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb'}}>
            <tr>
              <th style={{padding: '0.75rem 1rem', textAlign: 'left', fontWeight: '500', color: '#4b5563'}}>User ID</th>
              <th style={{padding: '0.75rem 1rem', textAlign: 'left', fontWeight: '500', color: '#4b5563'}}>User Name</th>
              <th style={{padding: '0.75rem 1rem', textAlign: 'left', fontWeight: '500', color: '#4b5563'}}>Email</th>
              <th style={{padding: '0.75rem 1rem', textAlign: 'left', fontWeight: '500', color: '#4b5563'}}>User</th>
              <th style={{padding: '0.75rem 1rem', textAlign: 'left', fontWeight: '500', color: '#4b5563'}}>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id} style={{borderBottom: '1px solid #e5e7eb'}}>
                <td style={{padding: '0.75rem 1rem'}}>{user.id}</td>
                <td style={{padding: '0.75rem 1rem'}}>
                  <button className="link" onClick={() => onUserSelect(user)} style={{color: '#111827', fontWeight: '500', background: 'none', border: 'none', padding: 0, cursor: 'pointer', textDecoration: 'none'}}>{user.name}</button>
                </td>
                <td style={{padding: '0.75rem 1rem'}}>{user.email}</td>
                <td style={{padding: '0.75rem 1rem'}}>
                  <span style={{display:'inline-flex', alignItems:'center', gap:'0.5rem'}}>
                    {userTypeIcons[user.type]}
                    {user.type}
                  </span>
                </td>
                <td style={{padding: '0.75rem 1rem'}}>
                  <span style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                    <span style={{
                      display: 'inline-block', 
                      width: '8px', 
                      height: '8px', 
                      borderRadius: '50%', 
                      backgroundColor: user.status === 'Active' ? '#10B981' : '#EF4444'
                    }}></span>
                    {user.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding: '1rem', borderTop: '1px solid #e5e7eb'}}>
          <button className="submit-btn" style={{background:'white', color:'#111827', border:'1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '0.375rem'}}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Prev
          </button>
          <div style={{display:'flex', gap:'0.5rem'}}>
            {[1,2,3,4].map(n => (
              <button key={n} className="submit-btn" style={{
                background: n===1 ? '#111827' : 'white', 
                color: n===1 ? 'white' : '#111827', 
                border:'1px solid #e5e7eb', 
                padding:'0.4rem 0.75rem',
                minWidth: '32px',
                borderRadius: '0.375rem'
              }}>{n}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;