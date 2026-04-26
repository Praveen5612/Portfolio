import { useEffect, useState } from 'react'
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { experienceApi } from '../../services/experience.api.js'

const EMPTY = { company: '', position: '', location: '', start_date: '', end_date: '', is_current: false, description: '', achievements: '', tech_stack: '', sort_order: 0, is_published: true, status: 'active' }

export default function AdminExperience() {
  const [items, setItems] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [loading, setLoading] = useState(false)

  const load = () => experienceApi.getAll({ admin: true }).then(r => setItems(r.data || [])).catch(() => { })
  useEffect(() => { load() }, [])
  useEffect(() => {
    if (!showModal) return
    const prevBody = document.body.style.overflow
    const prevHtml = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prevBody
      document.documentElement.style.overflow = prevHtml
    }
  }, [showModal])

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  const openAdd = () => { setEditing(null); setForm(EMPTY); setShowModal(true) }
  const openEdit = (item) => {
    setEditing(item)
    setForm({
      ...item,
      achievements: Array.isArray(item.achievements) ? item.achievements.join('\n') : '',
      tech_stack: Array.isArray(item.tech_stack) ? item.tech_stack.join(', ') : '',
      start_date: item.start_date ? item.start_date.split('T')[0] : '',
      end_date: item.end_date ? item.end_date.split('T')[0] : '',
      is_current: !!item.is_current, is_published: !!item.is_published
    })
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = {
        ...form,
        achievements: form.achievements ? form.achievements.split('\n').map(s => s.trim()).filter(Boolean) : [],
        tech_stack: form.tech_stack ? form.tech_stack.split(',').map(s => s.trim()).filter(Boolean) : [],
        is_current: form.is_current ? 1 : 0,
        is_published: form.is_published ? 1 : 0,
        end_date: form.is_current ? null : form.end_date || null,
      }
      if (editing) await experienceApi.update(editing.id, payload)
      else await experienceApi.create(payload)
      toast.success(editing ? 'Updated' : 'Created')
      setShowModal(false); load()
    } catch (err) { /* Handled */ }
    finally { setLoading(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this experience?')) return
    try { await experienceApi.delete(id); toast.success('Deleted'); load() }
    catch { /* Handled */ }
  }

  const fmtDate = d => d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : 'Present'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Experience</h2>
          <p className="text-slate-500 text-sm">{items.length} entries</p>
        </div>
        <button onClick={openAdd} className="btn-primary"><PlusIcon className="w-4 h-4" /> Add Experience</button>
      </div>

      <div className="space-y-4">
        {items.map(item => (
          <div key={item.id} className="card p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold">{item.position}</h3>
                <p className="text-blue-400 text-sm">{item.company} {item.location && <span className="text-slate-500">· {item.location}</span>}</p>
                <p className="text-slate-500 text-xs font-mono mt-0.5">{fmtDate(item.start_date)} – {item.is_current ? 'Present' : fmtDate(item.end_date)}</p>
                {item.description && <p className="text-slate-400 text-sm mt-2 line-clamp-2">{item.description}</p>}
                {item.tech_stack?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {item.tech_stack.slice(0, 5).map(t => <span key={t} className="tech-tag text-xs">{t}</span>)}
                  </div>
                )}
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => openEdit(item)} className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-700 rounded-lg"><PencilIcon className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg"><TrashIcon className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && <div className="card p-12 text-center text-slate-500">No experience yet.</div>}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto overscroll-contain" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-h-[calc(100dvh-2rem)] sm:max-h-[90vh] flex flex-col my-auto">
            <div className="p-5 border-b border-slate-700 flex items-center justify-between">
              <h3 className="text-white font-semibold">{editing ? 'Edit Experience' : 'Add Experience'}</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white text-2xl">×</button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 overflow-y-auto flex-1 min-h-0 space-y-4 overscroll-contain">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Company *</label>
                  <input className="input" value={form.company} onChange={set('company')} required />
                </div>
                <div>
                  <label className="label">Position *</label>
                  <input className="input" value={form.position} onChange={set('position')} required />
                </div>
                <div>
                  <label className="label">Location</label>
                  <input className="input" value={form.location} onChange={set('location')} />
                </div>
                <div>
                  <label className="label">Start Date</label>
                  <input className="input" type="date" value={form.start_date} onChange={set('start_date')} />
                </div>
                <div>
                  <label className="label">End Date</label>
                  <input className="input" type="date" value={form.end_date} onChange={set('end_date')} disabled={form.is_current} />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input type="checkbox" id="current" checked={form.is_current} onChange={set('is_current')} className="w-4 h-4 accent-blue-500" />
                  <label htmlFor="current" className="text-slate-300 text-sm">Currently working here</label>
                </div>
                <div className="sm:col-span-2">
                  <label className="label">Description</label>
                  <textarea className="input resize-none" rows={2} value={form.description} onChange={set('description')} />
                </div>
                <div className="sm:col-span-2">
                  <label className="label">Achievements (one per line)</label>
                  <textarea className="input resize-none" rows={3} placeholder="Led team of 5 engineers&#10;Reduced load time by 40%&#10;Shipped 3 major features" value={form.achievements} onChange={set('achievements')} />
                </div>
                <div className="sm:col-span-2">
                  <label className="label">Tech Stack (comma separated)</label>
                  <input className="input" value={form.tech_stack} onChange={set('tech_stack')} />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1 justify-center">Cancel</button>
                <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center">{loading ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
