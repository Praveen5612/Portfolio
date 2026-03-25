import { useEffect, useState } from 'react'
import { DevicePhoneMobileIcon, ComputerDesktopIcon, GlobeAltIcon } from '@heroicons/react/24/outline'
import { visitorsApi } from '../../services/visitors.api.js'

export default function AdminVisitors() {
  const [visitors, setVisitors] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState(null)

  const load = () => {
    visitorsApi.getAll({ page, limit: 20 })
      .then(r => { setVisitors(r.data || []); setTotal(r.meta?.total || 0) })
      .catch(() => {})
  }

  useEffect(() => { load() }, [page])

  const loadDetail = (v) => visitorsApi.getById(v.visitor_id).then(r => setSelected(r.data)).catch(() => {})

  const DeviceIcon = ({ type }) => {
    if (type === 'mobile') return <DevicePhoneMobileIcon className="w-4 h-4 text-blue-400" />
    return <ComputerDesktopIcon className="w-4 h-4 text-emerald-400" />
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Visitors</h2>
        <p className="text-slate-500 text-sm">{total} total visitors tracked</p>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <div className="card overflow-hidden">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Visitor</th>
                  <th>Location</th>
                  <th>Device</th>
                  <th>Visits</th>
                  <th>Last Seen</th>
                </tr>
              </thead>
              <tbody>
                {visitors.map(v => (
                  <tr key={v.id} className="cursor-pointer" onClick={() => loadDetail(v)}>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-slate-600 flex items-center justify-center text-xs text-slate-400 font-mono">
                          {v.visitor_id?.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-white text-xs font-mono">{v.ip_address}</p>
                          <p className="text-slate-500 text-xs">{v.browser} / {v.os}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        <GlobeAltIcon className="w-3.5 h-3.5 text-slate-500" />
                        <span className="text-slate-300 text-xs">{v.city || v.country || 'Unknown'}</span>
                      </div>
                    </td>
                    <td><DeviceIcon type={v.device_type} /></td>
                    <td><span className="badge-blue text-xs">{v.visit_count}</span></td>
                    <td><span className="text-slate-500 text-xs">{new Date(v.last_visit).toLocaleDateString()}</span></td>
                  </tr>
                ))}
                {visitors.length === 0 && (
                  <tr><td colSpan={5} className="text-center py-8 text-slate-500">No visitors tracked yet</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {total > 20 && (
            <div className="flex items-center justify-between mt-4 text-sm text-slate-400">
              <span>Page {page} · {total} total</span>
              <div className="flex gap-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-secondary py-1.5 px-3 text-xs">Prev</button>
                <button onClick={() => setPage(p => p + 1)} disabled={page * 20 >= total} className="btn-secondary py-1.5 px-3 text-xs">Next</button>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          {selected ? (
            <div className="card p-5 space-y-4">
              <h3 className="text-white font-semibold">Visitor Details</h3>
              <div className="space-y-2 text-sm">
                {[
                  ['IP', selected.ip_address],
                  ['Country', selected.country],
                  ['State', selected.state],
                  ['City', selected.city],
                  ['Browser', `${selected.browser} ${selected.browser_version}`],
                  ['OS', `${selected.os} ${selected.os_version}`],
                  ['Device', selected.device_type],
                  ['Visits', selected.visit_count],
                  ['First Visit', new Date(selected.first_visit).toLocaleString()],
                  ['Last Visit', new Date(selected.last_visit).toLocaleString()],
                  ['Returning', selected.is_returning ? 'Yes' : 'No'],
                ].map(([label, val]) => (
                  <div key={label} className="flex justify-between gap-4 py-1.5 border-b border-slate-800">
                    <span className="text-slate-500">{label}</span>
                    <span className="text-slate-300 text-right">{val || '—'}</span>
                  </div>
                ))}
              </div>

              {selected.pageViews?.length > 0 && (
                <div>
                  <p className="text-slate-500 text-xs uppercase tracking-wider mb-2">Pages Viewed ({selected.pageViews.length})</p>
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {selected.pageViews.map(pv => (
                      <div key={pv.id} className="flex justify-between text-xs text-slate-400 py-1">
                        <span className="truncate">{pv.page_path}</span>
                        <span className="text-slate-600 shrink-0 ml-2">{new Date(pv.created_at).toLocaleTimeString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="card p-8 text-center text-slate-500">
              <p className="text-sm">Click a visitor to see details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
