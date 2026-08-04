import { Calendar, Clock, MessageSquare, ArrowLeft, Send } from 'lucide-react';

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
      <div className="mb-6">
        <button
          type="button"
          onClick={onBackClick}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-[#4B5563] hover:bg-white/60 transition-all font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>
      {/* Background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#fbcfe8]/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-[#143694]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/3 w-40 h-40 bg-[#a7f3d0]/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 pt-14 max-w-2xl">
        {/* Header */}
        <header className="mb-6 text-center">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#1e4ed8] to-[#1e40af] bg-clip-text text-transparent">
            Campus Branding: Make Your Campus the Talent Hub
          </h1>
          <p className="text-gray-600 text-base md:text-lg max-w-xl mx-auto mt-3">
            Attract, engage and retain top talent right from the source. Campus Branding helps your company build a lasting relationship with students, showcasing your brand and opportunities early on.
          </p>
        </header>

        {/* Form Card */}
        <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#1e4ed8] to-[#1e40af] bg-clip-text text-transparent text-center mb-1">
            Request info for Campus Branding
          </h2>
          <p className="text-gray-600 text-center text-sm mb-5">
            Fill out the form below and our team will get back to you with detailed information.
          </p>

          {/* Error Message */}
          {submitError && (
            <div className="mb-5 p-4 bg-gradient-to-r from-[#fecaca]/20 to-[#f87171]/10 border border-[#f87171]/30 rounded-xl">
              <p className="text-[#dc2626] text-sm">{submitError}</p>
            </div>
          )}

          <div className="space-y-5">
            {/* Date & Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#1e4ed8]" />
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date || ""}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  required
                  className="w-full bg-white/50 border border-white/50 rounded-xl p-3 focus:ring-2 focus:ring-[#143694] outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#1e4ed8]" />
                  Time
                </label>
                <select
                  name="time"
                  value={formData.time || ""}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-white/50 border border-white/50 rounded-xl p-3 focus:ring-2 focus:ring-[#143694] outline-none"
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
              <label className="block text-gray-700 font-medium mb-1 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#1e4ed8]" />
                Message
              </label>
              <textarea
                name="message"
                value={formData.message || ""}
                onChange={handleInputChange}
                rows={3}
                required
                className="w-full bg-white/50 border border-white/50 rounded-xl p-3 focus:ring-2 focus:ring-[#143694] outline-none resize-none"
                placeholder="Type your message..."
              />
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3 bg-gradient-to-r from-[#143694]/10 to-[#1e4ed8]/5 p-3 rounded-xl border border-[#143694]/20">
              <input
                type="checkbox"
                name="acceptTerms"
                checked={formData.acceptTerms || false}
                onChange={handleInputChange}
                required
                className="w-5 h-5 mt-1"
              />
              <p className="text-gray-600 text-sm">
                I accept the <span className="font-medium">Terms & Conditions</span> and
                agree to the privacy policy.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4 border-t border-gray-200/50">
              {/* <button
                type="button"
                onClick={onBackClick}
                disabled={isSubmitting}
                className="flex items-center gap-2 text-[#1e4ed8] hover:text-[#1d4ed8] font-medium disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button> */}

              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="group flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white rounded-xl text-base font-semibold hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
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