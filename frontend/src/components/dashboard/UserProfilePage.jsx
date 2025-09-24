import React from 'react';
import Icon from '../common/Icon';

const UserProfilePage = ({ user, onBack }) => (
  <>
    <div className="content-card" style={{marginBottom:'1rem', border:'1px solid #e5e7eb', display:'flex', alignItems:'center', gap:'0.75rem'}}>
      <button onClick={onBack} style={{background:'white', border:'1px solid #e5e7eb', borderRadius:'0.5rem', padding:'0.35rem 0.6rem', cursor:'pointer'}}>&larr; Back</button>
      <span style={{color:'#6b7280'}}>Users</span>
      <span style={{color:'#d1d5db'}}>/</span>
      <span style={{color:'#6b7280'}}>User ID : {user.id}</span>
    </div>
    <div className="content-card" style={{border:'1px solid #e5e7eb'}}>
      <div className="profile-header">
        <div className="profile-header-avatar"></div>
        <div className="profile-header-info">
          <h1>{user.name} <span style={{backgroundColor: '#dcfce7', color: '#166534', fontSize: '0.75rem', padding: '0.25rem 0.5rem', borderRadius: '9999px', fontWeight: '500', verticalAlign: 'middle'}}>{user.status}</span></h1>
          <p style={{display:'flex', gap:'1rem', flexWrap:'wrap', alignItems:'center'}}>
            <span>User ID: {user.id}</span>
            <span>Joined: {user.joined}</span>
            <span>San Francisco, CA</span>
            <span>{user.email}</span>
            <span>{user.phone}</span>
          </p>
        </div>
        <div className="profile-header-actions">
          <button>Reset Password</button>
          <button>Suspend Account</button>
          <button className="primary">Send Message</button>
        </div>
      </div>
      <div className="profile-tabs">
        <button className="active">Profile Information</button>
        <button>Activity Log</button>
        <button>Attachments</button>
        <button>Job Applications</button>
        <button>Support Requests</button>
      </div>
    </div>
    <div className="profile-grid">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="content-card">
          <h3>About</h3>
          <p style={{marginTop:0, color:'#4b5563', fontSize:'0.9rem'}}>{user.about}</p>
        </div>
        <div className="content-card">
          <h3>Personal Information</h3>
          <div className="info-grid">
            <div className="info-item"><Icon d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/> <span className="label">Email:</span> <strong>{user.email}</strong></div>
            <div className="info-item"><Icon d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /> <span className="label">Phone:</span> <strong>{user.phone}</strong></div>
            <div className="info-item"><Icon d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /> <span className="label">Location:</span> <strong>{user.location}</strong></div>
            <div className="info-item"><Icon d="M10.5 21l5.25-11.625M21 21l-5.25-11.625M3.75 14.25l4.5-4.5M3.75 9.75l4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /> <span className="label">Language:</span> <strong>{user.language}</strong></div>
          </div>
        </div>
      </div>
      <div>
        <div className="content-card">
          <h3>Skills</h3>
          <div className="skills-list">
            {user.skills?.map((skill, i) => (
              <span key={i} className="skill-tag">{skill}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  </>
);

export default UserProfilePage;