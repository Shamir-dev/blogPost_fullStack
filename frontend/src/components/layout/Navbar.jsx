// src/components/layout/Navbar.jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Bell, PenLine, PanelLeft, LogOut } from 'lucide-react'
import ThemeToggle from '../ui/ThemeToggle.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

export default function Navbar({ onToggleSidebar }) {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <header className="sticky top-0 z-40 h-14 sm:h-16 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur px-1.5 sm:px-6 grid grid-cols-3 items-center gap-1 sm:gap-4">
      {/* Left */}
      <div className="flex items-center gap-0.5 sm:gap-3 justify-self-start min-w-0">
        <button onClick={onToggleSidebar} className="p-1 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-600 dark:text-gray-400 shrink-0" aria-label="Toggle sidebar">
          <PanelLeft size={16} className="sm:hidden" />
          <PanelLeft size={20} className="hidden sm:block" />
        </button>
        <Link to="/" className="flex items-center gap-1 sm:gap-2 font-bold text-xs sm:text-lg whitespace-nowrap min-w-0">
          <span className="text-indigo-600">{'</>'}</span>
          <span className="truncate">blogPost</span>
        </Link>
      </div>

      {/* Center */}
      <div className="relative w-full max-w-md justify-self-center min-w-0">
        <Search size={14} className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 text-gray-400 sm:hidden" />
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hidden sm:block" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          placeholder="Search..."
          className="w-full pl-7 sm:pl-9 pr-2 sm:pr-4 py-1 sm:py-2 rounded-lg text-xs sm:text-sm bg-gray-100 dark:bg-gray-900 border border-transparent focus:border-indigo-400 focus:outline-none"
        />
      </div>

      {/* Right */}
      <div className="flex items-center gap-0.5 sm:gap-3 justify-self-end min-w-0">
        <ThemeToggle />

        {isAuthenticated ? (
          <>
            {user?.is_admin && (
              <Link to="/admin" className="text-[10px] sm:text-sm font-medium text-gray-500 hover:text-indigo-600 whitespace-nowrap px-0.5 sm:px-0">
                Admin
              </Link>
            )}
            <Link to="/write" className="flex items-center gap-1 sm:gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] sm:text-sm font-medium px-1.5 sm:px-4 py-1 sm:py-2 rounded-lg transition-colors whitespace-nowrap shrink-0">
              <PenLine size={12} className="sm:hidden" />
              <PenLine size={16} className="hidden sm:block" />
              <span className="hidden xs:inline">Write</span>
            </Link>
            <button className="relative p-1 sm:p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900 shrink-0">
              <Bell size={16} className="sm:hidden" />
              <Bell size={20} className="hidden sm:block" />
              <span className="absolute top-0.5 right-0.5 sm:top-1.5 sm:right-1.5 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full" />
            </button>
            <Link to="/settings" className="shrink-0">
              <img src={user.avatar_url} alt={user.username} className="w-6 h-6 sm:w-9 sm:h-9 rounded-full object-cover" />
            </Link>
            <button onClick={handleLogout} className="p-1 sm:p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-500 shrink-0" aria-label="Logout">
              <LogOut size={14} className="sm:hidden" />
              <LogOut size={18} className="hidden sm:block" />
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-[10px] sm:text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-indigo-600 whitespace-nowrap">Sign in</Link>
            <Link to="/register" className="bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] sm:text-sm font-medium px-1.5 sm:px-4 py-1 sm:py-2 rounded-lg transition-colors whitespace-nowrap shrink-0">Register</Link>
          </>
        )}
      </div>
    </header>
  )
}

// // src/components/layout/Navbar.jsx
// import { useState } from 'react'
// import { Link, useNavigate } from 'react-router-dom'
// import { Search, Bell, PenLine, PanelLeft, LogOut } from 'lucide-react'
// import ThemeToggle from '../ui/ThemeToggle.jsx'
// import { useAuth } from '../../context/AuthContext.jsx'

// export default function Navbar({ onToggleSidebar }) {
//   const { user, isAuthenticated, logout } = useAuth()
//   const navigate = useNavigate()
//   const [searchQuery, setSearchQuery] = useState('')

//   const handleLogout = () => {
//     logout()
//     navigate('/')
//   }

//   const handleSearchKeyDown = (e) => {
//     if (e.key === 'Enter' && searchQuery.trim()) {
//       navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
//     }
//   }

//   return (
//     <header className="sticky top-0 z-40 h-16 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur px-4 sm:px-6 grid grid-cols-3 items-center gap-4">
//       {/* Left */}
//       <div className="flex items-center gap-3 justify-self-start">
//         <button onClick={onToggleSidebar} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-600 dark:text-gray-400" aria-label="Toggle sidebar">
//           <PanelLeft size={20} />
//         </button>
//         <Link to="/" className="flex items-center gap-2 font-bold text-lg">
//           <span className="text-indigo-600">{'</>'}</span>
//           blogPost
//         </Link>
//       </div>

//       {/* Center */}
//       <div className="relative w-full max-w-md justify-self-center hidden md:block">
//         <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//         <input
//           type="text"
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           onKeyDown={handleSearchKeyDown}
//           placeholder="Search for articles, topics, or people..."
//           className="w-full pl-9 pr-4 py-2 rounded-lg text-sm bg-gray-100 dark:bg-gray-900 border border-transparent focus:border-indigo-400 focus:outline-none"
//         />
//       </div>

//       {/* Right */}
//       <div className="flex items-center gap-3 justify-self-end">
//         <ThemeToggle />

//         {isAuthenticated ? (
//           <>
//             {user?.is_admin && (
//               <Link to="/admin" className="text-sm font-medium text-gray-500 hover:text-indigo-600 hidden sm:block">
//                 Admin
//               </Link>
//             )}
//             <Link to="/write" className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
//               <PenLine size={16} /> <span className="hidden sm:inline">Write Post</span>
//             </Link>
//             <button className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900">
//               <Bell size={20} />
//               <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
//             </button>
//             <Link to="/settings">
//               <img src={user.avatar_url} alt={user.username} className="w-9 h-9 rounded-full object-cover" />
//             </Link>
//             <button onClick={handleLogout} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-500" aria-label="Logout">
//               <LogOut size={18} />
//             </button>
//           </>
//         ) : (
//           <>
//             <Link to="/login" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-indigo-600">Sign in</Link>
//             <Link to="/register" className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">Register</Link>
//           </>
//         )}
//       </div>
//     </header>
//   )
// }