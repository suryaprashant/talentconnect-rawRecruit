import { Building2, Calendar, Clock, MessageSquare, ArrowLeft } from 'lucide-react';

export default function RegisterPage({
  onBackClick,
  formData = {},
  handleInputChange,
  handleSubmit
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea]/5 via-[#f093fb]/5 to-[#764ba2]/5">
      <div className="container mx-auto px-4 py-10 max-w-2xl">

        {/* Header Section */}
        <header className="mb-6 pt-2 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="p-2 bg-gradient-to-br from-[#667eea]/20 to-[#764ba2]/20 rounded-lg mr-3">
              <Building2 className="h-5 w-5 text-[#667eea]" />
            </div>

            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
              Employer Branding: Be the Brand They Want to Work For
            </h1>
          </div>

          <p className="text-sm text-gray-600 mt-3 max-w-xl mx-auto">
            Stand out in a competitive hiring market by building strong brand recall among students and early-career professionals.
          </p>
        </header>

        {/* Registration Form */}
        <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-6">
          <div className="text-center mb-6">
            {/* <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[#667eea]/20 to-[#764ba2]/20 rounded-xl mb-3">
              <Building2 className="h-6 w-6 text-[#667eea]" />
            </div> */}
            <h2 className="text-2xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
              Request Info for Employer Branding
            </h2>
            <p className="text-gray-600 text-sm">
              Fill in your details to get more information about our Employer Branding services
            </p>
          </div>

          <div className="space-y-8">
            {/* Date & Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date */}
              <div>
                <label className="block text-gray-700 font-medium mb-2 flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date || ""}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full border border-gray-200 rounded-lg p-3 bg-gradient-to-r from-gray-50 to-white focus:ring-2 focus:ring-[#667eea]/50 focus:outline-none"
                />
              </div>

              {/* Time */}
              <div>
                <label className="block text-gray-700 font-medium mb-2 flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-gray-500" />
                  Time
                </label>
                <select
                  name="time"
                  value={formData.time || ""}
                  onChange={handleInputChange}
                  className="w-full border border-gray-200 rounded-lg p-3 bg-gradient-to-r from-gray-50 to-white focus:ring-2 focus:ring-[#667eea]/50 focus:outline-none"
                >
                  <option value="">Select Time</option>
                  <option value="09:00">9:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="13:00">1:00 PM</option>
                  <option value="15:00">3:00 PM</option>
                </select>
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-gray-700 font-medium mb-2 flex items-center">
                <MessageSquare className="h-4 w-4 mr-2 text-gray-500" />
                Message
              </label>
              <textarea
                name="message"
                value={formData.message || ""}
                onChange={handleInputChange}
                placeholder="Tell us more about your employer branding needs..."
                className="w-full h-32 border border-gray-200 rounded-lg p-3 bg-gradient-to-r from-gray-50 to-white focus:ring-2 focus:ring-[#667eea]/50 focus:outline-none"
              />
            </div>

            {/* Terms */}
            <div className="flex items-start">
              <input
                type="checkbox"
                id="acceptTerms"
                name="acceptTerms"
                checked={formData.acceptTerms || false}
                onChange={handleInputChange}
                className="w-5 h-5 mt-1 mr-3 text-[#667eea] rounded"
              />
              <label htmlFor="acceptTerms" className="text-gray-700 text-sm">
                I accept the Terms and Conditions
              </label>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row justify-between items-center pt-8 gap-6">
              <button
                type="button"
                onClick={onBackClick}
                className="flex items-center text-gray-600 hover:text-gray-800 font-medium"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white px-10 py-3 rounded-xl font-semibold hover:shadow-xl hover:shadow-[#667eea]/30 transition-all duration-200"
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