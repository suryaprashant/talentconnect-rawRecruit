import { Calendar, Clock, MessageSquare, ArrowLeft, Send } from 'lucide-react';

export default function RegisterPage({
  onBackClick,
  formData = {},
  handleInputChange,
  handleSubmit
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0e6f7]/60 via-[#d4e8f9]/55 to-[#cff7ea]/60">

      {/* Background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#fbcfe8]/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-[#143694]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/3 w-40 h-40 bg-[#a7f3d0]/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 pt-14 max-w-2xl">

        {/* Header (compressed) */}
        <header className="mb-6 text-center">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#1e4ed8] to-[#1e40af] bg-clip-text text-transparent">
            Pool Campus Connect: Hire Bigger 
          </h1>

          <p className="text-gray-600 text-base md:text-lg max-w-xl mx-auto mt-3">
            Centralized hiring drives bringing students from multiple colleges
            together—saving time, cost, and boosting employer visibility.
          </p>
        </header>

        {/* Form Card */}
        <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg p-6">

          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#1e4ed8] to-[#1e40af] bg-clip-text text-transparent text-center mb-1">
            Request Info for On-Campus Hiring 
          </h2>

          <p className="text-gray-600 text-center text-sm mb-5">
            Share your availability and message. Our team will connect shortly.
          </p>

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
                className="w-5 h-5 mt-1"
              />
              <p className="text-gray-600 text-sm">
                I accept the <span className="font-medium">Terms & Conditions</span> and
                agree to the privacy policy.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-gray-200/50">
              <button
                type="button"
                onClick={onBackClick}
                className="flex items-center gap-2 text-[#1e4ed8] hover:text-[#1d4ed8] font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                Back 
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                className="group flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white rounded-xl text-base font-semibold hover:shadow-lg transition-all"
              >
                <Send className="w-5 h-5" />
                Submit Request
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
