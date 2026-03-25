import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { XMarkIcon } from '@heroicons/react/24/outline'
import api from '../../utils/api.js'
import { getVisitorId } from '../../utils/analytics.js'
import toast from 'react-hot-toast'

const POPUP_DISMISSED_KEY = 'pf_popup_dismissed'

export default function LeadPopup({ delay = 25000 }) {
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', message: '', reason: 'hiring' })

  useEffect(() => {
    const dismissed = sessionStorage.getItem(POPUP_DISMISSED_KEY)
    if (dismissed) return
    const timer = setTimeout(() => setShow(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  const dismiss = () => {
    setShow(false)
    sessionStorage.setItem(POPUP_DISMISSED_KEY, '1')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email) return toast.error('Name and email are required')
    setLoading(true)
    try {
      await api.post('/leads', { ...form, visitor_id: getVisitorId(), source: 'popup' })
      setSubmitted(true)
      toast.success('Thanks! I\'ll be in touch soon.')
      setTimeout(dismiss, 3000)
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && dismiss()}
        >
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5">
              <button onClick={dismiss} className="absolute top-4 right-4 text-white/70 hover:text-white">
                <XMarkIcon className="w-5 h-5" />
              </button>
              <div className="text-2xl mb-1">👋</div>
              <h3 className="text-white font-bold text-lg">Let's Work Together</h3>
              <p className="text-blue-100 text-sm mt-1">Looking to hire or collaborate? Drop your details!</p>
            </div>

            <div className="p-6">
              {submitted ? (
                <div className="text-center py-4">
                  <div className="text-4xl mb-3">🎉</div>
                  <h4 className="text-white font-semibold text-lg">Message Received!</h4>
                  <p className="text-slate-400 mt-1 text-sm">I'll reach out to you very soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <input className="input text-sm py-2.5" placeholder="Your Name *" value={form.name} onChange={set('name')} />
                    </div>
                    <div>
                      <input className="input text-sm py-2.5" type="email" placeholder="Email *" value={form.email} onChange={set('email')} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input className="input text-sm py-2.5" placeholder="Phone" value={form.phone} onChange={set('phone')} />
                    <input className="input text-sm py-2.5" placeholder="Company" value={form.company} onChange={set('company')} />
                  </div>
                  <select className="input text-sm py-2.5" value={form.reason} onChange={set('reason')}>
                    <option value="hiring">💼 Hiring / Job Opportunity</option>
                    <option value="freelance">🚀 Freelance Project</option>
                    <option value="project">🤝 Collaboration</option>
                    <option value="other">💬 Other</option>
                  </select>
                  <textarea
                    className="input text-sm py-2.5 resize-none"
                    rows={2}
                    placeholder="Brief message (optional)"
                    value={form.message}
                    onChange={set('message')}
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full justify-center py-2.5 text-sm"
                  >
                    {loading ? 'Sending...' : 'Send Message 🚀'}
                  </button>
                  <p className="text-center text-xs text-slate-500">
                    No spam, ever. I'll only reach out regarding your inquiry.
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
