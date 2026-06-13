import React from "react";

function SidebarHelpModal({ open, onClose, icon: Icon, title, description }) {
  if (!open) return null;

return (
  <div className="fixed inset-0 z-[99999] flex">
    <div className="relative flex-1 flex items-start justify-center p-4 sm:p-8 ml-0 sm:ml-64 pt-20">
      
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity cursor-pointer" 
        onClick={onClose} 
      />

      {/* Modal */}
      <div className="mt-10 relative z-10 w-full max-w-2xl min-w-[300px] sm:min-w-[380px] bg-white shadow-2xl rounded-2xl animate-in fade-in slide-in-from-top-8 duration-300 border border-gray-100">
        
        <div className="p-10 sm:p-6">

          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-3">
              <Icon className="w-6 h-6 text-[#143694]" />
              <h2 className="text-2xl font-bold">{title}</h2>
            </div>

            <button 
              onClick={onClose}
              className="p-2 -mt-2 text-gray-400 transition-all rounded-full hover:text-[#143694] hover:bg-[#143694]/10"
            >
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="text-base sm:text-lg leading-relaxed text-gray-600 whitespace-pre-wrap bg-[#143694]/5 border border-[#143694]/10 rounded-xl p-6 min-h-[120px]">
            {description}
          </div>

          {/* Footer */}
          <div className="flex justify-end mt-10">
            <button
              onClick={onClose}
              className="px-10 py-3.5 text-base font-semibold text-white bg-[#143694] rounded-xl hover:bg-[#1e4ed8] transition-all shadow-md hover:shadow-lg active:scale-95"
            >
              Got it
            </button>
          </div>

        </div>
      </div>
    </div>
  </div>
);
}

export default SidebarHelpModal;