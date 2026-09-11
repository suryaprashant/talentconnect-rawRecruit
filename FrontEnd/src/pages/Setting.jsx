function Settings() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#143694]/10 via-[#f093fb]/5 to-[#1e4ed8]/10">
      <div className="container mx-auto px-4 py-8 pt-20">
        {/* Page Header with only search box */}
        <div className="mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm rounded-2xl"></div>
            <div className="relative flex items-center justify-center py-6">
              <div className="absolute left-0 top-0 bottom-0 flex items-center pl-6">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-[#143694] to-[#1e4ed8] bg-clip-text text-transparent">
                  Settings
                </h1>
              </div>
              <div className="w-full max-w-md ml-auto">
                <div className="relative">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5">
                    <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clipRule="evenodd" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search settings..."
                    className="w-full pl-10 pr-4 py-3 bg-white/90 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#143694]/50 focus:border-transparent focus:outline-none shadow-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold bg-gradient-to-r from-[#143694] to-[#1e4ed8] bg-clip-text text-transparent mb-4">
            User Settings
          </h2>
          <p className="text-gray-600 p-4 bg-gradient-to-r from-[#143694]/5 to-transparent rounded-xl">
            Your settings options would be displayed here.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Settings