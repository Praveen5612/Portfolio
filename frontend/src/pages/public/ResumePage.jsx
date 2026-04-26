import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { ArrowDownTrayIcon, DocumentTextIcon, EyeIcon } from '@heroicons/react/24/outline'
import { resumeApi } from '../../services/resume.api.js'
import { experienceApi } from '../../services/experience.api.js'
import { skillsApi } from '../../services/skills.api.js'
import { useSettings } from '../../context/SettingsContext.jsx'
import { getVisitorId, getSessionId, trackEvent } from '../../utils/analytics.js'
import toast from 'react-hot-toast'

export default function ResumePage() {
  const { settings } = useSettings()
  const [resume, setResume] = useState(null)
  const [experience, setExperience] = useState([])
  const [skills, setSkills] = useState([])

  useEffect(() => {
    resumeApi.getActive().then(r => setResume(r.data)).catch(() => {})
    experienceApi.getAll().then(r => setExperience(r.data || [])).catch(() => {})
    skillsApi.getAll().then(r => setSkills(r.data || [])).catch(() => {})
  }, [])

  const handleDownload = async () => {
    if (!resume) return toast.error('No resume available')
    try {
      await resumeApi.download(resume.id, { visitor_id: getVisitorId(), session_id: getSessionId() })
      const link = document.createElement('a')
      link.href = `${import.meta.env.VITE_API_URL}${resume.file_path}`
      link.download = resume.file_name
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      trackEvent('resume_download', { resume_id: resume.id })
      toast.success('Download started!')
    } catch { toast.error('Download failed') }
  }

  const grouped = skills.reduce((acc, s) => { if (!acc[s.category]) acc[s.category] = []; acc[s.category].push(s); return acc }, {})
  const fmtDate = d => d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : 'Present'

  return (
    <>
      <Helmet><title>{`Resume | ${settings.site_name || 'Portfolio'}`}</title></Helmet>
      <section className="py-20">
        <div className="container-custom max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-12">
            <div>
              <h1 className="section-title mb-2">Resume</h1>
              <p className="text-slate-400">My professional experience and skills</p>
            </div>
            {resume && (
              <div className="flex gap-3">
                <a 
                  href={`${import.meta.env.VITE_API_URL}${resume.file_path}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="btn-secondary"
                  onClick={() => trackEvent('resume_view', { resume_id: resume.id })}
                >
                  <EyeIcon className="w-5 h-5" />
                  View PDF
                </a>
                <button onClick={handleDownload} className="btn-primary">
                  <ArrowDownTrayIcon className="w-5 h-5" />
                  Download PDF
                </button>
              </div>
            )}
          </motion.div>

          {!resume && (
            <div className="card p-8 text-center mb-8">
              <DocumentTextIcon className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-500">Resume will be available soon</p>
            </div>
          )}

          {experience.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-12">
              <h2 className="text-xl font-bold text-white mb-6 pb-3 border-b border-slate-700">Experience</h2>
              <div className="space-y-6">
                {experience.map(exp => (
                  <div key={exp.id} className="card p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                      <div>
                        <h3 className="text-white font-semibold">{exp.position}</h3>
                        <p className="text-blue-400">{exp.company} {exp.location && <span className="text-slate-500">— {exp.location}</span>}</p>
                      </div>
                      <span className="text-slate-500 text-sm font-mono">{fmtDate(exp.start_date)} – {exp.is_current ? 'Present' : fmtDate(exp.end_date)}</span>
                    </div>
                    {exp.description && <p className="text-slate-400 text-sm mb-3">{exp.description}</p>}
                    {exp.achievements?.length > 0 && (
                      <ul className="space-y-1">
                        {exp.achievements.map((a, i) => (
                          <li key={i} className="text-slate-400 text-sm flex gap-2"><span className="text-emerald-400">▸</span>{a}</li>
                        ))}
                      </ul>
                    )}
                    {exp.tech_stack?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {exp.tech_stack.map(t => <span key={t} className="tech-tag text-xs">{t}</span>)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {Object.keys(grouped).length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <h2 className="text-xl font-bold text-white mb-6 pb-3 border-b border-slate-700">Skills</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {Object.entries(grouped).map(([cat, items]) => (
                  <div key={cat} className="card p-4">
                    <h3 className="text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">{cat}</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {items.map(s => <span key={s.id} className="tech-tag text-xs">{s.name}</span>)}
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
