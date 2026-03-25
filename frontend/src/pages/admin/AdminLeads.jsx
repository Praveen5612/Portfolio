import { useEffect, useState } from 'react'
import { TrashIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import { leadsApi } from '../../services/leads.api.js'

const STATUS_COLORS = { new: 'badge-red', contacted: 'badge-yellow', replied: 'badge-green', closed: 'badge-gray' }
const REASON_LABELS = { hiring: '💼 Hiring', freelance: '🚀 Freelance', project: '🤝 Project', other: '💬 Other' }

export default function AdminLeads() {
  const [leads, setLeads] = useState([])
  const [total, setTotal] = useState(0)
  const [filter, setFilter] = useState('')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState(null)
  const [note, setNote] = useState('')

  const load = () => {
    leadsApi.getAll({ page, limit: 20, status: filter })
      .then(r => { setLeads(r.data || []); setTotal(r.meta?.total || 0) })
      .catch(() => {})
  }

  useEffect(() => { load() }, [filter, page])

  const updateStatus = async (id, status) => {
    try { await leadsApi.updateStatus(id, { status }); toast.success('Status updated'); load() }
    catch { /* Handled */ }
  }

  const addNote = async (id) => {
    if (!note.trim()) return
    try { await leadsApi.addNote(id, { note }); toast.success('Note added'); setNote(''); loadDetail(id) }
    catch { /* Handled */ }
  }

  const loadDetail = (id) => leadsApi.getById(id).then(r => setSelected(r.data)).catch(() => {})

  const handleDelete = async (id) => {
    if (!confirm('Delete this lead?')) return
    try { await leadsApi.delete(id); toast.success('Deleted'); load(); if (selected?.id === id) setSelected(null) }
    catch { /* Handled */ }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Leads</h2>
          <p className="text-slate-500 text-sm">{total} leads total</p>
        </div>
        <div className="flex gap-2">
          {['', 'new', 'contacted', 'replied', 'closed'].map(s => (
            <button key={s} onClick={() => { setFilter(s); setPage(1) }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === s ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'}`}>
              {s === '' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Lead List */}
        <div className="lg:col-span-3">
          <div className="card overflow-hidden">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Lead</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {leads.map(lead => (
                  <tr key={lead.id} className="cursor-pointer" onClick={() => loadDetail(lead.id)}>
                    <td>
                      <p className="text-white font-medium text-sm">{lead.name}</p>
                      <p className="text-slate-500 text-xs">{lead.email}</p>
                      {lead.company && <p className="text-slate-600 text-xs">{lead.company}</p>}
                    </td>
                    <td><span className="text-slate-400 text-xs">{REASON_LABELS[lead.reason] || lead.reason}</span></td>
                    <td>
                      <select
                        value={lead.status}
                        onClick={e => e.stopPropagation()}
                        onChange={e => updateStatus(lead.id, e.target.value)}
                        className={`${STATUS_COLORS[lead.status]} text-xs rounded-lg px-2 py-1 bg-transparent border-0 cursor-pointer`}
                      >
                        {['new', 'contacted', 'replied', 'closed'].map(s => <option key={s} value={s} className="bg-slate-800 text-white">{s}</option>)}
                      </select>
                    </td>
                    <td><span className="text-slate-500 text-xs">{new Date(lead.created_at).toLocaleDateString()}</span></td>
                    <td>
                      <button onClick={e => { e.stopPropagation(); handleDelete(lead.id) }} className="p-1 text-slate-500 hover:text-red-400">
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {leads.length === 0 && (
                  <tr><td colSpan={5} className="text-center py-8 text-slate-500">No leads found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Lead Detail */}
        <div className="lg:col-span-2">
          {selected ? (
            <div className="card p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-white font-semibold">{selected.name}</h3>
                  <p className="text-slate-400 text-sm">{selected.email}</p>
                  {selected.phone && <p className="text-slate-500 text-xs">{selected.phone}</p>}
                  {selected.company && <p className="text-slate-500 text-xs">{selected.company}</p>}
                </div>
                <span className={`${STATUS_COLORS[selected.status]} text-xs`}>{selected.status}</span>
              </div>

              <div className="pt-3 border-t border-slate-700">
                <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Reason</p>
                <p className="text-slate-300 text-sm">{REASON_LABELS[selected.reason]}</p>
              </div>

              {selected.message && (
                <div className="pt-3 border-t border-slate-700">
                  <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Message</p>
                  <p className="text-slate-300 text-sm">{selected.message}</p>
                </div>
              )}

              <div className="pt-3 border-t border-slate-700">
                <p className="text-slate-500 text-xs uppercase tracking-wider mb-2">Notes ({selected.notes?.length || 0})</p>
                <div className="space-y-2 mb-3 max-h-32 overflow-y-auto">
                  {(selected.notes || []).map(n => (
                    <div key={n.id} className="bg-slate-800 rounded-lg p-2.5">
                      <p className="text-slate-300 text-xs">{n.note}</p>
                      <p className="text-slate-600 text-xs mt-1">{new Date(n.created_at).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input className="input text-sm py-2 flex-1" placeholder="Add note..." value={note} onChange={e => setNote(e.target.value)} onKeyDown={e => e.key === 'Enter' && addNote(selected.id)} />
                  <button onClick={() => addNote(selected.id)} className="btn-primary py-2 px-3 text-sm">Add</button>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-700">
                <p className="text-slate-500 text-xs uppercase tracking-wider mb-2">Update Status</p>
                <div className="flex flex-wrap gap-2">
                  {['new', 'contacted', 'replied', 'closed'].map(s => (
                    <button key={s} onClick={() => { updateStatus(selected.id, s); setSelected(prev => ({ ...prev, status: s })) }}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all border ${selected.status === s ? 'bg-blue-600 border-blue-500 text-white' : 'border-slate-600 text-slate-400 hover:text-white'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="card p-8 text-center text-slate-500">
              <p>Click a lead to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
