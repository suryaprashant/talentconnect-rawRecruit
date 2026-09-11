// src/components/jobs/JobDetailWrapper.jsx
import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import CollegeJobDetail from './CollegeJobDetail';
import CompanyJobDetail from './CompanyJobDetail';
import EmployerJobDetail from './EmployerJobDetail';
import StudentJobDetail from './StudentJobDetail';
import FresherJobDetail from './FresherJobDetail';

const JobDetailWrapper = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const location = useLocation();
  
  // Get user type from auth context
  const userType = user?.userType || 'student';
  
  // Get job data from location state or fetch based on id
  const jobData = location.state?.job;
  const isSaved = location.state?.isSaved || false;
  const jobType = location.state?.jobType;

  // Common props to pass to all detail components
  const commonProps = {
    jobId: id,
    initialJobData: jobData,
    isSaved,
    jobType,
  };

  // Render appropriate detail component based on user type
  switch(userType) {
    case 'college':
      return <CollegeJobDetail {...commonProps} />;
    case 'company':
      return <CompanyJobDetail {...commonProps} />;
    case 'employer':
      return <EmployerJobDetail {...commonProps} />;
    case 'student':
      return <StudentJobDetail {...commonProps} />;
    case 'fresher':
      return <FresherJobDetail {...commonProps} />;
    default:
      return <StudentJobDetail {...commonProps} />;
  }
};

export default JobDetailWrapper;