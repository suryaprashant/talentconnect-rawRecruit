import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import FormField from '@/components/company/FormField';
import CreatableSelect from "react-select/creatable";
import { getCompanyMasterDataByType,
  createCompanyMasterData } from '@/lib/Company_AxiosInstance';


const PersonalInfoStep = ({ formData, handleChange, nextStep, prevStep }) => {
  const [errors, setErrors] = useState({});
  const [designationOptions, setDesignationOptions] = useState([]);

  useEffect(() => {
    const fetchDesignations = async () => {
      try {
        const res = await getCompanyMasterDataByType("COMPANY_DESIGNATION");
        setDesignationOptions(
          (res?.data?.data || []).map(item => ({
            value: item.value,
            label: item.value,
          }))
        );
      } catch (err) {
        console.error("Failed to fetch designations", err);
      }
    };

    fetchDesignations();
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Your name is required.';
    if (!formData.designation) newErrors.designation = 'Please select a designation.';
    if (!formData.workEmail) {
      newErrors.workEmail = 'A work email is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.workEmail)) {
      newErrors.workEmail = 'Please enter a valid email address.';
    }
    if (!formData.mobile) {
      newErrors.mobile = 'A mobile number is required.';
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = 'Please enter a valid 10-digit mobile number.';
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      nextStep();
    }
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    handleChange(name, value);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#667eea]/15 via-[#f093fb]/10 to-[#764ba2]/15 p-4">
      {/* Blur Background around card */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-[#667eea]/10 to-[#764ba2]/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-[#f093fb]/10 to-[#f5576c]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-2xl">
        {/* Blur background behind card */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 backdrop-blur-sm rounded-2xl -inset-x-4 bottom-0"></div>

        <motion.div
          className="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-100 p-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {/* Decorative top bar */}
          <div className="h-1 bg-gradient-to-r from-[#667eea] via-[#f093fb] to-[#43e97b] rounded-t-2xl absolute top-0 left-0 right-0"></div>

          <h1 className="text-2xl font-bold mb-1 text-gray-800">Introduce Yourself as a Company!</h1>
          <p className="text-gray-600 mb-6">
            Help candidates connect with the right recruiter in your company!
          </p>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>

            <FormField
              label="Enter your name"
              name="name"
              value={formData.name}
              onChange={handleFieldChange}
              placeholder="Your full name"
              error={errors.name}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Designation <span className="text-red-500">*</span>
              </label>

              <CreatableSelect
                isClearable
                placeholder="Select or type designation"
                options={designationOptions}
                value={
                  designationOptions.find(
                    opt => opt.value === formData.designation
                  ) || null
                }
                onChange={async (selected) => {
                  if (!selected) {
                    handleChange("designation", "");
                    return;
                  }
                
                  // Existing designation
                  if (!selected.__isNew__) {
                    handleChange("designation", selected.value);
                    return;
                  }
                
                  // New designation typed + Enter
                  try {
                    const res = await createCompanyMasterData({
                      type: "COMPANY_DESIGNATION",
                      value: selected.value,
                      isCustom: true,
                    });
                  
                    const savedValue = res.data.data.value;
                  
                    const newOption = {
                      value: savedValue,
                      label: savedValue,
                    };
                  
                    setDesignationOptions(prev => [...prev, newOption]);
                    handleChange("designation", savedValue);
                  } catch (err) {
                    console.error("Failed to create designation", err);
                  }
                }}
              />

              {errors.designation && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.designation}
                </p>
              )}
            </div>

            <FormField
              label="Enter your work email"
              type="email"
              name="workEmail"
              value={formData.workEmail}
              onChange={handleFieldChange}
              placeholder="hello@xyz.com"
              error={errors.workEmail}
              required
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              }
            />

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Enter your mobile no. <span className="text-red-500">*</span>
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </div>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleFieldChange}
                  placeholder="1234567890"
                  className={`block w-full pl-10 pr-3 py-2 border ${errors.mobile ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#667eea]/30 focus:border-[#667eea] transition-all duration-300 bg-white/80`}
                  required
                />
              </div>
              {errors.mobile && <p className="mt-1 text-sm text-red-600">{errors.mobile}</p>}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                LinkedIn Profile (Optional)
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </div>
                <input
                  type="url"
                  name="linkedIn"
                  value={formData.linkedIn}
                  onChange={handleFieldChange}
                  placeholder="https://linkedin.com/in/yourname"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#667eea]/30 focus:border-[#667eea] transition-all duration-300 bg-white/80"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">Example: https://linkedin.com/in/yourname</p>
            </div>

            <div className="flex justify-end mt-8 space-x-4">
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-all duration-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-lg font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-300 shadow-md"
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

export default PersonalInfoStep;