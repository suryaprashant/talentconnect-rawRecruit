import { FiHome, FiUser, FiClipboard , FiList, FiBookmark, FiCheckSquare } from 'react-icons/fi';
import { HiOutlineSearch, HiOutlineUserGroup } from 'react-icons/hi';
import { MdOutlineWork, MdMiscellaneousServices, MdWorkOutline } from 'react-icons/md';
import { BiCube, BiBriefcase, BiUserCheck, BiBarChartAlt2 } from 'react-icons/bi';
import { GiArchiveRegister, GiConfirmed } from 'react-icons/gi';
import SidebarNavItem from './SidebarNavItem';
import SidebarNavGroup from './SidebarNavGroup';

function EmployerSidebar({ activePath }) {
  return (
    <div>
      {/* Basic Navigation */}
      <SidebarNavItem to="/home" icon={<FiHome />} label="Home" active={activePath === '/home'} />
      <SidebarNavItem to="/employer-profile" icon={<FiUser />} label="Profile" active={activePath === '/employer-profile'} />

      {/* Employer Dashboard */}
      <SidebarNavGroup label="Employer Dashboard" icon={<BiBarChartAlt2 />} active={activePath.includes('/employer-dashboard')}>
        <SidebarNavItem to="/employer-dashboard/on-campus-request" icon={<BiCube />} label="On-campus Request" active={activePath === '/employer-dashboard/on-campus-request'} />
        <SidebarNavItem to="/employer-dashboard/pool-campus-requests" icon={<BiCube />} label="Pool Campus Requests" active={activePath === '/employer-dashboard/pool-campus-requests'} />
        <SidebarNavItem to="/employer-dashboard/resume-search" icon={<HiOutlineSearch />} label="Resume Search" active={activePath === '/employer-dashboard/resume-search'} />
      </SidebarNavGroup>

      {/* Service Request */}
      <SidebarNavGroup label="Service Request" icon={<MdMiscellaneousServices />} active={activePath.includes('/service-request')}>
        <SidebarNavItem to="/service-request/workforce-solution" icon={<MdOutlineWork />} label="Workforce Solution" active={activePath === '/service-request/workforce-solution'} />
        <SidebarNavItem to="/service-request/employee-training" icon={<BiBriefcase />} label="Employee Training" active={activePath === '/service-request/employee-training'} />
        <SidebarNavItem to="/service-request/branding" icon={<FiBookmark />} label="Branding" active={activePath === '/service-request/branding'} />
      </SidebarNavGroup>

      {/* Job Management */}
      <SidebarNavGroup label="Job Management" icon={<MdWorkOutline />} active={activePath.includes('/job-management')}>
        <SidebarNavItem to="/job-management/on-campus-listings" icon={<FiList />} label="On-campus Listings" active={activePath === '/job-management/on-campus-listings'} />
        <SidebarNavItem to="/job-management/pool-campus-listings" icon={<FiList />} label="Pool Campus Listings" active={activePath === '/job-management/pool-campus-listings'} />
        <SidebarNavItem to="/job-management/off-campus-listings" icon={<FiList />} label="Off-campus Listings" active={activePath === '/job-management/off-campus-listings'} />
        <SidebarNavItem to="/job-management/job-listings" icon={<FiList />} label="Job Listings" active={activePath === '/job-management/job-listings'} />
      </SidebarNavGroup>

      {/* Hiring Channels */}
      <SidebarNavGroup label="Hiring Channels" icon={<HiOutlineUserGroup />} active={activePath.includes('/hiring-channels')}>
        <SidebarNavItem to="/hiring-channels/on-campus-hiring" icon={<FiCheckSquare />} label="On-campus Hiring" active={activePath === '/hiring-channels/on-campus-hiring'} />
        <SidebarNavItem to="/hiring-channels/pool-campus-hiring" icon={<FiCheckSquare />} label="Pool Campus Hiring" active={activePath === '/hiring-channels/pool-campus-hiring'} />
        <SidebarNavItem to="/hiring-channels/off-campus-hiring" icon={<FiCheckSquare />} label="Off-campus Hiring" active={activePath === '/hiring-channels/off-campus-hiring'} />
        <SidebarNavItem to="/hiring-channels/post-a-job" icon={<FiBookmark />} label="Post a Job" active={activePath === '/hiring-channels/post-a-job'} />
        <SidebarNavItem to="/hiring-channels/post-an-internship" icon={<FiBookmark />} label="Post an Internship" active={activePath === '/hiring-channels/post-an-internship'} />
      </SidebarNavGroup>

      {/* Shortlisted Candidates */}
      <SidebarNavGroup label="Shortlisted Candidates" icon={<GiArchiveRegister />} active={activePath.includes('/shortlisted')}>
        <SidebarNavItem to="/shortlisted/on-campus-listings" icon={<BiUserCheck />} label="On-campus Listings" active={activePath === '/shortlisted/on-campus-listings'} />
        <SidebarNavItem to="/shortlisted/off-campus-listings" icon={<BiUserCheck />} label="Off-campus Listings" active={activePath === '/shortlisted/off-campus-listings'} />
        <SidebarNavItem to="/shortlisted/pool-campus-listings" icon={<BiUserCheck />} label="Pool Campus Listings" active={activePath === '/shortlisted/pool-campus-listings'} />
      </SidebarNavGroup>

      {/* Accepted Candidates */}
      <SidebarNavGroup label="Accepted Candidates" icon={<GiConfirmed />} active={activePath.includes('/accepted')}>
        <SidebarNavItem to="/accepted/on-campus-listings" icon={<FiCheckSquare />} label="On-campus Listings" active={activePath === '/accepted/on-campus-listings'} />
        <SidebarNavItem to="/accepted/off-campus-listings" icon={<FiCheckSquare />} label="Off-campus Listings" active={activePath === '/accepted/off-campus-listings'} />
        <SidebarNavItem to="/accepted/pool-campus-listings" icon={<FiCheckSquare />} label="Pool Campus Listings" active={activePath === '/accepted/pool-campus-listings'} />
        <SidebarNavItem to="/Employee/acceptedJobList" icon={<FiList />} label="Accepted Job List" active={activePath === '/Employee/acceptedJobList'} />
      </SidebarNavGroup>

      {/* Misc Pages */}
      <SidebarNavItem to="/interviews" icon={<HiOutlineUserGroup />} label="Interviews" active={activePath === '/interviews'} />
      {/* <SidebarNavItem to="/joblistingPage" icon={<FiClipboard />} label="Job Listing Page" active={activePath === '/joblistingPage'} /> */}
    </div>
  );
}

export default EmployerSidebar;
