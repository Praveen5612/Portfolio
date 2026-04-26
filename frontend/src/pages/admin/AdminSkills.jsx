import { useEffect, useState } from 'react'
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { skillsApi } from '../../services/skills.api.js'

const EMPTY = { name: '', category: '', proficiency: 80, icon: '', sort_order: 0, is_active: true }

export default function AdminSkills() {
  const [skills, setSkills] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [loading, setLoading] = useState(false)

  const load = () => skillsApi.getAll({ admin: true }).then(r => setSkills(r.data || [])).catch(() => { })
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

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.type === 'number' ? Number(e.target.value) : e.target.value }))

  const openAdd = () => { setEditing(null); setForm(EMPTY); setShowModal(true) }
  const openEdit = (s) => { setEditing(s); setForm({ ...s, is_active: !!s.is_active }); setShowModal(true) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = { ...form, is_active: form.is_active ? 1 : 0 }
      if (editing) {
        await skillsApi.update(editing.id, payload)
        toast.success('Skill updated')
      } else {
        await skillsApi.create(payload)
        toast.success('Skill added')
      }
      setShowModal(false); load()
    } catch (err) { toast.error(err.response?.data?.message || 'Error') }
    finally { setLoading(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this skill?')) return
    try { await skillsApi.delete(id); toast.success('Deleted'); load() }
    catch { /* Global interceptor handles toast */ }
  }

  const categories = [...new Set(skills.map(s => s.category).filter(Boolean))]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Skills</h2>
          <p className="text-slate-500 text-sm">{skills.length} skills across {categories.length} categories</p>
        </div>
        <button onClick={openAdd} className="btn-primary"><PlusIcon className="w-4 h-4" /> Add Skill</button>
      </div>

      <div className="grid gap-4">
        {categories.map(cat => (
          <div key={cat} className="card p-5">
            <h3 className="text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3">{cat}</h3>
            <div className="space-y-2">
              {skills.filter(s => s.category === cat).map(skill => (
                <div key={skill.id} className="flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-slate-300 text-sm">{skill.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500 text-xs font-mono">{skill.proficiency}%</span>
                        <button onClick={() => openEdit(skill)} className="p-1 text-slate-400 hover:text-blue-400"><PencilIcon className="w-3.5 h-3.5" /></button>
                        <button onClick={() => handleDelete(skill.id)} className="p-1 text-slate-400 hover:text-red-400"><TrashIcon className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                    <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full" style={{ width: `${skill.proficiency}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Uncategorized */}
        {skills.filter(s => !s.category).length > 0 && (
          <div className="card p-5">
            <h3 className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-3">Uncategorized</h3>
            <div className="flex flex-wrap gap-2">
              {skills.filter(s => !s.category).map(skill => (
                <div key={skill.id} className="flex items-center gap-2 tech-tag">
                  <span>{skill.name}</span>
                  <button onClick={() => openEdit(skill)} className="text-slate-500 hover:text-blue-400"><PencilIcon className="w-3 h-3" /></button>
                  <button onClick={() => handleDelete(skill.id)} className="text-slate-500 hover:text-red-400"><TrashIcon className="w-3 h-3" /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {skills.length === 0 && (
          <div className="card p-12 text-center text-slate-500">No skills added yet. Add your first skill!</div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto overscroll-contain" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-h-[calc(100dvh-2rem)] sm:max-h-[90vh] flex flex-col my-auto">
            <div className="p-5 border-b border-slate-700 flex items-center justify-between">
              <h3 className="text-white font-semibold">{editing ? 'Edit Skill' : 'Add Skill'}</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white text-2xl">×</button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 overflow-y-auto flex-1 min-h-0 space-y-4 overscroll-contain">
              <div>
                <label className="label">Skill Name *</label>
                <input className="input" value={form.name} onChange={set('name')} required />
              </div>
              <div>
                <label className="label">Category</label>
                <input className="input" placeholder="Frontend, Backend, DevOps..." value={form.category} onChange={set('category')} list="cats" />
                <datalist id="cats">{categories.map(c => <option key={c} value={c} />)}</datalist>
              </div>
              <div>
                <label className="label">Proficiency: {form.proficiency}%</label>
                <input type="range" min={0} max={100} className="w-full accent-blue-500" value={form.proficiency} onChange={set('proficiency')} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Sort Order</label>
                  <input className="input" type="number" value={form.sort_order} onChange={set('sort_order')} />
                </div>
                <div>
                  <label className="label">Status</label>
                  <select className="input" value={form.is_active ? 'active' : 'inactive'} onChange={(e) => setForm(f => ({ ...f, is_active: e.target.value === 'active' }))}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1 justify-center">Cancel</button>
                <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center">{loading ? 'Saving...' : 'Save Skill'}</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
