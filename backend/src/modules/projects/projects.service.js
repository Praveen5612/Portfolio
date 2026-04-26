import projectsModel from './projects.model.js';
import { buildPaginationMeta } from '../../utils/pagination.js';

class ProjectsService {
  _parseTech(str) {
    if (Array.isArray(str)) return str;
    try { return str ? JSON.parse(str) : []; } catch { return []; }
  }

  async getPublicProjects(page, limit, offset) {
    const { projects, total } = await projectsModel.getPublicProjects(limit, offset);
    return { data: projects, meta: buildPaginationMeta(total, page, limit) };
  }

  async getAllAdminProjects(page, limit, offset) {
    const { projects, total } = await projectsModel.getAllAdminProjects(limit, offset);
    return { data: projects, meta: buildPaginationMeta(total, page, limit) };
  }

  async getProject(id) {
    const project = await projectsModel.getProjectByIdOrSlug(id);
    if (!project) {
      const err = new Error('Project not found'); err.statusCode = 404; throw err;
    }
    return project;
  }

  async createProject(data, files) {
    const slug = data.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const tech_stack = this._parseTech(data.tech_stack);
    const thumbnail = files?.[0] ? `/uploads/projects/${files[0].filename}` : null;
    const images = files?.length ? files.map(f => `/uploads/projects/${f.filename}`) : [];

    const mappedData = {
      ...data,
      slug,
      tech_stack,
      thumbnail,
      images,
      url: data.live_url || data.url,
      featured: data.is_featured !== undefined ? data.is_featured : data.featured,
      is_published: data.status === 'published' ? 1 : (data.is_published ? 1 : 0)
    };

    for (const key in mappedData) {
      if (mappedData[key] === undefined) {
        mappedData[key] = null;
      }
    }

    const projectId = await projectsModel.createProject(mappedData);
    return projectId;
  }

  async updateProject(id, data, files) {
    const existing = await projectsModel.getProjectByIdOrSlug(id);
    if (!existing) {
      const err = new Error('Project not found'); err.statusCode = 404; throw err;
    }

    const mergedData = { ...existing, ...data };
    
    if (data.title) {
      mergedData.slug = data.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    } else {
      mergedData.slug = existing.slug;
    }

    if (data.tech_stack !== undefined) {
      mergedData.tech_stack = this._parseTech(data.tech_stack);
    } else {
      mergedData.tech_stack = existing.tech_stack;
    }
    
    mergedData.url = data.live_url !== undefined ? data.live_url : (data.url !== undefined ? data.url : existing.url);
    mergedData.featured = data.is_featured !== undefined ? data.is_featured : (data.featured !== undefined ? data.featured : existing.featured);
    
    if (data.status !== undefined) {
        mergedData.is_published = data.status === 'published' ? 1 : 0;
    } else if (data.is_published !== undefined) {
        mergedData.is_published = data.is_published ? 1 : 0;
    } else {
        mergedData.is_published = existing.is_published;
    }

    if (files?.[0]) {
       mergedData.thumbnail = `/uploads/projects/${files[0].filename}`;
       mergedData.images = files.map(f => `/uploads/projects/${f.filename}`);
    } else {
       mergedData.thumbnail = existing.thumbnail;
       mergedData.images = existing.images || [];
    }

    for (const key in mergedData) {
       if (mergedData[key] === undefined) {
           mergedData[key] = null;
       }
    }

    await projectsModel.updateProject(id, mergedData);
    return true;
  }

  async togglePublish(id, statusOrPublished) {
    let isPublished = statusOrPublished;
    if (typeof statusOrPublished === 'string') {
        isPublished = statusOrPublished === 'published' ? 1 : 0;
    }
    await projectsModel.updatePublishStatus(id, isPublished);
    return true;
  }

  async deleteProject(id) {
    await projectsModel.deleteProject(id);
    return true;
  }
}

export default new ProjectsService();
