import visitorsModel from './visitors.model.js';
import { buildPaginationMeta } from '../../utils/pagination.js';

class VisitorsService {
  async getVisitors(filters, page, limit, offset) {
    const { visitors, total } = await visitorsModel.getVisitors(filters, limit, offset);
    return { data: visitors, meta: buildPaginationMeta(total, page, limit) };
  }

  async getVisitorDetails(visitorId) {
    const data = await visitorsModel.getVisitorData(visitorId);
    if (!data) {
      const err = new Error('Visitor not found');
      err.statusCode = 404;
      throw err;
    }
    return data;
  }
}

export default new VisitorsService();
