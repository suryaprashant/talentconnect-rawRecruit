import { Link } from 'react-router-dom';
import SidebarNavItem from './SidebarNavItem';
import SidebarNavGroup from './SidebarNavGroup';
import { FiHome, FiUser, FiBookmark, FiPieChart, FiClipboard, FiSearch, FiHelpCircle, FiSettings } from 'react-icons/fi';

function CollegeSidebar({ activePath }) {
  return (
    <div>
      {/* College Sidebar */}
      <SidebarNavItem to="/home" icon={<FiHome />} label="Home" active={activePath === '/home'} />
      <SidebarNavItem to="/college-profile" icon={<FiUser />} label="Profile" active={activePath === '/profile'} />

      <SidebarNavGroup label="College Dashboard" icon={<FiPieChart />} active={activePath.includes('/college-dashboard')}>
        <SidebarNavItem to="/college-dashboard/on-campus-opportunities" label="On-campus Opportunities" active={activePath === '/college-dashboard/on-campus-opportunities'} />
        <SidebarNavItem to="/college-dashboard/pool-campus-opportunities" label="Pool Campus Opportunities" active={activePath === '/college-dashboard/pool-campus-opportunities'} />
        <SidebarNavItem to="/college-dashboard/internship-opportunities" label="Internship Opportunities" active={activePath === '/college-dashboard/internship-opportunities'} />
      </SidebarNavGroup>

      <SidebarNavGroup label="Service Request" icon={<FiClipboard />} active={activePath.includes('/service-request')}>
        <SidebarNavItem to="/service-request/campus-placement" label="Campus Placement" active={activePath === '/service-request/campus-placement'} />
        <SidebarNavItem to="/service-request/student-training-programs" label="Student Training Programs" active={activePath === '/service-request/student-training-programs'} />
        <SidebarNavItem to="/service-request/seminars" label="Seminars" active={activePath === '/service-request/seminars'} />
      </SidebarNavGroup>

      <SidebarNavGroup label="Manage Application" icon={<FiClipboard />} active={activePath.includes('/manage-application')}>
        <SidebarNavItem to="/manage-application/campus-placement" label="Campus Placement" active={activePath === '/manage-application/campus-placement'} />
      </SidebarNavGroup>

      <SidebarNavGroup label="Registered / Shortlisted" icon={<FiClipboard />} active={activePath.includes('/registered')}>
        <SidebarNavItem to="/registered/on-campus-opportunities" label="On-campus Opportunities" active={activePath === '/registered/on-campus-opportunities'} />
        <SidebarNavItem to="/registered/pool-campus-opportunities" label="Pool Campus Opportunities" active={activePath === '/registered/pool-campus-opportunities'} />
        <SidebarNavItem to="/registered/internship-opportunities" label="Internship Opportunities" active={activePath === '/registered/internship-opportunities'} />
      </SidebarNavGroup>

      {/* Messages and Settings at the bottom */}
      <SidebarNavItem to="/messages" icon={<FiClipboard />} label="Messages" />
    
    </div>
  );
}

export default CollegeSidebar;
