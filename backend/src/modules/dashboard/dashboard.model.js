import pool from '../../config/db.js';

class DashboardModel {
  async getShortStats() {
    const [visitors] = await pool.execute('SELECT COUNT(*) as total FROM visitors');
    const [uniqueVisitors] = await pool.execute('SELECT COUNT(DISTINCT visitor_id) as total FROM visitor_sessions');
    const [totalLeads] = await pool.execute('SELECT COUNT(*) as total FROM leads');
    const [newLeads] = await pool.execute('SELECT COUNT(*) as total FROM leads WHERE status=\'new\'');
    const [totalMessages] = await pool.execute('SELECT COUNT(*) as total FROM contact_messages');
    const [unreadMessages] = await pool.execute('SELECT COUNT(*) as total FROM contact_messages WHERE is_read=0');
    const [resumeDownloads] = await pool.execute('SELECT COUNT(*) as total FROM resume_downloads');
    const [projectClicks] = await pool.execute('SELECT COUNT(*) as total FROM project_clicks');
    const [returningVisitors] = await pool.execute('SELECT COUNT(*) as total FROM visitors WHERE is_returning=1');
    const [avgTime] = await pool.execute('SELECT AVG(time_spent) as avg FROM visitor_sessions');

    return {
      visitors: visitors[0].total,
      uniqueVisitors: uniqueVisitors[0].total,
      returningVisitors: returningVisitors[0].total,
      totalLeads: totalLeads[0].total,
      newLeads: newLeads[0].total,
      totalMessages: totalMessages[0].total,
      unreadMessages: unreadMessages[0].total,
      resumeDownloads: resumeDownloads[0].total,
      projectClicks: projectClicks[0].total,
      avgTimeSpent: Math.round(avgTime[0].avg || 0)
    };
  }

  async getVisitorsChart() {
    const [rows] = await pool.query(`
      SELECT DATE(started_at) as date, COUNT(*) as count 
      FROM visitor_sessions 
      WHERE started_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      GROUP BY DATE(started_at)
      ORDER BY date ASC
    `);
    return rows;
  }

  async getTopCountries() {
    const [rows] = await pool.query('SELECT country, COUNT(*) as count FROM visitors GROUP BY country ORDER BY count DESC LIMIT 10');
    return rows;
  }

  async getDeviceStats() {
    const [rows] = await pool.query('SELECT device_type, COUNT(*) as count FROM visitors GROUP BY device_type ORDER BY count DESC');
    return rows;
  }

  async getTopPages() {
    const [rows] = await pool.query('SELECT page_path, COUNT(*) as views FROM page_views GROUP BY page_path ORDER BY views DESC LIMIT 10');
    return rows;
  }

  async getRecentLeads() {
    const [rows] = await pool.query('SELECT * FROM leads ORDER BY created_at DESC LIMIT 5');
    return rows;
  }

  async getRecentMessages() {
    const [rows] = await pool.query('SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT 5');
    return rows;
  }

  async getTrafficSources() {
    const [rows] = await pool.query('SELECT traffic_source, COUNT(*) as count FROM visitor_sessions GROUP BY traffic_source ORDER BY count DESC');
    return rows;
  }
}

export default new DashboardModel();
