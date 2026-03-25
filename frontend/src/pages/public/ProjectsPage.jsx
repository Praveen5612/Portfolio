import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { FiGithub, FiExternalLink } from 'react-icons/fi'
import { projectsApi } from '../../services/projects.api.js'
import { useSettings } from '../../context/SettingsContext.jsx'
import { trackProjectClick } from '../../utils/analytics.js'

export default function ProjectsPage() {
  const { settings } = useSettings()
  const [projects, setProjects] = useState([])
  const [filter, setFilter] = useState('All')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    projectsApi.getAll()
      .then(r => setProjects(r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const allTags = ['All', ...new Set(projects.flatMap(p => p.tech_stack || []))]
  const filtered = filter === 'All' ? projects : projects.filter(p => (p.tech_stack || []).includes(filter))

  return (
    <>
      <Helmet><title>{`Projects | ${settings.site_name || 'Portfolio'}`}</title></Helmet>

      <section className="py-20">
        <div className="container-custom">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
            <h1 className="section-title">My Projects</h1>
            <p className="section-subtitle">Things I've built — from side projects to production apps</p>
          </motion.div>

          {/* Filter Tags */}
          <div className="flex flex-wrap gap-2 mb-10">
            {allTags.slice(0, 15).map(tag => (
              <button
                key={tag}
                onClick={() => setFilter(tag)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  filter === tag
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                    : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card p-6 animate-pulse">
                  <div className="w-full h-40 bg-slate-700 rounded-xl mb-4" />
                  <div className="h-5 bg-slate-700 rounded mb-2 w-3/4" />
                  <div className="h-4 bg-slate-700 rounded mb-1 w-full" />
                  <div className="h-4 bg-slate-700 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((project, i) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="card-hover group flex flex-col"
                  onClick={() => trackProjectClick(project.id, 'view')}
                >
                  {project.thumbnail ? (
                    <div className="w-full h-48 overflow-hidden rounded-t-2xl bg-slate-700">
                      <img
                        src={`${import.meta.env.VITE_API_URL}${project.thumbnail}`}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-48 rounded-t-2xl bg-gradient-to-br from-blue-600/20 to-emerald-600/20 flex items-center justify-center">
                      <span className="text-4xl">🚀</span>
                    </div>
                  )}

                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-white font-semibold text-lg group-hover:text-blue-400 transition-colors">
                        {project.title}
                      </h3>
                      {project.is_featured === 1 && (
                        <span className="badge-yellow text-xs shrink-0">⭐ Featured</span>
                      )}
                    </div>
                    <p className="text-slate-400 text-sm mb-4 flex-1 line-clamp-3">{project.description}</p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {(project.tech_stack || []).slice(0, 5).map(t => (
                        <span key={t} className="tech-tag text-xs">{t}</span>
                      ))}
                    </div>
                    <div className="flex gap-3 pt-2 border-t border-slate-700/50">
                      {project.live_url && (
                        <a
                          href={project.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => { e.stopPropagation(); trackProjectClick(project.id, 'live') }}
                          className="flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 font-medium"
                        >
                          <FiExternalLink className="w-3.5 h-3.5" /> Live Demo
                        </a>
                      )}
                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => { e.stopPropagation(); trackProjectClick(project.id, 'github') }}
                          className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white font-medium"
                        >
                          <FiGithub className="w-3.5 h-3.5" /> Source
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="text-center py-20 text-slate-500">
              <p className="text-lg">No projects found for "{filter}"</p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
