import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { authApi } from '../../services/auth.api.js'
import { uploadApi } from '../../services/upload.api.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { CameraIcon } from '@heroicons/react/24/outline'

function LoginLogsInner() {
  const [logs, setLogs] = useState([])
  useEffect(() => {
    authApi.getLoginLogs().then(r => setLogs(r.data || [])).catch(() => {})
  }, [])
  return (
    <div className="space-y-2">
      {logs.slice(0, 10).map(log => (
        <div key={log.id} className="flex items-center justify-between text-sm py-2 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className={`w-2 h-2 rounded-full ${log.status === 'success' ? 'bg-emerald-400' : 'bg-red-400'}`} />
            <span className="text-slate-300">{log.ip_address}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className={`text-xs ${log.status === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>{log.status}</span>
            <span className="text-slate-600 text-xs">{new Date(log.created_at).toLocaleString()}</span>
          </div>
        </div>
      ))}
      {logs.length === 0 && <p className="text-slate-500 text-sm">No login history</p>}
    </div>
  )
}

export default function AdminProfile() {
  const { admin, updateAdmin } = useAuth()
  const [form, setForm] = useState({ name: admin?.name || '', email: admin?.email || '' })
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [saving, setSaving] = useState(false)
  const [savingPw, setSavingPw] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)

  const setF = k => e => setForm(f => ({ ...f, [k]: e.target.value }))
  const setPw = k => e => setPwForm(f => ({ ...f, [k]: e.target.value }))

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await authApi.updateProfile(form)
      updateAdmin(form)
      toast.success('Profile updated!')
    } catch (err) { /* Handled */ } finally { setSaving(false) }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (pwForm.newPassword !== pwForm.confirmPassword) return toast.error('Passwords do not match')
    if (pwForm.newPassword.length < 8) return toast.error('Password must be at least 8 characters')
    setSavingPw(true)
    try {
      await authApi.updatePassword({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword })
      toast.success('Password changed!')
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) { /* Handled */ } finally { setSavingPw(false) }
  }

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploadingAvatar(true)
    try {
      const fd = new FormData()
      fd.append('avatar', file)
      const res = await uploadApi.uploadProfileImage(fd)
      updateAdmin({ avatar: res.data.path })
      toast.success('Avatar updated!')
    } catch {
      /* Handled */
    } finally { setUploadingAvatar(false) }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-xl font-bold text-white">Profile</h2>
        <p className="text-slate-500 text-sm">Manage your admin account</p>
      </div>
      <div className="card p-6">
        <h3 className="text-white font-semibold mb-4">Profile Photo</h3>
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
              {admin?.avatar ? (
                <img src={`${import.meta.env.VITE_API_URL}${admin.avatar}`} alt="" className="w-full h-full object-cover" />
              ) : admin?.name?.[0]?.toUpperCase()}
            </div>
            <label className="absolute -bottom-1 -right-1 w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors shadow-lg">
              <CameraIcon className="w-3.5 h-3.5 text-white" />
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={uploadingAvatar} />
            </label>
          </div>
          <div>
            <p className="text-white font-medium">{admin?.name}</p>
            <p className="text-slate-500 text-sm">{admin?.email}</p>
            <p className="text-slate-600 text-xs capitalize mt-0.5">{admin?.role?.replace('_', ' ')}</p>
            {uploadingAvatar && <p className="text-blue-400 text-xs mt-1">Uploading...</p>}
          </div>
        </div>
      </div>
      <div className="card p-6">
        <h3 className="text-white font-semibold mb-4">Account Information</h3>
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label className="label">Full Name</label>
            <input className="input" value={form.name} onChange={setF('name')} required />
          </div>
          <div>
            <label className="label">Email Address</label>
            <input className="input" type="email" value={form.email} onChange={setF('email')} required />
          </div>
          <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving...' : 'Save Changes'}</button>
        </form>
      </div>
      <div className="card p-6">
        <h3 className="text-white font-semibold mb-4">Change Password</h3>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="label">Current Password</label>
            <input className="input" type="password" value={pwForm.currentPassword} onChange={setPw('currentPassword')} required />
          </div>
          <div>
            <label className="label">New Password</label>
            <input className="input" type="password" value={pwForm.newPassword} onChange={setPw('newPassword')} required minLength={8} />
          </div>
          <div>
            <label className="label">Confirm New Password</label>
            <input className="input" type="password" value={pwForm.confirmPassword} onChange={setPw('confirmPassword')} required />
          </div>
          <button type="submit" disabled={savingPw} className="btn-primary">{savingPw ? 'Changing...' : 'Change Password'}</button>
        </form>
      </div>
      <div className="card p-6">
        <h3 className="text-white font-semibold mb-4">Recent Login Activity</h3>
        <LoginLogsInner />
      </div>
    </div>
  )
}
