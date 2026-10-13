import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  Search, GraduationCap, Users, Briefcase,
  X, Mail, BookOpen, UserCheck,
  ChevronLeft, ChevronRight, AlertCircle
} from 'lucide-react';
import { getAllStudentsInCollege } from '@/lib/College_AxiosIntance';

// ─── Tab config ────────────────────────────────────────────────────────────────
const TABS = [
  { key: 'student',      label: 'Students', icon: BookOpen,  profileType: 'student'      },
  { key: 'fresher',      label: 'Freshers', icon: UserCheck, profileType: 'fresher'      },
  { key: 'professional', label: 'Alumni',   icon: Briefcase, profileType: 'professional' },
];

const ITEMS_PER_PAGE = 8;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getInitials = (name = '') =>
  name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase() || '?';

const formatDate = (d) => {
  if (!d) return 'Present';
  try { return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }); }
  catch { return 'N/A'; }
};

const safeUrl = (url) => {
  if (!url) return '#';
  // Fix broken protocols like "https//..." or "http//..."
  url = url.replace(/^https?\/\//, (match) => match.replace('//', '://'));
  // Add protocol if missing entirely
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`;
  }
  return url;
};

// ─── InfoTile ─────────────────────────────────────────────────────────────────
function InfoTile({ label, value, icon }) {
  return (
    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-0.5">{label}</p>
      <div className="flex items-center gap-1">
        {icon}
        <p className="text-sm font-semibold text-slate-700 truncate">{value}</p>
      </div>
    </div>
  );
}

// ─── SectionHead ──────────────────────────────────────────────────────────────
function SectionHead({ label }) {
  return (
    <div className="flex items-center gap-2 mb-2.5">
      <p className="text-xs font-bold uppercase tracking-wider text-[#143694]">{label}</p>
      <div className="flex-1 h-px bg-[#143694]/10" />
    </div>
  );
}

// ─── Profile Modal ─────────────────────────────────────────────────────────────
function ProfileModal({ person, onClose }) {
  if (!person) return null;
  const initials = getInitials(person.name);
  console.log(person)
  const skills   = person.skills?.slice(0, 15) || [];
  const exps     = person.experiences?.slice(0, 5) || [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.50)' }}
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
        style={{ maxHeight: '90vh' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="overflow-y-auto" style={{ maxHeight: '90vh' }}>

          {/* Header strip */}
          <div className="h-28 bg-gradient-to-r from-[#143694] to-[#1e4ed8] flex-shrink-0" />

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 bg-white/20 hover:bg-white/40 rounded-full transition-colors z-10"
          >
            <X size={16} className="text-white" />
          </button>

          <div className="px-6 pb-8">

            {/* Avatar + name + profile type badge */}
            <div className="flex items-end gap-4 -mt-12 mb-5">
              <div className="w-24 h-24 rounded-2xl bg-white border-4 border-white shadow-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                {person.profileImage
                  ? <img src={person.profileImage} alt={person.name} className="w-full h-full object-cover" />
                  : <span className="text-[#143694] font-bold text-2xl">{initials}</span>
                }
              </div>
              <div className="pb-1 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-bold text-slate-900 leading-tight">{person.name}</h2>
                  {person.profileType && (
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide bg-[#143694]/10 text-[#143694]">
                      {person.profileType}
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-500 mt-0.5">
                  {person.degree}{person.specialization ? ` · ${person.specialization}` : ''}
                </p>
                {person.currentCompany && (
                  <p className="text-sm font-medium text-slate-700 mt-0.5 flex items-center gap-1">
                    <Briefcase size={12} className="text-[#143694]" /> {person.currentCompany}
                  </p>
                )}
              </div>
            </div>

            {/* Contact chips */}
            <div className="flex flex-wrap gap-2 mb-6">
              {person.email && (
                <a href={`mailto:${person.email}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-full text-xs font-medium hover:bg-blue-100 transition-colors">
                  <Mail size={11} /> {person.email}
                </a>
              )}
              {person.phone && (
                <a href={`tel:${person.phone}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-700 border border-slate-200 rounded-full text-xs font-medium hover:bg-slate-100 transition-colors">
                  📞 {person.phone}
                </a>
              )}
           {person.linkedin && person.linkedin.trim() && (
  <a href={safeUrl(person.linkedin)} target="_blank" rel="noopener noreferrer"
    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-full text-xs font-medium hover:bg-blue-100 transition-colors">
    LinkedIn ↗
  </a>
)}
{person.github && person.github.trim() && (
  <a href={safeUrl(person.github)} target="_blank" rel="noopener noreferrer"
    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-700 border border-slate-200 rounded-full text-xs font-medium hover:bg-slate-100 transition-colors">
    GitHub ↗
  </a>
)}
{person.portfolio && person.portfolio.trim() && (
  <a href={safeUrl(person.portfolio)} target="_blank" rel="noopener noreferrer"
    className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 border border-purple-100 rounded-full text-xs font-medium hover:bg-purple-100 transition-colors">
    Portfolio ↗
  </a>
)}
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
              {person.college && <InfoTile label="College" value={person.college} />}
              {person.semester && <InfoTile label="Semester" value={`Sem ${person.semester}`} />}
              {person.yearOfGraduation && (
                <InfoTile label="Graduation" value={person.yearOfGraduation}
                  icon={<GraduationCap size={13} className="text-[#143694]" />} />
              )}
              {person.cgpa && <InfoTile label="CGPA" value={person.cgpa} />}
              {person.totalYearsOfExperience && (
                <InfoTile label="Experience" value={`${person.totalYearsOfExperience} yrs`} />
              )}
              {person.noticePeriod && <InfoTile label="Notice Period" value={person.noticePeriod} />}
            </div>

            {/* About */}
            {person.about && (
              <div className="mb-6">
                <SectionHead label="About" />
                <p className="text-sm text-slate-600 leading-relaxed">{person.about}</p>
              </div>
            )}

            {/* Job Roles + Looking For */}
            {(person.jobRoles?.length > 0 || person.lookingFor?.length > 0 || person.industry?.length > 0) && (
              <div className="mb-6">
                <SectionHead label="Preferences" />
                <div className="space-y-3">
                  {person.jobRoles?.length > 0 && (
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Job Roles</p>
                      <div className="flex flex-wrap gap-2">
                        {person.jobRoles.map((r, i) => (
                          <span key={i} className="px-2.5 py-1 bg-green-50 text-green-700 border border-green-100 rounded-md text-xs font-medium">
                            {r}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {person.industry?.length > 0 && (
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Industries</p>
                      <div className="flex flex-wrap gap-2">
                        {person.industry.map((ind, i) => (
                          <span key={i} className="px-2.5 py-1 bg-orange-50 text-orange-700 border border-orange-100 rounded-md text-xs font-medium">
                            {ind}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {person.lookingFor?.length > 0 && (
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Looking For</p>
                      <div className="flex flex-wrap gap-2">
                        {(Array.isArray(person.lookingFor) ? person.lookingFor : [person.lookingFor]).map((l, i) => (
                          <span key={i} className="px-2.5 py-1 bg-purple-50 text-purple-700 border border-purple-100 rounded-md text-xs font-medium">
                            {l}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Skills */}
            {skills.length > 0 && (
              <div className="mb-6">
                <SectionHead label="Skills" />
                <div className="flex flex-wrap gap-2">
                  {skills.map((sk, i) => (
                    <span key={i} className="px-2.5 py-1 bg-blue-50 text-blue-600 border border-blue-100 rounded-md text-xs font-bold uppercase tracking-tight">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Experience */}
            {exps.length > 0 && (
              <div>
                <SectionHead label="Experience" />
                <div className="space-y-3">
                  {exps.map((exp, i) => (
                    <div key={i} className="flex gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="w-9 h-9 rounded-lg bg-[#143694]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Briefcase size={15} className="text-[#143694]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800">{exp.role}</p>
                        <p className="text-xs text-slate-500">{exp.company}</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {formatDate(exp.startDate)} – {exp.endDate ? formatDate(exp.endDate) : 'Present'}
                        </p>
                        {exp.description && (
                          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{exp.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
// ─── Main Component ────────────────────────────────────────────────────────────
const StudentDirectory = () => {
  const [activeTab,   setActiveTab]   = useState(TABS[0]);
  const [people,      setPeople]      = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);
  const [search,      setSearch]      = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selected,    setSelected]    = useState(null);

  const fetchPeople = useCallback(async (tab) => {
    setLoading(true);
    setError(null);
    setPeople([]);
    try {
      const response = await getAllStudentsInCollege(tab.profileType);
      if (response?.data?.success) {
        setPeople(response.data.data);
      } else {
        setError(response?.response?.data?.message || 'Failed to load data');
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPeople(activeTab);
    setCurrentPage(1);
    setSearch('');
  }, [activeTab, fetchPeople]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return people.filter(p =>
      (p.name           || '').toLowerCase().includes(q) ||
      (p.degree         || '').toLowerCase().includes(q) ||
      (p.specialization || '').toLowerCase().includes(q)
    );
  }, [people, search]);

  const totalPages  = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const currentRows = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const isAlumni = activeTab.key === 'professional';

  return (
    <>
      {selected && <ProfileModal person={selected} onClose={() => setSelected(null)} />}

      <div className="min-h-screen bg-gradient-to-br from-[#f0e6f7]/60 via-[#d4e8f9]/55 to-[#cff7ea]/60">

        {/* Blobs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#fbcfe8]/20 rounded-full blur-3xl" />
          <div className="absolute top-1/3 -left-20 w-60 h-60 bg-[#143694]/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-1/3 w-40 h-40 bg-[#a7f3d0]/20 rounded-full blur-3xl" />
        </div>

        {/* ── Top Nav ── */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 px-6 py-5 mb-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-[#143694]/10 rounded-lg">
                <Users className="h-5 w-5 text-[#143694]" />
              </div>
              <h2 className="text-2xl md:text-[26px] font-semibold text-[#143694] tracking-tight">
                Student Pool
              </h2>
              <span className="flex items-center justify-center w-7 h-7 bg-[#143694] text-white text-xs font-bold rounded-full">
                {people.length}
              </span>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pb-1">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab)}
                    className={`flex items-center gap-1.5 px-6 py-2 rounded-full font-medium text-sm transition-all ${
                      activeTab.key === tab.key
                        ? 'bg-[#143694] text-white shadow-sm'
                        : 'text-gray-500 hover:text-[#143694]'
                    }`}
                  >
                    <Icon size={14} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto p-6">

          {/* ── Search bar ── */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 px-6 py-5 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-500 text-sm">
                {loading ? 'Loading…' : `${filtered.length} ${activeTab.label.toLowerCase()} found`}
              </p>
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
                  placeholder={`Search ${activeTab.label.toLowerCase()}…`}
                  className="w-full pl-10 pr-4 py-2.5 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#143694]/50 focus:border-transparent focus:outline-none transition-all text-sm"
                />
              </div>
            </div>
          </div>

          {/* ── Error ── */}
          {error && (
            <div className="bg-gradient-to-r from-red-50 to-white border border-red-200 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* ── Table ── */}
          <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg overflow-hidden">

            {/* Header row */}
            <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              {isAlumni ? (
                <div className="grid grid-cols-12 gap-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <div className="col-span-3">Name</div>
                  <div className="col-span-3">Email</div>
                  <div className="col-span-2">Degree</div>
                  <div className="col-span-2 text-center">Company</div>
                  <div className="col-span-2 text-right">Experience</div>
                </div>
              ) : (
                <div className="grid grid-cols-12 gap-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <div className="col-span-3">Name</div>
                  <div className="col-span-3">Email</div>
                  <div className="col-span-2">Degree</div>
                  <div className="col-span-1 text-center">Sem</div>
                  <div className="col-span-2 text-center">Specialization</div>
                  <div className="col-span-1 text-right">Grad</div>
                </div>
              )}
            </div>

            {/* Rows */}
            <div className="divide-y divide-gray-100">
              {loading ? (
                <div className="p-12 text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#143694]" />
                  <p className="mt-4 text-gray-500 text-sm">Loading {activeTab.label.toLowerCase()}…</p>
                </div>

              ) : currentRows.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 mb-4">
                    <Users className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-1">No {activeTab.label} found</h3>
                  <p className="text-gray-400 text-sm">
                    {search ? `No results for "${search}"` : `No ${activeTab.label.toLowerCase()} enrolled yet.`}
                  </p>
                </div>

              ) : currentRows.map((person) => (
                <div
                  key={person._id || person.email}
                  onClick={() => setSelected(person)}
                  className="p-4 hover:bg-blue-50/40 transition-all duration-200 cursor-pointer group"
                >
                  {isAlumni ? (
                    <div className="grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-3 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#143694]/10 flex items-center justify-center flex-shrink-0 text-[#143694] text-xs font-bold">
                          {getInitials(person.name)}
                        </div>
                        <span className="font-semibold text-slate-800 group-hover:text-[#143694] transition-colors text-sm truncate">
                          {person.name}
                        </span>
                      </div>
                      <div className="col-span-3 text-slate-500 text-sm truncate">{person.email}</div>
                      <div className="col-span-2 text-slate-600 text-sm truncate">{person.degree || '—'}</div>
                      <div className="col-span-2 text-center text-slate-600 text-sm truncate">{person.currentCompany || '—'}</div>
                      <div className="col-span-2 text-right font-semibold text-[#143694] text-sm">
                        {person.totalYearsOfExperience ? `${person.totalYearsOfExperience} yrs` : '—'}
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-3 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#143694]/10 flex items-center justify-center flex-shrink-0 text-[#143694] text-xs font-bold">
                          {getInitials(person.name)}
                        </div>
                        <span className="font-semibold text-slate-800 group-hover:text-[#143694] transition-colors text-sm truncate">
                          {person.name}
                        </span>
                      </div>
                      <div className="col-span-3 text-slate-500 text-sm truncate">{person.email}</div>
                      <div className="col-span-2 text-slate-600 text-sm truncate">{person.degree || '—'}</div>
                      <div className="col-span-1 text-center text-slate-600 text-sm font-medium">{person.semester || '—'}</div>
                      <div className="col-span-2 text-center">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-tight bg-blue-50 text-blue-600 border border-blue-100">
                          {person.specialization || '—'}
                        </span>
                      </div>
                      <div className="col-span-1 flex items-center justify-end gap-1 text-[#143694] font-semibold text-sm">
                        <GraduationCap size={13} />
                        {person.yearOfGraduation || '—'}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between p-6 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-white gap-4">
                <button
                  onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl disabled:opacity-50 hover:bg-gray-50 transition-all text-gray-700 font-medium text-sm"
                >
                  <ChevronLeft size={16} /> Prev
                </button>

                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all font-medium text-sm ${
                        currentPage === page
                          ? 'bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white shadow-md shadow-[#143694]/30'
                          : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl disabled:opacity-50 hover:bg-gray-50 transition-all text-gray-700 font-medium text-sm"
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentDirectory;