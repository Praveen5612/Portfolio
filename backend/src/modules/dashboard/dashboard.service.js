import dashboardModel from './dashboard.model.js';

class DashboardService {
  async getShortStats() {
    return await dashboardModel.getShortStats();
  }

  async getVisitorsChart() {
    return await dashboardModel.getVisitorsChart();
  }

  async getTopCountries() {
    return await dashboardModel.getTopCountries();
  }

  async getDeviceStats() {
    return await dashboardModel.getDeviceStats();
  }

  async getTopPages() {
    return await dashboardModel.getTopPages();
  }

  async getRecentLeads() {
    return await dashboardModel.getRecentLeads();
  }

  async getRecentMessages() {
    return await dashboardModel.getRecentMessages();
  }

  async getTrafficSources() {
    return await dashboardModel.getTrafficSources();
  }
}

export default new DashboardService();
