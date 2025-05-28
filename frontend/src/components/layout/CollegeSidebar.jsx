import { Link } from 'react-router-dom';
import SidebarNavItem from './SidebarNavItem';
import SidebarNavGroup from './SidebarNavGroup';

import { FiHome, FiUser, FiMessageCircle } from 'react-icons/fi';
import { BiBarChartAlt2 } from 'react-icons/bi';
import { MdMiscellaneousServices, MdSchool, MdHowToVote } from 'react-icons/md';
import { RiFileSettingsLine, RiGroupLine } from 'react-icons/ri';
import { GiArchiveRegister, GiTeacher, GiReceiveMoney } from 'react-icons/gi';
import { FaUserTie, FaBuilding } from 'react-icons/fa';
import { HiOutlinePresentationChartBar } from 'react-icons/hi2';
import { TbFileCertificate } from 'react-icons/tb';
import { BsPeopleFill } from 'react-icons/bs';

function CollegeSidebar({ activePath }) {
  return (
    <div>
      {/* College Sidebar */}
      <SidebarNavItem to="/home" icon={<FiHome />} label="Home" active={activePath === '/college-home'} />
      <SidebarNavItem to="/college-profile" icon={<FiUser />} label="Profile" active={activePath === '/profile'} />

      <SidebarNavGroup label="College Dashboard" icon={<BiBarChartAlt2 />} active={activePath.includes('/college-dashboard')}>
        <SidebarNavItem to="/college-dashboard/on-campus-opportunities" icon={<MdSchool />} label="On-campus Opportunities" active={activePath === '/college-dashboard/on-campus-opportunities'} />
        <SidebarNavItem to="/college-dashboard/pool-campus-opportunities" icon={<RiGroupLine />} label="Pool Campus Opportunities" active={activePath === '/college-dashboard/pool-campus-opportunities'} />
        <SidebarNavItem to="/college-dashboard/internship-opportunities" icon={<FaUserTie />} label="Internship Opportunities" active={activePath === '/college-dashboard/internship-opportunities'} />
      </SidebarNavGroup>

      <SidebarNavGroup label="Service Request" icon={<MdMiscellaneousServices />} active={activePath.includes('/service-request')}>
        <SidebarNavItem to="/service-request/campus-placement" icon={<FaBuilding />} label="Campus Placement" active={activePath === '/service-request/campus-placement'} />
        <SidebarNavItem to="/service-request/student-training-programs" icon={<GiTeacher />} label="Student Training Programs" active={activePath === '/service-request/student-training-programs'} />
        <SidebarNavItem to="/service-request/seminars" icon={<HiOutlinePresentationChartBar />} label="Seminars" active={activePath === '/service-request/seminars'} />
      </SidebarNavGroup>

      <SidebarNavGroup label="Manage Application" icon={<RiFileSettingsLine />} active={activePath.includes('/manage-application')}>
        <SidebarNavItem to="/manage-application/campus-placement" icon={<TbFileCertificate />} label="Campus Placement" active={activePath === '/manage-application/campus-placement'} />
      </SidebarNavGroup>

      <SidebarNavGroup label="Registered / Shortlisted" icon={<GiArchiveRegister />} active={activePath.includes('/registered')}>
        <SidebarNavItem to="/registered/on-campus-opportunities" icon={<MdHowToVote />} label="On-campus Opportunities" active={activePath === '/registered/on-campus-opportunities'} />
        <SidebarNavItem to="/registered/pool-campus-opportunities" icon={<BsPeopleFill />} label="Pool Campus Opportunities" active={activePath === '/registered/pool-campus-opportunities'} />
        <SidebarNavItem to="/registered/internship-opportunities" icon={<GiReceiveMoney />} label="Internship Opportunities" active={activePath === '/registered/internship-opportunities'} />
      </SidebarNavGroup>

      {/* Messages and Settings at the bottom */}
      <SidebarNavItem to="/messages" icon={<FiMessageCircle />} label="Messages" />
    </div>
  );
}

export default CollegeSidebar;
