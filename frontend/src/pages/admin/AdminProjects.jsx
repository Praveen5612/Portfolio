import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import { projectsApi } from '../../services/projects.api.js'

const EMPTY = { title: '', description: '', long_description: '', tech_stack: '', live_url: '', github_url: '', is_featured: false, sort_order: 0, meta_title: '', meta_description: '', status: 'published', is_published: true }

export default function AdminProjects() {
  const [projects, setProjects] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)

  const load = () => projectsApi.getAll({ admin: true }).then(r => setProjects(r.data || [])).catch(() => {})

  useEffect(() => { load() }, [])

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  const openAdd = () => { setEditing(null); setForm(EMPTY); setImages([]); setShowModal(true) }
  const openEdit = (p) => {
    setEditing(p)
    setForm({ ...p, tech_stack: Array.isArray(p.tech_stack) ? p.tech_stack.join(', ') : p.tech_stack || '', is_featured: !!p.is_featured, is_published: !!p.is_published })
    setImages([])
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'tech_stack') fd.append(k, JSON.stringify(v.split(',').map(s => s.trim()).filter(Boolean)))
        else if (k === 'is_featured' || k === 'is_published') fd.append(k, v ? 1 : 0)
        else fd.append(k, v || '')
      })
      images.forEach(img => fd.append('images', img))

      if (editing) {
        await projectsApi.update(editing.id, fd)
        toast.success('Project updated')
      } else {
        await projectsApi.create(fd)
        toast.success('Project created')
      }
      setShowModal(false)
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this project?')) return
    try {
      await projectsApi.delete(id)
      toast.success('Project deleted')
      load()
    } catch { /* Handled */ }
  }

  const togglePublish = async (p) => {
    try {
      await projectsApi.update(p.id, { is_published: p.is_published ? 0 : 1 })
      toast.success(p.is_published ? 'Unpublished' : 'Published')
      load()
    } catch { /* Handled */ }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Projects</h2>
          <p className="text-slate-500 text-sm">{projects.length} projects total</p>
        </div>
        <button onClick={openAdd} className="btn-primary">
          <PlusIcon className="w-4 h-4" /> Add Project
        </button>
      </div>

      <div className="card overflow-hidden">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Project</th>
              <th>Tech Stack</th>
              <th>Status</th>
              <th>Featured</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map(p => (
              <tr key={p.id}>
                <td>
                  <div className="flex items-center gap-3">
                    {p.thumbnail && (
                      <img src={`${import.meta.env.VITE_API_URL}${p.thumbnail}`} alt="" className="w-10 h-10 rounded-lg object-cover bg-slate-700" />
                    )}
                    <div>
                      <p className="text-white font-medium">{p.title}</p>
                      <p className="text-slate-500 text-xs line-clamp-1 max-w-xs">{p.description}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="flex flex-wrap gap-1">
                    {(p.tech_stack || []).slice(0, 3).map(t => <span key={t} className="tech-tag text-xs py-0.5">{t}</span>)}
                    {(p.tech_stack || []).length > 3 && <span className="text-slate-500 text-xs">+{p.tech_stack.length - 3}</span>}
                  </div>
                </td>
                <td>
                  <span className={p.status === 'published' ? 'badge-green' : 'badge-gray'}>{p.status}</span>
                </td>
                <td>
                  <span className={p.is_featured ? 'badge-yellow' : 'badge-gray'}>{p.is_featured ? 'Yes' : 'No'}</span>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <button onClick={() => togglePublish(p)} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700" title={p.is_published ? 'Unpublish' : 'Publish'}>
                      {p.is_published ? <EyeIcon className="w-4 h-4" /> : <EyeSlashIcon className="w-4 h-4" />}
                    </button>
                    <button onClick={() => openEdit(p)} className="p-1.5 text-slate-400 hover:text-blue-400 rounded-lg hover:bg-slate-700">
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(p.id)} className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-700">
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {projects.length === 0 && (
              <tr><td colSpan={5} className="text-center py-8 text-slate-500">No projects yet. Add your first project!</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-slate-700 flex items-center justify-between">
              <h3 className="text-white font-semibold text-lg">{editing ? 'Edit Project' : 'Add Project'}</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white text-2xl leading-none">×</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="label">Title *</label>
                  <input className="input" value={form.title} onChange={set('title')} required />
                </div>
                <div className="sm:col-span-2">
                  <label className="label">Short Description</label>
                  <textarea className="input resize-none" rows={2} value={form.description} onChange={set('description')} />
                </div>
                <div className="sm:col-span-2">
                  <label className="label">Long Description</label>
                  <textarea className="input resize-none" rows={3} value={form.long_description} onChange={set('long_description')} />
                </div>
                <div className="sm:col-span-2">
                  <label className="label">Tech Stack (comma separated)</label>
                  <input className="input" placeholder="React, Node.js, MySQL, Tailwind" value={form.tech_stack} onChange={set('tech_stack')} />
                </div>
                <div>
                  <label className="label">Live URL</label>
                  <input className="input" type="url" value={form.live_url} onChange={set('live_url')} />
                </div>
                <div>
                  <label className="label">GitHub URL</label>
                  <input className="input" type="url" value={form.github_url} onChange={set('github_url')} />
                </div>
                <div>
                  <label className="label">Status</label>
                  <select className="input" value={form.status} onChange={set('status')}>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                <div>
                  <label className="label">Sort Order</label>
                  <input className="input" type="number" value={form.sort_order} onChange={set('sort_order')} />
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" id="featured" checked={form.is_featured} onChange={set('is_featured')} className="w-4 h-4 accent-blue-500" />
                  <label htmlFor="featured" className="text-slate-300 text-sm">Featured project</label>
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" id="published" checked={form.is_published} onChange={set('is_published')} className="w-4 h-4 accent-blue-500" />
                  <label htmlFor="published" className="text-slate-300 text-sm">Published (visible)</label>
                </div>
                <div className="sm:col-span-2">
                  <label className="label">Images</label>
                  <input type="file" multiple accept="image/*" onChange={e => setImages(Array.from(e.target.files))} className="input py-2" />
                  {images.length > 0 && <p className="text-slate-500 text-xs mt-1">{images.length} file(s) selected</p>}
                </div>
                <div>
                  <label className="label">Meta Title</label>
                  <input className="input" value={form.meta_title} onChange={set('meta_title')} />
                </div>
                <div>
                  <label className="label">Meta Description</label>
                  <input className="input" value={form.meta_description} onChange={set('meta_description')} />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1 justify-center">Cancel</button>
                <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center">
                  {loading ? 'Saving...' : editing ? 'Update Project' : 'Create Project'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
