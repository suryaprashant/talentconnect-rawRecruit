import { 
  FiHome, 
  FiUser, 
  FiPieChart, 
  FiMessageCircle,
  FiBriefcase,
  FiUsers,
  FiSearch,
  FiTool,
  FiBook,
  FiAward,
  FiLayers,
  FiMapPin,
  FiCheckCircle,
  FiFileText,
  FiCalendar,
  FiMic,
  FiThumbsUp,
  FiFilePlus,
  FiList
} from 'react-icons/fi';
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
        <SidebarNavItem 
          to="/employer-dashboard/On-campus" 
          icon={<FiMapPin />} 
          label="On-campus Request" 
          active={activePath === '/employer-dashboard/On-campus'} 
        />
        <SidebarNavItem 
          to="/employer-dashboard/Pool-campus" 
          icon={<FiUsers />} 
          label="Pool Campus Requests" 
          active={activePath === '/employer-dashboard/Pool-campus'} 
        />
        <SidebarNavItem 
          to="/employer-dashboard/resume-search" 
          icon={<FiSearch />} 
          label="Resume Search" 
          active={activePath === '/employer-dashboard/resume-search'} 
        />
      </SidebarNavGroup>

      {/* Service Request */}
      <SidebarNavGroup label="Service Request" icon={<FiTool />} active={activePath.includes('/service-request')}>
        <SidebarNavItem 
          to="/service-request/workforce-solution" 
          icon={<FiBriefcase />} 
          label="Workforce Solution" 
          active={activePath === '/service-request/workforce-solution'} 
        />
        <SidebarNavItem 
          to="/service-request/employee-training" 
          icon={<FiBook />} 
          label="Employee Training" 
          active={activePath === '/service-request/employee-training'} 
        />
        <SidebarNavItem 
          to="/service-request/branding" 
          icon={<FiAward />} 
          label="Branding" 
          active={activePath === '/service-request/branding'} 
        />
      </SidebarNavGroup>

      {/* Job Management */}
      <SidebarNavGroup label="Job Management" icon={<FiBriefcase />} active={activePath.includes('/job-management')}>
        <SidebarNavItem 
          to="/job-management/on-campus-listings/employer" 
          icon={<FiMapPin />} 
          label="On-campus Listings" 
          active={activePath === '/job-management/on-campus-listings/employer'} 
        />
        <SidebarNavItem 
          to="/job-management/pool-campus-listings/employer" 
          icon={<FiUsers />} 
          label="Pool Campus Listings" 
          active={activePath === '/job-management/pool-campus-listings/employer'} 
        />
        <SidebarNavItem 
          to="/job-management/Off-campus/employer" 
          icon={<FiLayers />} 
          label="Off-campus Listings" 
          active={activePath === '/job-management/Off-campus/employer'} 
        />
        <SidebarNavItem 
          to="/job-management/job-listings/employer" 
          icon={<FiFileText />} 
          label="Job Listings" 
          active={activePath === '/job-management/job-listings/employer'} 
        />
         <SidebarNavItem
          to="/employer/job-management/Internship"
          icon={<FiFileText />}
          label="Internship Listings"
          active={activePath === '/employer/job-management/Internship'}
        />
      </SidebarNavGroup>

      {/* Hiring Channels */}
      <SidebarNavGroup label="Hiring Channels" icon={<FiUsers />} active={activePath.includes('/hiring-channels')}>
        <SidebarNavItem 
          to="/hiring-channels/on-campus-hiring/employer" 
          icon={<FiMapPin />} 
          label="On-campus Hiring" 
          active={activePath === '/hiring-channels/on-campus-hiring//employer'} 
        />
        <SidebarNavItem 
          to="/hiring-channels/pool-campus-hiring/employer" 
          icon={<FiUsers />} 
          label="Pool Campus Hiring" 
          active={activePath === '/hiring-channels/pool-campus-hiring/employer'} 
        />
        <SidebarNavItem 
          to="/hiring-channels/off-campus-hiring/employer" 
          icon={<FiLayers />} 
          label="Off-campus Hiring" 
          active={activePath === '/hiring-channels/off-campus-hiring/employer'} 
        />
        <SidebarNavItem 
          to="/hiring-channels/post-a-job/employer" 
          icon={<FiFilePlus />} 
          label="Post a Job" 
          active={activePath === '/hiring-channels/post-a-job/employer'} 
        />
        <SidebarNavItem 
          to="/hiring-channels/post-an-internship/employer" 
          icon={<FiCalendar />} 
          label="Post an Internship" 
          active={activePath === '/hiring-channels/post-an-internship/employer'} 
        />
      </SidebarNavGroup>

      <SidebarNavGroup label="Application Status" icon={<FiUsers />} active={activePath.includes('/company/application-status')}>
        <SidebarNavItem
          to="/employer/application-status/oncampus"
          icon={<FiMapPin />}
          label="On Campus"
          active={activePath === '/employer/application-status/oncampus'}
        />
        <SidebarNavItem
          to="/employer/application-status/poolcampus"
          icon={<FiMapPin />}
          label="Pool Campus"
          active={activePath === '/employer/application-status/poolcampus'}
        />
      </SidebarNavGroup>

      {/* Shortlisted Candidates/Colleges */}
      <SidebarNavGroup label="Shortlisted Candidates" icon={<FiCheckCircle />} active={activePath.includes('/shortlisted')}>
        <SidebarNavItem 
          to="/employer/shortlisted/on-campus-listings" 
          icon={<FiMapPin />} 
          label="On-campus Listings" 
          active={activePath === '/employer/shortlisted/on-campus-listings'} 
        />
        <SidebarNavItem 
          to="/employer/shortlisted/Off-campus"
          icon={<FiLayers />} 
          label="Off-campus Listings" 
          active={activePath === '/employer/shortlisted/Off-campus'} 
        />
        <SidebarNavItem 
          to="/employer/shortlisted/pool-campus-listings" 
          icon={<FiUsers />} 
          label="Pool Campus Listings" 
          active={activePath === '/employer/shortlisted/pool-campus-listings'} 
        />
         <SidebarNavItem
          to="/employer/shortlisted/jobs-listings"
          icon={<FiFileText />}
          label="Job Listings"
          active={activePath === '/employer/shortlisted/jobs-listings'}
        />

        <SidebarNavItem
          to="/employer/shortlisted/internship-listings"
          icon={<FiLayers />}
          label="Internship"
          active={activePath === '/employer/shortlisted/internship-listings'}
        />

      </SidebarNavGroup>

      {/* Accepted Candidates/Colleges */}
      <SidebarNavGroup label="Accepted Candidates" icon={<FiThumbsUp />} active={activePath.includes('/accepted')}>
        <SidebarNavItem 
          to="/employer/accepted/on-campus-listings" 
          icon={<FiMapPin />} 
          label="On-campus Listings" 
          active={activePath === '/employer/accepted/on-campus-listings'} 
        />
        <SidebarNavItem 
          to="/employer/accepted/off-campus-listings" 
          icon={<FiLayers />} 
          label="Off-campus Listings" 
          active={activePath === '/employer/accepted/off-campus-listings'} 
        />
        <SidebarNavItem 
          to="/employer/accepted/pool-campus-listings" 
          icon={<FiUsers />} 
          label="Pool Campus Listings" 
          active={activePath === '/employer/accepted/pool-campus-listings'} 
        />
        <SidebarNavItem 
          to="/employee/acceptedJobList" 
          icon={<FiList />} 
          label="Accepted Job-Listing" 
          active={activePath === '/employee/acceptedJobList'} 
        />
           <SidebarNavItem
          to="/employer/accepted/internship-listings"
          icon={<FiUsers />}
          label="Intership"
          active={activePath === '/employer/accepted/internship-listings'}
        />
      </SidebarNavGroup>

      {/* Misc Pages */}
      <SidebarNavItem 
        to="/interviews" 
        icon={<FiMic />} 
        label="Interviews" 
        active={activePath === '/interviews'} 
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

export default EmployerSidebar;