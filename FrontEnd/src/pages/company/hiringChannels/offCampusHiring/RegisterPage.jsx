import {
  Building2,
  Calendar,
  Clock,
  MessageSquare,
  ArrowLeft,
  Check,
  Mail,
  User
} from "lucide-react";
import { TermsModal } from "@/components/onboarding/Terms&conditionModal";
import { useState } from "react";

export default function RegisterPage({
  onBackClick,
  formData = {},
  handleInputChange,
  handleSubmit,
  isSubmitting = false,
  submitError = ""
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#143694]/5 via-[#f093fb]/5 to-[#1e4ed8]/5 overflow-hidden">
      <div className="mb-6">
        <button
          type="button"
          onClick={onBackClick}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-[#4B5563] hover:bg-white/60 transition-all font-medium"
        >
          ← Back
        </button>
      </div>
      <div className="container mx-auto px-4 max-w-2xl flex flex-col py-4">
        {/* Header */}
        <header className="mb-6 pt-2 text-center">
          <div className="flex items-center justify-center gap-3">
            <div className="p-2 bg-gradient-to-br from-[#143694]/20 to-[#1e4ed8]/20 rounded-lg">
              <Building2 className="h-6 w-6 text-[#143694]" />
            </div>

            <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-[#143694] to-[#1e4ed8] bg-clip-text text-transparent">
              OffCampus Access: Hire Beyond Boundaries
            </h1>
          </div>

          <p className="text-sm text-gray-600 mt-3 max-w-xl mx-auto">
            Reach skilled talent beyond campuses. Schedule a discussion with our
            team to explore flexible, scalable off-campus hiring solutions.
          </p>
        </header>

        {/* Form Card */}
        <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-[#143694] to-[#1e4ed8] bg-clip-text text-transparent text-center">
            Request Information
          </h2>

          <p className="text-gray-600 text-sm text-center mt-2 mb-6">
            Share your availability and message to proceed
          </p>

          {/* Error Message */}
          {submitError && (
            <div className="mb-5 p-4 bg-gradient-to-r from-[#fecaca]/20 to-[#f87171]/10 border border-[#f87171]/30 rounded-xl">
              <p className="text-[#dc2626] text-sm">{submitError}</p>
            </div>
          )}

          <div className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-gray-700 font-medium mb-1 flex items-center gap-2">
                <User className="w-4 h-4 text-[#1e4ed8]" />
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name || ""}
                onChange={handleInputChange}
                required
                placeholder="Enter your full name"
                className="w-full bg-white/50 border border-white/50 rounded-xl p-3 focus:ring-2 focus:ring-[#143694] outline-none"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-700 font-medium mb-1 flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#1e4ed8]" />
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email || ""}
                onChange={handleInputChange}
                required
                placeholder="Enter your email address"
                className="w-full bg-white/50 border border-white/50 rounded-xl p-3 focus:ring-2 focus:ring-[#143694] outline-none"
              />
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Date */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date || ""}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full border border-gray-200 rounded-lg p-3 bg-gradient-to-r from-gray-50 to-white focus:ring-2 focus:ring-[#143694]/50 focus:outline-none"
                />
              </div>

              {/* Time */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Clock className="h-4 w-4 mr-2 text-gray-500" />
                  Time <span className="text-red-500">*</span>
                </label>
                <select
                  name="time"
                  value={formData.time || ""}
                  onChange={handleInputChange}
                  className="w-full border border-gray-200 rounded-lg p-3 bg-gradient-to-r from-gray-50 to-white focus:ring-2 focus:ring-[#143694]/50 focus:outline-none"
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
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                name="message"
                value={formData.message || ""}
                onChange={handleInputChange}
                placeholder="Type your message here..."
                className="w-full h-28 border border-gray-200 rounded-lg p-3 bg-gradient-to-r from-gray-50 to-white focus:ring-2 focus:ring-[#143694]/50 focus:outline-none"
              />
            </div>

            {/* Terms & Conditions - Styled like TermsAndConditions component */}
            <div className="mb-4">
              <div className="flex flex-col p-4 bg-gradient-to-r from-[#143694]/5 to-transparent rounded-xl border border-gray-200">
                <div className="flex items-start gap-3">
                  <div className="relative flex items-center h-5 mt-0.5">
                    <input
                      type="checkbox"
                      name="termsAccepted"
                      id="termsAccepted"
                      checked={formData.termsAccepted || false}
                      onChange={handleInputChange}
                      className="peer h-5 w-5 appearance-none rounded border border-gray-300 bg-white checked:bg-[#143694] checked:border-[#143694] focus:ring-2 focus:ring-[#143694]/50 transition cursor-pointer"
                    />
                    <Check className="absolute h-3 w-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
                  </div>
                  <div>
                    <label
                      htmlFor="termsAccepted"
                      className="text-sm sm:text-base text-gray-700 font-medium cursor-pointer"
                    >
                      I agree to the Terms & Conditions and Privacy Policy
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(true)}
                      className="block text-blue-600 hover:text-[#143694] underline cursor-pointer text-sm mt-1"
                    >
                      View Terms & Services
                    </button>
                  </div>
                </div>
              </div>

              {/* Terms Modal */}
              <TermsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
              />
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row justify-center items-center pt-6 gap-4">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting || !formData.termsAccepted}
                className={`bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white px-8 py-3 rounded-lg font-medium transition-all ${
                  !formData.termsAccepted 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:shadow-lg hover:shadow-[#143694]/30'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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

            {/* Terms reminder */}
            {!formData.termsAccepted && (
              <p className="text-center text-xs text-orange-500 mt-2">
                ⚠️ Please accept the Terms & Conditions to submit the form
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}