import { successResponse } from '../../global/response.js';
import { asyncHandler } from '../../global/asyncHandler.js';
import projectsService from './projects.service.js';
import { getPaginationData } from '../../utils/pagination.js';

class ProjectsController {
  getPublicProjects = asyncHandler(async (req, res) => {
    const { page, limit, offset } = getPaginationData(req);
    const { data, meta } = await projectsService.getPublicProjects(page, limit, offset);
    return successResponse(res, 200, 'Projects retrieved', data, meta);
  });

  getAdminProjects = asyncHandler(async (req, res) => {
    const { page, limit, offset } = getPaginationData(req);
    const { data, meta } = await projectsService.getAllAdminProjects(page, limit, offset);
    return successResponse(res, 200, 'Admin projects retrieved', data, meta);
  });

  getProject = asyncHandler(async (req, res) => {
    const project = await projectsService.getProject(req.params.id);
    return successResponse(res, 200, 'Project retrieved', project);
  });

  createProject = asyncHandler(async (req, res) => {
    const id = await projectsService.createProject(req.body, req.files);
    return successResponse(res, 201, 'Project created', { id });
  });

  updateProject = asyncHandler(async (req, res) => {
    await projectsService.updateProject(req.params.id, req.body, req.files);
    return successResponse(res, 200, 'Project updated');
  });

  publishProject = asyncHandler(async (req, res) => {
    const { is_published } = req.body;
    await projectsService.togglePublish(req.params.id, is_published);
    return successResponse(res, 200, `Project ${is_published ? 'published' : 'unpublished'}`);
  });

  deleteProject = asyncHandler(async (req, res) => {
    await projectsService.deleteProject(req.params.id);
    return successResponse(res, 200, 'Project deleted');
  });
}

export default new ProjectsController();
