import React from "react";

export default function Sidebar({ currentPage, setCurrentPage }) {
  return (
    <aside className="w-64 bg-white border-r p-4" style={{minHeight: "100vh"}}>
      <div style={{fontFamily: 'Lora, serif', fontSize: 20, fontWeight: 700, marginBottom: 12}}>Logo</div>
      <nav style={{display:'flex', flexDirection:'column', gap:8}}>
        <button onClick={() => setCurrentPage("overview")}
                style={{textAlign:'left', padding:'8px 12px', borderRadius:8, background: currentPage === 'overview' ? '#111827' : 'transparent', color: currentPage === 'overview' ? '#fff' : '#374151', border:'none', cursor:'pointer'}}>
          Dashboard
        </button>
        <button onClick={() => setCurrentPage("users")}
                style={{textAlign:'left', padding:'8px 12px', borderRadius:8, background: currentPage === 'users' ? '#111827' : 'transparent', color: currentPage === 'users' ? '#fff' : '#374151', border:'none', cursor:'pointer'}}>
          Users
        </button>
        <button onClick={() => setCurrentPage("requests")}
                style={{textAlign:'left', padding:'8px 12px', borderRadius:8, background: currentPage === 'requests' ? '#111827' : 'transparent', color: currentPage === 'requests' ? '#fff' : '#374151', border:'none', cursor:'pointer'}}>
          Requests
        </button>
        <button onClick={() => setCurrentPage("jobs")}
                style={{textAlign:'left', padding:'8px 12px', borderRadius:8, background: currentPage === 'jobs' ? '#111827' : 'transparent', color: currentPage === 'jobs' ? '#fff' : '#374151', border:'none', cursor:'pointer'}}>
          Job Postings
        </button>
      </nav>
    </aside>
  );
}
