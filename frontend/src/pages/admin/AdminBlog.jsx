import { useEffect, useState } from 'react'
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { blogsApi } from '../../services/blogs.api.js'

const EMPTY = { title: '', excerpt: '', content: '', tags: '', is_published: false, meta_title: '', meta_description: '' }

export default function AdminBlog() {
  const [posts, setPosts] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [thumbnail, setThumbnail] = useState(null)
  const [loading, setLoading] = useState(false)

  const load = () => blogsApi.getAll({ admin: true }).then(r => setPosts(r.data || [])).catch(() => {})
  useEffect(() => { load() }, [])

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  const openAdd = () => { setEditing(null); setForm(EMPTY); setThumbnail(null); setShowModal(true) }
  const openEdit = (p) => {
    setEditing(p)
    setForm({ ...p, tags: Array.isArray(p.tags) ? p.tags.join(', ') : '', is_published: !!p.is_published })
    setThumbnail(null)
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'tags') fd.append(k, JSON.stringify(v.split(',').map(s => s.trim()).filter(Boolean)))
        else if (k === 'is_published') fd.append(k, v ? '1' : '0')
        else fd.append(k, v || '')
      })
      if (thumbnail) fd.append('thumbnail', thumbnail)

      if (editing) await blogsApi.update(editing.id, fd)
      else await blogsApi.create(fd)

      toast.success(editing ? 'Post updated' : 'Post created')
      setShowModal(false); load()
    } catch (err) { toast.error(err.response?.data?.message || 'Error') }
    finally { setLoading(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this post?')) return
    try { await blogsApi.delete(id); toast.success('Deleted'); load() }
    catch { /* Handled */ }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Blog</h2>
          <p className="text-slate-500 text-sm">{posts.length} posts</p>
        </div>
        <button onClick={openAdd} className="btn-primary"><PlusIcon className="w-4 h-4" /> New Post</button>
      </div>

      <div className="card overflow-hidden">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Views</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map(p => (
              <tr key={p.id}>
                <td>
                  <div className="flex items-center gap-3">
                    {p.thumbnail && <img src={`${import.meta.env.VITE_API_URL}${p.thumbnail}`} alt="" className="w-10 h-8 rounded object-cover bg-slate-700" />}
                    <div>
                      <p className="text-white text-sm font-medium line-clamp-1">{p.title}</p>
                      <div className="flex gap-1 mt-0.5">
                        {(p.tags || []).slice(0, 2).map(t => <span key={t} className="badge-blue text-xs">{t}</span>)}
                      </div>
                    </div>
                  </div>
                </td>
                <td><span className={p.status === 'published' ? 'badge-green' : 'badge-gray'}>{p.status}</span></td>
                <td><span className="text-slate-400 text-sm">{p.views}</span></td>
                <td><span className="text-slate-500 text-xs">{new Date(p.created_at).toLocaleDateString()}</span></td>
                <td>
                  <div className="flex gap-2">
                    {p.is_published && (
                      <a href={`/blog/${p.slug}`} target="_blank" rel="noreferrer" className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-700 rounded-lg">
                        <EyeIcon className="w-4 h-4" />
                      </a>
                    )}
                    <button onClick={() => openEdit(p)} className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-slate-700 rounded-lg">
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(p.id)} className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg">
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {posts.length === 0 && <tr><td colSpan={5} className="text-center py-8 text-slate-500">No posts yet</td></tr>}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-slate-700 flex items-center justify-between">
              <h3 className="text-white font-semibold">{editing ? 'Edit Post' : 'New Post'}</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white text-2xl">×</button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4">
              <div>
                <label className="label">Title *</label>
                <input className="input" value={form.title} onChange={set('title')} required />
              </div>
              <div>
                <label className="label">Excerpt</label>
                <textarea className="input resize-none" rows={2} value={form.excerpt} onChange={set('excerpt')} />
              </div>
              <div>
                <label className="label">Content (HTML supported)</label>
                <textarea className="input resize-none font-mono text-sm" rows={8} value={form.content} onChange={set('content')} placeholder="<p>Write your content here...</p>" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Tags (comma separated)</label>
                  <input className="input" value={form.tags} onChange={set('tags')} placeholder="React, JavaScript, Web Dev" />
                </div>
                <div>
                  <label className="label">Thumbnail</label>
                  <input type="file" accept="image/*" onChange={e => setThumbnail(e.target.files[0])} className="input py-2 text-sm" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="bpub" checked={form.is_published} onChange={set('is_published')} className="w-4 h-4 accent-blue-500" />
                <label htmlFor="bpub" className="text-slate-300 text-sm">Publish immediately</label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1 justify-center">Cancel</button>
                <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center">{loading ? 'Saving...' : editing ? 'Update' : 'Publish'}</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
