import {
  Building2,
  Calendar,
  Clock,
  MessageSquare,
  ArrowLeft,
  Check
} from "lucide-react";

export default function RegisterPage({
  onBackClick,
  formData = {},
  handleInputChange,
  handleSubmit
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea]/5 via-[#f093fb]/5 to-[#764ba2]/5 overflow-hidden">
      <div className="container mx-auto px-4 max-w-2xl flex flex-col py-4">

        {/* Header */}
        <header className="mb-6 pt-2 text-center">
          <div className="flex items-center justify-center gap-3">
            <div className="p-2 bg-gradient-to-br from-[#667eea]/20 to-[#764ba2]/20 rounded-lg">
              <Building2 className="h-6 w-6 text-[#667eea]" />
            </div>

            <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
              OffCampus Access: Hire Beyond Boundaries
            </h1>
          </div>

          <p className="text-sm text-gray-600 mt-3 max-w-xl mx-auto">
            Reach skilled talent beyond campuses. Schedule a discussion with our team to
            explore flexible, scalable off-campus hiring solutions.
          </p>
        </header>

        {/* Form Card */}
        <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent text-center">
            Request Information
          </h2>

          <p className="text-gray-600 text-sm text-center mt-2 mb-6">
            Share your availability and message to proceed
          </p>

          <div className="space-y-5">

            {/* Date & Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Date */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
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
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
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
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <MessageSquare className="h-4 w-4 mr-2 text-gray-500" />
                Message
              </label>
              <textarea
                name="message"
                value={formData.message || ""}
                onChange={handleInputChange}
                placeholder="Type your message here..."
                className="w-full h-28 border border-gray-200 rounded-lg p-3 bg-gradient-to-r from-gray-50 to-white focus:ring-2 focus:ring-[#667eea]/50 focus:outline-none"
              />
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3 pt-1">
              <div className="relative flex items-center h-5">
                <input
                  type="checkbox"
                  name="termsAccepted"
                  checked={formData.termsAccepted || false}
                  onChange={handleInputChange}
                  className="peer h-5 w-5 appearance-none rounded border border-gray-300 bg-white checked:bg-[#667eea] checked:border-[#667eea] focus:ring-2 focus:ring-[#667eea]/50 transition"
                />
                <Check className="absolute h-3 w-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
              </div>
              <span className="text-sm text-gray-700">
                I accept the Terms and Conditions
              </span>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row justify-between items-center pt-6 gap-4">
              <button
                type="button"
                onClick={onBackClick}
                className="flex items-center text-gray-600 hover:text-gray-800 text-sm font-medium"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white px-8 py-3 rounded-lg font-medium hover:shadow-lg hover:shadow-[#667eea]/30 transition-all"
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
