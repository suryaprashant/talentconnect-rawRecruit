import { useState } from 'react';
import { Search, Tag, Calendar, User, Filter, Download, Share2, MoreVertical } from 'lucide-react';

export default function HeaderContentLayout() {
  const [mainContent, setMainContent] = useState('');
  const [secondaryContent, setSecondaryContent] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0e6f7]/60 via-[#d4e8f9]/55 to-[#cff7ea]/60">
      {/* Pastel blur background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#fbcfe8]/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-[#93c5fd]/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-1/3 w-40 h-40 bg-[#a7f3d0]/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/4 right-1/4 w-48 h-48 bg-[#c7d2fe]/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 left-1/4 w-56 h-56 bg-[#fde68a]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Header Section */}
        <div className="bg-white/90 backdrop-blur-sm border-b border-white/50 shadow-sm">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              {/* Title Section */}
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] bg-clip-text text-transparent">
                  Header Title
                </h1>
                <p className="text-gray-600 text-sm mt-1">Detailed overview and management interface</p>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2.5 bg-white/50 backdrop-blur-sm border border-white/50 text-gray-700 rounded-xl hover:bg-white hover:shadow-md transition-all duration-200">
                  <Filter className="w-4 h-4" />
                  Filter
                </button>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-white/50 backdrop-blur-sm border border-white/50 text-gray-700 rounded-xl hover:bg-white hover:shadow-md transition-all duration-200">
                  <Download className="w-4 h-4" />
                  Export
                </button>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-white/50 backdrop-blur-sm border border-white/50 text-gray-700 rounded-xl hover:bg-white hover:shadow-md transition-all duration-200">
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#93c5fd] to-[#3b82f6] text-white rounded-xl hover:shadow-lg hover:shadow-[#93c5fd]/40 transition-all duration-200">
                  <MoreVertical className="w-4 h-4" />
                  Actions
                </button>
              </div>
            </div>

            {/* Metadata Section */}
            <div className="mt-6 flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-[#fde68a]/30 to-[#f59e0b]/20 rounded-lg flex items-center justify-center">
                  <Tag className="w-4 h-4 text-[#f59e0b]" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Label</p>
                  <p className="text-sm font-medium text-gray-900">Important</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-[#a7f3d0]/30 to-[#10b981]/20 rounded-lg flex items-center justify-center">
                  <div className="w-2 h-2 bg-[#10b981] rounded-full"></div>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <p className="text-sm font-medium text-gray-900">Active</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-[#f9a8d4]/30 to-[#ec4899]/20 rounded-lg flex items-center justify-center">
                  <User className="w-4 h-4 text-[#ec4899]" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Assignee</p>
                  <p className="text-sm font-medium text-gray-900">John Doe</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-[#c7d2fe]/30 to-[#6366f1]/20 rounded-lg flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-[#6366f1]" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Created</p>
                  <p className="text-sm font-medium text-gray-900">July 1, 2023</p>
                </div>
              </div>
              
              {/* Search Bar */}
              <div className="lg:ml-auto w-full lg:w-auto">
                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search across content..."
                    className="w-full pl-10 pr-4 py-3 bg-white/90 backdrop-blur-sm border border-white/50 rounded-xl focus:ring-2 focus:ring-[#93c5fd] focus:border-transparent focus:outline-none shadow-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Main Content Card */}
            <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-blue-50/50 overflow-hidden hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-300">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Main Content</h2>
                  <div className="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-[#93c5fd]/20 to-[#3b82f6]/20 text-[#3b82f6] backdrop-blur-sm">
                    PRIMARY
                  </div>
                </div>
                
                <div 
                  className={`min-h-80 flex items-center justify-center rounded-xl transition-all duration-300 ${mainContent ? 'bg-white/50 backdrop-blur-sm p-6' : 'bg-gradient-to-br from-[#93c5fd]/10 to-[#3b82f6]/5 border-2 border-dashed border-[#93c5fd]/30 cursor-pointer hover:border-[#3b82f6]/50 hover:bg-gradient-to-br hover:from-[#93c5fd]/15 hover:to-[#3b82f6]/10'}`}
                  onClick={() => {
                    if (!mainContent) {
                      const content = prompt("Enter main content:");
                      if (content) setMainContent(content);
                    }
                  }}
                >
                  {mainContent ? (
                    <div className="text-gray-800 text-center w-full">
                      <p className="mb-4 text-lg font-medium">Your Main Content</p>
                      <p className="text-gray-600">{mainContent}</p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setMainContent('');
                        }}
                        className="mt-4 text-sm text-red-500 hover:text-red-700 transition-colors"
                      >
                        Clear Content
                      </button>
                    </div>
                  ) : (
                    <div className="text-center p-6">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#93c5fd]/20 to-[#3b82f6]/20 rounded-full mb-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-[#93c5fd] to-[#3b82f6] rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold">+</span>
                        </div>
                      </div>
                      <p className="text-gray-700 font-medium mb-2">Click to add Main Content</p>
                      <p className="text-sm text-gray-500">Add your primary content here</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Secondary Content Card */}
            <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-blue-50/50 overflow-hidden hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-300">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Secondary Content</h2>
                  <div className="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-[#f9a8d4]/20 to-[#ec4899]/20 text-[#ec4899] backdrop-blur-sm">
                    SECONDARY
                  </div>
                </div>
                
                <div 
                  className={`min-h-80 flex items-center justify-center rounded-xl transition-all duration-300 ${secondaryContent ? 'bg-white/50 backdrop-blur-sm p-6' : 'bg-gradient-to-br from-[#f9a8d4]/10 to-[#ec4899]/5 border-2 border-dashed border-[#f9a8d4]/30 cursor-pointer hover:border-[#ec4899]/50 hover:bg-gradient-to-br hover:from-[#f9a8d4]/15 hover:to-[#ec4899]/10'}`}
                  onClick={() => {
                    if (!secondaryContent) {
                      const content = prompt("Enter secondary content:");
                      if (content) setSecondaryContent(content);
                    }
                  }}
                >
                  {secondaryContent ? (
                    <div className="text-gray-800 text-center w-full">
                      <p className="mb-4 text-lg font-medium">Your Secondary Content</p>
                      <p className="text-gray-600">{secondaryContent}</p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSecondaryContent('');
                        }}
                        className="mt-4 text-sm text-red-500 hover:text-red-700 transition-colors"
                      >
                        Clear Content
                      </button>
                    </div>
                  ) : (
                    <div className="text-center p-6">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#f9a8d4]/20 to-[#ec4899]/20 rounded-full mb-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-[#f9a8d4] to-[#ec4899] rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold">+</span>
                        </div>
                      </div>
                      <p className="text-gray-700 font-medium mb-2">Click to add Secondary Content</p>
                      <p className="text-sm text-gray-500">Add your supporting content here</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg shadow-blue-50/50 p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="p-4 bg-gradient-to-r from-[#93c5fd]/10 to-transparent backdrop-blur-sm rounded-xl border border-[#93c5fd]/20 text-[#3b82f6] hover:from-[#93c5fd]/20 transition-all duration-200 flex items-center justify-center gap-2">
                <span className="font-medium">Save Content</span>
              </button>
              <button className="p-4 bg-gradient-to-r from-[#fde68a]/10 to-transparent backdrop-blur-sm rounded-xl border border-[#fde68a]/20 text-[#f59e0b] hover:from-[#fde68a]/20 transition-all duration-200 flex items-center justify-center gap-2">
                <span className="font-medium">Preview</span>
              </button>
              <button className="p-4 bg-gradient-to-r from-[#a7f3d0]/10 to-transparent backdrop-blur-sm rounded-xl border border-[#a7f3d0]/20 text-[#10b981] hover:from-[#a7f3d0]/20 transition-all duration-200 flex items-center justify-center gap-2">
                <span className="font-medium">Publish</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}