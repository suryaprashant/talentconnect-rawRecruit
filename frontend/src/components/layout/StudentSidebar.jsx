import { Link } from 'react-router-dom';
import SidebarNavItem from './SidebarNavItem';
import SidebarNavGroup from './SidebarNavGroup';
import { FiHome, FiUser, FiBookmark, FiPieChart, FiClipboard, FiSearch, FiHelpCircle, FiSettings } from 'react-icons/fi';

function StudentSidebar({ activePath }) {
  return (
    <div>
      {/* Student Sidebar */}
      <SidebarNavItem to="/home" icon={<FiHome />} label="Home" active={activePath === '/home'} />
      <SidebarNavItem to="/profile" icon={<FiUser />} label="Profile" active={activePath === '/profile'} />
      <SidebarNavItem to="/saved-jobs" icon={<FiBookmark />} label="Saved Jobs/Internships" active={activePath === '/saved-jobs'} />

      <SidebarNavGroup label="Student Dashboard" icon={<FiPieChart />} active={activePath.includes('/student-dashboard')}>
        <SidebarNavItem to="/student-dashboard/job-listing" label="Job Listing" active={activePath === '/student-dashboard/job-listing'} />
        <SidebarNavItem to="/student-dashboard/off-campus-listings" label="Off-Campus Listings" active={activePath === '/student-dashboard/off-campus-listings'} />
        <SidebarNavItem to="/student-dashboard/internship-opportunities" label="Internship Opportunities" active={activePath === '/student-dashboard/internship-opportunities'} />
        <SidebarNavItem to="/student-dashboard/referral-jobs" label="Referral Jobs" active={activePath === '/student-dashboard/referral-jobs'} />
        <SidebarNavItem to="/student-dashboard/hackathon" label="Hackathon" active={activePath === '/student-dashboard/hackathon'} />
      </SidebarNavGroup>

      <SidebarNavGroup label="Service Request" icon={<FiClipboard />} active={activePath.includes('/service-request')}>
        <SidebarNavItem to="/service-request/counselling" label="Counselling" active={activePath === '/service-request/counselling'} />
        <SidebarNavItem to="/service-request/career-craft" label="Career Craft" active={activePath === '/service-request/career-craft'} />
        <SidebarNavItem to="/service-request/mock-interview" label="Mock Interview" active={activePath === '/service-request/mock-interview'} />
      </SidebarNavGroup>

      <SidebarNavGroup label="Application Status" icon={<FiClipboard />} active={activePath.includes('/application-status')}>
        <SidebarNavItem to="/application-status/job-listing" label="Job Listing" active={activePath === '/application-status/job-listing'} />
        <SidebarNavItem to="/application-status/off-campus-listing" label="Off-Campus Listing" active={activePath === '/application-status/off-campus-listing'} />
        <SidebarNavItem to="/application-status/internship-opportunities" label="Internship Opportunities" active={activePath === '/application-status/internship-opportunities'} />
        <SidebarNavItem to="/application-status/referral-jobs" label="Referral Jobs" active={activePath === '/application-status/referral-jobs'} />
        <SidebarNavItem to="/application-status/hackathon" label="Hackathon" active={activePath === '/application-status/hackathon'} />
      </SidebarNavGroup>

      <SidebarNavItem to="/ai-driven-job-search" icon={<FiSearch />} label="AI-Driven Job Search" active={activePath === '/ai-driven-job-search'} />

    
    </div>
  );
}

export default StudentSidebar;
