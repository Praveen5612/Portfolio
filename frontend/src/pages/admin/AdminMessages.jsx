import { useEffect, useState } from 'react'
import { TrashIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import { contactApi } from '../../services/contact.api.js'

const STATUS_COLORS = { new: 'badge-red', read: 'badge-blue', replied: 'badge-green', archived: 'badge-gray' }

export default function AdminMessages() {
  const [messages, setMessages] = useState([])
  const [total, setTotal] = useState(0)
  const [filter, setFilter] = useState('')
  const [selected, setSelected] = useState(null)
  const [replyText, setReplyText] = useState('')
  const [sending, setSending] = useState(false)

  const load = () => {
    contactApi.getAll({ page: 1, limit: 30, status: filter })
      .then(r => { 
        setMessages(r.data || []); 
        setTotal(r.meta?.total || 0) 
      }).catch(() => {})
  }

  useEffect(() => { load() }, [filter])

  const loadDetail = (msg) => {
    contactApi.getById(msg.id).then(r => setSelected(r.data)).catch(() => {})
  }

  const handleReply = async () => {
    if (!replyText.trim()) return
    setSending(true)
    try {
      const res = await contactApi.reply(selected.id, { reply_text: replyText })
      toast.success(res.data.emailSent ? 'Reply sent via email!' : 'Reply saved (email failed)')
      setReplyText('')
      loadDetail(selected)
      load()
    } catch { toast.error('Failed to send reply') }
    finally { setSending(false) }
  }

  const updateStatus = async (id, status) => {
    try { await contactApi.updateStatus(id, { status }); toast.success('Status updated'); load() }
    catch { /* Handled */ }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this message?')) return
    try { await contactApi.delete(id); toast.success('Deleted'); load(); if (selected?.id === id) setSelected(null) }
    catch { /* Handled */ }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Messages</h2>
          <p className="text-slate-500 text-sm">{total} total</p>
        </div>
        <div className="flex gap-2">
          {['', 'new', 'read', 'replied', 'archived'].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === s ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'}`}>
              {s === '' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Message List */}
        <div className="lg:col-span-2">
          <div className="card overflow-hidden">
            <div className="divide-y divide-slate-800">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  onClick={() => loadDetail(msg)}
                  className={`p-4 cursor-pointer hover:bg-slate-800/50 transition-colors ${selected?.id === msg.id ? 'bg-slate-800' : ''}`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className={`text-sm font-medium truncate ${msg.is_read ? 'text-slate-300' : 'text-white'}`}>{msg.name}</p>
                    <span className={`${STATUS_COLORS[msg.status]} text-xs shrink-0`}>{msg.status}</span>
                  </div>
                  <p className="text-slate-500 text-xs truncate">{msg.subject || msg.message?.substring(0, 50)}</p>
                  <p className="text-slate-600 text-xs mt-1">{new Date(msg.created_at).toLocaleDateString()}</p>
                </div>
              ))}
              {messages.length === 0 && <div className="p-8 text-center text-slate-500 text-sm">No messages</div>}
            </div>
          </div>
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-3">
          {selected ? (
            <div className="card flex flex-col" style={{ maxHeight: '70vh' }}>
              {/* Header */}
              <div className="p-5 border-b border-slate-700 flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-white font-semibold">{selected.name}</h3>
                  <p className="text-slate-400 text-sm">{selected.email}</p>
                  {selected.phone && <p className="text-slate-500 text-xs">{selected.phone}</p>}
                  {selected.subject && <p className="text-blue-400 text-sm mt-1">{selected.subject}</p>}
                  <p className="text-slate-600 text-xs mt-1">{new Date(selected.created_at).toLocaleString()}</p>
                </div>
                <div className="flex gap-2">
                  <select
                    value={selected.status}
                    onChange={e => { updateStatus(selected.id, e.target.value); setSelected(p => ({ ...p, status: e.target.value })) }}
                    className="text-xs bg-slate-700 border border-slate-600 text-slate-300 rounded-lg px-2 py-1"
                  >
                    {['new', 'read', 'replied', 'archived'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <button onClick={() => handleDelete(selected.id)} className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg">
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Message Thread */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {/* Original message */}
                <div className="bg-slate-800/50 rounded-xl p-4">
                  <p className="text-xs text-slate-500 mb-2">Original message</p>
                  <p className="text-slate-300 text-sm whitespace-pre-wrap">{selected.message}</p>
                </div>

                {/* Replies */}
                {(selected.replies || []).map(reply => (
                  <div key={reply.id} className="bg-blue-600/10 border border-blue-500/20 rounded-xl p-4 ml-4">
                    <p className="text-xs text-blue-400 mb-2">Your reply · {new Date(reply.sent_at).toLocaleString()}</p>
                    <p className="text-slate-300 text-sm whitespace-pre-wrap">{reply.reply_text}</p>
                  </div>
                ))}
              </div>

              {/* Reply Box */}
              <div className="p-5 border-t border-slate-700">
                <textarea
                  className="input resize-none text-sm mb-3"
                  rows={3}
                  placeholder="Type your reply..."
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                />
                <button
                  onClick={handleReply}
                  disabled={sending || !replyText.trim()}
                  className="btn-primary text-sm py-2"
                >
                  <PaperAirplaneIcon className="w-4 h-4" />
                  {sending ? 'Sending...' : 'Send Reply via Email'}
                </button>
              </div>
            </div>
          ) : (
            <div className="card p-8 text-center text-slate-500">
              <p>Select a message to view and reply</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
