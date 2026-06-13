// src/components/common/savedJob/JobDetailRouter.jsx
import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import UnifiedJobDetail from './JobDetail';
import CompanyJobDetail from './CompanyJobDetail';

const JobDetailRouter = () => {
  const { user } = useAuth();
  const location = useLocation();
  
  // Check if this is a company OR employer user
  if (user?.userType === 'company' || user?.userType === 'employer') {
    return <CompanyJobDetail />;
  }
  
  // For all other users (college, student, fresher), use unified detail
  return <UnifiedJobDetail />;
};

export default JobDetailRouter;