import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import { SettingsProvider } from './context/SettingsContext.jsx'
import { initTracker, endSession } from './utils/analytics.js'
import LocomotiveScroll from 'locomotive-scroll'


// Public Layout & Pages
import PublicLayout from './components/public/PublicLayout.jsx'
import HomePage from './pages/public/HomePage.jsx'
import AboutPage from './pages/public/AboutPage.jsx'
import ProjectsPage from './pages/public/ProjectsPage.jsx'
import ContactPage from './pages/public/ContactPage.jsx'
import ResumePage from './pages/public/ResumePage.jsx'
import BlogPage from './pages/public/BlogPage.jsx'
import BlogPostPage from './pages/public/BlogPostPage.jsx'

// Admin Layout & Pages
import AdminLayout from './components/admin/AdminLayout.jsx'
import AdminLogin from './pages/admin/AdminLogin.jsx'
import Dashboard from './pages/admin/Dashboard.jsx'
import AdminProjects from './pages/admin/AdminProjects.jsx'
import AdminSkills from './pages/admin/AdminSkills.jsx'
import AdminExperience from './pages/admin/AdminExperience.jsx'
import AdminLeads from './pages/admin/AdminLeads.jsx'
import AdminMessages from './pages/admin/AdminMessages.jsx'
import AdminVisitors from './pages/admin/AdminVisitors.jsx'
import AdminBlog from './pages/admin/AdminBlog.jsx'
import AdminResume from './pages/admin/AdminResume.jsx'
import AdminSettings from './pages/admin/AdminSettings.jsx'
import AdminProfile from './pages/admin/AdminProfile.jsx'

function ProtectedRoute({ children }) {
  const { admin, loading } = useAuth()
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )
  if (!admin) return <Navigate to="/admin" replace />
  return children
}

function AppContent() {
  useEffect(() => {
    initTracker()
    window.addEventListener('beforeunload', endSession)
    
    // Initialize Locomotive Scroll for smooth scrolling
    const locomotiveScroll = new LocomotiveScroll();
    
    return () => {
      window.removeEventListener('beforeunload', endSession)
      if (locomotiveScroll) locomotiveScroll.destroy();
    }
  }, [])

  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/resume" element={<ResumePage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin">
        <Route index element={<AdminLogin />} />
        <Route element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="skills" element={<AdminSkills />} />
          <Route path="experience" element={<AdminExperience />} />
          <Route path="leads" element={<AdminLeads />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="visitors" element={<AdminVisitors />} />
          <Route path="blog" element={<AdminBlog />} />
          <Route path="resume" element={<AdminResume />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <AppContent />
      </SettingsProvider>
    </AuthProvider>
  )
}
