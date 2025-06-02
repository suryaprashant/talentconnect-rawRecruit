import { FiHome, FiUser, FiPieChart, FiClipboard } from 'react-icons/fi';
import SidebarNavItem from './SidebarNavItem';
import SidebarNavGroup from './SidebarNavGroup';

function EmployerSidebar({ activePath }) {
  return (
    <div>
      {/* Basic Navigation */}
      <SidebarNavItem to="/home" icon={<FiHome />} label="Home" active={activePath === '/home'} />
      <SidebarNavItem to="/employer-profile" icon={<FiUser />} label="Profile" active={activePath === '/employer-profile'} />

      {/* Employer Dashboard */}
      <SidebarNavGroup label="Employer Dashboard" icon={<FiPieChart />} active={activePath.includes('/employer-dashboard')}>
        <SidebarNavItem to="/employer-dashboard/on-campus-request" label="On-campus Request" active={activePath === '/employer-dashboard/on-campus-request'} />
        <SidebarNavItem to="/employer-dashboard/pool-campus-requests" label="Pool Campus Requests" active={activePath === '/employer-dashboard/pool-campus-requests'} />
        <SidebarNavItem to="/employer-dashboard/resume-search" label="Resume Search" active={activePath === '/employer-dashboard/resume-search'} />
      </SidebarNavGroup>

      {/* Service Request */}
      <SidebarNavGroup label="Service Request" icon={<FiClipboard />} active={activePath.includes('/service-request')}>
        <SidebarNavItem to="/service-request/workforce-solution" label="Workforce Solution" active={activePath === '/service-request/workforce-solution'} />
        <SidebarNavItem to="/service-request/employee-training" label="Employee Training" active={activePath === '/service-request/employee-training'} />
        <SidebarNavItem to="/service-request/branding" label="Branding" active={activePath === '/service-request/branding'} />
      </SidebarNavGroup>

      {/* Job Management */}
      <SidebarNavGroup label="Job Management" icon={<FiClipboard />} active={activePath.includes('/job-management')}>
        <SidebarNavItem to="/job-management/on-campus-listings" label="On-campus Listings" active={activePath === '/job-management/on-campus-listings'} />
        <SidebarNavItem to="/job-management/pool-campus-listings" label="Pool Campus Listings" active={activePath === '/job-management/pool-campus-listings'} />
        <SidebarNavItem to="/job-management/off-campus-listings" label="Off-campus Listings" active={activePath === '/job-management/off-campus-listings'} />
        <SidebarNavItem to="/job-management/job-listings" label="Job Listings" active={activePath === '/job-management/job-listings'} />
      </SidebarNavGroup>

      {/* Hiring Channels */}
      <SidebarNavGroup label="Hiring Channels" icon={<FiClipboard />} active={activePath.includes('/hiring-channels')}>
        <SidebarNavItem to="/hiring-channels/on-campus-hiring" label="On-campus Hiring" active={activePath === '/hiring-channels/on-campus-hiring'} />
        <SidebarNavItem to="/hiring-channels/pool-campus-hiring" label="Pool Campus Hiring" active={activePath === '/hiring-channels/pool-campus-hiring'} />
        <SidebarNavItem to="/hiring-channels/off-campus-hiring" label="Off-campus Hiring" active={activePath === '/hiring-channels/off-campus-hiring'} />
        <SidebarNavItem to="/hiring-channels/post-a-job" label="Post a Job" active={activePath === '/hiring-channels/post-a-job'} />
        <SidebarNavItem to="/hiring-channels/post-an-internship" label="Post an Internship" active={activePath === '/hiring-channels/post-an-internship'} />
      </SidebarNavGroup>

      {/* Shortlisted Candidates/Colleges */}
      <SidebarNavGroup label="Shortlisted Candidates" icon={<FiClipboard />} active={activePath.includes('/shortlisted')}>
        <SidebarNavItem to="/shortlisted/on-campus-listings" label="On-campus Listings" active={activePath === '/shortlisted/on-campus-listings'} />
        <SidebarNavItem to="/shortlisted/off-campus-listings" label="Off-campus Listings" active={activePath === '/shortlisted/off-campus-listings'} />
        <SidebarNavItem to="/shortlisted/pool-campus-listings" label="Pool Campus Listings" active={activePath === '/shortlisted/pool-campus-listings'} />
      </SidebarNavGroup>

      {/* Accepted Candidates/Colleges */}
      <SidebarNavGroup label="Accepted Candidates" icon={<FiClipboard />} active={activePath.includes('/accepted')}>
        <SidebarNavItem to="/accepted/on-campus-listings" label="On-campus Listings" active={activePath === '/accepted/on-campus-listings'} />
        <SidebarNavItem to="/accepted/off-campus-listings" label="Off-campus Listings" active={activePath === '/accepted/off-campus-listings'} />
        <SidebarNavItem to="/accepted/pool-campus-listings" label="Pool Campus Listings" active={activePath === '/accepted/pool-campus-listings'} />
        <SidebarNavItem to="/Employee/acceptedJobList" label="Accepted Job List" active={activePath === '/Employee/acceptedJobList'} />
      </SidebarNavGroup>

      {/* Misc Pages */}
      <SidebarNavItem to="/interviews" icon={<FiClipboard />} label="Interviews" active={activePath === '/interviews'} />
      <SidebarNavItem to="/joblistingPage" icon={<FiClipboard />} label="Job Listing Page" active={activePath === '/joblistingPage'} />
    </div>
  );
}

export default EmployerSidebar;
