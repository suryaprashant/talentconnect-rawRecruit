import React, { useEffect, useState, useMemo } from 'react';
import { Search, Loader2, GraduationCap } from 'lucide-react';
// Import the function from your instance file
//import { getAllStudentsInCollege } from "../../lib/College_AxiosInstance";
import { getAllStudentsInCollege } from '@/lib/College_AxiosIntance';

const StudentDirectory = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await getAllStudentsInCollege();
        
        // Handling the standard response structure from your axiosClient
        if (response?.data?.success) {
          setStudents(response.data.data);
        } else {
          // If response is an error object caught by .catch(error => error)
          setError(response?.response?.data?.message || "Failed to load students");
        }
      } catch (err) {
        setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  // --- STRICT NAME SEARCH LOGIC ---
  const filtered = useMemo(() => {
    return students.filter((s) => {
      const studentName = s.name ? s.name.toLowerCase() : "";
      const searchTerm = search.toLowerCase();
      return studentName.includes(searchTerm);
    });
  }, [students, search]);

  if (loading) return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="animate-spin text-blue-600" size={48} />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto">
        <header className="bg-white rounded-2xl shadow-sm border border-gray-200 px-6 py-5 mb-8">

          <div className="flex items-center justify-between">

            <div>
              <h1 className="text-xl md:text-2xl font-semibold text-[#143694] tracking-tight">
                Student Pool
              </h1>

              <p className="text-gray-500 text-sm mt-1">
                {students.length} total students enrolled
              </p>
            </div>

          </div>

        </header>

        {/* Search Bar - Strictly for Name */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text"
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            placeholder="Search by student name..." 
            className="w-full max-w-md pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white shadow-sm transition-all" 
          />
        </div>

        {error && <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 border border-red-200">{error}</div>}

        {/* Table Layout */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50">
                <th className="p-4 font-semibold text-slate-600">Name</th>
                <th className="p-4 font-semibold text-slate-600">Email</th>
                <th className="p-4 font-semibold text-slate-600">Degree</th>
                <th className="p-4 font-semibold text-slate-600 text-center">Specialization</th>
                <th className="p-4 font-semibold text-slate-600 text-center">Semester</th>
                <th className="p-4 font-semibold text-slate-600 text-right">Graduation</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s._id || s.email} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 font-bold text-slate-800">{s.name}</td>
                  <td className="p-4 text-slate-500">{s.email}</td>
                  <td className="p-4 text-slate-600">{s.degree}</td>
                  <td className="p-4 text-center">
                    <span className="bg-blue-50 text-blue-600 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-tight border border-blue-100">
                      {s.specialization}
                    </span>
                  </td>
                  <td className="p-4 text-center text-slate-700 font-medium">{s.semester}</td>
                  <td className="p-4 text-right font-semibold text-blue-600">
                    <div className="flex items-center justify-end gap-1.5">
                      <GraduationCap size={16} />
                      {s.yearOfGraduation}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="text-center py-24 bg-white">
              <p className="text-slate-400 font-medium">No student named "{search}" found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDirectory;