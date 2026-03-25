import projectsModel from './projects.model.js';
import { buildPaginationMeta } from '../../utils/pagination.js';

class ProjectsService {
  _parseTech(str) {
    try { return str ? JSON.parse(str) : []; } catch { return []; }
  }

  async getPublicProjects(page, limit, offset) {
    const { projects, total } = await projectsModel.getPublicProjects(limit, offset);
    const parsed = projects.map(r => ({
      ...r,
      tech_stack: this._parseTech(r.tech_stack),
      images: r.images ? r.images.split(',') : []
    }));
    return { data: parsed, meta: buildPaginationMeta(total, page, limit) };
  }

  async getAllAdminProjects(page, limit, offset) {
    const { projects, total } = await projectsModel.getAllAdminProjects(limit, offset);
    const parsed = projects.map(r => ({ ...r, tech_stack: this._parseTech(r.tech_stack) }));
    return { data: parsed, meta: buildPaginationMeta(total, page, limit) };
  }

  async getProject(id) {
    const project = await projectsModel.getProjectByIdOrSlug(id);
    if (!project) {
      const err = new Error('Project not found'); err.statusCode = 404; throw err;
    }
    project.tech_stack = this._parseTech(project.tech_stack);
    return project;
  }

  async createProject(data, files) {
    const slug = data.title.toLowerCase().replace(/\\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const tech_stack = JSON.stringify(this._parseTech(data.tech_stack));
    const thumbnail = files?.[0] ? `/uploads/projects/${files[0].filename}` : null;

    const projectId = await projectsModel.createProject({ ...data, slug, tech_stack, thumbnail });

    if (files?.length) {
      for (let i = 0; i < files.length; i++) {
        await projectsModel.insertImage(projectId, `/uploads/projects/${files[i].filename}`, i);
      }
    }
    return projectId;
  }

  async updateProject(id, data, files) {
    const slug = data.title.toLowerCase().replace(/\\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const tech_stack = JSON.stringify(this._parseTech(data.tech_stack));

    await projectsModel.updateProject(id, { ...data, slug, tech_stack });

    if (files?.length) {
      for (let i = 0; i < files.length; i++) {
        await projectsModel.insertImage(id, `/uploads/projects/${files[i].filename}`, i);
      }
    }
    return true;
  }

  async togglePublish(id, isPublished) {
    await projectsModel.updatePublishStatus(id, isPublished);
    return true;
  }

  async deleteProject(id) {
    await projectsModel.deleteProject(id);
    return true;
  }
}

export default new ProjectsService();
