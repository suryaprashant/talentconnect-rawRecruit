import { useState } from 'react';
import { motion } from 'framer-motion';

const IntroduceYourself = ({ onNext, onBack, formData, updateFormData }) => {
  const [errors, setErrors] = useState({});

  const isValidLinkedIn = (url) => {
    if (!url.trim()) return true; // Optional field, empty is valid
    
    const cleanUrl = url
      .trim()
      .toLowerCase()
      .replace(/^https?:\/\//, '')  // Remove http:// or https://
      .replace(/^www\./, '')         // Remove www.
      .replace(/^\/+|\/+$/g, '');    // Remove leading/trailing slashes

    // Must be a LinkedIn URL
    if (!cleanUrl.includes('linkedin.com')) {
      return false;
    }

    // Accepts various LinkedIn URL formats:
    // - linkedin.com/in/username
    // - linkedin.com/username
    // - linkedin.com/company/companyname
    // - linkedin.com/school/schoolname
    const linkedinPattern = /^linkedin\.com\/[A-Za-z0-9-_/]+\/?$/;
    
    return linkedinPattern.test(cleanUrl);
  };

  const isValidMobile = (mobile) => {
    const pattern = /^(\+?\d{1,4}[\s-]?)?\d{10}$/;
    return pattern.test(mobile.trim());
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name?.trim()) newErrors.name = 'Name is required';

    if (!formData.designation) newErrors.designation = 'Designation is required';

    if (!formData.email?.trim()) {
      newErrors.email = 'Work email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.mobile?.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!isValidMobile(formData.mobile)) {
      newErrors.mobile = 'Invalid mobile number';
    }

    if (formData.linkedin?.trim() && !isValidLinkedIn(formData.linkedin)) {
      newErrors.linkedin = 'Enter a valid LinkedIn URL (e.g., linkedin.com/in/username)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext();
    }
  };

  const handleChange = (field, value) => {
    updateFormData({ [field]: value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#143694]/15 via-[#f093fb]/10 to-[#1e4ed8]/15 p-4">
      {/* Blur Background around card */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-[#143694]/10 to-[#1e4ed8]/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-[#f093fb]/10 to-[#f5576c]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-2xl">
        {/* Blur background behind card */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#143694]/5 to-[#1e4ed8]/5 backdrop-blur-sm rounded-2xl -inset-x-4 bottom-0"></div>

        <motion.div
          className="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-100 p-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Decorative top bar */}
          <div className="h-1 bg-gradient-to-r from-[#143694] via-[#f093fb] to-[#43e97b] rounded-t-2xl absolute top-0 left-0 right-0"></div>

          {/* Progress indicator */}
          <div className="flex items-center justify-start mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white rounded-full flex items-center justify-center text-sm font-medium">
                1
              </div>
              <div className="w-16 h-px bg-gradient-to-r from-[#143694]/30 to-[#1e4ed8]/30"></div>
              <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm">
                2
              </div>
              <div className="w-16 h-px bg-gray-300"></div>
              <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm">
                3
              </div>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Introduce Yourself as an Employer!
          </h1>
          <p className="text-gray-600 mb-6">
            Help candidates connect with the right recruiter in your company!
          </p>

          <form className="space-y-5">
            {/* 🔽 NOTHING BELOW IS CHANGED VISUALLY 🔽 */}

            {/* NAME */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Enter your name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className={`block w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#143694]/30 focus:border-[#143694] transition-all duration-300 bg-white/80 text-gray-800`}
                  placeholder="Enter your name"
                />
              </div>
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            {/* DESIGNATION */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Designation <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={formData.designation || ''}
                  onChange={(e) => handleChange('designation', e.target.value)}
                  className={`block w-full px-3 py-2 border ${errors.designation ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#143694]/30 focus:border-[#143694] transition-all duration-300 bg-white/80 appearance-none text-gray-800`}
                >
                  <option value="">Select designation</option>
                  <option value="HR Manager">HR Manager</option>
                  <option value="Recruiter">Recruiter</option>
                  <option value="Hiring Manager">Hiring Manager</option>
                  <option value="CEO">CEO</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              {errors.designation && <p className="mt-1 text-sm text-red-600">{errors.designation}</p>}
            </div>

            {/* EMAIL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Enter your work email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className={`block w-full pl-10 pr-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#143694]/30 focus:border-[#143694] transition-all duration-300 bg-white/80 text-gray-800`}
                  placeholder="hello@xyz.com"
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            {/* MOBILE */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Enter your mobile no. <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={formData.mobile || ''}
                  onChange={(e) => handleChange('mobile', e.target.value)}
                  className={`block w-full pl-10 pr-3 py-2 border ${errors.mobile ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#143694]/30 focus:border-[#143694] transition-all duration-300 bg-white/80 text-gray-800`}
                  placeholder="+91 9876543210"
                />
              </div>
              {errors.mobile && <p className="mt-1 text-sm text-red-600">{errors.mobile}</p>}
            </div>

            {/* LINKEDIN - Updated placeholder */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                LinkedIn Profile (Optional)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.linkedin || ''}
                  onChange={(e) => handleChange('linkedin', e.target.value)}
                  className={`block w-full pl-10 pr-3 py-2 border ${errors.linkedin ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#143694]/30 focus:border-[#143694] transition-all duration-300 bg-white/80 text-gray-800`}
                  placeholder="linkedin.com/in/username or linkedin.com/company/name"
                />
              </div>
              {errors.linkedin && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.linkedin}
                </p>
              )}
              {!errors.linkedin && formData.linkedin && (
                <p className="mt-1 text-xs text-gray-500">
                  {/* Accepted formats: linkedin.com/in/username, linkedin.com/company/name, linkedin.com/school/name */}
                </p>
              )}
            </div>

            <div className="flex justify-between mt-8">
              <button
                type="button"
                className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-all duration-300"
                onClick={onBack}
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-3 bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white rounded-lg font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-300 shadow-md"
              >
                Next
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default IntroduceYourself;