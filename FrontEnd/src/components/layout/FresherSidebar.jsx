import SidebarNavItem from './SidebarNavItem';
import SidebarNavGroup from './SidebarNavGroup';
import { 

  FiTrendingUp,
 
} from 'react-icons/fi';

function FresherSidebar({ activePath }) {
  return (
    <div className="h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {/* Home */}
          <SidebarNavItem 
            to="/home" 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
                <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
              </svg>
            } 
            label="Home" 
            active={activePath === '/home'} 
          />

          {/* Saved Jobs/Internships */}
          <SidebarNavItem 
            to="/saved-jobs" 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z" clipRule="evenodd" />
              </svg>
            } 
            label="Saved Jobs/Internships" 
            active={activePath === '/saved-jobs'} 
          />

          {/* Fresher Dashboard */}
          <SidebarNavGroup 
            label="Fresher Dashboard" 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75zM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 01-1.875-1.875V8.625zM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 013 19.875v-6.75z" />
              </svg>
            } 
            active={activePath.includes('/fresher-dashboard')}
          >
            <SidebarNavItem
              to="/fresher-dashboard/Off-campus"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM6.262 6.072a8.25 8.25 0 1010.562-.766 4.5 4.5 0 01-1.318 1.357L14.25 7.5l.165.33a.809.809 0 01-1.086 1.085l-.604-.302a1.125 1.125 0 00-1.298.21l-.132.131a1.126 1.126 0 01-1.699.11l-.108-.106a1.14 1.14 0 00-1.59 0l-1.034 1.034a3.75 3.75 0 102.5.5l.2-.2c.322-.321.752-.566 1.218-.708a8.216 8.216 0 002.013-.336 9.02 9.02 0 00-.96-2.646.75.75 0 00-.42-.42 9.04 9.04 0 00-2.645-.961 8.202 8.202 0 00-.336 2.013 3.747 3.747 0 00-.708 1.218l-.2.2a.75.75 0 00.5 1.25h.004a.75.75 0 00.745-.748V9.5l.001-.001a.75.75 0 00-.745-.748H9.5a.75.75 0 00-.75.75v.004c0 .414.336.75.75.75h.004a.75.75 0 00.5-1.25l-.2-.2a5.25 5.25 0 01-1.357-1.318L6.262 6.072z" clipRule="evenodd" />
                </svg>
              }
              label="Off-Campus Listings"
              active={activePath === '/fresher-dashboard/Off-campus'}
            />
            <SidebarNavItem 
              to="/fresher-dashboard/Internship" 
              icon={<FiTrendingUp />} 
              label="Internship Opportunities" 
              active={activePath === '/fresher-dashboard/Internship'} 
            /> 
            <SidebarNavItem
              to="/fresher-dashboard/Referral"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M8.25 6.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM15.75 9.75a3 3 0 116 0 3 3 0 01-6 0zM2.25 9.75a3 3 0 116 0 3 3 0 01-6 0zM6.31 15.117A6.745 6.745 0 0112 12a6.745 6.745 0 016.709 7.498.75.75 0 01-.372.568A12.696 12.696 0 0112 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 01-.372-.568 6.787 6.787 0 011.019-4.38z" clipRule="evenodd" />
                  <path d="M5.082 14.254a8.287 8.287 0 00-1.308 5.135 9.687 9.687 0 01-1.764-.44l-.115-.04a.563.563 0 01-.373-.487l-.01-.121a3.75 3.75 0 013.57-4.047zM20.226 19.389a8.287 8.287 0 00-1.308-5.135 3.75 3.75 0 013.57 4.047l-.01.121a.563.563 0 01-.373.486l-.115.04c-.567.2-1.156.349-1.764.441z" />
                </svg>
              }
              label="Referral Jobs"
              active={activePath === '/fresher-dashboard/Referral'}
            />
            {/*
            <SidebarNavItem
              to="/fresher-dashboard/hackathon"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z" clipRule="evenodd" />
                </svg>
              }
              label="Hackathon"
              active={activePath === '/fresher-dashboard/hackathon'}
            /> */}
          </SidebarNavGroup>

          {/* Service Request */}
          <SidebarNavGroup 
            label="Service Request" 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M12 6.75a5.25 5.25 0 016.775-5.025.75.75 0 01.313 1.248l-3.32 3.319c.063.475.276.934.641 1.299.365.365.824.578 1.3.64l3.318-3.319a.75.75 0 011.248.313 5.25 5.25 0 01-5.472 6.756c-1.018-.086-1.87.1-2.309.634L7.344 21.3A3.298 3.298 0 112.7 16.657l8.684-7.151c.533-.44.72-1.291.634-2.309A5.342 5.342 0 0112 6.75zM4.117 19.125a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75v-.008z" clipRule="evenodd" />
              </svg>
            } 
            active={activePath.includes('/fresher-dashboard/service-request')}
          >
            <SidebarNavItem
              to="/fresher-dashboard/service-request/counselling"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223zM8.25 10.875a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM10.875 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875-1.125a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z" clipRule="evenodd" />
                </svg>
              }
              label="Counselling"
              active={activePath === '/fresher-dashboard/service-request/counselling'}
            />
            <SidebarNavItem
              to="/fresher-dashboard/service-request/career-craft"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M4.5 2.25c-1.036 0-1.875.84-1.875 1.875v11.25c0 1.035.84 1.875 1.875 1.875h15c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-15zM3.75 20.625c0 1.035.84 1.875 1.875 1.875h15c1.035 0 1.875-.84 1.875-1.875V12.75c0-1.036-.84-1.875-1.875-1.875h-15c-1.036 0-1.875.84-1.875 1.875v7.875z" clipRule="evenodd" />
                </svg>
              }
              label="Career Craft"
              active={activePath === '/fresher-dashboard/service-request/career-craft'}
            />
            <SidebarNavItem
              to="/fresher-dashboard/service-request/mock-interview"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M7.502 6h7.128A3.375 3.375 0 0118 9.375v9.375a3 3 0 003-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 00-.673-.05A3 3 0 0015 1.5h-1.5a3 3 0 00-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6zM13.5 3A1.5 1.5 0 0012 4.5h4.5A1.5 1.5 0 0015 3h-1.5z" clipRule="evenodd" />
                  <path d="M3 18.75v.75a3 3 0 003 3h13.5a3 3 0 003-3v-.75M18 15H6a1.5 1.5 0 01-1.5-1.5v-6A1.5 1.5 0 016 6h12a1.5 1.5 0 011.5 1.5v6A1.5 1.5 0 0118 15z" />
                </svg>
              }
              label="Mock Interview"
              active={activePath === '/fresher-dashboard/service-request/mock-interview'}
            />
          </SidebarNavGroup>

          {/* Application Status */}
          <SidebarNavGroup 
            label="Application Status" 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M7.502 6h7.128A3.375 3.375 0 0118 9.375v9.375a3 3 0 003-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 00-.673-.05A3 3 0 0015 1.5h-1.5a3 3 0 00-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6zM13.5 3A1.5 1.5 0 0012 4.5h4.5A1.5 1.5 0 0015 3h-1.5z" clipRule="evenodd" />
                <path fillRule="evenodd" d="M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 013 20.625V9.375zm9.586 4.594a.75.75 0 00-1.172-.938l-2.476 3.096-.634-.682a.75.75 0 00-1.06 1.06l1.125 1.125a.75.75 0 001.116-.062l3-3.75z" clipRule="evenodd" />
              </svg>
            } 
            active={activePath.includes('/application-status')}
          >
            <SidebarNavItem
              to="/application-status/Off-campus"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM6.262 6.072a8.25 8.25 0 1010.562-.766 4.5 4.5 0 01-1.318 1.357L14.25 7.5l.165.33a.809.809 0 01-1.086 1.085l-.604-.302a1.125 1.125 0 00-1.298.21l-.132.131a1.126 1.126 0 01-1.699.11l-.108-.106a1.14 1.14 0 00-1.59 0l-1.034 1.034a3.75 3.75 0 102.5.5l.2-.2c.322-.321.752-.566 1.218-.708a8.216 8.216 0 002.013-.336 9.02 9.02 0 00-.96-2.646.75.75 0 00-.42-.42 9.04 9.04 0 00-2.645-.961 8.202 8.202 0 00-.336 2.013 3.747 3.747 0 00-.708 1.218l-.2.2a.75.75 0 00.5 1.25h.004a.75.75 0 00.745-.748V9.5l.001-.001a.75.75 0 00-.745-.748H9.5a.75.75 0 00-.75.75v.004c0 .414.336.75.75.75h.004a.75.75 0 00.5-1.25l-.2-.2a5.25 5.25 0 01-1.357-1.318L6.262 6.072z" clipRule="evenodd" />
                </svg>
              }
              label="Off-Campus Listing"
              active={activePath === '/application-status/Off-campus'}
            />
            <SidebarNavItem
              to="/application-status/Internship"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM6.262 6.072a8.25 8.25 0 1010.562-.766 4.5 4.5 0 01-1.318 1.357L14.25 7.5l.165.33a.809.809 0 01-1.086 1.085l-.604-.302a1.125 1.125 0 00-1.298.21l-.132.131a1.126 1.126 0 01-1.699.11l-.108-.106a1.14 1.14 0 00-1.59 0l-1.034 1.034a3.75 3.75 0 102.5.5l.2-.2c.322-.321.752-.566 1.218-.708a8.216 8.216 0 002.013-.336 9.02 9.02 0 00-.96-2.646.75.75 0 00-.42-.42 9.04 9.04 0 00-2.645-.961 8.202 8.202 0 00-.336 2.013 3.747 3.747 0 00-.708 1.218l-.2.2a.75.75 0 00.5 1.25h.004a.75.75 0 00.745-.748V9.5l.001-.001a.75.75 0 00-.745-.748H9.5a.75.75 0 00-.75.75v.004c0 .414.336.75.75.75h.004a.75.75 0 00.5-1.25l-.2-.2a5.25 5.25 0 01-1.357-1.318L6.262 6.072z" clipRule="evenodd" />
                </svg>
              }
              label="Internship Listing"
              active={activePath === '/application-status/Internship'}
            />
            
            {/* <SidebarNavItem
              to="/application-status/Referral"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M8.25 6.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM15.75 9.75a3 3 0 116 0 3 3 0 01-6 0zM2.25 9.75a3 3 0 116 0 3 3 0 01-6 0zM6.31 15.117A6.745 6.745 0 0112 12a6.745 6.745 0 016.709 7.498.75.75 0 01-.372.568A12.696 12.696 0 0112 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 01-.372-.568 6.787 6.787 0 011.019-4.38z" clipRule="evenodd" />
                  <path d="M5.082 14.254a8.287 8.287 0 00-1.308 5.135 9.687 9.687 0 01-1.764-.44l-.115-.04a.563.563 0 01-.373-.487l-.01-.121a3.75 3.75 0 013.57-4.047zM20.226 19.389a8.287 8.287 0 00-1.308-5.135 3.75 3.75 0 013.57 4.047l-.01.121a.563.563 0 01-.373.486l-.115.04c-.567.2-1.156.349-1.764.441z" />
                </svg>
              }
              label="Referral Jobs"
              active={activePath === '/application-status/Referral'}
            /> */}
          </SidebarNavGroup>

          {/* AI-Driven Job Search */}
          {/* <SidebarNavItem
            to="/ai-driven-job-search"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clipRule="evenodd" />
              </svg>
            }
            label="AI-Driven Job Search"
            active={activePath === '/ai-driven-job-search'}
          /> */}

          {/* Chats */}
          <SidebarNavItem
            to="/chat-application"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223zM8.25 10.875a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM10.875 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875-1.125a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z" clipRule="evenodd" />
              </svg>
            }
            label="Chats"
            active={activePath === '/chats'}
          />
        </div>
      </div>
    </div>
  );
}

export default FresherSidebar;