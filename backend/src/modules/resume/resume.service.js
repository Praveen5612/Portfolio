import resumeModel from './resume.model.js';
import analyticsService from '../analytics/analytics.service.js';

class ResumeService {
  async getActiveResume() {
    return await resumeModel.getActiveResume();
  }

  async getAllResumes() {
    return await resumeModel.getAllResumes();
  }

  async downloadResume(id, visitorId, sessionId, ipAddress) {
    const resume = await resumeModel.getResumeById(id);
    if (!resume) {
      const err = new Error('Resume not found'); err.statusCode = 404; throw err;
    }

    await resumeModel.incrementDownloadCount(id);

    if (visitorId) {
      await resumeModel.logDownload(visitorId, id, ipAddress);
      await analyticsService.trackEvent(visitorId, sessionId, 'resume_download', { resume_id: id }, '/resume');
    }

    return resume;
  }

  async uploadResume(file, version) {
    if (!file) {
      const err = new Error('No file uploaded'); err.statusCode = 400; throw err;
    }
    
    await resumeModel.deactivateAllOtherResumes();
    const id = await resumeModel.createResume(file, version);
    return id;
  }

  async deleteResume(id) {
    await resumeModel.deleteResume(id);
    return true;
  }
}

export default new ResumeService();
