import { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext.jsx'
import {
  HomeIcon, FolderIcon, UserIcon, BriefcaseIcon, EnvelopeIcon,
  UsersIcon, ChartBarIcon, Cog6ToothIcon, DocumentTextIcon,
  ArrowRightOnRectangleIcon, Bars3Icon, XMarkIcon, SparklesIcon,
  BookOpenIcon, ArrowDownTrayIcon
} from '@heroicons/react/24/outline'

const navItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: HomeIcon },
  { path: '/admin/projects', label: 'Projects', icon: FolderIcon },
  { path: '/admin/skills', label: 'Skills', icon: SparklesIcon },
  { path: '/admin/experience', label: 'Experience', icon: BriefcaseIcon },
  { path: '/admin/leads', label: 'Leads', icon: UsersIcon },
  { path: '/admin/messages', label: 'Messages', icon: EnvelopeIcon },
  { path: '/admin/visitors', label: 'Visitors', icon: ChartBarIcon },
  { path: '/admin/blog', label: 'Blog', icon: BookOpenIcon },
  { path: '/admin/resume', label: 'Resume', icon: ArrowDownTrayIcon },
  { path: '/admin/settings', label: 'Settings', icon: Cog6ToothIcon },
  { path: '/admin/profile', label: 'Profile', icon: UserIcon },
]

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { admin, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/admin') }

  const Sidebar = ({ mobile = false }) => (
    <div className={`flex flex-col h-full ${mobile ? 'p-4' : 'p-4'}`}>
      {/* Logo */}
      <div className="flex items-center justify-between mb-8 px-2">
        <Link to="/" target="_blank" className="text-lg font-bold gradient-text font-display">
          Portfolio
        </Link>
        {mobile && (
          <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-white">
            <XMarkIcon className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Admin Info */}
      <div className="card p-3 mb-6 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shrink-0 overflow-hidden">
          {admin?.avatar ? <img src={`${import.meta.env.VITE_API_URL}${admin.avatar}`} alt="" className="w-full h-full object-cover" /> : admin?.name?.[0]?.toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="text-white text-sm font-medium truncate">{admin?.name}</p>
          <p className="text-slate-500 text-xs truncate">{admin?.role?.replace('_', ' ')}</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto">
        {navItems.map(item => {
          const active = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`sidebar-link text-sm ${active ? 'active' : ''}`}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-slate-800">
        <Link to="/" target="_blank" className="sidebar-link text-sm mb-1">
          <DocumentTextIcon className="w-4 h-4" /> View Portfolio
        </Link>
        <button onClick={handleLogout} className="sidebar-link text-sm w-full text-red-400 hover:text-red-300 hover:bg-red-500/10">
          <ArrowRightOnRectangleIcon className="w-4 h-4" /> Logout
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-60 xl:w-64 shrink-0 flex-col bg-slate-900/80 border-r border-slate-800">
        <Sidebar />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="lg:hidden fixed inset-0 z-40 bg-black/60" onClick={() => setSidebarOpen(false)} />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 z-50 w-64 bg-slate-900 border-r border-slate-800"
            >
              <Sidebar mobile />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="flex items-center justify-between px-4 lg:px-6 h-14 bg-slate-900/50 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 text-slate-400 hover:text-white"
              onClick={() => setSidebarOpen(true)}
            >
              <Bars3Icon className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-sm font-semibold text-white capitalize">
                {navItems.find(i => i.path === location.pathname)?.label || 'Admin'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/" target="_blank" className="text-xs text-slate-500 hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors">
              View Site ↗
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
