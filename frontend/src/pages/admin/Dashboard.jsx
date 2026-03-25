import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Line, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
  Title, Tooltip, Legend, ArcElement, Filler
} from 'chart.js'
import {
  UsersIcon, EnvelopeIcon, ArrowDownTrayIcon, CursorArrowRaysIcon,
  UserGroupIcon, ClockIcon, GlobeAltIcon, DevicePhoneMobileIcon
} from '@heroicons/react/24/outline'
import { dashboardApi } from '../../services/dashboard.api.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, Filler)

const StatCard = ({ label, value, icon: Icon, color, sub }) => (
  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="stat-card">
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
      <Icon className="w-5 h-5" />
    </div>
    <div>
      <p className="text-slate-400 text-xs mb-1">{label}</p>
      <p className="text-white text-2xl font-bold">{value?.toLocaleString() ?? '—'}</p>
      {sub && <p className="text-slate-500 text-xs mt-0.5">{sub}</p>}
    </div>
  </motion.div>
)

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [chartData, setChartData] = useState([])
  const [countries, setCountries] = useState([])
  const [devices, setDevices] = useState([])
  const [topPages, setTopPages] = useState([])
  const [recentLeads, setRecentLeads] = useState([])
  const [recentMsgs, setRecentMsgs] = useState([])
  const [sources, setSources] = useState([])

  useEffect(() => {
    const load = async () => {
      try {
        const [s, ch, co, dv, tp, rl, rm, sr] = await Promise.all([
          dashboardApi.getStats(),
          dashboardApi.getVisitorsChart(),
          dashboardApi.getCountries(),
          dashboardApi.getDevices(),
          dashboardApi.getTopPages(),
          dashboardApi.getRecentLeads(),
          dashboardApi.getRecentMessages(),
          dashboardApi.getTrafficSources(),
        ])
        setStats(s.data)
        setChartData(ch.data)
        setCountries(co.data)
        setDevices(dv.data)
        setTopPages(tp.data)
        setRecentLeads(rl.data)
        setRecentMsgs(rm.data)
        setSources(sr.data)
      } catch {}
    }
    load()
  }, [])

  const visitorsChart = {
    labels: chartData.map(d => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
    datasets: [{
      label: 'Visitors',
      data: chartData.map(d => d.count),
      fill: true,
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59,130,246,0.08)',
      tension: 0.4,
      pointRadius: 3,
      pointBackgroundColor: '#3b82f6',
    }]
  }

  const deviceChart = {
    labels: devices.map(d => d.device_type),
    datasets: [{
      data: devices.map(d => d.count),
      backgroundColor: ['#3b82f6', '#10b981', '#f59e0b'],
      borderWidth: 0,
    }]
  }

  const chartOpts = {
    responsive: true,
    plugins: { legend: { display: false }, tooltip: { backgroundColor: '#1e293b', titleColor: '#f1f5f9', bodyColor: '#94a3b8', borderColor: '#334155', borderWidth: 1 } },
    scales: {
      x: { grid: { color: 'rgba(51,65,85,0.3)' }, ticks: { color: '#64748b', maxTicksLimit: 7 } },
      y: { grid: { color: 'rgba(51,65,85,0.3)' }, ticks: { color: '#64748b' } }
    }
  }

  const statusColors = { new: 'badge-red', contacted: 'badge-yellow', replied: 'badge-green', closed: 'badge-gray' }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">Dashboard</h2>
        <p className="text-slate-500 text-sm">Your portfolio analytics at a glance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Visitors" value={stats?.visitors} icon={UsersIcon} color="bg-blue-500/20 text-blue-400 border border-blue-500/20" />
        <StatCard label="Unique Visitors" value={stats?.uniqueVisitors} icon={UserGroupIcon} color="bg-emerald-500/20 text-emerald-400 border border-emerald-500/20" />
        <StatCard label="Total Leads" value={stats?.totalLeads} icon={CursorArrowRaysIcon} color="bg-purple-500/20 text-purple-400 border border-purple-500/20" sub={`${stats?.newLeads || 0} new`} />
        <StatCard label="Messages" value={stats?.totalMessages} icon={EnvelopeIcon} color="bg-orange-500/20 text-orange-400 border border-orange-500/20" sub={`${stats?.unreadMessages || 0} unread`} />
        <StatCard label="Resume Downloads" value={stats?.resumeDownloads} icon={ArrowDownTrayIcon} color="bg-cyan-500/20 text-cyan-400 border border-cyan-500/20" />
        <StatCard label="Project Clicks" value={stats?.projectClicks} icon={CursorArrowRaysIcon} color="bg-pink-500/20 text-pink-400 border border-pink-500/20" />
        <StatCard label="Returning Visitors" value={stats?.returningVisitors} icon={UsersIcon} color="bg-indigo-500/20 text-indigo-400 border border-indigo-500/20" />
        <StatCard label="Avg Time Spent" value={stats?.avgTimeSpent ? `${Math.floor(stats.avgTimeSpent / 60)}m ${stats.avgTimeSpent % 60}s` : '—'} icon={ClockIcon} color="bg-teal-500/20 text-teal-400 border border-teal-500/20" />
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Visitors Chart */}
        <div className="lg:col-span-2 card p-5">
          <h3 className="text-white font-semibold mb-4 text-sm">Visitors — Last 30 Days</h3>
          {chartData.length > 0 ? (
            <Line data={visitorsChart} options={{ ...chartOpts, maintainAspectRatio: true }} height={80} />
          ) : (
            <div className="h-32 flex items-center justify-center text-slate-600 text-sm">No data yet</div>
          )}
        </div>

        {/* Device Chart */}
        <div className="card p-5">
          <h3 className="text-white font-semibold mb-4 text-sm">Devices</h3>
          {devices.length > 0 ? (
            <>
              <Doughnut data={deviceChart} options={{ responsive: true, plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8', boxWidth: 10, padding: 12 } }, tooltip: { backgroundColor: '#1e293b', titleColor: '#f1f5f9', bodyColor: '#94a3b8' } }, cutout: '65%' }} />
            </>
          ) : (
            <div className="h-32 flex items-center justify-center text-slate-600 text-sm">No data yet</div>
          )}
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Countries */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <GlobeAltIcon className="w-4 h-4 text-slate-400" />
            <h3 className="text-white font-semibold text-sm">Top Countries</h3>
          </div>
          {countries.length === 0 ? (
            <p className="text-slate-600 text-sm">No data yet</p>
          ) : (
            <div className="space-y-2">
              {countries.slice(0, 6).map(c => (
                <div key={c.country} className="flex items-center justify-between text-sm">
                  <span className="text-slate-300">{c.country}</span>
                  <span className="badge-gray">{c.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Pages */}
        <div className="card p-5">
          <h3 className="text-white font-semibold text-sm mb-4">Top Pages</h3>
          {topPages.length === 0 ? (
            <p className="text-slate-600 text-sm">No data yet</p>
          ) : (
            <div className="space-y-2">
              {topPages.slice(0, 6).map(p => (
                <div key={p.page_path} className="flex items-center justify-between text-sm">
                  <span className="text-slate-300 truncate max-w-[120px]">{p.page_path}</span>
                  <span className="badge-blue">{p.views}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Traffic Sources */}
        <div className="card p-5">
          <h3 className="text-white font-semibold text-sm mb-4">Traffic Sources</h3>
          {sources.length === 0 ? (
            <p className="text-slate-600 text-sm">No data yet</p>
          ) : (
            <div className="space-y-2">
              {sources.slice(0, 6).map(s => (
                <div key={s.traffic_source} className="flex items-center justify-between text-sm">
                  <span className="text-slate-300 capitalize">{s.traffic_source}</span>
                  <span className="badge-green">{s.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Leads */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold text-sm">Recent Leads</h3>
            <Link to="/admin/leads" className="text-blue-400 text-xs hover:text-blue-300">View all →</Link>
          </div>
          {recentLeads.length === 0 ? (
            <p className="text-slate-600 text-sm">No leads yet</p>
          ) : (
            <div className="space-y-3">
              {recentLeads.map(lead => (
                <div key={lead.id} className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-white text-sm font-medium truncate">{lead.name}</p>
                    <p className="text-slate-500 text-xs truncate">{lead.email} · {lead.reason}</p>
                  </div>
                  <span className={`${statusColors[lead.status]} text-xs shrink-0`}>{lead.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Messages */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold text-sm">Recent Messages</h3>
            <Link to="/admin/messages" className="text-blue-400 text-xs hover:text-blue-300">View all →</Link>
          </div>
          {recentMsgs.length === 0 ? (
            <p className="text-slate-600 text-sm">No messages yet</p>
          ) : (
            <div className="space-y-3">
              {recentMsgs.map(msg => (
                <div key={msg.id} className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-white text-sm font-medium truncate">{msg.name}</p>
                    <p className="text-slate-500 text-xs truncate">{msg.subject || msg.message?.substring(0, 40)}</p>
                  </div>
                  <span className={`${msg.is_read ? 'badge-gray' : 'badge-blue'} text-xs shrink-0`}>
                    {msg.is_read ? 'read' : 'new'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
