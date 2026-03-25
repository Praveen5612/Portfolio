import { successResponse } from '../../global/response.js';
import { asyncHandler } from '../../global/asyncHandler.js';
import blogsService from './blogs.service.js';
import { getPaginationData } from '../../utils/pagination.js';

export const getPublicBlogs = asyncHandler(async (req, res) => {
  const { page, limit, offset } = getPaginationData(req);
  const { data, meta } = await blogsService.getPublicBlogs(page, limit, offset);
  return successResponse(res, 200, 'Blogs retrieved', data, meta);
});

export const getBlogDetails = asyncHandler(async (req, res) => {
  const blog = await blogsService.getBlogBySlug(req.params.slug);
  return successResponse(res, 200, 'Blog retrieved', blog);
});

export const getAdminBlogs = asyncHandler(async (req, res) => {
  const { page, limit, offset } = getPaginationData(req);
  const { data, meta } = await blogsService.getAdminBlogs(page, limit, offset);
  return successResponse(res, 200, 'Admin blogs retrieved', data, meta);
});

export const createBlog = asyncHandler(async (req, res) => {
  const id = await blogsService.createBlog(req.body, req.file);
  return successResponse(res, 201, 'Blog created', { id });
});

export const updateBlog = asyncHandler(async (req, res) => {
  await blogsService.updateBlog(req.params.id, req.body, req.file);
  return successResponse(res, 200, 'Blog updated');
});

export const deleteBlog = asyncHandler(async (req, res) => {
  await blogsService.deleteBlog(req.params.id);
  return successResponse(res, 200, 'Blog deleted');
});

export const toggleBlogStatus = asyncHandler(async (req, res) => {
  const { is_published } = req.body;
  await blogsService.toggleStatus(req.params.id, is_published);
  return successResponse(res, 200, `Blog ${is_published ? 'published' : 'unpublished'}`);
});

