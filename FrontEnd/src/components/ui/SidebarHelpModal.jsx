import React from "react";

function SidebarHelpModal({ open, onClose, title, description }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex">
      <div className="relative flex-1 flex items-start justify-center p-4 sm:p-8 ml-0 sm:ml-64 pt-20">
        
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity cursor-pointer" 
          onClick={onClose} 
        />

        {/* Modal Box - Updated for consistent breadth */}
        <div className="mt-10 relative z-10 w-full max-w-2xl min-w-[300px] sm:min-w-[380px] bg-white shadow-2xl rounded-2xl animate-in fade-in slide-in-from-top-8 duration-300">
          <div className="p-10 sm:p-12">
            
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-center gap-4">
                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
                  {title}
                </h2>
              </div>
              <button 
                onClick={onClose}
                className="p-2 -mt-2 text-gray-400 transition-colors rounded-full hover:text-gray-600 hover:bg-gray-100"
              >
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content area with enforced spacing */}
            <div className="text-lg leading-relaxed text-gray-600 sm:text-xl whitespace-pre-wrap border-l-4 border-indigo-100 pl-8 min-h-[120px] flex items-center">
              {description}
            </div>

            <div className="flex justify-end mt-12">
              <button
                onClick={onClose}
                className="px-12 py-4 text-lg font-bold text-white transition-all bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-xl shadow-indigo-100 active:scale-95"
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