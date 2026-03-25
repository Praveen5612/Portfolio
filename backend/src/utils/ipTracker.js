import geoip from 'geoip-lite';
import UAParser from 'ua-parser-js';

export const extractVisitorData = (req) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
  const cleanIp = ip.split(',')[0].trim();
  
  const geo = geoip.lookup(cleanIp);
  const country = geo ? geo.country : 'Unknown';
  
  const parser = new UAParser(req.headers['user-agent']);
  const browser = parser.getBrowser().name || 'Unknown';
  const device = parser.getDevice().type || 'Desktop'; // defaults to desktop if undefined
  
  return {
    ip: cleanIp,
    country,
    browser,
    device
  };
};
