import { FiHome, FiUser, FiBookmark, FiPieChart, FiClipboard, FiSearch } from 'react-icons/fi';
import { MdWork, MdBusinessCenter, MdOutlineEmojiObjects, MdOutlineGroupWork } from 'react-icons/md';
import { AiOutlineTeam, AiOutlineThunderbolt } from 'react-icons/ai';
import { RiUserStarLine } from 'react-icons/ri';
import { BsLaptop } from 'react-icons/bs';

function FresherSidebar({ activePath }) {
  return (
    <div>
      {/* Fresher Sidebar */}
      <SidebarNavItem to="/home" icon={<FiHome />} label="Home" active={activePath === '/fresher-home'} />
      <SidebarNavItem to="/fresherprofile" icon={<FiUser />} label="Profile" active={activePath === '/profile'} />
      <SidebarNavItem to="/saved-jobs" icon={<FiBookmark />} label="Saved Jobs/Internships" active={activePath === '/saved-jobs'} />

      <SidebarNavGroup label="Fresher Dashboard" icon={<FiPieChart />} active={activePath.includes('/fresher-dashboard')}>
        <SidebarNavItem to="/fresher-dashboard/job-listing" icon={<MdWork />} label="Job Listing" active={activePath === '/fresher-dashboard/job-listing'} />
        <SidebarNavItem to="/fresher-dashboard/off-campus-listings" icon={<MdBusinessCenter />} label="Off-Campus Listings" active={activePath === '/fresher-dashboard/off-campus-listings'} />
        <SidebarNavItem to="/fresher-dashboard/internship-opportunities" icon={<BsLaptop />} label="Internship Opportunities" active={activePath === '/fresher-dashboard/internship-opportunities'} />
        <SidebarNavItem to="/fresher-dashboard/referral-jobs" icon={<AiOutlineTeam />} label="Referral Jobs" active={activePath === '/fresher-dashboard/referral-jobs'} />
        <SidebarNavItem to="/fresher-dashboard/hackathon" icon={<AiOutlineThunderbolt />} label="Hackathon" active={activePath === '/fresher-dashboard/hackathon'} />
      </SidebarNavGroup>

      <SidebarNavGroup label="Service Request" icon={<FiClipboard />} active={activePath.includes('/fresher-dashboard/service-request')}>
        <SidebarNavItem to="/fresher-dashboard/service-request/counselling" icon={<RiUserStarLine />} label="Counselling" active={activePath === '/fresher-dashboard/service-request/counselling'} />
        <SidebarNavItem to="/fresher-dashboard/service-request/career-craft" icon={<MdOutlineEmojiObjects />} label="Career Craft" active={activePath === '/fresher-dashboard/service-request/career-craft'} />
        <SidebarNavItem to="/fresher-dashboard/service-request/mock-interview" icon={<MdOutlineGroupWork />} label="Mock Interview" active={activePath === '/fresher-dashboard/service-request/mock-interview'} />
      </SidebarNavGroup>

      <SidebarNavGroup label="Application Status" icon={<FiClipboard />} active={activePath.includes('/application-status')}>
        <SidebarNavItem to="/application-status/job-listing" icon={<MdWork />} label="Job Listing" active={activePath === '/application-status/job-listing'} />
        <SidebarNavItem to="/application-status/off-campus-listing" icon={<MdBusinessCenter />} label="Off-Campus Listing" active={activePath === '/application-status/off-campus-listing'} />
        <SidebarNavItem to="/application-status/internship-opportunities" icon={<BsLaptop />} label="Internship Opportunities" active={activePath === '/application-status/internship-opportunities'} />
        <SidebarNavItem to="/application-status/referral-jobs" icon={<AiOutlineTeam />} label="Referral Jobs" active={activePath === '/application-status/referral-jobs'} />
        <SidebarNavItem to="/application-status/hackathon" icon={<AiOutlineThunderbolt />} label="Hackathon" active={activePath === '/application-status/hackathon'} />
      </SidebarNavGroup>

      <SidebarNavItem to="/ai-driven-job-search" icon={<FiSearch />} label="AI-Driven Job Search" active={activePath === '/ai-driven-job-search'} />
    </div>
  );
}

export default FresherSidebar;
