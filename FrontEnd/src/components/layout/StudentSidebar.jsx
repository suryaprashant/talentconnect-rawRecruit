import { Link } from 'react-router-dom';
import SidebarNavItem from './SidebarNavItem';
import SidebarNavGroup from './SidebarNavGroup';
import { 
  FiHome, 
  FiUser, 
  FiBookmark, 
  FiPieChart, 
  FiClipboard, 
  FiSearch, 
  FiHelpCircle, 
  FiSettings,
  FiMessageCircle,
  FiBriefcase,
  FiAward,
  FiUsers,
  FiLayers,
  FiTarget,
  FiCalendar,
  FiFileText,
  FiTrendingUp,
  FiMic,
  FiTool
} from 'react-icons/fi';

function StudentSidebar({ activePath }) {
  return (
    <div>
      {/* Student Sidebar */}
      <SidebarNavItem to="/home" icon={<FiHome />} label="Home" active={activePath === '/home'} />
      <SidebarNavItem to="/profile" icon={<FiUser />} label="Profile" active={activePath === '/profile'} />
      <SidebarNavItem to="/saved-jobs" icon={<FiBookmark />} label="Saved Jobs/Internships" active={activePath === '/saved-jobs'} />

      <SidebarNavGroup label="Student Dashboard" icon={<FiPieChart />} active={activePath.includes('/student-dashboard')}>
        <SidebarNavItem 
          to="/student-dashboard/Job-listing" 
          icon={<FiBriefcase />} 
          label="Job Listing" 
          active={activePath === '/student-dashboard/Job-listing'} 
        />
        <SidebarNavItem 
          to="/student-dashboard/Off-campus" 
          icon={<FiLayers />} 
          label="Off-Campus Listings" 
          active={activePath === '/student-dashboard/Off-campus'} 
        />
        <SidebarNavItem 
          to="/student-dashboard/Internship" 
          icon={<FiTrendingUp />} 
          label="Internship Opportunities" 
          active={activePath === '/student-dashboard/Internship'} 
        />
        <SidebarNavItem 
          to="/student-dashboard/Referral" 
          icon={<FiUsers />} 
          label="Referral Jobs" 
          active={activePath === '/student-dashboard/Referral'} 
        />
      </SidebarNavGroup>
      <SidebarNavGroup label="Events" icon={<FiCalendar/>} active={activePath.includes('/events')}>
        <SidebarNavItem 
          to="/student-events/casestudy" 
          icon={<FiBookmark />} 
          label="Case Studies" 
          active={activePath === '/student-events/casestudy'} 
        />
        <SidebarNavItem 
          to="/student-events/hackathon" 
          icon={<FiAward />} 
          label="Hackathon" 
          active={activePath === '/student-events/hackathon'} 
        />
        <SidebarNavItem 
          to="/student-events/workshop" 
          icon={<FiTool/>} 
          label="Workshop" 
          active={activePath === '/student-events/workshop'} 
        />
      </SidebarNavGroup>

      <SidebarNavGroup label="Service Request" icon={<FiClipboard />} active={activePath.includes('/service-request')}>
        <SidebarNavItem 
          to="/service-request/counselling" 
          icon={<FiHelpCircle />} 
          label="Counselling" 
          active={activePath === '/service-request/counselling'} 
        />
        <SidebarNavItem 
          to="/service-request/career-craft" 
          icon={<FiTool />} 
          label="Career Craft" 
          active={activePath === '/service-request/career-craft'} 
        />
        <SidebarNavItem 
          to="/service-request/mock-interview" 
          icon={<FiMic />} 
          label="Mock Interview" 
          active={activePath === '/service-request/mock-interview'} 
        />
      </SidebarNavGroup>

      <SidebarNavGroup label="Application Status" icon={<FiFileText />} active={activePath.includes('/application-status')}>
        <SidebarNavItem 
          to="/application-status/Job-listing" 
          icon={<FiBriefcase />} 
          label="Job Listing" 
          active={activePath === '/application-status/Job-listing'} 
        />
        <SidebarNavItem 
          to="/application-status/Off-campus" 
          icon={<FiLayers />} 
          label="Off-Campus Listing" 
          active={activePath === '/application-status/Off-campus'} 
        />
        <SidebarNavItem 
          to="/application-status/Internship" 
          icon={<FiTrendingUp />} 
          label="Internship Opportunities" 
          active={activePath === '/application-status/Internship'} 
        />
        <SidebarNavItem 
          to="/application-status/Referral" 
          icon={<FiUsers />} 
          label="Referral Jobs" 
          active={activePath === '/application-status/Referral'} 
        />
        <SidebarNavItem 
          to="/application-status/events" 
          icon={<FiAward />} 
          label="Event Management" 
          active={activePath === '/application-status/events'} 
        />
      </SidebarNavGroup>

      <SidebarNavItem 
        to="/ai-driven-job-search" 
        icon={<FiSearch />} 
        label="AI-Driven Job Search" 
        active={activePath === '/ai-driven-job-search'} 
      />
      <SidebarNavItem 
        to="/chat-application" 
        icon={<FiMessageCircle />} 
        label="Chats" 
        active={activePath === '/chats'} 
      />
    </div>
  );
}

export default StudentSidebar;
