import SidebarNavItem from './SidebarNavItem';
import SidebarNavGroup from './SidebarNavGroup';
import { FiHome, FiUser, FiBookmark, FiPieChart, FiClipboard, FiSearch } from 'react-icons/fi';
import { MdWork, MdOutlineGroupWork, MdBusinessCenter } from 'react-icons/md';
import { AiOutlineTeam, AiOutlineThunderbolt } from 'react-icons/ai';
import { RiFileList2Line } from 'react-icons/ri';

function ProfessionalSidebar({ activePath }) {
  return (
    <div>
      {/* Professional Sidebar */}
      <SidebarNavItem to="/home" icon={<FiHome />} label="Home" active={activePath === '/professional-home'} />
      <SidebarNavItem to="/profprofile" icon={<FiUser />} label="Profile" active={activePath === '/profile'} />
      <SidebarNavItem to="/saved-jobs" icon={<FiBookmark />} label="Saved Jobs/Internships" active={activePath === '/saved-jobs'} />

      <SidebarNavGroup label="Professional Dashboard" icon={<FiPieChart />} active={activePath.includes('/professional-dashboard')}>
        <SidebarNavItem to="/professional-dashboard/job-listing" icon={<MdWork />} label="Job Listings" active={activePath === '/professional-dashboard/job-listing'} />
        <SidebarNavItem to="/professional-dashboard/referral-jobs" icon={<AiOutlineTeam />} label="Referral Jobs" active={activePath === '/professional-dashboard/referral-jobs'} />
        <SidebarNavItem to="/professional-dashboard/hackathon" icon={<AiOutlineThunderbolt />} label="Hackathon" active={activePath === '/professional-dashboard/hackathon'} />
      </SidebarNavGroup>

      <SidebarNavGroup label="Service Request" icon={<FiClipboard />} active={activePath.includes('/service-request')}>
        <SidebarNavItem to="/professional/service-request" icon={<MdOutlineGroupWork />} label="Post Referral Job" active={activePath === '/professional/service-request'} />
        <SidebarNavItem to="/professional/service-request/referral" icon={<RiFileList2Line />} label="Manage Referral Jobs" active={activePath === '/service-request/manage-referral-jobs'} />
      </SidebarNavGroup>

      <SidebarNavGroup label="Application Status" icon={<FiClipboard />} active={activePath.includes('/application-status')}>
        <SidebarNavItem to="/application-status/job-listing" icon={<MdWork />} label="Job Listing" active={activePath === '/application-status/job-listing'} />
        <SidebarNavItem to="/application-status/referral-jobs" icon={<AiOutlineTeam />} label="Referral Jobs" active={activePath === '/application-status/referral-jobs'} />
        <SidebarNavItem to="/application-status/off-campus-listing" icon={<MdBusinessCenter />} label="Off-Campus Jobs" active={activePath === '/application-status/off-campus-jobs'} />
        <SidebarNavItem to="/application-status/hackathon" icon={<AiOutlineThunderbolt />} label="Hackathon" active={activePath === '/application-status/hackathon'} />
      </SidebarNavGroup>

      <SidebarNavItem to="/ai-driven-job-search" icon={<FiSearch />} label="AI-Driven Job Search" active={activePath === '/ai-driven-job-search'} />
    </div>
  );
}

export default ProfessionalSidebar;
