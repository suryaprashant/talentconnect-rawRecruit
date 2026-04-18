import { useState } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'
// import bgImage from "../../assets/bg_image.webp";
import FloatingMessenger from '../../home/FloatingMessenger'
import { useLegacyAuth } from '../../context/AuthProvider'
import { useLocation } from 'react-router-dom'

function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [profileOpen, setProfileOpen] = useState(false)
  const [authUser] = useLegacyAuth()
  const location = useLocation()

  const showFloatingChat =
    authUser && location.pathname !== "/chat-application"

  console.log("authUser:", authUser);
  console.log("pathname:", location.pathname);
  console.log("showFloatingChat:", showFloatingChat);
  return (
    <div className="flex h-full bg-gray-50 relative">
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      
     
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen}
          profileOpen={profileOpen}
          setProfileOpen={setProfileOpen}
        />
        {/* <main
  className="relative flex-1 overflow-y-auto p-4 md:p-6 bg-transparent"
  style={{
    backgroundImage: `url(${bgImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  }}
> */}

          {/* <main
  className="relative flex-1 overflow-y-auto p-4 md:p-6 bg-gradient-to-br from-[#143694]/10 via-[#f093fb]/5 to-[#1e4ed8]/10
            "
> */}

<main
  className="relative flex-1 overflow-y-auto p-4 md:p-6 bg-white
            "
>
          {children}
        </main>
      </div>
      {/* FLOATING CHAT */}
      {showFloatingChat && <FloatingMessenger />}
    </div>
  )
}

export default Layout