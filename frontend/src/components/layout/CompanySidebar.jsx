import { Link } from 'react-router-dom';
import SidebarNavItem from './SidebarNavItem';
import SidebarNavGroup from './SidebarNavGroup';

import { 
  FiHome, 
  FiUser, 
  FiPieChart, 
  FiClipboard, 
  FiSearch, 
  FiMessageCircle 
} from 'react-icons/fi';

import { 
  MdSchool, 
  MdCampaign, 
  MdLocationCity, 
  MdWork, 
  MdListAlt, 
  MdHowToVote, 
  MdOutlineWorkOutline 
} from 'react-icons/md';

import { 
  RiGroupLine, 
  RiBuilding2Line 
} from 'react-icons/ri';

import { 
  GiTeacher, 
  GiReceiveMoney 
} from 'react-icons/gi';

import { 
  FaUsersCog, 
  FaUniversity 
} from 'react-icons/fa';

import { 
  BsBuildingAdd, 
  BsBookmarkCheck, 
  BsBookmarkCheckFill, 
  BsBookmarkHeart, 
  BsFillCalendarCheckFill 
} from 'react-icons/bs';

import { 
  HiUsers, 
  HiOutlineUserGroup 
} from 'react-icons/hi2';

import { 
  AiOutlineUserSwitch, 
  AiOutlineBarChart 
} from 'react-icons/ai';

function CompanySidebar({ activePath }) {
  return (
    <div>
      {/* Company Sidebar */}
      <SidebarNavItem to="/home" icon={<FiHome />} label="Home" active={activePath === '/company-home'} />
      <SidebarNavItem to="/company-profile" icon={<FiUser />} label="Profile" active={activePath === '/profile'} />

      <SidebarNavGroup label="Employer Dashboard" icon={<FaUsersCog />} active={activePath.includes('/employer-dashboard')}>
        <SidebarNavItem to="/employer-dashboard/on-campus-request" icon={<MdSchool />} label="On-campus Request" active={activePath === '/employer-dashboard/on-campus-request'} />
        <SidebarNavItem to="/employer-dashboard/pool-campus-requests" icon={<RiGroupLine />} label="Pool Campus Requests" active={activePath === '/employer-dashboard/pool-campus-requests'} />
        <SidebarNavItem to="/employer-dashboard/resume-search" icon={<FiSearch />} label="Resume Search" active={activePath === '/employer-dashboard/resume-search'} />
      </SidebarNavGroup>

      <SidebarNavGroup label="Service Request" icon={<GiTeacher />} active={activePath.includes('/service-request')}>
        <SidebarNavItem to="/service-request/workforce-solution" icon={<FaUsersCog />} label="Workforce Solution" active={activePath === '/service-request/workforce-solution'} />
        <SidebarNavItem to="/service-request/employee-training" icon={<GiTeacher />} label="Employee Training" active={activePath === '/service-request/employee-training'} />
        <SidebarNavItem to="/service-request/branding" icon={<MdCampaign />} label="Branding" active={activePath === '/service-request/branding'} />
      </SidebarNavGroup>

      <SidebarNavGroup label="Hiring Channels" icon={<BsBuildingAdd />} active={activePath.includes('/hiring-channels')}>
        <SidebarNavItem to="/hiring-channels/on-campus-hiring" icon={<BsBuildingAdd />} label="On-campus Hiring" active={activePath === '/hiring-channels/on-campus-hiring'} />
        <SidebarNavItem to="/hiring-channels/pool-campus-hiring" icon={<HiUsers />} label="Pool Campus Hiring" active={activePath === '/hiring-channels/pool-campus-hiring'} />
        <SidebarNavItem to="/hiring-channels/off-campus-hiring" icon={<MdLocationCity />} label="Off-campus Hiring" active={activePath === '/hiring-channels/off-campus-hiring'} />
        <SidebarNavItem to="/hiring-channels/post-a-job" icon={<MdWork />} label="Post a Job" active={activePath === '/hiring-channels/post-a-job'} />
        <SidebarNavItem to="/hiring-channels/post-an-internship" icon={<GiReceiveMoney />} label="Post an Internship" active={activePath === '/hiring-channels/post-an-internship'} />
      </SidebarNavGroup>

      <SidebarNavGroup label="Job Management" icon={<MdOutlineWorkOutline />} active={activePath.includes('/job-management')}>
        <SidebarNavItem to="/job-management/on-campus-listings" icon={<MdListAlt />} label="On-campus Listings" active={activePath === '/job-management/on-campus-listings'} />
        <SidebarNavItem to="/job-management/off-campus-listings" icon={<RiBuilding2Line />} label="Off-campus Listings" active={activePath === '/job-management/off-campus-listings'} />
        <SidebarNavItem to="/job-management/pool-campus-listings" icon={<FaUniversity />} label="Pool Campus Listings" active={activePath === '/job-management/pool-campus-listings'} />
        <SidebarNavItem to="/job-management/job-listings" icon={<MdOutlineWorkOutline />} label="Job Listings" active={activePath === '/job-management/job-listings'} />
      </SidebarNavGroup>

      <SidebarNavGroup label="Shortlisted Candidates / Colleges" icon={<BsBookmarkCheck />} active={activePath.includes('/shortlisted')}>
        <SidebarNavItem to="/shortlisted/on-campus-listings" icon={<BsBookmarkCheck />} label="On-campus Listings" active={activePath === '/shortlisted/on-campus-listings'} />
        <SidebarNavItem to="/shortlisted/off-campus-listings" icon={<BsBookmarkCheckFill />} label="Off-campus Listings" active={activePath === '/shortlisted/off-campus-listings'} />
        <SidebarNavItem to="/shortlisted/pool-campus-listings" icon={<BsBookmarkHeart />} label="Pool Campus Listings" active={activePath === '/shortlisted/pool-campus-listings'} />
      </SidebarNavGroup>

      <SidebarNavGroup label="Accepted Candidates/Colleges" icon={<AiOutlineUserSwitch />} active={activePath.includes('/accepted')}>
        <SidebarNavItem to="/accepted/on-campus-listings" icon={<AiOutlineUserSwitch />} label="On-campus Listings" active={activePath === '/accepted/on-campus-listings'} />
        <SidebarNavItem to="/accepted/off-campus-listings" icon={<HiOutlineUserGroup />} label="Off-campus Listings" active={activePath === '/accepted/off-campus-listings'} />
        <SidebarNavItem to="/accepted/pool-campus-listings" icon={<MdHowToVote />} label="Pool Campus Listings" active={activePath === '/accepted/pool-campus-listings'} />
      </SidebarNavGroup>

      <SidebarNavItem to="/chats" icon={<FiMessageCircle />} label="Chats" active={activePath === '/chats'} />
      <SidebarNavItem to="/interviews" icon={<BsFillCalendarCheckFill />} label="Interviews" active={activePath === '/interviews'} />
      <SidebarNavItem to="/reports" icon={<AiOutlineBarChart />} label="Reports" active={activePath === '/reports'} />
    </div>
  );
}

export default CompanySidebar;
