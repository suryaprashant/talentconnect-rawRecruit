import React from 'react';

const DashboardOverview = () => {
  return (
    <>
      <h2>Welcome back, John Smith</h2>
      <p>Here's what's happening with RawRecruit today</p>
      <div className="content-card" style={{marginTop:'1.5rem'}}>
        <div style={{display:'grid', gridTemplateColumns:'repeat(4, minmax(0,1fr))', gap:'1rem'}}>
          {[
            {title:'Total Pending Requests', value:'47'},
            {title:'New Users (24h)', value:'156'},
            {title:'Active Job Postings', value:'283'},
            {title:'Average Resolution Time', value:'2.4h'},
          ].map(card => (
            <div key={card.title} style={{border:'1px solid #e5e7eb', borderRadius:'0.75rem', padding:'1.25rem', background:'white'}}>
              <div style={{fontSize:'0.9rem', color:'#6b7280'}}>{card.title}</div>
              <div style={{marginTop:'0.25rem', fontSize:'1.75rem', fontWeight:700}}>{card.value}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{display:'grid', gridTemplateColumns:'2fr 1fr', gap:'1.5rem', marginTop:'1.5rem'}}>
        <div className="content-card">
          <h3>Recent Activity</h3>
          <div style={{marginTop:'1rem'}}>
            {[
              {time:'2 min ago', text:'New Student Request', status:'Pending', by:'John Doe'},
              {time:'15 min ago', text:'Company X posted a new job', status:'Active', by:'Sarah Wilson'},
              {time:'1 hour ago', text:'Profile Updated', status:'Completed', by:'Mike Johnson'},
            ].map((row, idx) => (
              <div key={idx} style={{display:'grid', gridTemplateColumns:'140px 1fr 120px 140px', padding:'0.75rem 0', borderBottom:'1px solid #e5e7eb', alignItems:'center'}}>
                <span style={{color:'#6b7280'}}>{row.time}</span>
                <span style={{fontWeight:500}}>{row.text}</span>
                <span style={{color:'#6b7280'}}>{row.status}</span>
                <span style={{color:'#6b7280'}}>{row.by}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="content-card">
          <h3>Quick Actions</h3>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem', marginTop:'1rem'}}>
            {['View Requests','Add Company','Review Jobs','Generate Report'].map(a => (
              <button key={a} className="submit-btn" style={{background:'white', color:'#111827', border:'1px solid #e5e7eb'}}>{a}</button>
            ))}
          </div>
          <h3 style={{marginTop:'1.5rem'}}>Recent Notifications</h3>
          <ul style={{marginTop:'0.75rem', paddingLeft: '1rem'}}>
            {['Urgent: New student verification request','Profile verification completed','System maintenance scheduled'].map(n => (
              <li key={n} style={{color:'#6b7280', marginTop:'0.5rem'}}>{n}</li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default DashboardOverview;