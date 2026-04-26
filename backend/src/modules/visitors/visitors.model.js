import pool from '../../config/db.js';

class VisitorsModel {
  async getVisitors(filters, limit, offset) {
    let where = 'WHERE 1=1';
    let params = [];
    
    if (filters.country) {
      where += ' AND country = ?';
      params.push(filters.country);
    }
    
    if (filters.device_type) {
      where += ' AND device_type = ?';
      params.push(filters.device_type);
    }

    const [rows] = await pool.execute(
      `SELECT v.*, COUNT(pv.id) as total_pages_viewed 
       FROM visitors v
       LEFT JOIN page_views pv ON v.visitor_id = pv.visitor_id
       ${where}
       GROUP BY v.id
       ORDER BY v.last_visit DESC LIMIT ? OFFSET ?`,
      [...params, String(limit), String(offset)]
    );
    
    const [count] = await pool.execute(`SELECT COUNT(*) as total FROM visitors ${where}`, params);
    return { visitors: rows, total: count[0].total };
  }

  async getVisitorData(visitorId) {
    const [rows] = await pool.execute('SELECT * FROM visitors WHERE visitor_id=?', [visitorId]);
    if (!rows.length) return null;

    const [sessions] = await pool.execute('SELECT * FROM visitor_sessions WHERE visitor_id=? ORDER BY started_at DESC LIMIT 10', [visitorId]);
    const [pageViews] = await pool.execute('SELECT * FROM page_views WHERE visitor_id=? ORDER BY created_at DESC LIMIT 20', [visitorId]);
    const [events] = await pool.execute('SELECT * FROM visitor_events WHERE visitor_id=? ORDER BY created_at DESC LIMIT 20', [visitorId]);

    return { ...rows[0], sessions, pageViews, events };
  }
}

export default new VisitorsModel();
