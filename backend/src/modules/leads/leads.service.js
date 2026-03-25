import leadsModel from './leads.model.js';
import { buildPaginationMeta } from '../../utils/pagination.js';

class LeadsService {
  async getLeads(status, page, limit, offset) {
    const { leads, total } = await leadsModel.getLeads(status, limit, offset);
    return { data: leads, meta: buildPaginationMeta(total, page, limit) };
  }

  async getLead(id) {
    const lead = await leadsModel.getLeadById(id);
    if (!lead) {
      const err = new Error('Lead not found'); err.statusCode = 404; throw err;
    }
    const notes = await leadsModel.getLeadNotes(id);
    return { ...lead, notes };
  }

  async createLead(data, ip) {
    return await leadsModel.createLead(data, ip);
  }

  async updateLeadStatus(id, status) {
    await leadsModel.updateLeadStatus(id, status);
    return true;
  }

  async addNote(leadId, adminId, noteText) {
    await leadsModel.addNote(leadId, adminId, noteText);
    return true;
  }

  async deleteLead(id) {
    await leadsModel.deleteLead(id);
    return true;
  }
}

export default new LeadsService();
