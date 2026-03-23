import React, { useState, useEffect , useRef} from "react";
import { ProgressIndicator } from "../ProgressIndicator";
import { ChevronDownIcon, X , CheckCircle, AlertCircle, Mail} from "lucide-react"; // Import X for the tags
import CreatableSelect from "react-select/creatable";
import { fetchAllCompaniesName, getCompanyMasterDataByType,

  createCompanyMasterData } from '@/lib/Company_AxiosInstance';
const experienceOptions = [
  "Less than 1 year", "1-3 years", "3-5 years", "5-8 years",
  "8-12 years", "12-15 years", "15+ years",
];

const noticePeriodOptions = [
  { value: 0, label: "Immediate" }, { value: 15, label: "15 Days" },
  { value: 30, label: "1 Month" }, { value: 45, label: "45 Days" },
  { value: 60, label: "2 Months" }, { value: 90, label: "3 Months" },
];

const domainKnowledgeOptions = [
  "FinTech", "E-commerce", "Healthcare", "SaaS (Software as a Service)",
  "EdTech", "Logistics & Supply Chain", "Gaming", "Telecommunications",
];

// const companyOptions = [
//   ...(formData.currentCompany ? [formData.currentCompany] : []),
//   "Tech Mahindra", "Infosys", "Tata Consultancy Services (TCS)", "Wipro",
//   "HCL Technologies", "Cognizant", "Accenture", "Capgemini", "Other"
// ];

// --- Helper Components for Multi-Select UI (Copied from previous file for style) ---

// ── Email domain verification helpers ──────────────────────────────────────

const FREE_PROVIDERS = [
  "gmail","yahoo","hotmail","outlook","rediffmail",
  "icloud","protonmail","zoho","yandex","aol",
];

/**
 * Builds TWO domain candidates from a company name:
 *
 * 1. FULL SLUG  — every word joined, common suffixes stripped
 *    "Google LLC"                  → "google"
 *    "Tata Consultancy Services"   → "tataconsultancyservices"
 *    "Tech Mahindra Ltd"           → "techmahindra"
 *
 * 2. ACRONYM — first letter of each meaningful word (≥2 chars, non-suffix)
 *    "Tata Consultancy Services"   → "tcs"
 *    "Tech Mahindra"               → "tm"
 *    "Google"                      → null  (single word → no acronym)
 *
 * Both are matched against the domain label (part before first dot).
 */
const STRIP_WORDS = new Set([
  "private","pvt","ltd","limited","inc","llc","llp",
  "corp","corporation","group","and","the","of","&",
]);

function buildCandidates(companyName) {
  if (!companyName) return [];

  // Extract explicit abbreviation from parentheses e.g. "(TCS)"
  const parenMatch = companyName.match(/\(([^)]+)\)/);
  const parenAbbrev = parenMatch
    ? parenMatch[1].toLowerCase().replace(/\s+/g, "")
    : null;

  const cleaned = companyName
    .replace(/\([^)]*\)/g, "")          // remove parentheticals
    .replace(/[^a-zA-Z0-9\s]/g, " ")    // punctuation → space
    .trim();

  const words = cleaned.split(/\s+/).filter(Boolean);
  const meaningfulWords = words.filter(
    (w) => !STRIP_WORDS.has(w.toLowerCase())
  );

  // 1. Full slug (meaningful words joined)
  const fullSlug = meaningfulWords.map((w) => w.toLowerCase()).join("");

  // 2. Acronym (first letter of each meaningful word, only if >1 word)
  const acronym =
    meaningfulWords.length > 1
      ? meaningfulWords.map((w) => w[0].toLowerCase()).join("")
      : null;

  const candidates = new Set();
  if (fullSlug) candidates.add(fullSlug);
  if (acronym) candidates.add(acronym);
  if (parenAbbrev) candidates.add(parenAbbrev);

  return Array.from(candidates);
}

/**
 * Core check: domain label must EXACTLY equal one of the candidates.
 * e.g. "google" === "google" ✓
 *      "tcs"    === "tcs"    ✓
 *      "tataconsultancyservices" === "tataconsultancyservices" ✓
 */
function doesEmailMatchCompany(email, companyName) {
  if (!email || !companyName) return false;
  const atIdx = email.lastIndexOf("@");
  if (atIdx === -1) return false;

  const domain = email.slice(atIdx + 1).toLowerCase();
  const domainLabel = domain.split(".")[0];
  if (!domainLabel) return false;

  if (FREE_PROVIDERS.includes(domainLabel)) return "free";

  const candidates = buildCandidates(companyName);
  return candidates.includes(domainLabel) ? "valid" : "invalid";
}

// Badge shown below the email input
const EmailVerificationBadge = ({ status }) => {
  if (status === "valid")
    return (
      <div className="flex items-center gap-2 mt-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-md px-3 py-2">
        <CheckCircle size={15} className="shrink-0" />
        <span>Email domain matches the company — verified.</span>
      </div>
    );
  if (status === "invalid")
    return (
      <div className="flex items-center gap-2 mt-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
        <AlertCircle size={15} className="shrink-0" />
        <span>
          Domain doesn&apos;t match the company. You can still proceed but it
          won&apos;t be verified.
        </span>
      </div>
    );
  if (status === "free")
    return (
      <div className="flex items-center gap-2 mt-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
        <AlertCircle size={15} className="shrink-0" />
        <span>Please use your official work email, not a personal address.</span>
      </div>
    );
  return null;
};
// ────────────────────────────────────────────────────────────────────────────

const SelectedTag = ({ item, onRemove }) => (
    <div className="flex items-center bg-gray-200 text-sm px-3 py-1 rounded-full text-black">
        <span>{item}</span>
        <button 
            type="button" 
            onClick={onRemove} 
            className="ml-2 text-gray-600 hover:text-black"
        >
            <X size={14} />
        </button>
    </div>
);
// --- End Helper Components ---


export const ProfessionalDetailsStep = ({ onNext, onBack, formData, onChange }) => {

  const [companyOptions, setCompanyOptions] = useState([]);
const [isLoadingCompanies, setIsLoadingCompanies] = useState(false);
 
const [localFormData, setLocalFormData] = useState({
    totalExperience: formData.totalExperience || "",
    domainKnowledge: formData.domainKnowledge || [],
    currentCompany: formData.currentCompany || "",
    noticePeriod: formData.noticePeriod || "",
    servingNoticePeriod: formData.servingNoticePeriod === true || formData.servingNoticePeriod === 'true',
    noticePeriodStartDate: formData.noticePeriodStartDate || "",
    // existing fields stay, add these two:
companyEmail: formData.companyEmail || "",
emailVerified: formData.emailVerified === true || formData.emailVerified === "true",
  });
// Derived verification status — recomputes on every render
const emailVerificationStatus = (() => {
  const { companyEmail, currentCompany } = localFormData;
  if (!companyEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(companyEmail))
    return "idle";
  if (!currentCompany) return "idle";
  return doesEmailMatchCompany(companyEmail, currentCompany);
})();

// Keep emailVerified boolean in sync with live status
useEffect(() => {
  setLocalFormData((prev) => ({
    ...prev,
    emailVerified: emailVerificationStatus === "valid",
  }));
}, [emailVerificationStatus]);

useEffect(() => {
  const loadCompanies = async () => {
    try {
      setIsLoadingCompanies(true);
      const response = await fetchAllCompaniesName();

      let companyData = [];
      if (Array.isArray(response?.data)) {
        companyData = response.data;
      } else if (Array.isArray(response)) {
        companyData = response;
      }

      // companyData is likely an array of { value, label } already
      // or strings — check what CompanyInfoStep receives and match it
      setCompanyOptions(companyData);
    } catch (err) {
      console.error("Failed to load companies", err);
    } finally {
      setIsLoadingCompanies(false);
    }
  };
  loadCompanies();
}, []);



  const [isDomainDropdownOpen, setIsDomainDropdownOpen] = useState(false);
  const domainDropdownRef = useRef(null);

  useEffect(() => {
    const updates = {};
    if (formData.totalExperience) updates.totalExperience = formData.totalExperience;
    if (formData.domainKnowledge && Array.isArray(formData.domainKnowledge)) {
      updates.domainKnowledge = formData.domainKnowledge;
    }
    if (formData.currentCompany) updates.currentCompany = formData.currentCompany;
    if (formData.noticePeriod) updates.noticePeriod = formData.noticePeriod;
    
    // Convert boolean string to boolean for servingNoticePeriod
    const servingNoticeValue = formData.servingNoticePeriod === true || formData.servingNoticePeriod === 'true';
    updates.servingNoticePeriod = servingNoticeValue;

    if (formData.noticePeriodStartDate) updates.noticePeriodStartDate = formData.noticePeriodStartDate;

    if (Object.keys(updates).length > 0) {
      setLocalFormData(prev => ({ ...prev, ...updates }));
    }
    if (formData.companyEmail) updates.companyEmail = formData.companyEmail;
if (formData.emailVerified !== undefined)
  updates.emailVerified =
    formData.emailVerified === true || formData.emailVerified === "true";
  }, [formData]);

  // Handle outside click logic for the custom dropdown
 useEffect(() => {
    const handleClickOutside = (event) => {
      if (domainDropdownRef.current && !domainDropdownRef.current.contains(event.target)) {
        setIsDomainDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

 const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setLocalFormData((prev) => ({
      ...prev,
      [name]: newValue,
      ...(name === "servingNoticePeriod" && !checked && { noticePeriodStartDate: "" }),
    }));
  };
  
  // --- MODIFIED HANDLER FOR MULTI-SELECT DOMAIN KNOWLEDGE ---
  const handleDomainChange = (domain) => {
    setLocalFormData(prev => {
      const newDomains = prev.domainKnowledge.includes(domain)
        ? prev.domainKnowledge.filter(d => d !== domain)
        : [...prev.domainKnowledge, domain];
      return {...prev, domainKnowledge: newDomains };
    });
  };

  // Helper to remove a tag
  const removeDomainTag = (domain) => {
    setLocalFormData(prev => ({
        ...prev,
        domainKnowledge: prev.domainKnowledge.filter(d => d !== domain)
    }));
  }

  const handleNextClick = () => {
    onChange({ ...formData, ...localFormData });
    onNext();
  };
  
  const calculateRemainingDays = () => {
    if (!localFormData.servingNoticePeriod || !localFormData.noticePeriodStartDate || localFormData.noticePeriod === "") {
      return null;
    }
    const noticePeriodInDays = parseInt(localFormData.noticePeriod, 10);
    if (isNaN(noticePeriodInDays) || noticePeriodInDays < 0) return null;

    const startDate = new Date(localFormData.noticePeriodStartDate);
    const today = new Date();
    startDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + noticePeriodInDays);

    if (today >= endDate) return "Notice period complete";
    
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return `${diffDays} day(s) remaining until ${endDate.toLocaleDateString()}`;
  };

  const remainingDays = calculateRemainingDays();

  return (
    <div className="justify-center items-stretch bg-white z-0 flex min-w-60 flex-col w-[560px] my-auto p-12 rounded-lg shadow-lg max-md:max-w-full max-md:px-5">
      <ProgressIndicator currentStep={6} totalSteps={7} /> 
      <div className="flex w-full flex-col items-stretch justify-center mt-8 max-md:max-w-full">
        <h2 className="text-gray-900 text-[32px] font-bold leading-[42px] max-md:max-w-full">
          
          
        </h2>
        <p className="text-gray-600 text-base font-normal leading-6 mt-2 max-md:max-w-full">
          Provide your current employment and availability information.
        </p>
        <form className="w-full text-base font-normal mt-8 max-md:max-w-full">
          
          {/* Total Years of Experience */}
          <div className="w-full">
            <label htmlFor="totalExperience" className="block text-black mb-2 font-medium">Total Years of Experience</label>
            <div className="relative">
              <select id="totalExperience" name="totalExperience" value={localFormData.totalExperience} onChange={handleChange} className="appearance-none bg-white flex min-h-12 w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-black focus:border-black">
                <option value="" disabled>Select your experience range</option>
                {experienceOptions.map(exp => <option key={exp} value={exp}>{exp}</option>)}
              </select>
              <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Domain Knowledge (Multi-Select Dropdown with Tags) */}
          <div className="w-full mt-6">
            <label className="block text-black mb-2 font-medium">Domain Knowledge</label>
            
            <div className="flex flex-wrap gap-2 mb-2">
                {localFormData.domainKnowledge.map(domain => (
                    <SelectedTag 
                        key={domain} 
                        item={domain} 
                        onRemove={() => removeDomainTag(domain)} 
                    />
                ))}
            </div>

            <div className="relative" ref={domainDropdownRef}>
              <button 
                type="button" 
                onClick={() => setIsDomainDropdownOpen(!isDomainDropdownOpen)} 
                className="text-left appearance-none bg-white flex items-center justify-between min-h-12 w-full p-3 border border-gray-300 rounded hover:border-gray-400 focus:ring-2 focus:ring-black focus:border-black"
              >
                <span className={localFormData.domainKnowledge.length > 0 ? "text-gray-800" : "text-gray-500"}>
                    Select your domain(s)
                </span>
                <ChevronDownIcon className={`w-6 h-6 text-gray-400 transition-transform duration-200 ${isDomainDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isDomainDropdownOpen && (
                <div className="absolute top-full mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                    {domainKnowledgeOptions.map(domain => (
                        // Use onMouseDown to handle selection while keeping dropdown open
                        <label 
                            key={domain} 
                            onMouseDown={(e) => { e.preventDefault(); handleDomainChange(domain); }} 
                            className="flex items-center w-full px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-800"
                        >
                            <input 
                                type="checkbox" 
                                readOnly // Prevent direct click handler; let onMouseDown handle state
                                checked={localFormData.domainKnowledge.includes(domain)} 
                                className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black mr-3" 
                            />
                            {domain}
                        </label>
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* Current Company */}
       <div className="w-full mt-6">
  <label className="block text-black mb-2 font-medium">
    Current Company
  </label>

  <CreatableSelect
    isClearable
    isLoading={isLoadingCompanies}
    options={companyOptions}
    getOptionLabel={(e) => e.label}
getOptionValue={(e) => e.value}
 value={
  localFormData.currentCompany
    ? {
        value: localFormData.currentCompany,
        label: localFormData.currentCompany,
      }
    : null
}
    placeholder="Select or type your company"
   onChange={async (selected) => {
 // AFTER
if (!selected) {
  setLocalFormData(prev => ({
    ...prev,
    currentCompany: "",
    companyEmail: "",
    emailVerified: false,
  }));
  return;
}
  if (!selected.__isNew__) {
    setLocalFormData(prev => ({ ...prev, currentCompany: selected.value }));
    return;
  }

  // ✅ Just add locally — no DB call needed
  const newOption = {
    value: selected.value,
    label: selected.value,
  };

  setCompanyOptions(prev => [...prev, newOption]);
  setLocalFormData(prev => ({ ...prev, currentCompany: selected.value }));
}}
  />
</div>

{/* Company Official Email */}
<div className="w-full mt-6">
  <label htmlFor="companyEmail" className="block text-black mb-2 font-medium">
    Company Official Email
    {localFormData.emailVerified && (
      <span className="ml-2 inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-100 border border-green-200 rounded-full px-2 py-0.5">
        <CheckCircle size={11} />
        Verified
      </span>
    )}
  </label>
  <div className="relative">
    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
      <Mail size={16} />
    </span>
    <input
      id="companyEmail"
      name="companyEmail"
      type="email"
      value={localFormData.companyEmail}
      onChange={handleChange}
      placeholder="yourname@yourcompany.com"
      className={`pl-9 flex min-h-12 w-full p-3 border rounded focus:ring-2 focus:outline-none transition-colors ${
        emailVerificationStatus === "valid"
          ? "border-green-400 focus:ring-green-300 bg-green-50"
          : emailVerificationStatus === "invalid"
          ? "border-amber-400 focus:ring-amber-300 bg-amber-50"
          : emailVerificationStatus === "free"
          ? "border-red-400 focus:ring-red-300 bg-red-50"
          : "border-gray-300 focus:ring-black focus:border-black"
      }`}
    />
  </div>
  <EmailVerificationBadge status={emailVerificationStatus} />
  {!localFormData.currentCompany && localFormData.companyEmail.length > 0 && (
    <p className="text-xs text-gray-500 mt-1">
      Select a company above so we can verify this email.
    </p>
  )}
</div>

          {/* Notice Period */}
          <div className="w-full mt-6">
            <label htmlFor="noticePeriod" className="block text-black mb-2 font-medium">Notice Period</label>
            <div className="relative">
              <select id="noticePeriod" name="noticePeriod" value={localFormData.noticePeriod} onChange={handleChange} className="appearance-none bg-white flex min-h-12 w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-black focus:border-black">
                <option value="" disabled>Select your notice period</option>
                {noticePeriodOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
              <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400 pointer-events-none" />
            </div>
          </div>
          
          {/* Serving Notice Period Checkbox and Date Picker */}
          <div className="w-full mt-6">
              <div className="flex items-center gap-3">
                <input id="servingNoticePeriod" name="servingNoticePeriod" type="checkbox" checked={localFormData.servingNoticePeriod} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black" />
                <label htmlFor="servingNoticePeriod" className="text-black font-medium select-none">Are you currently serving your notice period?</label>
              </div>
            {localFormData.servingNoticePeriod && (
              <div className="mt-4 pl-7">
                <label htmlFor="noticePeriodStartDate" className="block text-black mb-2 font-medium">Notice Period Start Date</label>
                <input id="noticePeriodStartDate" name="noticePeriodStartDate" type="date" value={localFormData.noticePeriodStartDate} onChange={handleChange} className="flex min-h-12 w-full p-3 border border-gray-300 rounded" />
                {remainingDays && (
                    <p className={`text-sm mt-2 ${remainingDays.includes('complete') ? 'text-green-600 font-medium' : 'text-gray-600'}`}>
                        {remainingDays}
                    </p>
                )}
              </div>
            )}
          </div>
          
          <div className="flex justify-end gap-4 mt-8">
            <button type="button" onClick={onBack} className="px-6 py-3 border border-gray-300 rounded-md font-semibold text-gray-700 hover:bg-gray-50">Back</button>
            <button type="button" onClick={handleNextClick} className="bg-black text-white px-6 py-3 border border-black rounded-md font-semibold hover:bg-gray-800">Next</button>
          </div>
        </form>
      </div>
    </div>
  );
};