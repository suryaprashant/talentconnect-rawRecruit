import { Calendar, Clock, MessageSquare, ArrowLeft, Send, CheckSquare, Star } from 'lucide-react';

export default function RegisterPage({ 
  onBackClick, 
  formData = {}, 
  handleInputChange, 
  handleSubmit, 
  isSubmitting = false,
  submitError = '' 
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0e6f7]/60 via-[#d4e8f9]/55 to-[#cff7ea]/60">
      {/* Pastel blur background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#fbcfe8]/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-[#93c5fd]/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-1/3 w-40 h-40 bg-[#a7f3d0]/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/4 right-1/4 w-48 h-48 bg-[#c7d2fe]/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 left-1/4 w-56 h-56 bg-[#fde68a]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-2xl">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] bg-clip-text text-transparent mb-2">
            Campus Branding: Make Your Campus the Talent Hub
          </h1>
          <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto">
            Attract, engage and retain top talent right from the source. Campus Branding helps your company build a lasting relationship with students, showcasing your brand and opportunities early on. Connect with the next generation of talent and establish a presence that resonates with future leaders.
          </p>
        </div>

        {/* Registration Form */}
        <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-blue-50/50 p-8">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] bg-clip-text text-transparent mb-2 text-center">
            Request info for Campus Branding
          </h2>
          <p className="text-gray-600 mb-8 text-center">
            Fill out the form below and our team will get back to you with detailed information.
          </p>

          {/* Error Message */}
          {submitError && (
            <div className="mb-6 p-4 bg-gradient-to-r from-[#fecaca]/20 to-[#f87171]/10 border border-[#f87171]/30 rounded-xl">
              <p className="text-[#dc2626] text-sm">{submitError}</p>
            </div>
          )}

          <div className="space-y-6">
            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#3b82f6]" />
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date || ""}
                  onChange={handleInputChange}
                  className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent transition-all duration-200"
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#3b82f6]" />
                  Time
                </label>
                <select 
                  name="time"
                  value={formData.time || ""}
                  onChange={handleInputChange}
                  className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent appearance-none transition-all duration-200"
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

            {/* Message */}
            <div>
              <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#3b82f6]" />
                Message
              </label>
              <textarea 
                name="message"
                value={formData.message || ""}
                onChange={handleInputChange}
                className="w-full bg-white/50 backdrop-blur-sm border border-white/50 rounded-xl p-3 h-32 focus:outline-none focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent transition-all duration-200 resize-none" 
                placeholder="Type your message here..."
                required
              />
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-center bg-gradient-to-r from-[#93c5fd]/10 to-[#3b82f6]/5 p-4 rounded-xl border border-[#93c5fd]/20">
              <div className="flex items-center h-5">
                <input 
                  type="checkbox" 
                  id="acceptTerms"
                  name="acceptTerms"
                  checked={formData.acceptTerms || false}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-[#3b82f6] bg-white/50 border-white/50 rounded focus:ring-[#93c5fd] focus:ring-2"
                  required
                />
              </div>
              <label htmlFor="acceptTerms" className="ml-3 text-gray-700 text-sm">
                <span className="font-medium">I accept the Terms and Conditions</span>
                <p className="text-gray-500 mt-1">By checking this box, you agree to our privacy policy and terms of service.</p>
              </label>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 border-t border-gray-200/50">
              <button 
                type="button"
                onClick={onBackClick}
                disabled={isSubmitting}
                className="flex items-center gap-2 text-[#3b82f6] hover:text-[#1d4ed8] font-medium transition-colors duration-200 group disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform duration-200" />
                Back to Home
              </button>
              <button 
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="group flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-[#93c5fd] to-[#3b82f6] text-white rounded-xl hover:shadow-lg hover:shadow-[#93c5fd]/40 transition-all duration-200 text-base font-medium disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Submit Request
                    <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}