import { motion } from 'framer-motion'
import FormField from '@/components/company/FormField'
import Button from '@/components/company/Button'

const CompanyInfoStep = ({ formData, handleChange, nextStep, prevStep }) => {
  const handleSubmit = (e) => {
    e.preventDefault()
    nextStep()
  }

  const companyName = [
    { value: 'TCS', label: 'TCS' },
    { value: 'Google', label: 'Google' }
  ]

  const companyTypeOptions = [
    { value: 'startup', label: 'Startup' },
    { value: 'mnc', label: 'MNC' },
    { value: 'private', label: 'Private Limited' },
    { value: 'public', label: 'Public Limited' },
  ]

  const industryOptions = [
    { value: 'tech', label: 'Technology' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'finance', label: 'Finance' },
    { value: 'education', label: 'Education' },
    { value: 'retail', label: 'Retail' },
  ]

  const employeeCountOptions = [
    { value: '1-10', label: '1-10' },
    { value: '11-50', label: '11-50' },
    { value: '51-200', label: '51-200' },
    { value: '201-500', label: '201-500' },
    { value: '501+', label: '501+' },
  ]

  const yearOptions = Array.from({ length: 74 }, (_, i) => {
    const year = 2025 - i
    return { value: year.toString(), label: year.toString() }
  })

  const locationOptions = [
    { value: 'india', label: 'India' },
    { value: 'us', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'canada', label: 'Canada' },
    { value: 'australia', label: 'Australia' },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="bg-white shadow-lg rounded-2xl p-10 w-full max-w-3xl"
      >
        <h1 className="text-2xl font-bold mb-1 text-center">Connect to Your Company!</h1>
        <p className="text-gray-600 mb-6 text-center">Select the company you represent or register a new one.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            label="Company Name"
            type="select"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            placeholder="Placeholder"
            options={companyName}
            required
          />

          <p className="text-accent text-sm font-medium cursor-pointer hover:underline mb-4">
            Register Your Company
          </p>

          <FormField
            label="Description"
            type="textarea"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Type your message..."
          />

          <FormField
            label="Company Type"
            type="select"
            name="companyType"
            value={formData.companyType}
            onChange={handleChange}
            placeholder="Placeholder"
            options={companyTypeOptions}
            required
          />

          <FormField
            label="Industry Type"
            type="select"
            name="industryType"
            value={formData.industryType}
            onChange={handleChange}
            placeholder="Placeholder"
            options={industryOptions}
            required
          />

          <FormField
            label="Number of Employees"
            type="select"
            name="employeesCount"
            value={formData.employeesCount}
            onChange={handleChange}
            placeholder="Placeholder"
            options={employeeCountOptions}
            required
          />

          <FormField
            label="Established Year"
            type="select"
            name="establishedYear"
            value={formData.establishedYear}
            onChange={handleChange}
            placeholder="Placeholder"
            options={yearOptions}
            required
          />

          <FormField
            label="Contact Number"
            type="tel"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            placeholder="1234567890"
          />

          <FormField
            label="Alternate Number"
            type="tel"
            name="alternateNumber"
            value={formData.alternateNumber}
            onChange={handleChange}
            placeholder="1234567890"
          />

          <FormField
            label="Company Location"
            type="select"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Placeholder"
            options={locationOptions}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="State"
              type="select"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="Placeholder"
            />
            <FormField
              label="City"
              type="select"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Placeholder"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Country"
              type="select"
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="Placeholder"
            />
            <FormField
              label="Pincode"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              placeholder="Placeholder"
            />
          </div>

          <div className="flex justify-end mt-8 space-x-4">
            <Button variant="secondary" onClick={prevStep}>
              Back
            </Button>
            <Button type="submit" variant="primary">
              Next
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default CompanyInfoStep
