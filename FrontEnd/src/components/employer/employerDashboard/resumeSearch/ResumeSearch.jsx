import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Briefcase, DollarSign, Upload } from 'lucide-react';

function ResumeSearch({ onSearch, onFileUpload }) {
  const [searchParams, setSearchParams] = useState({
    query: '',
    location: '',
    experience: '',
    salary: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchParams);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea]/10 via-[#f093fb]/5 to-[#764ba2]/10 flex items-center justify-center px-4">
      <div className="w-full max-w-4xl">
        <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-8">
          {/* Header Section - Changed to match second component */}
          <div className="flex flex-col md:flex-row items-center justify-center mb-8">
            <div className="flex items-center mb-4 md:mb-0 md:mr-6">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-[#667eea]/20 to-[#764ba2]/20">
                <Search className="h-8 w-8 text-[#667eea]" />
              </div>
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-3">
                Smart Resume Search for Faster Hiring
              </h1>
              <p className="text-gray-600 max-w-2xl text-center">
                Leverage AI-driven recommendations and powerful filters to find the right talent instantly.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Search Query Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="query"
                value={searchParams.query}
                onChange={handleChange}
                placeholder="Search by job title, skills, or keywords"
                className="w-full pl-12 pr-4 py-3 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none transition-all duration-200"
              />
            </div>

            {/* Filters Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Location Filter */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                  Location
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-4 w-4 text-gray-400" />
                  </div>
                  <select
                    name="location"
                    value={searchParams.location}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none appearance-none transition-all duration-200"
                  >
                    <option value="">Select Location</option>
                    <option value="Remote">Remote</option>
                    <option value="Onsite">On-site</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Experience Filter */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 flex items-center">
                  <Briefcase className="h-4 w-4 mr-2 text-gray-500" />
                  Experience
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Briefcase className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    name="experience"
                    value={searchParams.experience}
                    onChange={handleChange}
                    placeholder="Minimum years of experience"
                    className="w-full pl-10 pr-4 py-3 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Salary Filter */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 flex items-center">
                <DollarSign className="h-4 w-4 mr-2 text-gray-500" />
                Expected Salary
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                </div>
                <select
                  name="salary"
                  value={searchParams.salary}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none appearance-none transition-all duration-200"
                >
                  <option value="">Select Salary Range</option>
                  <option value="0-50000">$0 - $50,000</option>
                  <option value="50000-75000">$50,000 - $75,000</option>
                  <option value="75000-100000">$75,000 - $100,000</option>
                  <option value="100000+">$100,000+</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col items-center space-y-6 pt-4">
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-xl hover:shadow-lg hover:shadow-[#667eea]/30 transition-all duration-300 font-medium text-lg"
              >
                Search Resumes
              </button>

              {/* Upload Section - Kept commented out as in original */}
              {/* <div className="text-center">
                <p className="mb-3 text-gray-500 text-sm">Or upload resumes to parse automatically</p>
                <input
                  type="file"
                  id="resume-upload"
                  multiple
                  accept=".pdf,.doc,.docx"
                  onChange={onFileUpload}
                  className="hidden"
                />
                <label 
                  htmlFor="resume-upload"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-gray-100 to-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:shadow-md transition-all duration-200 cursor-pointer font-medium"
                >
                  <Upload className="h-4 w-4" />
                  Upload Resumes
                </label>
              </div> */}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ResumeSearch;