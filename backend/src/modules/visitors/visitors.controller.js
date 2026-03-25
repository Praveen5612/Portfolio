import { successResponse } from '../../global/response.js';
import { asyncHandler } from '../../global/asyncHandler.js';
import visitorsService from './visitors.service.js';
import { getPaginationData } from '../../utils/pagination.js';

class VisitorsController {
  getVisitors = asyncHandler(async (req, res) => {
    const { page, limit, offset } = getPaginationData(req);
    const filters = {
      country: req.query.country,
      device_type: req.query.device_type,
    };
    
    const { data, meta } = await visitorsService.getVisitors(filters, page, limit, offset);
    return successResponse(res, 200, 'Visitors retrieved', data, meta);
  });

  getVisitorDetails = asyncHandler(async (req, res) => {
    const data = await visitorsService.getVisitorDetails(req.params.visitor_id);
    return successResponse(res, 200, 'Visitor details retrieved', data);
  });
}

export default new VisitorsController();
