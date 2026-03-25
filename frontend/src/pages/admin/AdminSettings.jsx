import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { settingsApi } from '../../services/settings.api.js'

const TAB_GROUPS = ['general', 'home', 'about', 'contact', 'seo', 'email', 'leads', 'analytics']

export default function AdminSettings() {
  const [settings, setSettings] = useState({})
  const [socialLinks, setSocialLinks] = useState([])
  const [activeTab, setActiveTab] = useState('general')
  const [saving, setSaving] = useState(false)

  const load = async () => {
    const [s, l] = await Promise.all([
      settingsApi.getAll().catch(() => ({ data: {} })),
      settingsApi.getSocialLinks().catch(() => ({ data: [] })),
    ])
    setSettings(s.data || {})
    setSocialLinks(l.data || [])
  }

  useEffect(() => { load() }, [])

  const setVal = (k) => (e) => setSettings(s => ({ ...s, [k]: e.target.value }))

  const handleSave = async () => {
    setSaving(true)
    try {
      await settingsApi.updateAll(settings)
      toast.success('Settings saved!')
    } catch { /* Global interceptor handles toast */ }
    finally { setSaving(false) }
  }

  const handleSaveSocial = async () => {
    setSaving(true)
    try {
      await settingsApi.updateSocialLinks({ links: socialLinks })
      toast.success('Social links saved!')
    } catch { /* Global interceptor handles toast */ }
    finally { setSaving(false) }
  }

  const addSocialLink = () => setSocialLinks(l => [...l, { platform: '', url: '', icon: '', sort_order: l.length, is_active: true }])
  const removeSocialLink = (i) => setSocialLinks(l => l.filter((_, idx) => idx !== i))
  const setSocial = (i, k) => (e) => setSocialLinks(l => l.map((item, idx) => idx === i ? { ...item, [k]: e.target.value } : item))

  const F = ({ label, k, type = 'text', placeholder = '' }) => (
    <div>
      <label className="label">{label}</label>
      {type === 'textarea' ? (
        <textarea className="input resize-none" rows={4} value={settings[k] || ''} onChange={setVal(k)} placeholder={placeholder} />
      ) : (
        <input className="input" type={type} value={settings[k] || ''} onChange={setVal(k)} placeholder={placeholder} />
      )}
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Settings</h2>
          <p className="text-slate-500 text-sm">Configure your portfolio</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-primary">
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 flex-wrap border-b border-slate-700 pb-0">
        {TAB_GROUPS.map(t => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-4 py-2 text-sm font-medium capitalize rounded-t-lg transition-all ${
              activeTab === t
                ? 'bg-slate-800 text-white border-b-2 border-blue-500'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t}
          </button>
        ))}
        <button
          onClick={() => setActiveTab('social')}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all ${activeTab === 'social' ? 'bg-slate-800 text-white border-b-2 border-blue-500' : 'text-slate-400 hover:text-white'}`}
        >
          Social Links
        </button>
      </div>

      <div className="card p-6">
        {activeTab === 'general' && (
          <div className="grid sm:grid-cols-2 gap-5">
            <F label="Site Name" k="site_name" placeholder="My Portfolio" />
            <F label="Tagline" k="site_tagline" placeholder="Full Stack Developer" />
            <div className="sm:col-span-2">
              <F label="Resume URL" k="resume_url" placeholder="/resume" />
            </div>
          </div>
        )}

        {activeTab === 'home' && (
          <div className="space-y-5">
            <F label="Hero Title (HTML allowed)" k="hero_title" placeholder="Hi, I'm <span>Your Name</span>" />
            <F label="Hero Subtitle" k="hero_subtitle" placeholder="Full Stack Developer & UI/UX Enthusiast" />
            <F label="Hero Description" k="hero_description" type="textarea" />
          </div>
        )}

        {activeTab === 'about' && (
          <div className="space-y-5">
            <div>
              <label className="label">About Text (HTML)</label>
              <textarea
                className="input resize-none font-mono text-sm"
                rows={10}
                value={settings.about_text || ''}
                onChange={setVal('about_text')}
                placeholder="<p>Tell your story here...</p>"
              />
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="grid sm:grid-cols-2 gap-5">
            <F label="Contact Email" k="contact_email" type="email" />
            <F label="Contact Phone" k="contact_phone" placeholder="+1 234 567 8900" />
            <div className="sm:col-span-2">
              <F label="Location" k="contact_location" placeholder="Your City, Country" />
            </div>
          </div>
        )}

        {activeTab === 'seo' && (
          <div className="space-y-5">
            <F label="Meta Title" k="meta_title" />
            <F label="Meta Description" k="meta_description" type="textarea" />
            <F label="Meta Keywords" k="meta_keywords" placeholder="developer, portfolio, react, nodejs" />
            <F label="OG Image URL" k="og_image" placeholder="https://yoursite.com/og.jpg" />
          </div>
        )}

        {activeTab === 'email' && (
          <div className="space-y-5">
            <div>
              <label className="label">Auto-reply Enabled</label>
              <select className="input" value={settings.auto_reply_enabled || '1'} onChange={setVal('auto_reply_enabled')}>
                <option value="1">Yes — Send auto-reply to visitors</option>
                <option value="0">No — Disable auto-reply</option>
              </select>
            </div>
          </div>
        )}

        {activeTab === 'leads' && (
          <div className="space-y-5">
            <div>
              <label className="label">Lead Popup Delay (ms)</label>
              <input className="input" type="number" value={settings.lead_popup_delay || '25000'} onChange={setVal('lead_popup_delay')} />
              <p className="text-slate-500 text-xs mt-1">Default: 25000 (25 seconds). Set to 0 to disable.</p>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-5">
            <F label="Google Analytics ID" k="google_analytics_id" placeholder="G-XXXXXXXXXX" />
          </div>
        )}

        {activeTab === 'social' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white font-medium">Social Links</h3>
              <div className="flex gap-2">
                <button onClick={addSocialLink} className="btn-secondary py-1.5 px-3 text-sm">+ Add Link</button>
                <button onClick={handleSaveSocial} disabled={saving} className="btn-primary py-1.5 px-3 text-sm">
                  {saving ? 'Saving...' : 'Save Links'}
                </button>
              </div>
            </div>

            {socialLinks.map((link, i) => (
              <div key={i} className="grid grid-cols-12 gap-3 items-center">
                <div className="col-span-3">
                  <input className="input text-sm py-2" placeholder="Platform" value={link.platform} onChange={setSocial(i, 'platform')} />
                </div>
                <div className="col-span-4">
                  <input className="input text-sm py-2" placeholder="URL" value={link.url} onChange={setSocial(i, 'url')} />
                </div>
                <div className="col-span-3">
                  <input className="input text-sm py-2" placeholder="Icon (github, linkedin...)" value={link.icon} onChange={setSocial(i, 'icon')} />
                </div>
                <div className="col-span-2 flex items-center justify-end gap-2">
                  <input type="checkbox" checked={link.is_active !== false} onChange={e => setSocialLinks(l => l.map((item, idx) => idx === i ? { ...item, is_active: e.target.checked } : item))} className="w-4 h-4 accent-blue-500" title="Active" />
                  <button onClick={() => removeSocialLink(i)} className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg">×</button>
                </div>
              </div>
            ))}

            {socialLinks.length === 0 && (
              <p className="text-slate-500 text-sm text-center py-4">No social links. Click "Add Link" to add one.</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
