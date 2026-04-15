
import { useNavigate, useLocation } from 'react-router-dom'
import { FiHome, FiUser, FiBookmark, FiSearch, FiHelpCircle, FiSettings } from 'react-icons/fi'
import SidebarNavItem from './SidebarNavItem'
import CompanySidebar from './CompanySidebar'
import CollegeSidebar from './CollegeSidebar'
import StudentSidebar from './StudentSidebar' // You can create a similar one for students
import Logo from '../ui/Logo'
import FresherSidebar from './FresherSidebar'
import ProfessionalSidebar from './ProfessionalSidebar'
import EmployerSidebar from './EmployerSidebar'
import { useAuth } from "@/context/AuthContext";
import { useLegacyAuth } from '@/context/AuthProvider';


function Sidebar({ open, setOpen }) {
  const navigate = useNavigate();
  const location = useLocation()
 const [authUser] = useLegacyAuth();


const isAuthenticated = !!authUser;
  const role = authUser?.user?.userType;
const loading = false;



  
 
  const isActive = (path) => location.pathname === path
  
  //const isAuthenticated = localStorage.getItem('token') && localStorage.getItem('ChatAppUser');
  
  {/*const handleLogin =()=>{
     const userType=localStorage.getItem('selectedServiceType')
     localStorage.setItem('selectedRole',userType)
     console.log(userType)
     navigate('/login')
  }*/}

  const handleLogin = () => {
  navigate('/userselection');
};

  console.log("Sidebar auth:", {
    loading,
    isAuthenticated,
    role
  });

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-white  
                  transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto
                  ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex flex-col h-full">
          {/* <div className="px-4 py-5 border-b border-gray-200">
            <Logo />
          </div> */}
          <div onClick={()=>navigate('/')} className="h-16 flex items-center px-5 border-b shadow-grey cursor-pointer">
            <Logo />
            
          </div>
          

          <nav className="flex-1 px-1 py-4 space-y-1 overflow-y-hidden">
    
            {/* Role-specific Sidebars */}
            {/* {selectedRole === 'student' && <StudentSidebar activePath={location.pathname} />}
            {selectedRole === 'fresher' && <FresherSidebar activePath={location.pathname} />}
            {selectedRole === 'professional' && <ProfessionalSidebar activePath={location.pathname} />}
            {selectedRole === 'employer' && <EmployerSidebar activePath={location.pathname} />}
            {selectedRole === 'company' && <CompanySidebar activePath={location.pathname} />}
            {selectedRole === 'college' && <CollegeSidebar activePath={location.pathname} />}
             */}
          
            {isAuthenticated && role  === 'student' && <StudentSidebar activePath={location.pathname} />}
            {isAuthenticated && role === 'fresher' && <FresherSidebar activePath={location.pathname} />}
            {isAuthenticated && role === 'professional' && <ProfessionalSidebar activePath={location.pathname} />}
            {isAuthenticated && role === 'employer' && <EmployerSidebar activePath={location.pathname} />}
            {isAuthenticated && role === 'company' && <CompanySidebar activePath={location.pathname} />}
            {isAuthenticated && role === 'college' && <CollegeSidebar activePath={location.pathname} />}

            {!isAuthenticated && (
              <div className='text-center'>

                <div className="text-center text-gray-500 py-8 font-bold">
                  Please login to access navigation
                </div>
             <button 
                  className="
                    relative group
                    px-8 py-3 
                    font-bold text-white 
                    rounded-xl
                    transition-all duration-500
                    bg-[length:200%_auto]
                    bg-gradient-to-r from-[#667eea] via-[#764ba2] to-[#667eea]
                    hover:bg-right
                    hover:shadow-[0_10px_20px_rgba(118,75,162,0.4)]
                    hover:-translate-y-1
                    active:scale-95
                    overflow-hidden
                  " 
                  onClick={handleLogin}
                >
                  {/* The Text */}
                  <span className="relative z-10">Login</span>

                  {/* Inner Light Sweep Effect */}
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] transition-transform"></div>
                </button>

              </div>
              )}            

          </nav>

          <div className="p-4 border-t border-gray-200">
            <SidebarNavItem 
              to="/ContactUs" 
              icon={<FiHelpCircle />} 
              label="Support" 
              active={isActive('/support')} 
            />
           {/*<SidebarNavItem 
              to="/settings" 
              icon={<FiSettings />} 
              label="Settings" 
              active={isActive('/settings')} 
            />*/}
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
