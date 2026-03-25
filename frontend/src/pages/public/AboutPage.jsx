import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { experienceApi } from '../../services/experience.api.js'
import { skillsApi } from '../../services/skills.api.js'
import { useSettings } from '../../context/SettingsContext.jsx'

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

      <section className="py-20">
        <div className="container-custom">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
            <h1 className="section-title">About Me</h1>
            <div
              className="text-slate-400 text-lg leading-relaxed max-w-3xl prose prose-invert whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: (settings.about_long || settings.about_text || '<p>Tell your story here...</p>') }}
            />
          </motion.div>

          {/* Experience Timeline */}
          {experience.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
              <h2 className="text-2xl font-bold text-white mb-8">Work Experience</h2>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-px bg-slate-700" />
                <div className="space-y-8">
                  {experience.map((exp, i) => (
                    <motion.div
                      key={exp.id}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="relative pl-12"
                    >
                      <div className="absolute left-2.5 top-1.5 w-3 h-3 rounded-full bg-blue-500 border-2 border-slate-900 ring-2 ring-blue-500/30" />
                      <div className="card p-6">
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
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Skills */}
          {Object.keys(grouped).length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-2xl font-bold text-white mb-8">Technical Skills</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(grouped).map(([cat, items]) => (
                  <div key={cat} className="card p-5">
                    <h3 className="text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3">{cat}</h3>
                    <div className="flex flex-wrap gap-2">
                      {items.map(s => (
                        <span key={s.id} className="tech-tag text-xs">{s.name}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </>
  )
}
