import {
  Building2,
  Calendar,
  Clock,
  MessageSquare,
  ArrowLeft,
} from "lucide-react";

export default function RegisterPage({
  onBackClick,
  formData = {},
  handleInputChange,
  handleSubmit,
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#143694]/5 via-[#f093fb]/5 to-[#1e4ed8]/5">
      <div className="mb-6">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-[#4B5563] hover:bg-white/60 transition-all font-medium"
        >
          ← Back
        </button>
      </div>

      <div className="container mx-auto px-4 py-10 max-w-2xl">
        {/* Header Section */}
        <header className="mb-6 pt-2 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="p-2 bg-gradient-to-br from-[#143694]/20 to-[#1e4ed8]/20 rounded-lg mr-3">
              <Building2 className="h-5 w-5 text-[#143694]" />
            </div>

            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#143694] to-[#1e4ed8] bg-clip-text text-transparent">
              OnCampus Connect: Hire Smarter
            </h1>
          </div>

          <p className="text-sm text-gray-600 mt-3 max-w-xl mx-auto">
            Our OnCampus Service brings career opportunities directly to
            students through structured campus recruitment drives and hiring
            events.
          </p>
        </header>

        {/* Registration Form */}
        <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-[#143694] to-[#1e4ed8] bg-clip-text text-transparent text-center">
            Request Info for On-Campus Hiring
          </h2>

          <p className="text-gray-600 mb-10 text-center">
            Fill in your details to get more information about our On-Campus
            hiring services
          </p>

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
                  className="w-full border border-gray-200 rounded-lg p-3 bg-gradient-to-r from-gray-50 to-white focus:ring-2 focus:ring-[#143694]/50 focus:outline-none"
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
              <label className="block text-gray-700 font-medium mb-2 flex items-center">
                <MessageSquare className="h-4 w-4 mr-2 text-gray-500" />
                Message
              </label>

              <textarea
                name="message"
                value={formData.message || ""}
                onChange={handleInputChange}
                placeholder="Type your message here..."
                className="w-full h-32 border border-gray-200 rounded-lg p-3 bg-gradient-to-r from-gray-50 to-white focus:ring-2 focus:ring-[#143694]/50 focus:outline-none"
              />
            </div>

            {/* Terms */}
            <div className="flex items-start">
              <input
                type="checkbox"
                name="termsAccepted"
                checked={formData.termsAccepted || false}
                onChange={handleInputChange}
                className="w-5 h-5 mt-1 mr-3 text-[#143694] rounded"
              />
              <label className="text-gray-700">
                I accept the Terms and Conditions
              </label>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row justify-center items-center pt-12 gap-6">
              {/* <button
                type="button"
                onClick={onBackClick}
                className="flex items-center text-gray-600 hover:text-gray-800 font-medium"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </button> */}

              <button
                type="button"
                onClick={handleSubmit}
                className="bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white px-10 py-4 rounded-xl text-lg font-semibold hover:shadow-xl hover:shadow-[#143694]/30 transition-all duration-200"
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
