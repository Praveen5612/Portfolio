import { useState } from 'react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { EnvelopeIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import { contactApi } from '../../services/contact.api.js'
import { useSettings } from '../../context/SettingsContext.jsx'
import { getVisitorId } from '../../utils/analytics.js'

export default function ContactPage() {
  const { settings } = useSettings()
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return toast.error('Please fill required fields')
    setLoading(true)
    try {
      await contactApi.create({ ...form, visitor_id: getVisitorId() })
      setSent(true)
      toast.success('Message sent! I\'ll reply within 24 hours.')
    } catch (err) {
      // Global interceptor handles the toast now
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Helmet><title>{`Contact | ${settings.site_name || 'Portfolio'}`}</title></Helmet>

      <section className="py-20">
        <div className="container-custom">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
            <h1 className="section-title">Get In Touch</h1>
            <p className="section-subtitle">Have a project in mind? Let's talk about it.</p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="space-y-6">
              <h2 className="text-xl font-semibold text-white">Contact Information</h2>

              {settings.contact_email && (
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center shrink-0">
                    <EnvelopeIcon className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-slate-500 text-sm mb-1">Email</p>
                    <a href={`mailto:${settings.contact_email}`} className="text-white hover:text-blue-400 transition-colors">
                      {settings.contact_email}
                    </a>
                  </div>
                </div>
              )}

              {settings.contact_phone && (
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
                    <PhoneIcon className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-slate-500 text-sm mb-1">Phone</p>
                    <a href={`tel:${settings.contact_phone}`} className="text-white hover:text-emerald-400 transition-colors">
                      {settings.contact_phone}
                    </a>
                  </div>
                </div>
              )}

              {settings.contact_location && (
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center shrink-0">
                    <MapPinIcon className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-slate-500 text-sm mb-1">Location</p>
                    <p className="text-white">{settings.contact_location}</p>
                  </div>
                </div>
              )}

              <div className="card p-5 mt-8">
                <p className="text-slate-400 text-sm leading-relaxed">
                  I typically respond within <span className="text-emerald-400 font-semibold">24 hours</span>. 
                  For urgent matters, please reach out via phone or LinkedIn.
                </p>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-2">
              {sent ? (
                <div className="card p-12 text-center">
                  <div className="text-6xl mb-4">🎉</div>
                  <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                  <p className="text-slate-400 mb-6">Thanks for reaching out. I'll get back to you within 24 hours.</p>
                  <button onClick={() => setSent(false)} className="btn-secondary">Send Another Message</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="card p-8 space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="label">Name <span className="text-red-400">*</span></label>
                      <input className="input" placeholder="Your full name" value={form.name} onChange={set('name')} />
                    </div>
                    <div>
                      <label className="label">Email <span className="text-red-400">*</span></label>
                      <input className="input" type="email" placeholder="your@email.com" value={form.email} onChange={set('email')} />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="label">Phone</label>
                      <input className="input" placeholder="+1 234 567 8900" value={form.phone} onChange={set('phone')} />
                    </div>
                    <div>
                      <label className="label">Subject</label>
                      <input className="input" placeholder="What's this about?" value={form.subject} onChange={set('subject')} />
                    </div>
                  </div>
                  <div>
                    <label className="label">Message <span className="text-red-400">*</span></label>
                    <textarea className="input resize-none" rows={6} placeholder="Tell me about your project..." value={form.message} onChange={set('message')} />
                  </div>
                  <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-4 text-base">
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending...
                      </span>
                    ) : '🚀 Send Message'}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}
