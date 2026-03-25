import { useEffect, useState } from 'react'
import { ArrowUpTrayIcon, TrashIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import { resumeApi } from '../../services/resume.api.js'
import { uploadApi } from '../../services/upload.api.js'

export default function AdminResume() {
  const [resumes, setResumes] = useState([])
  const [file, setFile] = useState(null)
  const [version, setVersion] = useState('')
  const [uploading, setUploading] = useState(false)

  const load = () => resumeApi.getAll({ admin: true }).then(r => setResumes(r.data || [])).catch(() => {})
  useEffect(() => { load() }, [])

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!file) return toast.error('Select a PDF file')
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('resume', file)
      fd.append('version', version || '1.0')
      await uploadApi.uploadResume(fd)
      toast.success('Resume uploaded!')
      setFile(null); setVersion('')
      document.getElementById('resume-file').value = ''
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed')
    } finally { setUploading(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this resume?')) return
    try { await resumeApi.delete(id); toast.success('Deleted'); load() }
    catch { /* Global interceptor handles toast */ }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Resume Management</h2>
        <p className="text-slate-500 text-sm">Upload and manage resume files</p>
      </div>

      {/* Upload Form */}
      <div className="card p-6">
        <h3 className="text-white font-semibold mb-4">Upload New Resume</h3>
        <form onSubmit={handleUpload} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">PDF File *</label>
              <input
                id="resume-file"
                type="file"
                accept=".pdf"
                onChange={e => setFile(e.target.files[0])}
                className="input py-2 text-sm"
              />
              {file && <p className="text-slate-500 text-xs mt-1">{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</p>}
            </div>
            <div>
              <label className="label">Version</label>
              <input className="input" placeholder="e.g. 2.0, Jan 2025" value={version} onChange={e => setVersion(e.target.value)} />
            </div>
          </div>
          <button type="submit" disabled={uploading} className="btn-primary">
            <ArrowUpTrayIcon className="w-4 h-4" />
            {uploading ? 'Uploading...' : 'Upload Resume'}
          </button>
        </form>
      </div>

      {/* Resume List */}
      <div className="card overflow-hidden">
        <div className="p-4 border-b border-slate-700">
          <h3 className="text-white font-semibold">All Resumes</h3>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>File</th>
              <th>Version</th>
              <th>Downloads</th>
              <th>Active</th>
              <th>Uploaded</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {resumes.map(r => (
              <tr key={r.id}>
                <td>
                  <a href={`${import.meta.env.VITE_API_URL}${r.file_path}`} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300 text-sm">
                    {r.file_name}
                  </a>
                  {r.file_size && <p className="text-slate-600 text-xs">{(r.file_size / 1024).toFixed(0)} KB</p>}
                </td>
                <td><span className="badge-gray">{r.version}</span></td>
                <td><span className="badge-blue">{r.download_count}</span></td>
                <td>
                  {r.is_active ? (
                    <span className="flex items-center gap-1 text-emerald-400 text-xs"><CheckCircleIcon className="w-4 h-4" /> Active</span>
                  ) : (
                    <span className="text-slate-600 text-xs">Inactive</span>
                  )}
                </td>
                <td><span className="text-slate-500 text-xs">{new Date(r.created_at).toLocaleDateString()}</span></td>
                <td>
                  <button onClick={() => handleDelete(r.id)} className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg">
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {resumes.length === 0 && (
              <tr><td colSpan={6} className="text-center py-8 text-slate-500">No resumes uploaded yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
