import { motion } from 'framer-motion'

export default function Welcome({ onNext }) {  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#143694]/15 via-[#f093fb]/10 to-[#1e4ed8]/15 p-4">
      {/* Blur Background around card */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-[#143694]/10 to-[#1e4ed8]/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-[#f093fb]/10 to-[#f5576c]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-2xl">
        {/* Blur background behind card */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#143694]/5 to-[#1e4ed8]/5 backdrop-blur-sm rounded-2xl -inset-x-4 bottom-0"></div>
        
        <motion.div
          className="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-100 p-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Decorative top bar */}
          <div className="h-1 bg-gradient-to-r from-[#143694] via-[#f093fb] to-[#43e97b] rounded-t-2xl absolute top-0 left-0 right-0"></div>

          <h1 className="text-2xl font-bold text-gray-800 mb-2">Create Your Employer Account</h1>
          <p className="text-gray-600 mb-8">
            Build your profile to explore job opportunities, internships, and campus placements.
          </p>

          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={() => console.log('Cancel')}
              className="px-6 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-all duration-300"
            >
              Cancel
            </button>
            <button
              onClick={onNext}
              className="px-6 py-3 bg-gradient-to-r from-[#143694] to-[#1e4ed8] text-white rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-300 shadow-md"
            >
              Next
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}