// import { useLocation, Link } from 'react-router-dom'
// import { FiHome, FiUser, FiBookmark, FiPieChart, FiClipboard, 
//          FiFileText, FiSearch, FiHelpCircle, FiSettings } from 'react-icons/fi'
// import SidebarNavItem from './SidebarNavItem'
// import SidebarNavGroup from './SidebarNavGroup'
// import Logo from '../ui/Logo'

// function Sidebar({ open, setOpen }) {
//   const location = useLocation()
  
//   const isActive = (path) => {
//     return location.pathname === path
//   }
  
//   return (
//     <>
//       {/* Mobile backdrop */}
//       {open && (
//         <div
//           className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
//           onClick={() => setOpen(false)}
//         />
//       )}
      
//       {/* Sidebar */}
//       <aside
//         className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-white border-r border-gray-200 
//                   transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto
//                   ${open ? 'translate-x-0' : '-translate-x-full'}`}
//       >
//         <div className="flex flex-col h-full">
//           {/* Logo */}
//           <div className="px-4 py-5 border-b border-gray-200">
//             <Logo />
//           </div>
          
//           {/* Navigation */}
//           <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
//             <SidebarNavItem 
//               to="/dashboard" 
//               icon={<FiHome />} 
//               label="Home" 
//               active={isActive('/dashboard')} 
//             />
//             <SidebarNavItem 
//               to="/profile" 
//               icon={<FiUser />} 
//               label="Profile" 
//               active={isActive('/profile')} 
//             />
//             <SidebarNavItem 
//               to="/saved-jobs" 
//               icon={<FiBookmark />} 
//               label="Saved Jobs/Internships" 
//               active={isActive('/saved-jobs')} 
//               badge="24"
//             />
            
//             <SidebarNavGroup
//               icon={<FiPieChart />}
//               label="Student Dashboard"
//               to="/student-dashboard"
//               active={isActive('/student-dashboard')}
//             />
            
//             <SidebarNavGroup
//               icon={<FiClipboard />}
//               label="Service Requests"
//               to="/service-requests"
//               active={isActive('/service-requests')}
//             />
            
//             <SidebarNavGroup
//               icon={<FiFileText />}
//               label="Application Status"
//               to="/application-status"
//               active={isActive('/application-status')}
//             />
            
//             <SidebarNavItem 
//               to="/job-search" 
//               icon={<FiSearch />} 
//               label="AI-Driven Job Search" 
//               active={isActive('/job-search')} 
//             />
//           </nav>
          
//           {/* Footer Links */}
//           <div className="p-4 border-t border-gray-200">
//             <SidebarNavItem 
//               to="/ContactUs" 
//               icon={<FiHelpCircle />} 
//               label="Support" 
//               active={isActive('/support')} 
//             />
//             <SidebarNavItem 
//               to="/settings" 
//               icon={<FiSettings />} 
//               label="Settings" 
//               active={isActive('/settings')} 
//             />
//           </div>
//         </div>
//       </aside>
//     </>
//   )
// }

// export default Sidebar




import { useLocation } from 'react-router-dom'
import { FiHome, FiUser, FiBookmark, FiSearch, FiHelpCircle, FiSettings } from 'react-icons/fi'
import SidebarNavItem from './SidebarNavItem'
import CompanySidebar from './CompanySidebar'
import CollegeSidebar from './CollegeSidebar'
import StudentSidebar from './StudentSidebar' // You can create a similar one for students
import Logo from '../ui/Logo'

function Sidebar({ open, setOpen }) {
  const location = useLocation()
  const userType = localStorage.getItem('userType')
  const isActive = (path) => location.pathname === path

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-white border-r border-gray-200 
                  transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto
                  ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex flex-col h-full">
          <div className="px-4 py-5 border-b border-gray-200">
            <Logo />
          </div>

          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {/* Common Nav Items */}
            {/* <SidebarNavItem 
              to="/dashboard" 
              icon={<FiHome />} 
              label="Home" 
              active={isActive('/dashboard')} 
            />
            <SidebarNavItem 
              to="/profile" 
              icon={<FiUser />} 
              label="Profile" 
              active={isActive('/profile')} 
            />
            <SidebarNavItem 
              to="/saved-jobs" 
              icon={<FiBookmark />} 
              label="Saved Jobs/Internships" 
              active={isActive('/saved-jobs')} 
              badge="24"
            /> */}

            {/* Role-specific Sidebars */}
            {userType === 'candidate' && <StudentSidebar activePath={location.pathname} />}
            {userType === 'company' && <CompanySidebar activePath={location.pathname} />}
            {userType === 'college' && <CollegeSidebar activePath={location.pathname} />}

            {/* <SidebarNavItem 
              to="/job-search" 
              icon={<FiSearch />} 
              label="AI-Driven Job Search" 
              active={isActive('/job-search')} 
            /> */}
          </nav>

          <div className="p-4 border-t border-gray-200">
            <SidebarNavItem 
              to="/ContactUs" 
              icon={<FiHelpCircle />} 
              label="Support" 
              active={isActive('/support')} 
            />
            <SidebarNavItem 
              to="/settings" 
              icon={<FiSettings />} 
              label="Settings" 
              active={isActive('/settings')} 
            />
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
