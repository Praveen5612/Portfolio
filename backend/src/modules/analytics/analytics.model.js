import pool from '../../config/db.js';

class AnalyticsModel {
  async findVisitorByIpAndBrowser(ip, browser) {
    const [rows] = await pool.execute('SELECT visitor_id FROM visitors WHERE ip_address = ? AND browser = ? LIMIT 1', [ip, browser]);
    return rows[0]?.visitor_id || null;
  }

  async updateReturningVisitor(visitorId) {
    await pool.execute(
      `UPDATE visitors SET last_visit=NOW(), visit_count=visit_count+1, is_returning=1, updated_at=NOW() WHERE visitor_id=?`,
      [visitorId]
    );
  }

  async createVisitor(vId, ip, geo, ua) {
    await pool.execute(
      `INSERT INTO visitors (visitor_id, ip_address, country, country_code, state, city, device_type, browser, browser_version, os, os_version, is_returning)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
      [vId, ip, geo.country, geo.countryCode, geo.state, geo.city, ua.deviceType, ua.browser, ua.browserVersion, ua.os, ua.osVersion, 0]
    );
  }

  async createSession(vId, sId, data, trafficSource) {
    await pool.execute(
      `INSERT IGNORE INTO visitor_sessions (visitor_id, session_id, referrer, utm_source, utm_medium, utm_campaign, traffic_source, entry_page)
       VALUES (?,?,?,?,?,?,?,?)`,
      [vId, sId, data.referrer || '', data.utm_source || '', data.utm_medium || '', data.utm_campaign || '', trafficSource, data.page || '/']
    );
  }

  async insertPageView(vId, sId, path, title, time) {
    await pool.execute(
      `INSERT INTO page_views (visitor_id, session_id, page_path, page_title, time_on_page) VALUES (?,?,?,?,?)`,
      [vId, sId, path, title, time]
    );
    await pool.execute(
      `UPDATE visitor_sessions SET pages_viewed=pages_viewed+1, time_spent=time_spent+? WHERE session_id=?`,
      [time, sId]
    );
  }

  async insertEvent(vId, sId, type, dataObj, path) {
    await pool.execute(
      `INSERT INTO visitor_events (visitor_id, session_id, event_type, event_data, page_path) VALUES (?,?,?,?,?)`,
      [vId, sId, type, JSON.stringify(dataObj), path]
    );
  }

  async insertProjectClick(vId, pId, type) {
    await pool.execute('INSERT INTO project_clicks (visitor_id, project_id, click_type) VALUES (?,?,?)', [vId, pId, type]);
  }

  async endSession(sId, time) {
    await pool.execute("UPDATE visitor_sessions SET ended_at=NOW(), status='ended', time_spent=? WHERE session_id=?", [time, sId]);
  }
}

export default new AnalyticsModel();
