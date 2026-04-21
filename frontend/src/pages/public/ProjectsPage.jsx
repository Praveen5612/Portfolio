import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { FiGithub, FiExternalLink } from 'react-icons/fi'
import { projectsApi } from '../../services/projects.api.js'
import { useSettings } from '../../context/SettingsContext.jsx'
import { trackProjectClick } from '../../utils/analytics.js'

import ScrollReveal from '../../components/animations/ScrollReveal.jsx'
import TiltCard from '../../components/animations/TiltCard.jsx'

export default function ProjectsPage() {
  const { settings } = useSettings()
  const [projects, setProjects] = useState([])
  const [filter, setFilter] = useState('All')
  const [loading, setLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState(null)

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

      <section className="py-24 bg-slate-950 min-h-screen relative overflow-hidden">
        {/* Subtle background abstract shapes */}
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-blue-500/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-emerald-500/5 rounded-full blur-[150px] pointer-events-none" />

        <div className="container-custom relative z-10">
          <ScrollReveal>
            <div className="mb-16">
              <h1 className="section-title text-5xl md:text-6xl font-display font-extrabold tracking-tight mb-4">My Projects</h1>
              <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full mb-6"></div>
              <p className="text-xl text-slate-400 font-light max-w-2xl">Things I've built — from side projects to production apps.</p>
            </div>
          </ScrollReveal>

          {/* Filter Tags */}
          <ScrollReveal delay={0.1}>
            <div className="flex flex-wrap gap-3 mb-16">
              {allTags.slice(0, 15).map(tag => (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  key={tag}
                  onClick={() => setFilter(tag)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all shadow-md ${
                    filter === tag
                      ? 'bg-blue-600/90 text-white shadow-blue-500/30 border border-blue-500/50'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  {tag}
                </motion.button>
              ))}
            </div>
          </ScrollReveal>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card p-6 border-slate-800 bg-slate-900/50 animate-pulse border">
                  <div className="w-full h-48 bg-slate-800 rounded-xl mb-6" />
                  <div className="h-6 bg-slate-800 rounded mb-3 w-3/4" />
                  <div className="h-4 bg-slate-800 rounded mb-2 w-full" />
                  <div className="h-4 bg-slate-800 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence mode="popLayout">
                {filtered.map((project, i) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    key={project.id}
                  >
                    <TiltCard>
                      <div 
                        onClick={() => {
                          trackProjectClick(project.id, 'view')
                          setSelectedProject(project)
                        }}
                        className="card h-full border-white/5 bg-slate-900/40 hover:bg-slate-800/60 overflow-hidden shadow-2xl group flex flex-col backdrop-blur-xl transition-all cursor-pointer ring-1 ring-white/10 hover:ring-blue-500/50"
                      >
                        {project.thumbnail ? (
                          <div className="w-full relative h-[220px] overflow-hidden bg-slate-800">
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 to-transparent z-10" />
                            <motion.img
                              initial={false}
                              whileHover={{ scale: 1.1 }}
                              transition={{ duration: 0.6 }}
                              src={`${import.meta.env.VITE_API_URL}${project.thumbnail}`}
                              alt={project.title}
                              className="w-full h-full object-cover relative z-0"
                            />
                            {project.is_featured === 1 && (
                              <div className="absolute top-4 right-4 z-20">
                                <span className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white shadow-lg text-xs px-3 py-1.5 rounded-full font-bold uppercase tracking-wider">
                                  ⭐ Featured
                                </span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="w-full relative h-[220px] bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center border-b border-slate-800">
                            <span className="text-6xl opacity-20 group-hover:opacity-40 transition-opacity">🚀</span>
                          </div>
                        )}

                        <div className="p-8 flex flex-col flex-1">
                          <h3 className="text-white font-bold text-xl tracking-wide group-hover:text-blue-400 transition-colors mb-3">
                            {project.title}
                          </h3>
                          <p className="text-slate-400 text-sm mb-6 flex-1 line-clamp-3 leading-relaxed">
                            {project.description}
                          </p>
                          <div className="flex flex-wrap gap-2 mb-6">
                            {(project.tech_stack || []).slice(0, 5).map(t => (
                              <span key={t} className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-md text-xs font-semibold">
                                {t}
                              </span>
                            ))}
                          </div>
                          
                          <div className="flex gap-4 pt-4 border-t border-slate-800/80">
                            {project.live_url && (
                              <a
                                href={project.live_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => { e.stopPropagation(); trackProjectClick(project.id, 'live') }}
                                className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 font-bold tracking-wide"
                              >
                                <FiExternalLink className="w-4 h-4" /> Live Demo
                              </a>
                            )}
                            {project.github_url && (
                              <a
                                href={project.github_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => { e.stopPropagation(); trackProjectClick(project.id, 'github') }}
                                className="flex items-center gap-2 text-sm text-slate-400 hover:text-white font-bold tracking-wide transition-colors"
                              >
                                <FiGithub className="w-4 h-4" /> Source
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </TiltCard>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-32 text-slate-500">
              <span className="text-4xl block mb-4">🔍</span>
              <p className="text-xl font-light">No projects found for "{filter}"</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-xl overflow-y-auto"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="relative w-full max-w-4xl bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-white/10 my-auto"
              onClick={e => e.stopPropagation()}
            >
              {/* Close button */}
              <button 
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 z-50 w-10 h-10 bg-slate-950/50 backdrop-blur-md hover:bg-red-500/20 text-slate-300 hover:text-red-400 rounded-full flex items-center justify-center transition-all border border-white/10"
              >
                ✕
              </button>

              <div className="flex flex-col md:flex-row h-full max-h-[85vh] overflow-y-auto no-scrollbar">
                {/* Image Section */}
                <div className="md:w-1/2 relative bg-slate-950 border-r border-white/5 min-h-[300px] md:min-h-full flex items-center justify-center p-6">
                  {selectedProject.thumbnail ? (
                    <img
                      src={`${import.meta.env.VITE_API_URL}${selectedProject.thumbnail}`}
                      alt={selectedProject.title}
                      className="w-full h-auto object-contain rounded-xl shadow-2xl"
                    />
                  ) : (
                    <span className="text-8xl opacity-20">🚀</span>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Content Section */}
                <div className="md:w-1/2 p-8 md:p-10 flex flex-col justify-center bg-slate-900/50">
                  <div className="mb-6">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 font-display">
                      {selectedProject.title}
                    </h2>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {(selectedProject.tech_stack || []).map(t => (
                        <span key={t} className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-md text-sm font-semibold tracking-wide">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="prose prose-invert prose-sm md:prose-base max-w-none text-slate-300 mb-8 max-h-[30vh] overflow-y-auto pr-4 custom-scrollbar whitespace-pre-wrap leading-relaxed">
                    {selectedProject.content || selectedProject.description}
                  </div>

                  <div className="flex flex-wrap gap-4 mt-auto pt-6 border-t border-slate-800">
                    {selectedProject.live_url && (
                      <a
                        href={selectedProject.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 min-w-[140px] px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)]"
                      >
                        <FiExternalLink className="w-5 h-5" /> Visit Live
                      </a>
                    )}
                    {selectedProject.github_url && (
                      <a
                        href={selectedProject.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 min-w-[140px] px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all border border-slate-600 hover:border-slate-500"
                      >
                        <FiGithub className="w-5 h-5" /> Source Code
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
