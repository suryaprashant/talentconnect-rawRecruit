import { motion } from 'framer-motion'
import { useState, useEffect } from 'react';
import FormField from '@/components/company/FormField';

const VerificationStep = ({ formData, handleChange, prevStep, nextStep, updateFormData }) => {
    const [selectedDocumentType, setSelectedDocumentType] = useState(formData.documentType || '');
    const [kycFileNames, setKycFileNames] = useState([]);

    useEffect(() => {
        if (formData.kycDocuments) {
            setKycFileNames(formData.kycDocuments.map(file => file.name));
        }
    }, [formData.kycDocuments]);

    const documentTypeOptions = [
        { value: '', label: 'Select document type' },
        { value: 'certificate', label: 'Company Certificate' },
        { value: 'registration', label: 'Registration Document' },
        { value: 'tax', label: 'Tax Document' },
    ];

    const handleKycFilesChange = (e) => {
        const files = Array.from(e.target.files);
        handleChange('kycDocuments', files);
        setKycFileNames(files.map(file => file.name));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleChange('documentType', selectedDocumentType);
        nextStep();
    };

    const CustomFileInput = ({ label, name, fileName, onChange, multiple = false, accept = "*/*" }) => (
        <div className="mb-4">
            <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>
            <div className="flex rounded-xl overflow-hidden shadow-sm border border-gray-200 hover:border-[#667eea]/50 transition-all duration-300">
                <input
                    type="text"
                    className="flex-1 block w-full px-4 py-3 border-0 focus:outline-none sm:text-sm cursor-not-allowed bg-gray-50/50"
                    value={fileName || 'No file chosen'}
                    readOnly
                    placeholder="No file chosen"
                />
                <label
                    htmlFor={name}
                    className="cursor-pointer bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white px-4 py-3 text-sm font-semibold hover:shadow-md transition-all duration-300 flex items-center justify-center"
                >
                    Choose File{multiple ? '(s)' : ''}
                    <input
                        id={name}
                        name={name}
                        type="file"
                        className="sr-only"
                        onChange={onChange}
                        multiple={multiple}
                        accept={accept}
                    />
                </label>
            </div>
            {fileName && (
                <p className="text-xs text-gray-500 mt-1">Selected: {fileName}</p>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#667eea]/10 via-[#f093fb]/5 to-[#764ba2]/10 p-4">
            {/* Background decorative elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-[#667eea]/10 to-[#764ba2]/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-[#f093fb]/10 to-[#f5576c]/10 rounded-full blur-3xl"></div>
            </div>

            <div className="relative max-w-2xl mx-auto">
                {/* Blur background behind card */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/5 backdrop-blur-sm rounded-2xl -inset-x-4 bottom-4"></div>

                <motion.div
                    className="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-100 p-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    {/* Decorative top bar */}
                    <div className="h-1 bg-gradient-to-r from-[#667eea] via-[#f093fb] to-[#43e97b] rounded-t-2xl absolute top-0 left-0 right-0"></div>

                    {/* Header */}
                    <div className="mb-8">
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#667eea]/10 to-[#764ba2]/10 text-[#667eea] px-4 py-2 rounded-full text-sm font-semibold mb-4 shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                            </svg>
                            Step 5: Verification
                        </div>

                        <h1 className="text-2xl font-bold text-gray-800 mb-2">Company Verification & KYC</h1>
                        <p className="text-gray-600">
                            Complete KYC verification to unlock full hiring access and ensure compliance.
                        </p>
                    </div>

                    {/* Progress Indicator */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                            <span>Step 5 of 5</span>
                            <span>100%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-[#667eea] to-[#764ba2] w-full"></div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* KYC Documents Upload */}
                        <div className="bg-gradient-to-r from-[#667eea]/5 to-transparent p-5 rounded-xl border border-gray-100">
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Upload Verification Documents (Choose any one for verification)
                            </label>
                            <div className="space-y-4">
                                <div className="relative">
                                    <select
                                        name="documentType"
                                        value={selectedDocumentType}
                                        onChange={(e) => setSelectedDocumentType(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#667eea]/30 focus:border-[#667eea] transition-all duration-300 bg-white/80 appearance-none"
                                    >
                                        {documentTypeOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                        </svg>
                                    </div>
                                </div>

                                <CustomFileInput
                                    label="Choose File(s)"
                                    name="kycDocuments"
                                    fileName={kycFileNames.join(', ')}
                                    onChange={handleKycFilesChange}
                                    multiple={true}
                                    accept="image/*,.pdf"
                                />
                            </div>
                        </div>

                        {/* Tax Information Section */}
                        <div className="space-y-4">
                            <div className="bg-gradient-to-r from-[#f093fb]/5 to-transparent p-5 rounded-xl border border-gray-100">
                                <FormField
                                    label="TAN (Tax Deduction and Collection Account Number)"
                                    name="TAN"
                                    value={formData.TAN}
                                    onChange={(e) => handleChange('TAN', e.target.value)}
                                    placeholder="e.g., ABCDE12345Z"
                                />
                            </div>

                            <div className="bg-gradient-to-r from-[#43e97b]/5 to-transparent p-5 rounded-xl border border-gray-100">
                                <FormField
                                    label="GST Number (Optional)"
                                    name="GSTNumber"
                                    value={formData.GSTNumber}
                                    onChange={(e) => handleChange('GSTNumber', e.target.value)}
                                    placeholder="e.g., 22ABCDE1234F1Z5"
                                />
                            </div>

                            <div className="bg-gradient-to-r from-[#667eea]/5 to-transparent p-5 rounded-xl border border-gray-100">
                                <FormField
                                    label="Company Registration Number (CIN/LLPIN - Optional)"
                                    name="companyRegistrationNumber"
                                    value={formData.companyRegistrationNumber}
                                    onChange={(e) => handleChange('companyRegistrationNumber', e.target.value)}
                                    placeholder="e.g., L12345MH2020PTC123456"
                                />
                            </div>
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={prevStep}
                                className="px-6 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-all duration-300 hover:shadow-sm"
                            >
                                Back
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-300 shadow-md"
                            >
                                Complete Setup
                            </button>
                        </div>
                    </form>
                </motion.div>

                {/* Footer */}
                <div className="mt-6 text-center">
                    <p className="text-gray-500 text-sm">
                        Your information is secure and encrypted
                    </p>
                </div>
            </div>
        </div>
    );
};

export default VerificationStep;