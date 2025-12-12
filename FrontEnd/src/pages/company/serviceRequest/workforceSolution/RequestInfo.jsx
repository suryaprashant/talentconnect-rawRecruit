export default function RegistrationPage({
  onBackClick,
  formData,
  handleInputChange,
  startDate,
  handleDateChange,
  handleSubmit
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea]/5 via-[#f093fb]/5 to-[#764ba2]/5 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header Section */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
              Workforce Solutions:
            </span>
            <span className="text-gray-900 block mt-2">Empower Your Hiring Strategy</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Partner with us to streamline your recruitment process and connect with top-tier professionals who are ready to make an impact.
          </p>
        </header>

        {/* Registration Form */}
        <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#667eea]/20 to-[#764ba2]/20 rounded-2xl mb-4">
              <svg className="w-8 h-8 text-[#667eea]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Request Info for Workforce Solutions
            </h2>
            <p className="text-gray-600">
              Fill out the form below to schedule a consultation or request more details about our workforce services.
            </p>
          </div>

          <div className="space-y-6">
            {/* Date and Time Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent transition-all duration-200"
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time
                </label>
                <select
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent transition-all duration-200"
                >
                  <option value="">Select Time</option>
                  <option value="09:00">9:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="13:00">1:00 PM</option>
                  <option value="15:00">3:00 PM</option>
                </select>
              </div>
            </div>

            {/* Message Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent h-32 transition-all duration-200"
                placeholder="Tell us more about your workforce needs..."
              />
            </div>

            {/* Accept Terms */}
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="acceptTerms"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleInputChange}
                className="w-5 h-5 mt-1 text-[#667eea] rounded focus:ring-[#667eea]/50"
              />
              <label htmlFor="acceptTerms" className="text-sm text-gray-700">
                I accept the Terms and Conditions and agree to the Privacy Policy
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-between items-center pt-8 border-t border-gray-200">
              <button
                type="button"
                onClick={onBackClick}
                className="text-gray-600 hover:text-gray-800 font-medium flex items-center mb-4 sm:mb-0 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Home
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white px-8 py-3 rounded-xl hover:shadow-lg hover:shadow-[#667eea]/30 transition-all duration-200"
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}