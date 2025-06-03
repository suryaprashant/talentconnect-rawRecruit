import { useState } from 'react';
import { Mail, Phone, Upload, Globe, Linkedin } from 'lucide-react';
import axios from 'axios'; // Recommended for easier HTTP requests and FormData handling

export default function EmployerProfileForm() {
    const [formData, setFormData] = useState({
        companyName: '',
        description: '',
        companyType: '',
        industryType: '',
        numberOfEmployees: '',
        establishedYear: '',
        contactNumber: '',
        alternateNumber: '',
        companyLocation: '',
        state: '',
        city: '',
        country: '',
        pincode: '',
        companyWebsite: '',
        linkedinProfile: '',
        jobRoles: [], // Will be an array
        preferredHiringLocations: [], // Will be an array
        lookingFor: '',
        employmentType: '',
        tanNumber: '',
        gstNumber: '',
        companyRegNumber: '',
    });

    const [verificationDocuments, setVerificationDocuments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Placeholder data for dropdowns (you'd typically fetch these from an API)
    const companyTypes = ['Sole Proprietorship', 'Partnership', 'Private Limited', 'Public Limited', 'LLP', 'Other'];
    const industryTypes = ['IT', 'Healthcare', 'Finance', 'Education', 'Manufacturing', 'Retail', 'Other'];
    const employeeRanges = ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'];
    const establishedYears = Array.from({ length: 50 }, (_, i) => (new Date().getFullYear() - i).toString());
    const locations = ['New York', 'London', 'Bangalore', 'Mumbai', 'Delhi', 'Remote']; // Example

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;

        if (type === 'file') {
            setVerificationDocuments(Array.from(files));
        } else if (name === 'jobRoles' || name === 'preferredHiringLocations') {
            // Assuming comma-separated input for simplicity for now
            setFormData(prev => ({
                ...prev,
                [name]: value.split(',').map(item => item.trim()).filter(item => item !== '')
            }));
        }
        else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleHiringPreferenceClick = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const data = new FormData();

            // Append all text fields
            for (const key in formData) {
                if (key === 'jobRoles' || key === 'preferredHiringLocations') {
                    // Stringify arrays as backend expects JSON strings for these
                    data.append(key, JSON.stringify(formData[key]));
                } else {
                    data.append(key, formData[key]);
                }
            }

            // Append verification documents
            verificationDocuments.forEach((file) => {
                data.append('verificationDocuments', file);
            });

            // Make the API call
            const response = await axios.post('http://localhost:5000/api/employer-profile/create', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setSuccess(response.data.message || 'Employer profile created successfully!');
            // Optionally, clear the form or redirect
            // setFormData({ ...initial state or empty strings });
            // setVerificationDocuments([]);

        } catch (err) {
            console.error('Error creating employer profile:', err);
            setError(err.response?.data?.message || 'Failed to create employer profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // The current form structure has "Edit" buttons and seems designed for display.
    // I will convert them into a single form with a "Save" button to submit the data.
    // The "About", "Employer Details", and "Company Profiles" sections are currently
    // designed as separate editable blocks. For initial creation, we'll combine them.
    // If these are intended for *updating* separate sections, the approach would be different,
    // involving fetching data and potentially multiple PUT endpoints.

    // I will simplify the "Edit" buttons to be a single "Save" button at the end
    // and make all fields editable for initial submission.

    return (
        <div className="flex flex-col w-full bg-gray-50 min-h-screen">
            <div className="container mx-auto py-6 px-4">
                <h1 className="text-2xl font-bold mb-6">Create Company Profile</h1>

                {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">{success}</div>}
                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}

                <form onSubmit={handleSubmit}>
                    {/* Company Details Section */}
                    <div className="bg-white border rounded-md mb-6">
                        <div className="border-b">
                            <div className="grid md:grid-cols-12 gap-4 p-6">
                                <div className="md:col-span-3">
                                    <h3 className="font-bold mb-2">Company Details</h3>
                                    <p className="text-sm text-gray-600">
                                        Provide essential information about your company.
                                    </p>
                                </div>

                                <div className="md:col-span-9">
                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor="companyName" className="block mb-1 text-sm font-medium">
                                                Company Name <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                id="companyName"
                                                name="companyName"
                                                type="text"
                                                className="form-input"
                                                placeholder="Your Company Name"
                                                value={formData.companyName}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="description" className="block mb-1 text-sm font-medium">
                                                Description <span className="text-red-500">*</span>
                                            </label>
                                            <textarea
                                                id="description"
                                                name="description"
                                                className="form-input"
                                                rows="4"
                                                placeholder="Tell us about your company..."
                                                value={formData.description}
                                                onChange={handleChange}
                                                required
                                            ></textarea>
                                        </div>

                                        <div>
                                            <label htmlFor="companyType" className="block mb-1 text-sm font-medium">
                                                Company Type <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                id="companyType"
                                                name="companyType"
                                                className="form-input"
                                                value={formData.companyType}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">Select Company Type</option>
                                                {companyTypes.map(type => (
                                                    <option key={type} value={type}>{type}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label htmlFor="industryType" className="block mb-1 text-sm font-medium">
                                                Industry Type <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                id="industryType"
                                                name="industryType"
                                                className="form-input"
                                                value={formData.industryType}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">Select Industry Type</option>
                                                {industryTypes.map(type => (
                                                    <option key={type} value={type}>{type}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label htmlFor="numberOfEmployees" className="block mb-1 text-sm font-medium">
                                                Number of Employees <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                id="numberOfEmployees"
                                                name="numberOfEmployees"
                                                className="form-input"
                                                value={formData.numberOfEmployees}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">Select Number of Employees</option>
                                                {employeeRanges.map(range => (
                                                    <option key={range} value={range}>{range}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label htmlFor="establishedYear" className="block mb-1 text-sm font-medium">
                                                Established Year <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                id="establishedYear"
                                                name="establishedYear"
                                                className="form-input"
                                                value={formData.establishedYear}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">Select Year</option>
                                                {establishedYears.map(year => (
                                                    <option key={year} value={year}>{year}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label htmlFor="contactNumber" className="block mb-1 text-sm font-medium">
                                                Contact Number <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                    <Phone size={16} className="text-gray-500" />
                                                </div>
                                                <input
                                                    id="contactNumber"
                                                    name="contactNumber"
                                                    type="text"
                                                    className="form-input pl-10"
                                                    placeholder="1234567890"
                                                    value={formData.contactNumber}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="alternateNumber" className="block mb-1 text-sm font-medium">
                                                Alternate Number
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                    <Phone size={16} className="text-gray-500" />
                                                </div>
                                                <input
                                                    id="alternateNumber"
                                                    name="alternateNumber"
                                                    type="text"
                                                    className="form-input pl-10"
                                                    placeholder="1234567890"
                                                    value={formData.alternateNumber}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="companyLocation" className="block mb-1 text-sm font-medium">
                                                Company Location <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                id="companyLocation"
                                                name="companyLocation"
                                                className="form-input"
                                                value={formData.companyLocation}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">Select Company Location</option>
                                                {locations.map(loc => (
                                                    <option key={loc} value={loc}>{loc}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label htmlFor="state" className="block mb-1 text-sm font-medium">State</label>
                                                <input
                                                    id="state"
                                                    name="state"
                                                    type="text"
                                                    className="form-input"
                                                    placeholder="e.g., Uttar Pradesh"
                                                    value={formData.state}
                                                    onChange={handleChange}
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="city" className="block mb-1 text-sm font-medium">City</label>
                                                <input
                                                    id="city"
                                                    name="city"
                                                    type="text"
                                                    className="form-input"
                                                    placeholder="e.g., Lucknow"
                                                    value={formData.city}
                                                    onChange={handleChange}
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="country" className="block mb-1 text-sm font-medium">Country</label>
                                                <input
                                                    id="country"
                                                    name="country"
                                                    type="text"
                                                    className="form-input"
                                                    placeholder="e.g., India"
                                                    value={formData.country}
                                                    onChange={handleChange}
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="pincode" className="block mb-1 text-sm font-medium">Pincode</label>
                                                <input
                                                    id="pincode"
                                                    name="pincode"
                                                    type="text"
                                                    className="form-input"
                                                    placeholder="e.g., 226001"
                                                    value={formData.pincode}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Hiring Preferences Section */}
                    <div className="bg-white border rounded-md mb-6">
                        <div className="border-b">
                            <div className="grid md:grid-cols-12 gap-4 p-6">
                                <div className="md:col-span-3">
                                    <h3 className="font-bold mb-2">Hiring Preferences</h3>
                                    <p className="text-sm text-gray-600">
                                        Tell us what kind of talent you are looking for.
                                    </p>
                                </div>

                                <div className="md:col-span-9">
                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor="jobRoles" className="block mb-1 text-sm font-medium">Job Roles You Hire For</label>
                                            <input
                                                id="jobRoles"
                                                name="jobRoles"
                                                type="text"
                                                className="form-input"
                                                placeholder="e.g., Software Engineer, Marketing Manager (comma separated)"
                                                value={formData.jobRoles.join(', ')}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="preferredHiringLocations" className="block mb-1 text-sm font-medium">Preferred Hiring Locations</label>
                                            <input
                                                id="preferredHiringLocations"
                                                name="preferredHiringLocations"
                                                type="text"
                                                className="form-input"
                                                placeholder="e.g., Bangalore, Remote, Hyderabad (comma separated)"
                                                value={formData.preferredHiringLocations.join(', ')}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div>
                                            <label className="block mb-1 text-sm font-medium">Looking for</label>
                                            <div className="flex gap-2">
                                                <button
                                                    type="button"
                                                    className={`px-4 py-1 text-sm rounded ${formData.lookingFor === 'Job' ? 'bg-black text-white' : 'border border-gray-300'}`}
                                                    onClick={() => handleHiringPreferenceClick('lookingFor', 'Job')}
                                                >
                                                    Job
                                                </button>
                                                <button
                                                    type="button"
                                                    className={`px-4 py-1 text-sm rounded ${formData.lookingFor === 'Internship' ? 'bg-black text-white' : 'border border-gray-300'}`}
                                                    onClick={() => handleHiringPreferenceClick('lookingFor', 'Internship')}
                                                >
                                                    Internship
                                                </button>
                                                <button
                                                    type="button"
                                                    className={`px-4 py-1 text-sm rounded ${formData.lookingFor === 'Both' ? 'bg-black text-white' : 'border border-gray-300'}`}
                                                    onClick={() => handleHiringPreferenceClick('lookingFor', 'Both')}
                                                >
                                                    Both
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block mb-1 text-sm font-medium">Employment type</label>
                                            <div className="flex gap-2">
                                                <button
                                                    type="button"
                                                    className={`px-4 py-1 text-sm rounded ${formData.employmentType === 'Part-time' ? 'bg-black text-white' : 'border border-gray-300'}`}
                                                    onClick={() => handleHiringPreferenceClick('employmentType', 'Part-time')}
                                                >
                                                    Part-time
                                                </button>
                                                <button
                                                    type="button"
                                                    className={`px-4 py-1 text-sm rounded ${formData.employmentType === 'Full-time' ? 'bg-black text-white' : 'border border-gray-300'}`}
                                                    onClick={() => handleHiringPreferenceClick('employmentType', 'Full-time')}
                                                >
                                                    Full-time
                                                </button>
                                                <button
                                                    type="button"
                                                    className={`px-4 py-1 text-sm rounded ${formData.employmentType === 'Contract' ? 'bg-black text-white' : 'border border-gray-300'}`}
                                                    onClick={() => handleHiringPreferenceClick('employmentType', 'Contract')}
                                                >
                                                    Contract
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Company Verification & KYC Section */}
                    <div className="bg-white border rounded-md mb-6">
                        <div className="border-b">
                            <div className="grid md:grid-cols-12 gap-4 p-6">
                                <div className="md:col-span-3">
                                    <h3 className="font-bold mb-2">Company Verification & KYC</h3>
                                    <p className="text-sm text-gray-600">
                                        Upload necessary documents for verification and provide tax details.
                                    </p>
                                </div>

                                <div className="md:col-span-9">
                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor="verificationDocuments" className="block mb-1 text-sm font-medium">Upload Verification Documents (Choose any one for verification)</label>
                                            <input
                                                id="verificationDocuments"
                                                name="verificationDocuments"
                                                type="file"
                                                multiple
                                                className="hidden" // Hide the default input
                                                onChange={handleChange}
                                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" // Specify accepted file types
                                            />
                                            <div className="mt-2 flex justify-start">
                                                <label htmlFor="verificationDocuments" className="border border-gray-300 px-4 py-1 text-sm flex items-center gap-1 cursor-pointer hover:bg-gray-100 transition-colors">
                                                    <Upload size={14} />
                                                    Upload Document(s)
                                                </label>
                                            </div>
                                            {verificationDocuments.length > 0 && (
                                                <div className="mt-2 text-sm text-gray-600">
                                                    Selected files: {verificationDocuments.map(file => file.name).join(', ')}
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="tanNumber" className="block mb-1 text-sm font-medium">TAN (Tax Deduction and Collection Account Number)</label>
                                            <input
                                                id="tanNumber"
                                                name="tanNumber"
                                                type="text"
                                                className="form-input"
                                                placeholder="10-digit alphanumeric"
                                                value={formData.tanNumber}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="gstNumber" className="block mb-1 text-sm font-medium">GST Number</label>
                                            <input
                                                id="gstNumber"
                                                name="gstNumber"
                                                type="text"
                                                className="form-input"
                                                placeholder="15-digit alphanumeric"
                                                value={formData.gstNumber}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="companyRegNumber" className="block mb-1 text-sm font-medium">Company Registration Number (CIN/LLPIN)</label>
                                            <input
                                                id="companyRegNumber"
                                                name="companyRegNumber"
                                                type="text"
                                                className="form-input"
                                                placeholder="21-digit alphanumeric"
                                                value={formData.companyRegNumber}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Company Profiles Section */}
                    <div className="bg-white border rounded-md mb-6">
                        <div>
                            <div className="grid md:grid-cols-12 gap-4 p-6">
                                <div className="md:col-span-3">
                                    <h3 className="font-bold mb-2">Company Profiles</h3>
                                    <p className="text-sm text-gray-600">
                                        Add links to your company's online presence.
                                    </p>
                                </div>

                                <div className="md:col-span-9">
                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor="linkedinProfile" className="flex items-center gap-2 mb-1 text-sm font-medium">
                                                <Linkedin size={18} className="text-blue-700" />
                                                LinkedIn
                                            </label>
                                            <div className="flex">
                                                <div className="bg-gray-100 border border-gray-300 p-2 rounded-l flex items-center">https://linkedin.com/company/</div>
                                                <input
                                                    id="linkedinProfile"
                                                    name="linkedinProfile"
                                                    type="text"
                                                    className="form-input rounded-r-md rounded-l-none"
                                                    placeholder="yourcompanyname"
                                                    value={formData.linkedinProfile}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="companyWebsite" className="flex items-center gap-2 mb-1 text-sm font-medium">
                                                <Globe size={18} className="text-gray-700" />
                                                Website
                                            </label>
                                            <div className="flex">
                                                <div className="bg-gray-100 border border-gray-300 p-2 rounded-l flex items-center">https://</div>
                                                <input
                                                    id="companyWebsite"
                                                    name="companyWebsite"
                                                    type="text"
                                                    className="form-input rounded-r-md rounded-l-none"
                                                    placeholder="www.yourcompany.com"
                                                    value={formData.companyWebsite}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end p-4 bg-white border-t rounded-b-md">
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? 'Saving Profile...' : 'Save Profile'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}