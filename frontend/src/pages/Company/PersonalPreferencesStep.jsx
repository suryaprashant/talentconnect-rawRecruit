import { motion } from 'framer-motion'
import FormField from '@/components/company/FormField'
import Button from '@/components/company/Button'

const PersonalInfoStep = ({ formData, handleChange, nextStep, prevStep }) => {
  const handleSubmit = (e) => {
    e.preventDefault()
    nextStep()
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
        <h1 className="text-2xl font-bold mb-1">Introduce Yourself as an Employer!</h1>
        <p className="text-gray-600 mb-6">
          Help candidates connect with the right recruiter in your company!
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <FormField
            label="Enter your name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your full name"
            required
          />

          <FormField
            label="Designation"
            type="select"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            placeholder="Choose your role"
            options={[
              { value: 'hr_manager', label: 'HR Manager' },
              { value: 'recruiter', label: 'Recruiter' },
              { value: 'hiring_manager', label: 'Hiring Manager' },
              { value: 'team_lead', label: 'Team Lead' },
              { value: 'ceo', label: 'CEO' },
            ]}
            required
          />

          <FormField
            label="Enter your work email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="hello@xyz.com"
            required
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            }
          />

          <FormField
            label="Enter your mobile no."
            type="tel"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            placeholder="1234567890"
            required
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
            }
          />

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              LinkedIn Profile
            </label>
            <div className="flex">
              <div className="bg-gray-100 border border-r-0 border-gray-300 rounded-l-md px-3 flex items-center text-gray-500">
                <span className="text-sm">http://</span>
              </div>
              <input
                type="text"
                name="linkedIn"
                value={formData.linkedIn}
                onChange={(e) => handleChange('linkedIn', e.target.value)}
                placeholder="www.linkedin.com/in/yourname"
                className="form-input rounded-l-none flex-1 border-gray-300 focus:ring-black focus:border-black"
              />
            </div>
          </div>

          <div className="flex justify-end mt-8 space-x-4">
            <Button variant="secondary" onClick={prevStep}>
              Cancel
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

export default PersonalInfoStep
