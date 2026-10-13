import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    message: '',
    acceptTerms: false
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length === 0) {
      setSubmitting(true);
      // Simulate API call
      setTimeout(() => {
        console.log('Form submitted:', formData);
        setSubmitting(false);
        setFormData({ message: '', acceptTerms: false });
      }, 1000);
    } else {
      setErrors(validationErrors);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.message.trim()) errors.message = 'Message is required';
    if (!formData.acceptTerms) errors.acceptTerms = 'You must accept the terms';
    return errors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#143694]/5 via-[#f093fb]/5 to-[#1e4ed8]/5 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-[#143694] to-[#1e4ed8] bg-clip-text text-transparent mb-8">Contact us</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#143694]/50 focus:border-transparent focus:outline-none transition-all duration-200 bg-gradient-to-r from-gray-50 to-white ${
                    errors.message ? 'border-red-500' : 'border-gray-200'
                  }`}
                  rows="4"
                  placeholder="Type your message..."
                />
                {errors.message && (
                  <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                )}
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  className="h-5 w-5 text-[#143694] border-gray-300 rounded focus:ring-[#143694]/50"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  I accept the Terms
                </label>
              </div>
              {errors.acceptTerms && (
                <p className="text-red-500 text-sm">{errors.acceptTerms}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white py-3 px-4 rounded-lg font-medium hover:shadow-lg hover:shadow-[#143694]/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Submit
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-6 space-y-6">
            <div className="flex items-start">
              <div className="p-3 bg-gradient-to-br from-[#143694]/20 to-[#1e4ed8]/20 rounded-lg mr-4">
                <Mail className="h-5 w-5 text-[#143694]" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-1">Email</h2>
                <a
                  href="mailto:contact-us@talentconnectes.com"
                  className="text-[#143694] hover:text-[#1e4ed8] transition-colors"
                >
                  contact-us@talentconnectes.com
                </a>
              </div>
            </div>

            <div className="flex items-start">
              <div className="p-3 bg-gradient-to-br from-[#143694]/20 to-[#1e4ed8]/20 rounded-lg mr-4">
                <Phone className="h-5 w-5 text-[#143694]" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-1">Phone</h2>
                <a
                  href="tel:+917979863193"
                  className="text-[#143694] hover:text-[#1e4ed8] transition-colors"
                >
                  +91-7979863193
                </a>
              </div>
            </div>

            <div className="flex items-start">
              <div className="p-3 bg-gradient-to-br from-[#143694]/20 to-[#1e4ed8]/20 rounded-lg mr-4">
                <MapPin className="h-5 w-5 text-[#143694]" />
              </div>
           <div>
  <h2 className="text-lg font-semibold text-gray-900 mb-1">
    Office
  </h2>

  <p className="text-gray-600">
    RUKMINI VENKATASWAMY REDDY ARCADE, B-Block, Ashoka Lane,
    Green Glen Layout, Bellandur, Bangalore, Karnataka - 560103
  </p>

  <a
    href="https://maps.google.com/?q=RUKMINI%20VENKATASWAMY%20REDDY%20ARCADE,%20B-Block,%20Ashoka%20Lane,%20Green%20Glen%20Layout,%20Bellandur,%20Bangalore,%20Karnataka%20560103"
    target="_blank"
    rel="noopener noreferrer"
    className="text-[#143694] hover:text-[#1e4ed8] transition-colors mt-1 inline-block underline-offset-2 hover:underline"
    aria-label="Get directions to office on Google Maps"
  >
    Get Directions
  </a>
</div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;