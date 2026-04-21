import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { experienceApi } from '../../services/experience.api.js'
import { skillsApi } from '../../services/skills.api.js'
import { useSettings } from '../../context/SettingsContext.jsx'
import ScrollReveal from '../../components/animations/ScrollReveal.jsx'
import TiltCard from '../../components/animations/TiltCard.jsx'

export default function AboutPage() {
  const { settings } = useSettings()
  const [experience, setExperience] = useState([])
  const [skills, setSkills] = useState([])

  useEffect(() => {
    experienceApi.getAll().then(r => setExperience(r.data || [])).catch(() => {})
    skillsApi.getAll().then(r => setSkills(r.data || [])).catch(() => {})
  }, [])

  const grouped = skills.reduce((acc, s) => {
    if (!acc[s.category]) acc[s.category] = []
    acc[s.category].push(s)
    return acc
  }, {})

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : 'Present'

  return (
    <>
      <Helmet><title>{`About | ${settings.site_name || 'Portfolio'}`}</title></Helmet>

      <section className="py-32 relative overflow-hidden bg-slate-950">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="container-custom relative z-10">
          {/* Header */}
          <ScrollReveal>
            <div className="mb-24">
              <h1 className="text-5xl md:text-7xl font-bold font-display text-white mb-8">About Me</h1>
              <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full mb-10"></div>
              <div
                className="text-slate-300 text-lg md:text-xl leading-relaxed max-w-4xl font-light prose prose-invert whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: (settings.about_long || settings.about_text || '<p>Tell your story here...</p>') }}
              />
            </div>
          </ScrollReveal>

          {/* Experience Timeline */}
          {experience.length > 0 && (
            <div className="mb-32">
              <ScrollReveal>
                <h2 className="text-3xl font-bold font-display text-white mb-12">Work Experience</h2>
              </ScrollReveal>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-px bg-slate-700" />
                <div className="space-y-8">
                  {experience.map((exp, i) => (
                    <ScrollReveal key={exp.id} delay={i * 0.1}>
                      <div className="relative pl-12">
                        <div className="absolute left-2.5 top-1.5 w-3 h-3 rounded-full bg-blue-500 border-2 border-slate-900 ring-4 ring-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                        <TiltCard>
                          <div className="card p-8 border-slate-800/80 bg-slate-900/60 backdrop-blur-xl hover:bg-slate-800/80 transition-all shadow-2xl border border-white/5">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                          <div>
                            <h3 className="text-white font-semibold text-lg">{exp.position}</h3>
                            <p className="text-blue-400 font-medium">{exp.company}</p>
                            {exp.location && <p className="text-slate-500 text-sm">{exp.location}</p>}
                          </div>
                          <span className="text-slate-500 text-sm whitespace-nowrap font-mono">
                            {formatDate(exp.start_date)} — {exp.is_current ? 'Present' : formatDate(exp.end_date)}
                          </span>
                        </div>
                        {exp.description && <p className="text-slate-400 text-sm mb-3">{exp.description}</p>}
                        {exp.achievements?.length > 0 && (
                          <ul className="space-y-1 mb-3">
                            {exp.achievements.map((a, ai) => (
                              <li key={ai} className="text-slate-400 text-sm flex gap-2">
                                <span className="text-emerald-400 mt-0.5">▸</span> {a}
                              </li>
                            ))}
                          </ul>
                        )}
                        {exp.tech_stack?.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {exp.tech_stack.map(t => <span key={t} className="tech-tag text-xs">{t}</span>)}
                          </div>
                        )}
                          </div>
                        </TiltCard>
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Skills */}
          {Object.keys(grouped).length > 0 && (
            <div className="mb-20">
              <ScrollReveal>
                <h2 className="text-3xl font-bold font-display text-white mb-12">Technical Skills</h2>
              </ScrollReveal>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(grouped).map(([cat, items], ci) => (
                  <ScrollReveal key={cat} delay={ci * 0.1}>
                    <TiltCard>
                      <div className="card p-8 border-slate-800/80 bg-slate-900/60 backdrop-blur-xl h-full shadow-xl border border-white/5">
                    <h3 className="text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3">{cat}</h3>
                    <div className="flex flex-wrap gap-2">
                      {items.map(s => (
                        <span key={s.id} className="tech-tag text-xs">{s.name}</span>
                      ))}
                    </div>
                      </div>
                    </TiltCard>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
