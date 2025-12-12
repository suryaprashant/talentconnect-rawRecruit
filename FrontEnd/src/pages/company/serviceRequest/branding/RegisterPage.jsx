import { Building2, Calendar, Clock, MessageSquare, ArrowLeft } from 'lucide-react';

export default function RegisterPage({ onBackClick, formData = {}, handleInputChange, handleSubmit }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea]/5 via-[#f093fb]/5 to-[#764ba2]/5">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header Section */}
        <header className="mb-12 text-center">
          <div className="flex items-center justify-center mb-3">
            <div className="p-2 bg-gradient-to-br from-[#667eea]/20 to-[#764ba2]/20 rounded-lg mr-3">
              <Building2 className="h-5 w-5 text-[#667eea]" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
              Employer Branding: Be the Brand They Want to Work For
            </h1>
          </div>
          <p className="text-md text-gray-600 max-w-2xl mx-auto">
            Stand out in a competitive hiring market by building strong brand recall among students and early-career professionals.  
            Our Employer Branding solutions help you position your company as an aspirational workplace.
          </p>
        </header>

        {/* Registration Form */}
        <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent text-center">
            Request info for Employer Branding
          </h2>
          <p className="text-gray-600 mb-8 text-center">
            Fill in your details to get more information about our Employer Branding services
          </p>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date Input */}
              <div>
                <label className="block text-gray-700 font-medium mb-2 flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="date"
                    value={formData.date || ""}
                    onChange={handleInputChange}
                    className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
              
              {/* Time Select */}
              <div>
                <label className="block text-gray-700 font-medium mb-2 flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-gray-500" />
                  Time
                </label>
                <div className="relative">
                  <select
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className="w-full border border-gray-200 rounded-lg p-3 appearance-none focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white"
                  >
                    <option value="">Select Time</option>
                    <option value="09:00">9:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="13:00">1:00 PM</option>
                    <option value="15:00">3:00 PM</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <Clock className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Message Textarea */}
            <div>
              <label className="block text-gray-700 font-medium mb-2 flex items-center">
                <MessageSquare className="h-4 w-4 mr-2 text-gray-500" />
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-[#667eea]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white h-32"
                placeholder="Tell us more about your employer branding needs..."
              />
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start pt-2">
              <input
                type="checkbox"
                id="acceptTerms"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleInputChange}
                className="w-5 h-5 mr-3 mt-1 text-[#667eea] border-gray-300 rounded focus:ring-[#667eea]/50"
              />
              <label htmlFor="acceptTerms" className="text-gray-700">
                Accept the Terms and Conditions
              </label>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row justify-between items-center pt-8 gap-4">
              <button
                type="button"
                onClick={onBackClick}
                className="flex items-center text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white px-8 py-3 rounded-lg font-medium hover:shadow-lg hover:shadow-[#667eea]/30 focus:outline-none focus:ring-2 focus:ring-[#667eea]/50 transition-all duration-200"
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