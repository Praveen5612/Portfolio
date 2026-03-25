import { v4 as uuidv4 } from 'uuid';
import geoip from 'geoip-lite';
import UAParser from 'ua-parser-js';
import analyticsModel from './analytics.model.js';
import logger from '../../global/logger.js';

class AnalyticsService {
  _getGeoData(ip) {
    try {
      const geo = geoip.lookup(ip);
      if (!geo) return { country: 'Unknown', countryCode: '', state: '', city: '' };
      return {
        country: geo.country || 'Unknown',
        countryCode: geo.country || '',
        state: geo.region || '',
        city: geo.city || '',
      };
    } catch {
      return { country: 'Unknown', countryCode: '', state: '', city: '' };
    }
  }

  _parseUserAgent(uaString) {
    const parser = new UAParser(uaString);
    const result = parser.getResult();
    let deviceType = 'desktop';
    if (result.device.type === 'mobile') deviceType = 'mobile';
    else if (result.device.type === 'tablet') deviceType = 'tablet';
    return {
      browser: result.browser.name || 'Unknown',
      browserVersion: result.browser.version || '',
      os: result.os.name || 'Unknown',
      osVersion: result.os.version || '',
      deviceType,
    };
  }

  _getTrafficSource(referrer, utmSource) {
    if (utmSource) return utmSource;
    if (!referrer) return 'direct';
    if (referrer.includes('google')) return 'google';
    if (referrer.includes('linkedin')) return 'linkedin';
    if (referrer.includes('github')) return 'github';
    if (referrer.includes('twitter') || referrer.includes('t.co')) return 'twitter';
    if (referrer.includes('facebook')) return 'facebook';
    return 'referral';
  }

  async trackVisitor(ip, uaString, data) {
    try {
      const uaData = this._parseUserAgent(uaString);
      const geo = this._getGeoData(ip);
      const trafficSource = this._getTrafficSource(data.referrer, data.utm_source);

      let visitorId = data.visitor_id;
      let isReturning = false;

      // Checking existing by IP + Browser if no visitorId is provided (or verifying)
      if (!visitorId) {
        visitorId = await analyticsModel.findVisitorByIpAndBrowser(ip, uaData.browser);
      }

      if (visitorId) {
        isReturning = true;
        await analyticsModel.updateReturningVisitor(visitorId);
      } else {
        visitorId = uuidv4();
        await analyticsModel.createVisitor(visitorId, ip, geo, uaData);
      }

      const sessionId = data.session_id || uuidv4();
      await analyticsModel.createSession(visitorId, sessionId, data, trafficSource);

      return { visitorId, sessionId, isReturning };
    } catch (err) {
      logger.error(`Track visitor error: ${err.message}`);
      return { visitorId: uuidv4(), sessionId: uuidv4(), isReturning: false };
    }
  }

  async trackPageView(vId, sId, path, title, time) {
    await analyticsModel.insertPageView(vId, sId, path, title, time);
  }

  async trackEvent(vId, sId, type, dataObj, path) {
    await analyticsModel.insertEvent(vId, sId, type, dataObj, path);
  }

  async trackProjectClick(vId, pId, type) {
    await analyticsModel.insertProjectClick(vId, pId, type);
  }

  async endSession(sId, time) {
    await analyticsModel.endSession(sId, time);
  }
}

export default new AnalyticsService();
