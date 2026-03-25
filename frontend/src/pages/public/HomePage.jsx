import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { ArrowDownIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import { FiGithub, FiLinkedin, FiMail, FiTwitter, FiExternalLink } from 'react-icons/fi'
import { projectsApi } from '../../services/projects.api.js'
import { skillsApi } from '../../services/skills.api.js'
import { useSettings } from '../../context/SettingsContext.jsx'
import { trackProjectClick } from '../../utils/analytics.js'

const iconMap = { github: FiGithub, linkedin: FiLinkedin, mail: FiMail, twitter: FiTwitter }

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } })
}

export default function HomePage() {
  const { settings, socialLinks } = useSettings()
  const [projects, setProjects] = useState([])
  const [skills, setSkills] = useState([])

  useEffect(() => {
    projectsApi.getAll({ limit: 3 }).then(r => setProjects(r.data || [])).catch(() => {})
    skillsApi.getAll().then(r => setSkills(r.data || [])).catch(() => {})
  }, [])

  const grouped = skills.reduce((acc, s) => {
    if (!acc[s.category]) acc[s.category] = []
    acc[s.category].push(s)
    return acc
  }, {})

  return (
    <>
      <Helmet>
        <title>{`${settings.meta_title || settings.site_name || 'Portfolio'}`}</title>
        <meta name="description" content={settings.meta_description || ''} />
      </Helmet>

      {/* Hero */}
      <section className="min-h-screen flex items-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
        </div>

        <div className="container-custom relative z-10 py-20">
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}>
            <span className="badge-green text-sm mb-6 inline-block">✓ Available for opportunities</span>
          </motion.div>

          <motion.h1
            variants={fadeUp} initial="hidden" animate="show" custom={1}
            className="text-5xl md:text-7xl font-bold leading-tight mb-6 font-display"
            dangerouslySetInnerHTML={{ __html: settings.hero_title || 'Hi, I\'m <span class="gradient-text">Your Name</span>' }}
          />

          <motion.p
            variants={fadeUp} initial="hidden" animate="show" custom={2}
            className="text-xl md:text-2xl text-slate-400 mb-4 max-w-2xl"
          >
            {settings.hero_subtitle || 'Full Stack Developer & UI/UX Enthusiast'}
          </motion.p>

          <motion.p
            variants={fadeUp} initial="hidden" animate="show" custom={3}
            className="text-slate-500 mb-10 max-w-xl leading-relaxed whitespace-pre-wrap"
          >
            {settings.hero_description || 'I craft beautiful, fast, and scalable web applications. Passionate about clean code, great UX, and solving real problems.'}
          </motion.p>

          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={4} className="flex flex-wrap gap-4 mb-12">
            <Link to="/projects" className="btn-primary">
              View My Work <ArrowRightIcon className="w-4 h-4" />
            </Link>
            <Link to="/contact" className="btn-secondary">
              Get In Touch
            </Link>
          </motion.div>

          {/* Social Links */}
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={5} className="flex items-center gap-4">
            {socialLinks.map(link => {
              const Icon = iconMap[link.icon?.toLowerCase()] || FiExternalLink
              return (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-500 transition-all duration-200 hover:-translate-y-0.5"
                >
                  <Icon className="w-4 h-4" />
                </a>
              )
            })}
          </motion.div>

        </div>
      </section>

      {/* Stats */}
      {settings.stats && (
        <section className="py-12 border-y border-slate-800 bg-slate-900/10">
          <div className="container-custom">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
              {JSON.parse(settings.stats).map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl font-bold text-white mb-1 font-display">{stat.value}</div>
                  <div className="text-xs text-slate-500 uppercase tracking-widest">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Services */}
      {settings.services && (
        <section className="py-24 bg-slate-900/20">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="section-title">Services & Expertise</h2>
              <p className="section-subtitle">What I bring to your business</p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {JSON.parse(settings.services).map((service, i) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="card p-6 border-slate-800 hover:border-blue-500/30 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 mb-4">
                    <span className="text-xl">⚡</span>
                  </div>
                  <h3 className="text-white font-semibold mb-2">{service.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{service.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Projects */}
      {projects.length > 0 && (
        <section className="py-24">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="section-title">Featured Projects</h2>
              <p className="section-subtitle">A selection of my recent work</p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, i) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="card-hover group p-6"
                  onClick={() => trackProjectClick(project.id, 'view')}
                >
                  {project.thumbnail && (
                    <div className="w-full h-40 rounded-xl overflow-hidden mb-4 bg-slate-700">
                      <img
                        src={`${import.meta.env.VITE_API_URL}${project.thumbnail}`}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-blue-400 transition-colors">{project.title}</h3>
                  <p className="text-slate-400 text-sm mb-4 line-clamp-2">{project.description}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {(project.tech_stack || []).slice(0, 4).map(t => (
                      <span key={t} className="tech-tag text-xs">{t}</span>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    {project.live_url && (
                      <a href={project.live_url} target="_blank" rel="noopener noreferrer"
                        onClick={(e) => { e.stopPropagation(); trackProjectClick(project.id, 'live') }}
                        className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
                        <FiExternalLink className="w-3 h-3" /> Live
                      </a>
                    )}
                    {project.github_url && (
                      <a href={project.github_url} target="_blank" rel="noopener noreferrer"
                        onClick={(e) => { e.stopPropagation(); trackProjectClick(project.id, 'github') }}
                        className="text-sm text-slate-400 hover:text-white flex items-center gap-1">
                        <FiGithub className="w-3 h-3" /> Code
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link to="/projects" className="btn-secondary">View All Projects <ArrowRightIcon className="w-4 h-4" /></Link>
            </div>
          </div>
        </section>
      )}

      {/* Skills */}
      {Object.keys(grouped).length > 0 && (
        <section className="py-24 bg-slate-900/30">
          <div className="container-custom">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
              <h2 className="section-title">Skills & Technologies</h2>
              <p className="section-subtitle">Tools and technologies I work with</p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(grouped).map(([cat, items], ci) => (
                <motion.div key={cat} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: ci * 0.1 }} className="card p-6">
                  <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider text-blue-400">{cat}</h3>
                  <div className="space-y-3">
                    {items.map(skill => (
                      <div key={skill.id}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-300">{skill.name}</span>
                          <span className="text-slate-500">{skill.proficiency}%</span>
                        </div>
                        <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.proficiency}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-24">
        <div className="container-custom text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl font-bold text-white mb-4">Ready to work together?</h2>
            <p className="text-slate-400 mb-8 text-lg">Let's build something amazing. Get in touch!</p>
            <Link to="/contact" className="btn-primary text-base px-8 py-4">
              Start a Conversation <ArrowRightIcon className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  )
}
