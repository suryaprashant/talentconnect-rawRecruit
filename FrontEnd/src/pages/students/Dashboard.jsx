import { useAuth } from '@/context/AuthProvider'
import { FiPlus } from 'react-icons/fi'

function Dashboard() {
  const [authuser, setAuthUser] = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea]/10 via-[#f093fb]/5 to-[#764ba2]/10">
      {/* Pastel blur background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#667eea]/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-[#f093fb]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-1/3 w-40 h-40 bg-[#764ba2]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 p-6">
        {/* Header with theme */}
        <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-purple-50/50 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
                {authuser?.user?.name ?? authuser?.user?.email ?? 'Welcome'}
              </h1>
              
              {/* Pastel color pills in grid layout */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                {/* Label Pill */}
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 mb-1">Label</span>
                  <span className="px-3 py-2 text-sm font-medium bg-gradient-to-r from-[#a5b4fc]/20 to-[#c4b5fd]/20 text-[#5b21b6] border border-[#a5b4fc]/30 rounded-xl">
                    Label
                  </span>
                </div>
                
                {/* Status Pill */}
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 mb-1">Status</span>
                  <span className="px-3 py-2 text-sm font-medium bg-gradient-to-r from-[#bbf7d0]/20 to-[#86efac]/20 text-[#065f46] border border-[#bbf7d0]/30 rounded-xl">
                    Active
                  </span>
                </div>
                
                {/* Assignee Pill */}
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 mb-1">Assignee</span>
                  <span className="px-3 py-2 text-sm font-medium bg-gradient-to-r from-[#fbcfe8]/20 to-[#f9a8d4]/20 text-[#9d174d] border border-[#fbcfe8]/30 rounded-xl">
                    Assignee
                  </span>
                </div>
                
                {/* Created Pill */}
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 mb-1">Created</span>
                  <span className="px-3 py-2 text-sm font-medium bg-gradient-to-r from-[#fde68a]/20 to-[#fcd34d]/20 text-[#92400e] border border-[#fde68a]/30 rounded-xl">
                    July 1, 2023
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-purple-50/50 p-6">
            <h2 className="mb-4 text-xl font-bold text-gray-900">Main Content</h2>
            <p className="text-gray-600 text-lg">
              This is where your main content would go. You can click and paste content here as needed. 1234
            </p>
            <div className="flex justify-end mt-6">
              <button
                className="flex items-center px-6 py-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-200 font-medium"
              >
                <FiPlus className="w-5 h-5 mr-2" />
                Add New
              </button>
            </div>
          </div>
          
          <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-purple-50/50 p-6">
            <h2 className="mb-4 text-xl font-bold text-gray-900">Additional Content</h2>
            <p className="text-gray-600 text-lg">
              This is a secondary content area that can be used to display related information or additional features.
            </p>
            <div className="flex justify-end mt-6">
              <button
                className="px-6 py-3 bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl text-gray-700 hover:bg-white/90 hover:shadow-md transition-all duration-200 font-medium"
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard