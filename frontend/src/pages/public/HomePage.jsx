import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { ArrowDownIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import { FiGithub, FiLinkedin, FiMail, FiTwitter, FiExternalLink } from 'react-icons/fi'
import { projectsApi } from '../../services/projects.api.js'
import { skillsApi } from '../../services/skills.api.js'
import { useSettings } from '../../context/SettingsContext.jsx'
import { trackProjectClick } from '../../utils/analytics.js'

// Animation Components
import ScrollReveal from '../../components/animations/ScrollReveal.jsx'
import TiltCard from '../../components/animations/TiltCard.jsx'
import AnimatedButton from '../../components/animations/AnimatedButton.jsx'
import Hero3D from '../../components/animations/Hero3D.jsx'
import AnimatedBackground from '../../components/animations/AnimatedBackground.jsx'
import { TypeAnimation } from 'react-type-animation'
import CountUp from 'react-countup'
import Marquee from 'react-fast-marquee'

const iconMap = { github: FiGithub, linkedin: FiLinkedin, mail: FiMail, twitter: FiTwitter }

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" } })
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
      <section className="min-h-screen flex items-center relative overflow-hidden bg-slate-950">
        
        {/* 3D and Particle Backgrounds injected into Hero */}
        <Hero3D />
        <AnimatedBackground />

        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
        </div>

        <div className="container-custom relative z-10 py-20">
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}>
            <span className="badge-green text-sm mb-6 inline-block shadow-[0_0_15px_rgba(16,185,129,0.3)]">✓ Available for opportunities</span>
          </motion.div>

          <motion.h1
            variants={fadeUp} initial="hidden" animate="show" custom={1}
            className="text-5xl md:text-7xl font-bold leading-tight mb-6 font-display"
            dangerouslySetInnerHTML={{ __html: settings.hero_title || 'Hi, I\'m <span class="gradient-text">Your Name</span>' }}
          />

          <motion.div
            variants={fadeUp} initial="hidden" animate="show" custom={2}
            className="text-xl md:text-3xl text-emerald-400 mb-8 mt-2 max-w-2xl font-light min-h-[3rem]"
          >
            <TypeAnimation
              sequence={[
                settings.hero_subtitle || 'Full Stack Developer',
                2000,
                'UI/UX Enthusiast',
                2000,
                'Creative Problem Solver',
                2000,
              ]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
            />
          </motion.div>

          <motion.p
            variants={fadeUp} initial="hidden" animate="show" custom={3}
            className="text-slate-400 mb-10 max-w-xl leading-relaxed whitespace-pre-wrap"
          >
            {settings.hero_description || 'I craft beautiful, fast, and scalable web applications. Passionate about clean code, great UX, and solving real problems.'}
          </motion.p>

          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={4} className="flex flex-wrap gap-5 mb-12">
            <Link to="/projects">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn-primary flex items-center shadow-[0_4px_20px_rgba(59,130,246,0.3)]">
                View My Work <ArrowRightIcon className="w-4 h-4 ml-2" />
              </motion.div>
            </Link>
            <Link to="/contact">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn-secondary">
                Get In Touch
              </motion.div>
            </Link>
          </motion.div>

          {/* Social Links */}
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={5} className="flex items-center gap-4">
            {socialLinks.map(link => {
              const Icon = iconMap[link.icon?.toLowerCase()] || FiExternalLink
              return (
                <motion.a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, translateY: -5, boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.5)' }}
                  className="w-12 h-12 rounded-xl bg-slate-800/80 backdrop-blur-sm border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:border-blue-500/50 transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              )
            })}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 1.5, duration: 1 }} 
            className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce"
          >
            <ArrowDownIcon className="w-6 h-6 text-slate-500" />
          </motion.div>
        </div>
      </section>

      {/* Marquee Section */}
      <section className="py-10 bg-slate-950 border-b border-slate-900 overflow-hidden shadow-[inset_0_0_100px_rgba(0,0,0,0.5)] relative z-20">
        <Marquee gradient={true} gradientColor="#0f172a" gradientWidth={150} speed={40} className="w-full">
          {["REACT", "NODE.JS", "TAILWIND", "THREE.JS", "GSAP", "FRAMER MOTION", "TYPESCRIPT", "MONGODB", "POSTGRESQL", "AWS", "DOCKER", "NEXT.JS"].map((tech, i) => (
             <div key={i} className="mx-8 md:mx-16 text-3xl font-extrabold text-slate-800/80 font-display tracking-widest hover:text-slate-600 transition-colors cursor-default">
               {tech}
             </div>
          ))}
        </Marquee>
      </section>

      {/* Stats */}
      {settings.stats && (
        <section className="py-16 border-y border-slate-800/50 bg-slate-900/30 backdrop-blur-sm relative z-10 shadow-xl overflow-hidden">
          <div className="container-custom">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
              {JSON.parse(settings.stats).map((stat, i) => (
                <ScrollReveal key={stat.label} delay={i * 0.1}>
                  <div className="text-center group overflow-hidden">
                    <motion.div 
                      whileHover={{ scale: 1.1, color: '#60a5fa' }} 
                      transition={{ type: "spring", stiffness: 300 }}
                      className="text-4xl font-bold text-white mb-2 font-display tracking-tight flex items-center justify-center gap-1"
                    >
                      <CountUp end={parseInt(stat.value) || 0} duration={2.5} enableScrollSpy scrollSpyOnce />
                      <span className="text-emerald-400">{isNaN(parseInt(stat.value)) ? stat.value.replace(/[0-9]/g, '') : '+'}</span>
                    </motion.div>
                    <div className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors font-medium uppercase tracking-widest">{stat.label}</div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Services */}
      {settings.services && (
        <section className="py-32 bg-slate-950 relative overflow-hidden">
          {/* subtle abstract background */}
          <div className="absolute top-1/2 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-slate-900/10 to-transparent pointer-events-none" />
          
          <div className="container-custom relative z-10">
            <ScrollReveal>
              <div className="mb-16">
                <h2 className="section-title">What I Do</h2>
                <div className="h-1 w-20 bg-blue-500 rounded-full mb-4"></div>
                <p className="section-subtitle">How I can add value to your next project</p>
              </div>
            </ScrollReveal>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {JSON.parse(settings.services).map((service, i) => (
                <ScrollReveal key={service.title} delay={i * 0.1} yOffset={30}>
                  <TiltCard>
                    <div className="card h-full p-8 border-slate-800/80 bg-slate-900/60 backdrop-blur-xl hover:bg-slate-800/80 transition-all shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/5">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center text-blue-400 mb-6 shadow-lg shadow-blue-500/10">
                        <span className="text-2xl">✨</span>
                      </div>
                      <h3 className="text-xl text-white font-bold mb-3 tracking-wide">{service.title}</h3>
                      <p className="text-slate-400 text-sm leading-relaxed">{service.description}</p>
                    </div>
                  </TiltCard>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Projects */}
      {projects.length > 0 && (
        <section className="py-32 bg-slate-900/30 border-y border-slate-800/50">
          <div className="container-custom">
            <ScrollReveal>
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                <div>
                  <h2 className="section-title">Featured Projects</h2>
                  <div className="h-1 w-20 bg-emerald-500 rounded-full mb-4"></div>
                  <p className="section-subtitle mb-0">A selection of my recent work</p>
                </div>
                <Link to="/projects">
                  <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-2 text-slate-300 hover:text-emerald-400 transition-colors font-medium">
                    View full portoflio <ArrowRightIcon className="w-5 h-5" />
                  </motion.div>
                </Link>
              </div>
            </ScrollReveal>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence>
                {projects.map((project, i) => (
                  <ScrollReveal key={project.id} delay={i * 0.15}>
                    <Link to="/projects">
                      <TiltCard onClick={() => trackProjectClick(project.id, 'view')}>
                        <div className="card h-full border-slate-800/80 bg-slate-900/80 hover:bg-slate-800/90 overflow-hidden shadow-2xl group flex flex-col backdrop-blur-md cursor-pointer transition-all">
                        {project.thumbnail && (
                          <div className="w-full relative h-[220px] overflow-hidden bg-slate-800">
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent z-10" />
                            <motion.img
                              whileHover={{ scale: 1.1 }}
                              transition={{ duration: 0.6 }}
                              src={`${import.meta.env.VITE_API_URL}${project.thumbnail}`}
                              alt={project.title}
                              className="w-full h-full object-cover relative z-0"
                            />
                            <div className="absolute bottom-4 left-4 z-20 flex gap-2">
                              {project.live_url && (
                                <a href={project.live_url} target="_blank" rel="noopener noreferrer"
                                  onClick={(e) => { e.stopPropagation(); trackProjectClick(project.id, 'live') }}
                                  className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white hover:bg-blue-500 transition-colors shadow-lg">
                                  <FiExternalLink className="w-4 h-4" />
                                </a>
                              )}
                              {project.github_url && (
                                <a href={project.github_url} target="_blank" rel="noopener noreferrer"
                                  onClick={(e) => { e.stopPropagation(); trackProjectClick(project.id, 'github') }}
                                  className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-white hover:bg-slate-700 transition-colors border border-slate-600 shadow-lg">
                                  <FiGithub className="w-4 h-4" />
                                </a>
                              )}
                            </div>
                          </div>
                        )}
                        <div className="p-6 flex-1 flex flex-col">
                          <h3 className="text-white font-bold text-xl mb-3 tracking-tight group-hover:text-blue-400 transition-colors">{project.title}</h3>
                          <p className="text-slate-400 text-sm mb-6 line-clamp-3 leading-relaxed flex-1">{project.description}</p>
                          <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-slate-800">
                            {(project.tech_stack || []).slice(0, 4).map(t => (
                              <span key={t} className="px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 text-xs font-semibold">{t}</span>
                            ))}
                          </div>
                        </div>
                        </div>
                      </TiltCard>
                    </Link>
                  </ScrollReveal>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </section>
      )}

      {/* Skills */}
      {Object.keys(grouped).length > 0 && (
        <section className="py-32 bg-slate-950">
          <div className="container-custom">
            <ScrollReveal>
              <div className="mb-16 text-center">
                <h2 className="section-title">Technical Expertise</h2>
                <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full mx-auto my-6"></div>
              </div>
            </ScrollReveal>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Object.entries(grouped).map(([cat, items], ci) => (
                <ScrollReveal key={cat} delay={ci * 0.1}>
                  <div className="card p-8 border-slate-800 bg-slate-900/40 hover:bg-slate-900/60 transition-colors shadow-lg">
                    <h3 className="text-white font-bold mb-6 text-sm uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400 inline-block">{cat}</h3>
                    <div className="space-y-5">
                      {items.map((skill, si) => (
                        <div key={skill.id} className="group">
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-slate-200 font-medium">{skill.name}</span>
                            <span className="text-slate-500 font-semibold group-hover:text-blue-400 transition-colors">{skill.proficiency}%</span>
                          </div>
                          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${skill.proficiency}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1, delay: 0.1 * si, ease: "easeOut" }}
                              className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full relative"
                            >
                              <div className="absolute top-0 right-0 bottom-0 left-0 bg-white/20 animate-pulse" />
                            </motion.div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-32 relative overflow-hidden bg-blue-900/10">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1)_0,transparent_50%)]" />
        <div className="container-custom text-center relative z-10">
          <ScrollReveal>
            <div className="max-w-3xl mx-auto backdrop-blur-md bg-slate-950/40 p-12 rounded-3xl border border-white/5 shadow-2xl">
              <h2 className="text-5xl font-extrabold text-white mb-6 font-display">Let's build something amazing</h2>
              <p className="text-slate-400 mb-10 text-xl font-light leading-relaxed">Whether you have a specific project in mind, or just want to chat about possibilities, I'm here to help.</p>
              
              <Link to="/contact">
                <motion.button 
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 30px -10px rgba(59, 130, 246, 0.7)" }} 
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary text-lg px-10 py-5 rounded-full shadow-lg shadow-blue-500/20"
                >
                  Start a Conversation <ArrowRightIcon className="w-5 h-5 ml-2 inline" />
                </motion.button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
