import { useState } from 'react';
import { Mail, Phone, Upload, Globe, Linkedin } from 'lucide-react';
import axios from 'axios'; // Import axios

export default function CompanyProfileForm() {
    const [activeTab, setActiveTab] = useState('Profile');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // State for Company Details
    const [companyDetails, setCompanyDetails] = useState({
        companyName: '',
        description: '',
        companyType: '',
        industryType: '',
        numberOfEmployees: '',
        establishedYear: '',
        phoneNumber: '',
        alternatePhoneNumber: '',
        companyLocation: '',
        state: '',
        city: '',
        country: '',
        pincode: '',
        companyLinkedin: '', // Added based on backend schema
        websiteUrl: ''       // Added based on backend schema
    });

    // State for Hiring Preferences
    const [hiringPreferences, setHiringPreferences] = useState({
        hiringPara: '', // This field was not explicitly in the original UI but is in the backend model
        jobRoles: [],
        hiringLocations: [],
        lookingFor: '',
        employmentType: []
    });

    // State for KYC Details
    const [kycDetails, setKycDetails] = useState({
        TAN: '',
        GSTNumber: '',
        companyRegistrationNumber: '',
        kycStatus: '', // Default value can be set by backend or frontend
        photoVerificationStatus: '', // Default value can be set by backend or frontend
        aadharNumber: '',
        nameOnAadharCard: '',
        addressLabel: '',
        address: '',
        country: '',
        state: '',
        city: '',
        pincode: '',
        GSTIN: ''
    });

    // File states
    const [backgroundImage, setBackgroundImage] = useState(null);
    const [kycDocuments, setKycDocuments] = useState([]);

    const handleCompanyDetailsChange = (e) => {
        const { name, value } = e.target;
        setCompanyDetails(prev => ({ ...prev, [name]: value }));
    };

    const handleHiringPreferencesChange = (e) => {
        const { name, value } = e.target;
        // For multi-selects, you might need special handling
        if (name === 'jobRoles' || name === 'hiringLocations' || name === 'employmentType') {
            const options = Array.from(e.target.options).filter(option => option.selected).map(option => option.value);
            setHiringPreferences(prev => ({ ...prev, [name]: options }));
        } else {
            setHiringPreferences(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleKycDetailsChange = (e) => {
        const { name, value } = e.target;
        setKycDetails(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (name === 'backgroundImage') {
            setBackgroundImage(files[0]);
        } else if (name === 'kycDocuments') {
            setKycDocuments(Array.from(files));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        const formData = new FormData();
        // Append JSON parts as strings
        formData.append('companyDetails', JSON.stringify(companyDetails));
        formData.append('hiringPreferences', JSON.stringify(hiringPreferences));
        formData.append('kycDetails', JSON.stringify(kycDetails));

        // Append files
        if (backgroundImage) {
            formData.append('backgroundImage', backgroundImage);
        }
        kycDocuments.forEach((doc) => {
            formData.append('kycDocuments', doc);
        });

        try {
            // Replace with your actual backend URL
            const response = await axios.post('http://localhost:5000/api/companyDashboard/profile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true, // Important for sending cookies
            });
            setSuccess('Company profile created successfully!');
            console.log('Profile created:', response.data);
            // You might want to clear the form or redirect here
        } catch (err) {
            console.error('Error creating profile:', err.response?.data || err.message);
            setError(err.response?.data?.message || 'Failed to create company profile.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col w-full bg-gray-50 min-h-screen">
            {/* Main Content */}
            <div className="container mx-auto py-6 px-4">
                {/* About Section */}
                <div className="mb-6">
                    <h2 className="text-xl font-bold mb-2">About</h2>
                    <p className="text-gray-600 mb-6">
                        Fill in your company details to create your profile.
                    </p>
                </div>

                {/* Submission Status */}
                {loading && <div className="text-blue-600 mb-4">Submitting...</div>}
                {error && <div className="text-red-600 mb-4">{error}</div>}
                {success && <div className="text-green-600 mb-4">{success}</div>}

                <form onSubmit={handleSubmit} className="bg-white border rounded-md">
                    {/* Company Details Section */}
                    <div className="border-b">
                        <div className="grid md:grid-cols-12 gap-4 p-6">
                            <div className="md:col-span-3">
                                <h3 className="font-bold mb-2">Company Details</h3>
                                <p className="text-sm text-gray-600">
                                    Provide general information about your company.
                                </p>
                            </div>

                            <div className="md:col-span-9">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block mb-1 text-sm font-medium" htmlFor="companyName">
                                            Company Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            id="companyName"
                                            type="text"
                                            name="companyName"
                                            value={companyDetails.companyName}
                                            onChange={handleCompanyDetailsChange}
                                            className="w-full border border-gray-300 p-2 rounded"
                                            placeholder="e.g., Tech Solutions Inc."
                                            required
                                        />
                                        <div className="mt-1">
                                            <a href="#" className="text-indigo-600 text-sm">Register Your Company</a>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block mb-1 text-sm font-medium" htmlFor="description">
                                            Description <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            value={companyDetails.description}
                                            onChange={handleCompanyDetailsChange}
                                            className="w-full border border-gray-300 p-2 rounded"
                                            rows="4"
                                            placeholder="Tell us about your company..."
                                            required
                                        ></textarea>
                                    </div>

                                    <div>
                                        <label className="block mb-1 text-sm font-medium" htmlFor="companyType">
                                            Company Type <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            id="companyType"
                                            name="companyType"
                                            value={companyDetails.companyType}
                                            onChange={handleCompanyDetailsChange}
                                            className="w-full border border-gray-300 p-2 pr-8 rounded appearance-none"
                                            required
                                        >
                                            <option value="">Select Type</option>
                                            <option value="Product">Product Based</option>
                                            <option value="Service">Service Based</option>
                                            <option value="Startup">Startup</option>
                                            <option value="MNC">MNC</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block mb-1 text-sm font-medium" htmlFor="industryType">
                                            Industry Type <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            id="industryType"
                                            name="industryType"
                                            value={companyDetails.industryType}
                                            onChange={handleCompanyDetailsChange}
                                            className="w-full border border-gray-300 p-2 pr-8 rounded appearance-none"
                                            required
                                        >
                                            <option value="">Select Industry</option>
                                            <option value="IT">Information Technology</option>
                                            <option value="Finance">Finance</option>
                                            <option value="Healthcare">Healthcare</option>
                                            <option value="Education">Education</option>
                                            <option value="Manufacturing">Manufacturing</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block mb-1 text-sm font-medium" htmlFor="numberOfEmployees">
                                            Number of Employees <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            id="numberOfEmployees"
                                            name="numberOfEmployees"
                                            value={companyDetails.numberOfEmployees}
                                            onChange={handleCompanyDetailsChange}
                                            className="w-full border border-gray-300 p-2 pr-8 rounded appearance-none"
                                            required
                                        >
                                            <option value="">Select Range</option>
                                            <option value="1-10">1-10</option>
                                            <option value="11-50">11-50</option>
                                            <option value="51-200">51-200</option>
                                            <option value="201-1000">201-1000</option>
                                            <option value="1000+">1000+</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block mb-1 text-sm font-medium" htmlFor="establishedYear">
                                            Established Year <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            id="establishedYear"
                                            type="text"
                                            name="establishedYear"
                                            value={companyDetails.establishedYear}
                                            onChange={handleCompanyDetailsChange}
                                            className="w-full border border-gray-300 p-2 rounded"
                                            placeholder="e.g., 2005"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block mb-1 text-sm font-medium" htmlFor="phoneNumber">
                                            Contact Number <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                <Phone size={16} className="text-gray-500" />
                                            </div>
                                            <input
                                                id="phoneNumber"
                                                type="text"
                                                name="phoneNumber"
                                                value={companyDetails.phoneNumber}
                                                onChange={handleCompanyDetailsChange}
                                                className="w-full border border-gray-300 p-2 pl-10 rounded"
                                                placeholder="1234567890"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block mb-1 text-sm font-medium" htmlFor="alternatePhoneNumber">
                                            Alternate Number
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                <Phone size={16} className="text-gray-500" />
                                            </div>
                                            <input
                                                id="alternatePhoneNumber"
                                                type="text"
                                                name="alternatePhoneNumber"
                                                value={companyDetails.alternatePhoneNumber}
                                                onChange={handleCompanyDetailsChange}
                                                className="w-full border border-gray-300 p-2 pl-10 rounded"
                                                placeholder="Optional"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block mb-1 text-sm font-medium" htmlFor="companyLocation">
                                            Company Location
                                        </label>
                                        <input
                                            id="companyLocation"
                                            type="text"
                                            name="companyLocation"
                                            value={companyDetails.companyLocation}
                                            onChange={handleCompanyDetailsChange}
                                            className="w-full border border-gray-300 p-2 rounded"
                                            placeholder="e.g., Main Office Address"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block mb-1 text-sm font-medium" htmlFor="state">State</label>
                                            <input
                                                id="state"
                                                type="text"
                                                name="state"
                                                value={companyDetails.state}
                                                onChange={handleCompanyDetailsChange}
                                                className="w-full border border-gray-300 p-2 rounded"
                                                placeholder="State"
                                            />
                                        </div>

                                        <div>
                                            <label className="block mb-1 text-sm font-medium" htmlFor="city">City</label>
                                            <input
                                                id="city"
                                                type="text"
                                                name="city"
                                                value={companyDetails.city}
                                                onChange={handleCompanyDetailsChange}
                                                className="w-full border border-gray-300 p-2 rounded"
                                                placeholder="City"
                                            />
                                        </div>

                                        <div>
                                            <label className="block mb-1 text-sm font-medium" htmlFor="country">Country</label>
                                            <input
                                                id="country"
                                                type="text"
                                                name="country"
                                                value={companyDetails.country}
                                                onChange={handleCompanyDetailsChange}
                                                className="w-full border border-gray-300 p-2 rounded"
                                                placeholder="Country"
                                            />
                                        </div>

                                        <div>
                                            <label className="block mb-1 text-sm font-medium" htmlFor="pincode">Pincode</label>
                                            <input
                                                id="pincode"
                                                type="text"
                                                name="pincode"
                                                value={companyDetails.pincode}
                                                onChange={handleCompanyDetailsChange}
                                                className="w-full border border-gray-300 p-2 rounded"
                                                placeholder="Pincode"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block mb-1 text-sm font-medium" htmlFor="backgroundImage">
                                            Background Image (Company Cover Photo)
                                        </label>
                                        <input
                                            id="backgroundImage"
                                            type="file"
                                            name="backgroundImage"
                                            onChange={handleFileChange}
                                            className="w-full border border-gray-300 p-2 rounded"
                                            accept="image/*"
                                        />
                                        {backgroundImage && <p className="text-sm text-gray-500 mt-1">Selected: {backgroundImage.name}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end p-4 border-t">
                            {/* Removed "Edit" button logic for now, as it's a submission form */}
                        </div>
                    </div>

                    {/* Hiring Preferences Section */}
                    <div className="border-b">
                        <div className="grid md:grid-cols-12 gap-4 p-6">
                            <div className="md:col-span-3">
                                <h3 className="font-bold mb-2">Hiring Preferences</h3>
                                <p className="text-sm text-gray-600">
                                    Define your ideal candidate and hiring needs.
                                </p>
                            </div>

                            <div className="md:col-span-9">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block mb-1 text-sm font-medium" htmlFor="hiringPara">
                                            Hiring Paragraph
                                        </label>
                                        <textarea
                                            id="hiringPara"
                                            name="hiringPara"
                                            value={hiringPreferences.hiringPara}
                                            onChange={handleHiringPreferencesChange}
                                            className="w-full border border-gray-300 p-2 rounded"
                                            rows="3"
                                            placeholder="Describe your hiring philosophy..."
                                        ></textarea>
                                    </div>
                                    <div>
                                        <label className="block mb-1 text-sm font-medium" htmlFor="jobRoles">Job Roles You Hire For</label>
                                        <select
                                            id="jobRoles"
                                            name="jobRoles"
                                            multiple // Enable multiple selection
                                            value={hiringPreferences.jobRoles}
                                            onChange={handleHiringPreferencesChange}
                                            className="w-full border border-gray-300 p-2 pr-8 rounded appearance-none h-32" // Increased height for multi-select
                                        >
                                            <option value="Software Engineer">Software Engineer</option>
                                            <option value="Data Scientist">Data Scientist</option>
                                            <option value="Product Manager">Product Manager</option>
                                            <option value="UI/UX Designer">UI/UX Designer</option>
                                            <option value="Marketing Specialist">Marketing Specialist</option>
                                        </select>
                                        <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple.</p>
                                    </div>

                                    <div>
                                        <label className="block mb-1 text-sm font-medium" htmlFor="hiringLocations">Preferred Hiring Locations</label>
                                        <select
                                            id="hiringLocations"
                                            name="hiringLocations"
                                            multiple // Enable multiple selection
                                            value={hiringPreferences.hiringLocations}
                                            onChange={handleHiringPreferencesChange}
                                            className="w-full border border-gray-300 p-2 pr-8 rounded appearance-none h-32"
                                        >
                                            <option value="Remote">Remote</option>
                                            <option value="On-site">On-site</option>
                                            <option value="Hybrid">Hybrid</option>
                                            <option value="Mumbai">Mumbai</option>
                                            <option value="Bangalore">Bangalore</option>
                                            <option value="Delhi">Delhi</option>
                                        </select>
                                        <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple.</p>
                                    </div>

                                    <div>
                                        <label className="block mb-1 text-sm font-medium">Looking for</label>
                                        <div className="flex gap-2">
                                            <button
                                                type="button" // Important: Prevent form submission
                                                onClick={() => setHiringPreferences(prev => ({ ...prev, lookingFor: 'job' }))}
                                                className={`border px-4 py-1 text-sm ${hiringPreferences.lookingFor === 'job' ? 'bg-black text-white' : 'border-gray-300'}`}
                                            >
                                                Job
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setHiringPreferences(prev => ({ ...prev, lookingFor: 'internship' }))}
                                                className={`border px-4 py-1 text-sm ${hiringPreferences.lookingFor === 'internship' ? 'bg-black text-white' : 'border-gray-300'}`}
                                            >
                                                Internship
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setHiringPreferences(prev => ({ ...prev, lookingFor: 'both' }))}
                                                className={`border px-4 py-1 text-sm ${hiringPreferences.lookingFor === 'both' ? 'bg-black text-white' : 'border-gray-300'}`}
                                            >
                                                Both
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block mb-1 text-sm font-medium">Employment type</label>
                                        <div className="flex gap-2 flex-wrap">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const newTypes = hiringPreferences.employmentType.includes('Part-time')
                                                        ? hiringPreferences.employmentType.filter(type => type !== 'Part-time')
                                                        : [...hiringPreferences.employmentType, 'Part-time'];
                                                    setHiringPreferences(prev => ({ ...prev, employmentType: newTypes }));
                                                }}
                                                className={`border px-4 py-1 text-sm ${hiringPreferences.employmentType.includes('Part-time') ? 'bg-black text-white' : 'border-gray-300'}`}
                                            >
                                                Part-time
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const newTypes = hiringPreferences.employmentType.includes('Full-time')
                                                        ? hiringPreferences.employmentType.filter(type => type !== 'Full-time')
                                                        : [...hiringPreferences.employmentType, 'Full-time'];
                                                    setHiringPreferences(prev => ({ ...prev, employmentType: newTypes }));
                                                }}
                                                className={`border px-4 py-1 text-sm ${hiringPreferences.employmentType.includes('Full-time') ? 'bg-black text-white' : 'border-gray-300'}`}
                                            >
                                                Full-time
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const newTypes = hiringPreferences.employmentType.includes('Contract')
                                                        ? hiringPreferences.employmentType.filter(type => type !== 'Contract')
                                                        : [...hiringPreferences.employmentType, 'Contract'];
                                                    setHiringPreferences(prev => ({ ...prev, employmentType: newTypes }));
                                                }}
                                                className={`border px-4 py-1 text-sm ${hiringPreferences.employmentType.includes('Contract') ? 'bg-black text-white' : 'border-gray-300'}`}
                                            >
                                                Contract
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const newTypes = hiringPreferences.employmentType.includes('Temporary')
                                                        ? hiringPreferences.employmentType.filter(type => type !== 'Temporary')
                                                        : [...hiringPreferences.employmentType, 'Temporary'];
                                                    setHiringPreferences(prev => ({ ...prev, employmentType: newTypes }));
                                                }}
                                                className={`border px-4 py-1 text-sm ${hiringPreferences.employmentType.includes('Temporary') ? 'bg-black text-white' : 'border-gray-300'}`}
                                            >
                                                Temporary
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end p-4 border-t">
                            {/* Removed "Edit" button logic for now */}
                        </div>
                    </div>

                    {/* Company Verification & KYC Section */}
                    <div className="border-b">
                        <div className="grid md:grid-cols-12 gap-4 p-6">
                            <div className="md:col-span-3">
                                <h3 className="font-bold mb-2">Company Verification & KYC</h3>
                                <p className="text-sm text-gray-600">
                                    Upload necessary documents for verification.
                                </p>
                            </div>

                            <div className="md:col-span-9">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block mb-1 text-sm font-medium" htmlFor="kycDocuments">Upload Verification Documents (Choose any one for verification)</label>
                                        <input
                                            id="kycDocuments"
                                            type="file"
                                            name="kycDocuments"
                                            onChange={handleFileChange}
                                            className="w-full border border-gray-300 p-2 rounded"
                                            multiple // Allow multiple file selection
                                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                        />
                                        <div className="mt-2 flex justify-center">
                                            {kycDocuments.length > 0 && (
                                                <p className="text-sm text-gray-500">{kycDocuments.length} file(s) selected.</p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block mb-1 text-sm font-medium" htmlFor="TAN">TAN (Tax Deduction and Collection Account Number)</label>
                                        <input
                                            id="TAN"
                                            type="text"
                                            name="TAN"
                                            value={kycDetails.TAN}
                                            onChange={handleKycDetailsChange}
                                            className="w-full border border-gray-300 p-2 rounded"
                                            placeholder="10-digit alphanumeric"
                                        />
                                    </div>

                                    <div>
                                        <label className="block mb-1 text-sm font-medium" htmlFor="GSTNumber">GST Number</label>
                                        <input
                                            id="GSTNumber"
                                            type="text"
                                            name="GSTNumber"
                                            value={kycDetails.GSTNumber}
                                            onChange={handleKycDetailsChange}
                                            className="w-full border border-gray-300 p-2 rounded"
                                            placeholder="15-digit alphanumeric"
                                        />
                                    </div>

                                    <div>
                                        <label className="block mb-1 text-sm font-medium" htmlFor="companyRegistrationNumber">Company Registration Number (CIN/LLPIN)</label>
                                        <input
                                            id="companyRegistrationNumber"
                                            type="text"
                                            name="companyRegistrationNumber"
                                            value={kycDetails.companyRegistrationNumber}
                                            onChange={handleKycDetailsChange}
                                            className="w-full border border-gray-300 p-2 rounded"
                                            placeholder="21-digit alphanumeric"
                                        />
                                    </div>

                                    {/* Additional KYC fields from backend schema */}
                                    <div>
                                        <label className="block mb-1 text-sm font-medium" htmlFor="GSTIN">GSTIN (if different from GST Number)</label>
                                        <input
                                            id="GSTIN"
                                            type="text"
                                            name="GSTIN"
                                            value={kycDetails.GSTIN}
                                            onChange={handleKycDetailsChange}
                                            className="w-full border border-gray-300 p-2 rounded"
                                            placeholder="GSTIN"
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-1 text-sm font-medium" htmlFor="aadharNumber">Aadhar Number</label>
                                        <input
                                            id="aadharNumber"
                                            type="text"
                                            name="aadharNumber"
                                            value={kycDetails.aadharNumber}
                                            onChange={handleKycDetailsChange}
                                            className="w-full border border-gray-300 p-2 rounded"
                                            placeholder="Aadhar Number"
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-1 text-sm font-medium" htmlFor="nameOnAadharCard">Name on Aadhar Card</label>
                                        <input
                                            id="nameOnAadharCard"
                                            type="text"
                                            name="nameOnAadharCard"
                                            value={kycDetails.nameOnAadharCard}
                                            onChange={handleKycDetailsChange}
                                            className="w-full border border-gray-300 p-2 rounded"
                                            placeholder="Name on Aadhar Card"
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-1 text-sm font-medium" htmlFor="addressLabel">Address Label</label>
                                        <input
                                            id="addressLabel"
                                            type="text"
                                            name="addressLabel"
                                            value={kycDetails.addressLabel}
                                            onChange={handleKycDetailsChange}
                                            className="w-full border border-gray-300 p-2 rounded"
                                            placeholder="e.g., Registered Address"
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-1 text-sm font-medium" htmlFor="address">Address</label>
                                        <textarea
                                            id="address"
                                            name="address"
                                            value={kycDetails.address}
                                            onChange={handleKycDetailsChange}
                                            className="w-full border border-gray-300 p-2 rounded"
                                            rows="2"
                                            placeholder="Full address"
                                        ></textarea>
                                    </div>
                                    {/* Country, State, City, Pincode are already in companyDetails. Decide if they should be duplicated in kycDetails or linked. For now, I'm adding them to kycDetails as per your model. */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block mb-1 text-sm font-medium" htmlFor="kycCountry">Country (KYC)</label>
                                            <input
                                                id="kycCountry"
                                                type="text"
                                                name="country"
                                                value={kycDetails.country}
                                                onChange={handleKycDetailsChange}
                                                className="w-full border border-gray-300 p-2 rounded"
                                                placeholder="Country"
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-1 text-sm font-medium" htmlFor="kycState">State (KYC)</label>
                                            <input
                                                id="kycState"
                                                type="text"
                                                name="state"
                                                value={kycDetails.state}
                                                onChange={handleKycDetailsChange}
                                                className="w-full border border-gray-300 p-2 rounded"
                                                placeholder="State"
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-1 text-sm font-medium" htmlFor="kycCity">City (KYC)</label>
                                            <input
                                                id="kycCity"
                                                type="text"
                                                name="city"
                                                value={kycDetails.city}
                                                onChange={handleKycDetailsChange}
                                                className="w-full border border-gray-300 p-2 rounded"
                                                placeholder="City"
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-1 text-sm font-medium" htmlFor="kycPincode">Pincode (KYC)</label>
                                            <input
                                                id="kycPincode"
                                                type="text"
                                                name="pincode"
                                                value={kycDetails.pincode}
                                                onChange={handleKycDetailsChange}
                                                className="w-full border border-gray-300 p-2 rounded"
                                                placeholder="Pincode"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end p-4 border-t">
                            {/* Removed "Edit" button logic for now */}
                        </div>
                    </div>

                    {/* Company Profiles Section (Social Media Links) */}
                    <div>
                        <div className="grid md:grid-cols-12 gap-4 p-6">
                            <div className="md:col-span-3">
                                <h3 className="font-bold mb-2">Company Social Profiles</h3>
                                <p className="text-sm text-gray-600">
                                    Add links to your company's social media and website.
                                </p>
                            </div>

                            <div className="md:col-span-9">
                                <div className="space-y-4">
                                    <div>
                                        <label className="flex items-center gap-2 mb-1 text-sm font-medium" htmlFor="companyLinkedin">
                                            <Linkedin size={18} className="text-blue-700" />
                                            LinkedIn Profile URL
                                        </label>
                                        <div className="flex">
                                            <div className="bg-gray-100 border border-gray-300 p-2 rounded-l">https://</div>
                                            <input
                                                id="companyLinkedin"
                                                type="text"
                                                name="companyLinkedin"
                                                value={companyDetails.companyLinkedin}
                                                onChange={handleCompanyDetailsChange}
                                                className="w-full border border-gray-300 p-2 rounded-r"
                                                placeholder="linkedin.com/company/your-company"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="flex items-center gap-2 mb-1 text-sm font-medium" htmlFor="websiteUrl">
                                            <Globe size={18} className="text-gray-700" />
                                            Website URL
                                        </label>
                                        <div className="flex">
                                            <div className="bg-gray-100 border border-gray-300 p-2 rounded-l">https://</div>
                                            <input
                                                id="websiteUrl"
                                                type="text"
                                                name="websiteUrl"
                                                value={companyDetails.websiteUrl}
                                                onChange={handleCompanyDetailsChange}
                                                className="w-full border border-gray-300 p-2 rounded-r"
                                                placeholder="www.yourcompany.com"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end p-4 border-t">
                            <button
                                type="submit"
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-md shadow-md transition duration-300 ease-in-out"
                                disabled={loading}
                            >
                                {loading ? 'Saving...' : 'Save Company Profile'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}