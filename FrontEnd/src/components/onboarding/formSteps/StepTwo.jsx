import React from "react";
import { ProgressIndicator } from "../ProgressIndicator";
import { MailIcon, PhoneIcon, ChevronDownIcon } from "lucide-react";
import { extractValidEmail } from "@/lib/utils";
import Profile from "@/pages/students/Profile";

export const StepTwo = ({ onNext, onBack, onProfileTypeSelect, formData, onChange }) => {
  const [hasAutoSeparated, setHasAutoSeparated] = React.useState(false);

  // Enhanced function to automatically separate concatenated name, phone, and email
  const separateContactInfo = (text) => {
    if (!text) return { name: '', phone: '', email: '' };

    let name = '';
    let phone = '';
    let email = '';
    let remainingText = text;

    // Email regex pattern
    const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
    
    // Phone regex patterns for various formats
    const phonePatterns = [
      /(\+91[\s-]?[6-9]\d{9})/g,         
      /(\+91[\s-]?\d{10})/g,              
      /([6-9]\d{9})/g,                   
      /(\d{10})/g,                        
      /(\+\d{1,3}[\s-]?\d{6,14})/g,     
    ];

    // Common keywords that might appear before contact info
    const contactKeywords = [
      'email:', 'e-mail:', 'mail:', 'contact:', 'phone:', 'mobile:', 'mob:', 
      'cell:', 'tel:', 'telephone:', 'call:', 'number:', 'ph:', 'contact no:',
      'mobile no:', 'phone no:', 'contact number:', 'mobile number:', 'phone number:'
    ];

    // Clean and normalize text
    let cleanText = remainingText
      .replace(/\s+/g, ' ')  // Replace multiple spaces with single space
      .trim();

    // Extract email
    const emailMatch = cleanText.match(emailRegex);
    if (emailMatch) {
      email = emailMatch[0];
      // Remove email and surrounding keywords from text
      cleanText = cleanText
        .replace(emailRegex, '')
        .replace(/email\s*:\s*/gi, '')
        .replace(/e-?mail\s*:\s*/gi, '')
        .replace(/mail\s*:\s*/gi, '')
        .trim();
    }

    // Extract phone number
    let phoneMatch = null;
    for (const pattern of phonePatterns) {
      phoneMatch = cleanText.match(pattern);
      if (phoneMatch) {
        phone = phoneMatch[0];
        // Clean phone number
        if (!phone.startsWith('+91') && phone.length === 10 && /^[6-9]/.test(phone)) {
          phone = '+91' + phone;
        }
        // Remove phone and surrounding keywords from text
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

    // Remove any remaining contact keywords
    contactKeywords.forEach(keyword => {
      const keywordRegex = new RegExp(keyword.replace(':', '\\s*:\\s*'), 'gi');
      cleanText = cleanText.replace(keywordRegex, '').trim();
    });

    // Extract name (remaining text after removing email and phone)
    name = cleanText
      .replace(/^\s*-+\s*|\s*-+\s*$/g, '')  // Remove leading/trailing dashes
      .replace(/^\s*\|\s*|\s*\|\s*$/g, '')  // Remove leading/trailing pipes
      .replace(/^\s*,\s*|\s*,\s*$/g, '')    // Remove leading/trailing commas
      .replace(/\s+/g, ' ')                  // Replace multiple spaces
      .trim();

    // Additional cleaning for name
    if (name) {
      // Remove common prefixes that might be left over
      const prefixesToRemove = [
        'name:', 'full name:', 'candidate:', 'applicant:', 'resume of:', 'cv of:'
      ];
      
      prefixesToRemove.forEach(prefix => {
        const prefixRegex = new RegExp(`^${prefix}\\s*`, 'gi');
        name = name.replace(prefixRegex, '').trim();
      });

      // Capitalize first letter of each word in name
      name = name.replace(/\b\w/g, l => l.toUpperCase());
    }

    return { name, phone, email };
  };

  // Enhanced function with additional parsing for complex formats
  const separateContactInfoAdvanced = (text) => {
    if (!text) return { name: '', phone: '', email: '' };

    
    // Pattern 1: Name directly followed by "Email:"
    const nameEmailPattern = /^([A-Za-z\s]+?)(?:Email\s*:|E-?mail\s*:)/i;
    const nameEmailMatch = text.match(nameEmailPattern);
    
    if (nameEmailMatch) {
      const extractedName = nameEmailMatch[1].trim();
      const result = separateContactInfo(text);
      
      // If we found a better name match, use it
      if (extractedName && extractedName.length > result.name.length) {
        result.name = extractedName.replace(/\b\w/g, l => l.toUpperCase());
      }
      
      return result;
    }
    // Pattern 2: Name followed by contact info with various separators
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

    // Fallback to regular separation
    return separateContactInfo(text);
  };

  // Automatically separate name, phone, and email when component receives data
  React.useEffect(() => {
    if (formData.name && !hasAutoSeparated && 
        (formData.name.includes('+91') || 
         /\d{10}/.test(formData.name) || 
         /@/.test(formData.name) ||
         /email:/i.test(formData.name) ||
         /mobile:/i.test(formData.name) ||
         /phone:/i.test(formData.name))) {
      
      const { name, phone, email } = separateContactInfoAdvanced(formData.name);
      
      if (name !== formData.name || phone || email) {
        const updates = {
          ...formData,
          name: name || formData.name
        };
        
        // Only update phone if we found one and don't already have one
        if (phone && !formData.phone) {
          updates.phone = phone;
        }
        
        // Only update email if we found one and don't already have one
        if (email && !formData.email) {
          updates.email = email;
        }
        
        onChange(updates);
        setHasAutoSeparated(true);
      }
    }
  }, [formData.name]);

  const handleNameChange = (e) => {
    const { name, value } = e.target;
    // Clean the name field to only contain letters, spaces, and basic punctuation
    const cleanedName = value.replace(/[^a-zA-Z\s\.\-']/g, '');
    onChange({ [name]: cleanedName });
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    const cleanedEmail = extractValidEmail(value);
    onChange({ email: cleanedEmail });
  };

  const handlePhoneChange = (e) => {
    const { name, value } = e.target;
    // Clean phone number to only contain numbers, spaces, +, -, and ()
    const cleanedPhone = value.replace(/[^0-9\s\+\-\(\)]/g, '');
    onChange({ [name]: cleanedPhone });
  };

  const handleProfileTypeChange = (e) => {
    const selectedProfileType = e.target.value;
    onProfileTypeSelect(selectedProfileType);
    onChange({ profileType: selectedProfileType });
  };

  const handleNextClick = () => {
    if (!formData.email || !formData.phone || !formData.profileType || !formData.name) {
      alert("Please fill in all required fields: Name, Email, Phone, and Profile Type.");
      return;
    }
    onNext();
  };

  return (
    <div className="justify-center items-stretch bg-white z-0 flex min-w-60 flex-col w-[560px] my-auto p-12 max-md:max-w-full max-md:px-5">
      <ProgressIndicator currentStep={2} totalSteps={6} />
      <div className="flex w-full flex-col items-stretch justify-center mt-8 max-md:max-w-full">
        <h2 className="text-[32px] font-bold leading-[42px]">Basic Information</h2>
        <p className="text-base font-normal leading-6 mt-2">
          This information will be visible to recruiters.
        </p>

        {/* Your Name Input */}
        <div className="w-full mt-6">
          <label htmlFor="name" className="block text-black">
            Your Name <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center min-h-12 w-full mt-2 p-3 border rounded">
            <input
              type="text"
              id="name"
              required
              name="name"
              placeholder="Your Name"
              className="w-full bg-transparent border-none focus:outline-none"
              value={formData.name || ""}
              onChange={handleNameChange}
            />
          </div>
        </div>

        {/* Email ID Input */}
        <div className="w-full mt-6">
          <label htmlFor="email" className="block text-black">
            Email ID <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center min-h-12 w-full mt-2 p-3 border rounded">
            <MailIcon className="w-6 h-6" />
            <input
              type="email"
              id="email"
              name="email"
              placeholder="name@gmail.com"
              className="w-full bg-transparent border-none focus:outline-none ml-2"
              value={formData.email || ""}
              onChange={handleEmailChange}
              required
            />
          </div>
        </div>

        {/* Phone Number Input */}
        <div className="w-full mt-6">
          <label htmlFor="phone" className="block text-black">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center min-h-12 w-full mt-2 p-3 border rounded">
            <PhoneIcon className="w-6 h-6" />
            <input
              type="tel"
              id="phone"
              name="phone"
              placeholder="e.g. +91 9876543210"
              className="w-full bg-transparent border-none focus:outline-none ml-2"
              value={formData.phone || ""}
              onChange={handlePhoneChange}
              required
            />
          </div>
        </div>

        {/* Profile Type Select */}
        <div className="w-full mt-6 relative">
          <label htmlFor="profileType" className="block text-black">
            Profile Type <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              id="profileType"
              name="profileType"
              value={formData.profileType || ""}
              onChange={handleProfileTypeChange}
              required
              className="items-center appearance-none flex min-h-12 w-full mt-2 p-3 border rounded"
            >
              <option value="" disabled>Select a profile type</option>
              <option value="student">Student</option>
              <option value="fresher">Fresher</option>
              <option value="professional">Professional</option>
            </select>
            <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 pointer-events-none" />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex min-h-12 w-full gap-4 mt-6">
          <button
            type="button"
            onClick={onBack}
            className="text-black px-6 py-3 border rounded-md"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleNextClick}
            className="bg-black text-white px-6 py-3 border rounded-md"
            disabled={!formData.email || !formData.phone || !formData.profileType || !formData.name}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};