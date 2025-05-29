import { motion } from 'framer-motion'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FormField from '@/components/company/FormField'
import Button from '@/components/company/Button'

const VerificationStep = ({ formData, handleChange, prevStep, onSubmit }) => {
  const [termsAccepted, setTermsAccepted] = useState(false)
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!termsAccepted) {
      alert('Please accept the Terms & Conditions to continue')
      return
    }
    onSubmit()
    console.log('Form submitted successfully!', formData)
    // alert('Profile created successfully!')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <motion.div
        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold mb-1">Company Verification & KYC</h1>
        <p className="text-gray-600 mb-6">
          Complete KYC verification to unlock full hiring access and ensure compliance.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Verification Documents (Choose any one for verification)
            </label>
            <select className="form-input w-full mb-3 border-gray-300 focus:ring-black focus:border-black">
              <option value="">Select document type</option>
              <option value="certificate">Company Certificate</option>
              <option value="registration">Registration Document</option>
              <option value="tax">Tax Document</option>
            </select>

            <div className="flex items-center justify-between p-3 border border-gray-300 rounded-md">
              <span className="text-gray-600">Upload Document</span>
              <button
                type="button"
                className="text-gray-600 hover:text-black"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>

          <FormField
            label="TAN (Tax Deduction and Collection Account Number)"
            name="tanNumber"
            value={formData.tanNumber}
            onChange={handleChange}
            placeholder="10-digit alphanumeric"
          />

          <FormField
            label="GST Number"
            name="gstNumber"
            value={formData.gstNumber}
            onChange={handleChange}
            placeholder="15-digit alphanumeric"
          />

          <FormField
            label="Company Registration Number (CIN/LLPIN)"
            name="companyRegistration"
            value={formData.companyRegistration}
            onChange={handleChange}
            placeholder="21-digit alphanumeric"
          />

          <div>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="w-4 h-4 text-accent rounded border-gray-300 focus:ring-accent"
              />
              <span className="text-sm text-gray-600">
                I agree to the Terms & Conditions and Privacy Policy
              </span>
            </label>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button variant="secondary" onClick={prevStep}>
              Back
            </Button>
            <Button
              onClick={() => navigate("/company-onboarding/step-1")}
              type="submit" variant="primary">
              Get Started
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default VerificationStep
