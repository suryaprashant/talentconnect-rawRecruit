import React from "react";
import { MailIcon, PhoneIcon, ChevronDownIcon, AlertCircle, User } from "lucide-react";
import { extractValidEmail } from "@/lib/utils";
import { getProfileTypeFromJWT } from "../../../context/RoleContext/jwt";

export const StepTwo = ({ onNext, onBack, onProfileTypeSelect, formData, onChange }) => {
  const parsedData = formData?.parsedData || {};
  const [hasAutoSeparated, setHasAutoSeparated] = React.useState(false);
  const [validationErrors, setValidationErrors] = React.useState({
    name: '',
    email: '',
    phone: '',
    
  });

  React.useEffect(() => {
    const profileType = getProfileTypeFromJWT();

    if (profileType && !formData.profileType) {
      onProfileTypeSelect(profileType);
      onChange({ profileType });
    }
  }, []);


  React.useEffect(() => {
    if (!formData?.parsedData) return;

    const { name, phone, email } = formData.parsedData;
    const updates = {};

    if (name && !formData.name) {
      updates.name = name;
    }
    if (phone && !formData.phone) {
      updates.phone = phone;
    }
    if (email && !formData.email) {
      updates.email = email;
    }

    if (Object.keys(updates).length > 0) {
      onChange(updates);
    }
  }, [formData?.parsedData?.name]);


  const separateContactInfo = (text) => {
    if (!text) return { name: '', phone: '', email: '' };

    let name = '';
    let phone = '';
    let email = '';
    let remainingText = text;

    const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;

    const phonePatterns = [
      /(\+91[\s-]?[6-9]\d{9})/g,
      /(\+91[\s-]?\d{10})/g,
      /([6-9]\d{9})/g,
      /(\d{10})/g,
      /(\+\d{1,3}[\s-]?\d{6,14})/g,
    ];

    const contactKeywords = [
      'email:', 'e-mail:', 'mail:', 'contact:', 'phone:', 'mobile:', 'mob:',
      'cell:', 'tel:', 'telephone:', 'call:', 'number:', 'ph:', 'contact no:',
      'mobile no:', 'phone no:', 'contact number:', 'mobile number:', 'phone number:'
    ];

    let cleanText = remainingText
      .replace(/\s+/g, ' ')
      .trim();

    const emailMatch = cleanText.match(emailRegex);
    if (emailMatch) {
      email = emailMatch[0];
      cleanText = cleanText
        .replace(emailRegex, '')
        .replace(/email\s*:\s*/gi, '')
        .replace(/e-?mail\s*:\s*/gi, '')
        .replace(/mail\s*:\s*/gi, '')
        .trim();
    }

    let phoneMatch = null;
    for (const pattern of phonePatterns) {
      phoneMatch = cleanText.match(pattern);
      if (phoneMatch) {
        phone = phoneMatch[0];
        if (!phone.startsWith('+91') && phone.length === 10 && /^[6-9]/.test(phone)) {
          phone = '+91' + phone;
        }
        cleanText = cleanText
          .replace(pattern, '')
          .replace(/mobile\s*:\s*/gi, '')
          .replace(/phone\s*:\s*/gi, '')
          .replace(/contact\s*:\s*/gi, '')
          .replace(/mob\s*:\s*/gi, '')
          .replace(/cell\s*:\s*/gi, '')
          .replace(/tel\s*:\s*/gi, '')
          .replace(/telephone\s*:\s*/gi, '')
          .replace(/number\s*:\s*/gi, '')
          .replace(/ph\s*:\s*/gi, '')
          .replace(/contact\s+no\s*:\s*/gi, '')
          .replace(/mobile\s+no\s*:\s*/gi, '')
          .replace(/phone\s+no\s*:\s*/gi, '')
          .replace(/contact\s+number\s*:\s*/gi, '')
          .replace(/mobile\s+number\s*:\s*/gi, '')
          .replace(/phone\s+number\s*:\s*/gi, '')
          .trim();
        break;
      }
    }

    contactKeywords.forEach(keyword => {
      const keywordRegex = new RegExp(keyword.replace(':', '\\s*:\\s*'), 'gi');
      cleanText = cleanText.replace(keywordRegex, '').trim();
    });

    name = cleanText
      .replace(/^\s*-+\s*|\s*-+\s*$/g, '')
      .replace(/^\s*\|\s*|\s*\|\s*$/g, '')
      .replace(/^\s*,\s*|\s*,\s*$/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (name) {
      const prefixesToRemove = [
        'name:', 'full name:', 'candidate:', 'applicant:', 'resume of:', 'cv of:'
      ];

      prefixesToRemove.forEach(prefix => {
        const prefixRegex = new RegExp(`^${prefix}\\s*`, 'gi');
        name = name.replace(prefixRegex, '').trim();
      });

      name = name.replace(/\b\w/g, l => l.toUpperCase());
    }

    return { name, phone, email };
  };

  const separateContactInfoAdvanced = (text) => {
    if (!text) return { name: '', phone: '', email: '' };

    const nameEmailPattern = /^([A-Za-z\s]+?)(?:Email\s*:|E-?mail\s*:)/i;
    const nameEmailMatch = text.match(nameEmailPattern);

    if (nameEmailMatch) {
      const extractedName = nameEmailMatch[1].trim();
      const result = separateContactInfo(text);

      if (extractedName && extractedName.length > result.name.length) {
        result.name = extractedName.replace(/\b\w/g, l => l.toUpperCase());
      }

      return result;
    }

    const complexPattern = /^([A-Za-z\s]+?)(?:\s*[-|,]\s*)?(?:Email|E-?mail|Phone|Mobile|Contact)/i;
    const complexMatch = text.match(complexPattern);

    if (complexMatch) {
      const extractedName = complexMatch[1].trim();
      const result = separateContactInfo(text);

      if (extractedName && extractedName.length > result.name.length) {
        result.name = extractedName.replace(/\b\w/g, l => l.toUpperCase());
      }

      return result;
    }

    return separateContactInfo(text);
  };

  React.useEffect(() => {
    if (parsedData?.name && !hasAutoSeparated &&
      (formData.parsedData.name.includes('+91') ||
        /\d{10}/.test(formData.parsedData.name) ||
        /@/.test(formData.parsedData.name) ||
        /email:/i.test(formData.parsedData.name) ||
        /mobile:/i.test(formData.parsedData.name) ||
        /phone:/i.test(formData.parsedData.name))) {

      const { name, phone, email } = separateContactInfoAdvanced(formData.parsedData.name);

      if (name !== formData.parsedData.name || phone || email) {
        const updates = {
          ...formData,
          name: name || formData.parsedData.name
        };

        if (phone && !formData.parsedData.phone) {
          updates.phone = phone;
        }

        if (email && !formData.parsedData.email) {
          updates.email = email;
        }

        onChange(updates);
        setHasAutoSeparated(true);
      }
    }
  }, [parsedData?.name]);

  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'name':
        if (!value.trim()) {
          error = 'Name is required';
        } else if (value.trim().length < 2) {
          error = 'Name must be at least 2 characters';
        }
        break;

      case 'email':
        if (!value.trim()) {
          error = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Please enter a valid email address';
        }
        break;

      case 'phone':
        if (!value.trim()) {
          error = 'Phone number is required';
        } else if (!/^\+?[0-9\s\-\(\)]{10,}$/.test(value.replace(/\s/g, ''))) {
          error = 'Please enter a valid phone number';
        }
        break;

      case 'profileType':
        if (!value) {
          error = 'Please select a profile type';
        }
        break;

      default:
        break;
    }

    return error;
  };

  const handleFieldBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);

    setValidationErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleNameChange = (e) => {
    const { name, value } = e.target;
    const cleanedName = value.replace(/[^a-zA-Z\s\.\-']/g, '');
    onChange({ [name]: cleanedName });

    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    const cleanedEmail = extractValidEmail(value);
    onChange({ email: cleanedEmail });

    if (validationErrors.email) {
      setValidationErrors(prev => ({
        ...prev,
        email: ''
      }));
    }
  };

  const handlePhoneChange = (e) => {
    const { name, value } = e.target;
    const cleanedPhone = value.replace(/[^0-9\s\+\-\(\)]/g, '');
    onChange({ [name]: cleanedPhone });

    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleProfileTypeChange = (e) => {
    const selectedProfileType = e.target.value;
    localStorage.setItem('selectedRole', selectedProfileType);
    onProfileTypeSelect(selectedProfileType);
    onChange({ profileType: selectedProfileType });

    if (validationErrors.profileType) {
      setValidationErrors(prev => ({
        ...prev,
        profileType: ''
      }));
    }
  };

//   const validateAllFields = () => {
//     const errors = {
//       name: validateField('name', formData.parsedData.name || ''),
// //email: validateField('email', formData.parsedData.email || JSON.parse(localStorage.getItem("ChatAppUser")).user.email || ''),
//       email: validateField('email', formData.parsedData.email || JSON.parse(localStorage.getItem("ChatAppUser"))?.user?.email || ''),
// phone: validateField('phone', formData.parsedData.phone || ''),
//       profileType: validateField('profileType', formData.profileType || '')
//     };

//     setValidationErrors(errors);

//     return !Object.values(errors).some(error => error !== '');
//   };

const validateAllFields = () => {
  const errors = {
    // Check manual input (formData.name) first, then fallback to parsedData
    name: validateField('name', formData.name || parsedData.name || ''),
    email: validateField('email', formData.email || parsedData.email || JSON.parse(localStorage.getItem("ChatAppUser") || "{}")?.user?.email || ''),
    phone: validateField('phone', formData.phone || parsedData.phone || ''),
    
  };

  setValidationErrors(errors);
  return !Object.values(errors).some(error => error !== '');
};

  const handleNextClick = () => {
    const isValid = validateAllFields();

    if (!isValid) {
      const firstErrorField = Object.keys(validationErrors).find(
        key => validationErrors[key]
      );

      if (firstErrorField) {
        const element = document.getElementById(firstErrorField);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.focus();
        }
      }
      return;
    }

    onNext();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea]/10 via-[#f093fb]/5 to-[#764ba2]/10">
      {/* Pastel blur background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#667eea]/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-[#f093fb]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-1/3 w-40 h-40 bg-[#764ba2]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-purple-50/50 p-8 w-full max-w-2xl"> {/* Changed to max-w-2xl for wider container */}

          {/* Header with gradient */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-[#667eea]/20 to-[#764ba2]/20 flex items-center justify-center mx-auto mb-4">
              <User className="w-10 h-10 text-[#667eea]" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-2">
              Basic Information
            </h1>
            <p className="text-gray-600 mb-4">
              This information will be visible to recruiters.
            </p>
          </div>

          {/* Wider Form Section */}
          <div className="space-y-6">
            {/* Two-column layout for fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> {/* Added grid layout */}

              {/* Name Field - Full width on mobile, half on desktop */}
              <div className="md:col-span-2"> {/* Name field takes full width */}
                <label htmlFor="name" className="block text-gray-700 font-medium text-sm mb-2">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <div className={`relative flex items-center p-4 border rounded-xl transition-all duration-200 ${validationErrors.name
                  ? 'border-red-300 bg-gradient-to-r from-[#fecaca]/10 to-[#fca5a5]/10'
                  : 'border-gray-300 hover:border-[#667eea] focus-within:border-[#667eea] focus-within:shadow-[0_0_0_3px_rgba(102,126,234,0.1)]'
                  }`}>
                  <User className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                  <input
                    type="text"
                    id="name"
                    required
                    name="name"
                    placeholder="Enter your full name"
                    className="w-full bg-transparent border-none focus:outline-none text-gray-700 placeholder-gray-400 text-base"
                   // value={formData.parsedData.name || ""}
                   value={formData.name || parsedData.name || ""}
                    onChange={handleNameChange}
                    onBlur={handleFieldBlur}
                  />
                </div>
                {validationErrors.name && (
                  <div className="flex items-center mt-2 text-red-500 text-sm">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    {validationErrors.name}
                  </div>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-gray-700 font-medium text-sm mb-2">
                  Email ID <span className="text-red-500">*</span>
                </label>
                <div className={`relative flex items-center p-4 border rounded-xl transition-all duration-200 ${validationErrors.email
                  ? 'border-red-300 bg-gradient-to-r from-[#fecaca]/10 to-[#fca5a5]/10'
                  : 'border-gray-300 hover:border-[#667eea] focus-within:border-[#667eea] focus-within:shadow-[0_0_0_3px_rgba(102,126,234,0.1)]'
                  }`}>
                  <MailIcon className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="name@example.com"
                    className="w-full bg-transparent border-none focus:outline-none text-gray-700 placeholder-gray-400 text-base"
                    //value={formData.parsedData.email || JSON.parse(localStorage.getItem("ChatAppUser")).user.email || ""}
                    // Inside the email <input />
                  // value={parsedData.email || JSON.parse(localStorage.getItem("ChatAppUser"))?.user?.email || ""}
                   value={formData.email || parsedData.email || JSON.parse(localStorage.getItem("ChatAppUser") || "{}")?.user?.email || ""}
                  onChange={handleEmailChange}
                    onBlur={handleFieldBlur}
                    required
                  />
                </div>
                {validationErrors.email && (
                  <div className="flex items-center mt-2 text-red-500 text-sm">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    {validationErrors.email}
                  </div>
                )}
              </div>

              {/* Phone Field */}
              <div>
                <label htmlFor="phone" className="block text-gray-700 font-medium text-sm mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className={`relative flex items-center p-4 border rounded-xl transition-all duration-200 ${validationErrors.phone
                  ? 'border-red-300 bg-gradient-to-r from-[#fecaca]/10 to-[#fca5a5]/10'
                  : 'border-gray-300 hover:border-[#667eea] focus-within:border-[#667eea] focus-within:shadow-[0_0_0_3px_rgba(102,126,234,0.1)]'
                  }`}>
                  <PhoneIcon className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="+91 9876543210"
                    className="w-full bg-transparent border-none focus:outline-none text-gray-700 placeholder-gray-400 text-base"
                   // value={parsedData.phone || ""}
                   value={formData.phone || parsedData.phone || ""}
                    onChange={handlePhoneChange}
                    onBlur={handleFieldBlur}
                    required
                  />
                </div>
                {validationErrors.phone && (
                  <div className="flex items-center mt-2 text-red-500 text-sm">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    {validationErrors.phone}
                  </div>
                )}
              </div>

            </div>

            {/* Profile Type Field - Full width below */}
            {/*{!formData.profileType && (
            <div>
              <label htmlFor="profileType" className="block text-gray-700 font-medium text-sm mb-2">
                Profile Type <span className="text-red-500">*</span>
              </label>
              <div className={`relative border rounded-xl transition-all duration-200 ${validationErrors.profileType
                ? 'border-red-300 bg-gradient-to-r from-[#fecaca]/10 to-[#fca5a5]/10'
                : 'border-gray-300 hover:border-[#667eea] focus-within:border-[#667eea] focus-within:shadow-[0_0_0_3px_rgba(102,126,234,0.1)]'
                }`}>
                <select
                  id="profileType"
                  name="profileType"
                  value={formData.profileType || ""}
                  onChange={handleProfileTypeChange}
                  onBlur={handleFieldBlur}
                  
                  className="appearance-none w-full p-4 bg-transparent border-none focus:outline-none text-gray-700 pr-12 text-base" 
                >
                  <option value="" disabled className="text-gray-400">Select a profile type</option>
                  <option value="student" className="text-gray-700">Student</option>
                  <option value="fresher" className="text-gray-700">Fresher</option>
                </select>
                <ChevronDownIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
              {validationErrors.profileType && (
                <div className="flex items-center mt-2 text-red-500 text-sm">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  {validationErrors.profileType}
                </div>
              )}
            </div>)}*/}

          </div>

          {/* Action Buttons - Wider spacing */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between mt-10">
            <button
              onClick={onBack}
              className="flex items-center justify-center px-8 py-4 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl text-gray-700 hover:bg-white/90 hover:shadow-md transition-all duration-200 font-medium text-base" /* Increased padding and text */
            >
              Back
            </button>
            <button
              onClick={handleNextClick}
              //disabled={!formData.parsedData.phone || !formData.profileType || !formData.parsedData.name}
           //   disabled={!parsedData.phone || !formData.profileType || !parsedData.name}
           disabled={!formData.phone && !parsedData.phone}
              className="flex items-center justify-center px-8 py-4 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-200 font-medium text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none" /* Increased padding and text */
            >
              Next
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};