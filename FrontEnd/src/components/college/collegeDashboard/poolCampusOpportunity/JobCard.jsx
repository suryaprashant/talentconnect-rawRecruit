import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Building, User, Banknote, Calendar, Briefcase, Home, Monitor, Building2, Tag } from 'lucide-react';

const JobCard = ({ job }) => {
    if (!job) return null;

    // Helper functions from the second design
    const getWorkModeDetails = () => {
        const workMode = job.workMode && typeof job.workMode === 'string' 
            ? job.workMode.toLowerCase() 
            : 'not specified';
        
        switch (workMode) {
            case 'remote':
                return {
                    label: 'Remote',
                    icon: Home,
                    color: 'bg-blue-100',
                    textColor: 'text-blue-800'
                };
            case 'hybrid':
                return {
                    label: 'Hybrid',
                    icon: Monitor,
                    color: 'bg-purple-100',
                    textColor: 'text-purple-800'
                };
            case 'onsite':
            case 'on-site':
                return {
                    label: 'On-Site',
                    icon: Building2,
                    color: 'bg-green-100',
                    textColor: 'text-green-800'
                };
            case 'office':
                return {
                    label: 'Office',
                    icon: Building,
                    color: 'bg-orange-100',
                    textColor: 'text-orange-800'
                };
            default:
                return {
                    label: workMode === 'not specified' ? 'Not specified' : 
                           workMode.charAt(0).toUpperCase() + workMode.slice(1),
                    icon: Building,
                    color: 'bg-gray-100',
                    textColor: 'text-gray-800'
                };
        }
    };

    // Format package details
    const formatPackage = () => {
        if (job.package && job.package !== 'Not specified') {
            return job.package;
        }
        return 'Package not specified';
    };

    // Format location
    const formatLocation = () => {
        if (job.location && job.location !== 'Not specified') {
            return job.location;
        }
        return 'Location not specified';
    };

    // Format streams
    const formatStreams = () => {
        if (job.streams && job.streams.length > 0 && job.streams[0] !== 'Not specified') {
            return job.streams.slice(0, 2); // Show max 2
        }
        return [];
    };

    // Format hiring process steps
    const formatHiringProcess = () => {
        if (job.hiringProcess && job.hiringProcess.length > 0 && job.hiringProcess[0] !== 'Not specified') {
            if (typeof job.hiringProcess === 'string') {
                const steps = job.hiringProcess.split(' + ');
                return steps.slice(0, 3);
            }
            return job.hiringProcess.slice(0, 3);
        }
        return [];
    };

    // Format description
    const formatDescription = () => {
        if (!job.description) {
            return 'No description provided.';
        }
        
        const words = job.description.split(' ');
        if (words.length <= 15) {
            return job.description;
        }
        
        // Always take exactly 15 words
        const truncatedWords = words.slice(0, 15);
        return truncatedWords.join(' ') + '...';
    };

    // Format tags
    const formatTags = () => {
        if (job?.tags && job.tags.length > 0) {
            return job.tags.slice(0, 3);
        }
        return [];
    };

    // Get work mode details
    const workModeDetails = getWorkModeDetails();
    const WorkModeIcon = workModeDetails.icon;
    const shouldDisplayWorkMode = job.workMode && 
                                 job.workMode !== 'Not specified' && 
                                 job.workMode !== 'not specified' &&
                                 workModeDetails.label !== 'Not specified';

    // Format streams for display
    const streams = formatStreams();
    const hiringProcess = formatHiringProcess();
    const tags = formatTags();

    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition duration-200 flex flex-col h-full">
            <div className="p-6 flex-1 flex flex-col">
                {/* Company Header */}
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center flex-1 min-w-0">
                        <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center overflow-hidden flex-shrink-0">
                            <img
                                src={job.logo || "https://via.placeholder.com/48"}
                                alt={`${job.companyName} logo`}
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                    e.target.src = "https://via.placeholder.com/48";
                                }}
                            />
                        </div>
                        <div className="ml-3 min-w-0">
                            <h3 className="font-semibold text-gray-900 truncate" title={job.companyName}>
                                {job.companyName}
                            </h3>
                        </div>
                    </div>
                    
                    {/* Work Mode Badge */}
                    {shouldDisplayWorkMode && (
                        <div className={`inline-flex items-center px-2 py-1 rounded-full ${workModeDetails.color} flex-shrink-0 ml-2`}>
                            <WorkModeIcon className={`h-3 w-3 mr-1 ${workModeDetails.textColor}`} />
                            <span className={`text-xs font-medium ${workModeDetails.textColor}`}>
                                {workModeDetails.label}
                            </span>
                        </div>
                    )}
                </div>

                {/* Streams - Only show if present */}
                {streams.length > 0 && (
                    <div className="flex gap-2 mb-3">
                        {streams.map((stream, index) => (
                            <span 
                                key={index} 
                                className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded flex-1 text-center truncate" 
                                title={stream}
                            >
                                {stream}
                            </span>
                        ))}
                    </div>
                )}

                {/* Info Sections with consistent height */}
                <div className="space-y-3 mb-4">
                    {/* Position */}
                    <div className="flex items-center min-h-[24px]">
                        <User className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
                        <p className="text-sm font-medium text-gray-800 truncate" title={job.position}>
                            {job.position}
                        </p>
                    </div>

                    {/* Location */}
                    <div className="flex items-center min-h-[24px]">
                        <MapPin className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
                        <p className="text-sm text-gray-700 truncate" title={formatLocation()}>
                            {formatLocation()}
                        </p>
                    </div>

                    {/* Venue */}
                    <div className="flex items-center min-h-[24px]">
                        <Building className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
                        <p className="text-sm text-gray-700 truncate" title={job.venue}>
                            {job.venue || 'Venue not specified'}
                        </p>
                    </div>

                    {/* Package */}
                    <div className="flex items-center min-h-[24px]">
                        <Banknote className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
                        <p className="text-sm text-gray-700 truncate" title={formatPackage()}>
                            {formatPackage()}
                        </p>
                    </div>

                    {/* Calendar if dates are available */}
                    {job.startDate && job.endDate && (
                        <div className="flex items-center min-h-[24px]">
                            <Calendar className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
                            <p className="text-sm text-gray-700 truncate">
                                {new Date(job.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(job.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </p>
                        </div>
                    )}
                </div>

                {/* Description - Fixed height */}
                <div className="mb-4 flex-1">
                    <p className="text-sm text-gray-600 line-clamp-3 h-[60px] overflow-hidden">
                        {formatDescription()}
                    </p>
                </div>

                {/* Hiring Process - Only show if present */}
                {hiringProcess.length > 0 && (
                    <div className="mb-4">
                        <div className="flex items-center mb-2">
                            <div className="bg-yellow-100 border border-yellow-200 rounded-md px-3 py-1">
                                <p className="text-xs font-medium text-yellow-800">Hiring Process</p>
                            </div>
                        </div>
                        <div className="flex gap-2 mb-2">
                            {hiringProcess.map((step, index) => (
                                <div key={index} className="bg-gray-50 border border-gray-100 rounded-md px-2 py-1 flex-1">
                                    <p className="text-xs text-gray-700 truncate text-center" title={step}>
                                        {step}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Tags - Only show if present */}
                {tags.length > 0 && (
                    <div className="mb-4">
                        <div className="flex items-center mb-2">
                            <Tag className="h-3 w-3 text-gray-500 mr-1" />
                            <span className="text-xs font-medium text-gray-700">Tags</span>
                        </div>
                        <div className="flex gap-2">
                            {tags.map((tag, index) => (
                                <span 
                                    key={index} 
                                    className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full truncate max-w-[100px]" 
                                    title={tag}
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Register Button - Always at bottom */}
                <div className="mt-auto pt-4">
                    <Link 
                        to={`/college-dashboard/Pool-campus/${job.id}`} 
                        className="block w-full"
                    >
                        <button className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition duration-200 font-medium">
                            Register Now
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default JobCard;