// RegisterPage component
export default function RegisterPage ({ 
  onBackClick, 
  formData = {}, 
  handleInputChange, 
  handleSubmit, 
  isSubmitting = false,
  submitError = '' 
}) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Header Section */}
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Campus Branding: Make Your Campus the Talent Hub
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Attract, engage and retain top talent right from the source. <br/>
          Campus Branding helps your company build a lasting relationship with students, showcasing your brand and opportunities early on. Connect with the next generation of talent and establish a presence that resonates with future leaders.
        </p>
      </header>

      {/* Registration Form */}
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">
          Request info for Campus Branding
        </h2>
        <p className="text-gray-600 mb-8 text-center">
          Fill out the form below and we'll get back to you soon.
        </p>

        {/* Error Message */}
        {submitError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{submitError}</p>
          </div>
        )}

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date || ""}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg p-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Time</label>
              <select 
                name="time"
                value={formData.time || ""}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg p-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                required
              >
                <option value="">Select Time</option>
                <option value="09:00">9:00 AM</option>
                <option value="11:00">11:00 AM</option>
                <option value="13:00">1:00 PM</option>
                <option value="15:00">3:00 PM</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Message</label>
            <textarea 
              name="message"
              value={formData.message || ""}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg p-3 h-32 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" 
              placeholder="Type your message..."
              required
            />
          </div>

          <div className="flex items-center">
            <input 
              type="checkbox" 
              id="acceptTerms"
              name="acceptTerms"
              checked={formData.acceptTerms || false}
              onChange={handleInputChange}
              className="w-5 h-5 mr-2 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              required
            />
            <label htmlFor="acceptTerms" className="text-gray-700">
              I accept the Terms and Conditions
            </label>
          </div>

          <div className="flex justify-between items-center pt-6">
            <button 
              type="button"
              onClick={onBackClick}
              disabled={isSubmitting}
              className="text-blue-600 hover:text-blue-800 font-medium disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              ← Back to Home
            </button>
            <button 
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                'Submit Request'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}