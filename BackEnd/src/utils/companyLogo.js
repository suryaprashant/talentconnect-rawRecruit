export const getCompanyLogo = (job) => {
  if (!job) return null;
  
  console.log('🔄 getCompanyLogo called with:', {
    jobId: job._id,
    companyPosted: job.companyPosted,
    profileImageUrl: job.companyPosted?.profileImageUrl,
    companyDetailsLogo: job.companyPosted?.companyDetails?.companyLogo,
    // Also check other possible paths
    allPossiblePaths: {
      path1: job.companyPosted?.profileImageUrl,
      path2: job.companyPosted?.profileImage,
      path3: job.companyPosted?.companyDetails?.companyLogo,
      path4: job.companyProfile?.profileImageUrl,
      path5: job.logo,
      path6: job.profileImageUrl
    }
  });
  
  // Priority order
  const possiblePaths = [
    job.companyPosted?.profileImageUrl,      // From fixed backend
    job.companyPosted?.profileImage,         // Fallback if field name differs
    job.companyPosted?.companyDetails?.companyLogo, // Alternative location
    job.companyProfile?.profileImageUrl,     // Status page structure
    job.companyProfile?.profileImage,
    job.profileImageUrl,
    job.logo
  ];
  
  for (const path of possiblePaths) {
    if (path && typeof path === 'string' && path.trim() !== '') {
      console.log('✅ Selected logo:', path);
      return path;
    }
  }
  
  console.log('❌ No logo found');
  return null;
};

export const getCompanyName = (job) => {
  return (
    job?.companyPosted?.companyDetails?.companyName ||
    job?.companyProfile?.companyDetails?.companyName ||
    job?.companyName ||
    'Company'
  );
};