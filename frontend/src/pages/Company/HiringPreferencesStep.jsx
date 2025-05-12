import { motion } from 'framer-motion'
import { useState } from 'react'
import FormField from '@/components/company/FormField'
import Button from '@/components/company/Button'

const HiringPreferencesStep = ({ formData, handleChange, nextStep, prevStep }) => {
  const [lookingFor, setLookingFor] = useState(formData.lookingFor || '')
  const [employmentTypes, setEmploymentTypes] = useState(formData.employmentType || [])

  const handleSubmit = (e) => {
    e.preventDefault()
    handleChange('lookingFor', lookingFor)
    handleChange('employmentType', employmentTypes)
    nextStep()
  }

  const handleLookingForClick = (value) => {
    setLookingFor(value)
  }

  const handleEmploymentTypeClick = (value) => {
    setEmploymentTypes((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    )
  }

  const jobRoleOptions = [
    { value: 'software_engineer', label: 'Software Engineer' },
    { value: 'product_manager', label: 'Product Manager' },
    { value: 'designer', label: 'Designer' },
    { value: 'data_scientist', label: 'Data Scientist' },
    { value: 'marketing', label: 'Marketing' },
  ]

  const locationOptions = [
    { value: 'remote', label: 'Remote' },
    { value: 'bangalore', label: 'Bangalore' },
    { value: 'delhi', label: 'Delhi' },
    { value: 'mumbai', label: 'Mumbai' },
    { value: 'hyderabad', label: 'Hyderabad' },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-8"
      >
        <h1 className="text-2xl font-bold mb-1">Define Your Hiring Preferences!</h1>
        <p className="text-gray-600 mb-6">Tell us what roles you're hiring for and where!</p>

        <form onSubmit={handleSubmit}>
          <FormField
            label="Job Roles You Hire For"
            type="select"
            name="jobRoles"
            value={formData.jobRoles}
            onChange={handleChange}
            placeholder="Multiple-select"
            options={jobRoleOptions}
          />

          <FormField
            label="Preferred Hiring Locations"
            type="select"
            name="hiringLocations"
            value={formData.hiringLocations}
            onChange={handleChange}
            placeholder="Multiple-select"
            options={locationOptions}
          />

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Looking for</label>
            <div className="flex space-x-2">
              {['job', 'internship', 'both'].map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`px-4 py-2 rounded-md border ${
                    lookingFor === option
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-gray-700 border-gray-300'
                  } transition-colors duration-200`}
                  onClick={() => handleLookingForClick(option)}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Employment type</label>
            <div className="flex space-x-2">
              {['part-time', 'full-time', 'contract'].map((type) => (
                <button
                  key={type}
                  type="button"
                  className={`px-4 py-2 rounded-md border ${
                    employmentTypes.includes(type)
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-gray-700 border-gray-300'
                  } transition-colors duration-200`}
                  onClick={() => handleEmploymentTypeClick(type)}
                >
                  {type.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                </button>
              ))}
            </div>
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

export default HiringPreferencesStep
