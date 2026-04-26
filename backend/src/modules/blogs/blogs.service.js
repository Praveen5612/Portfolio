import blogsModel from './blogs.model.js';
import { buildPaginationMeta } from '../../utils/pagination.js';

class BlogsService {
  _parseTags(tagsStr) {
    if (Array.isArray(tagsStr)) return tagsStr;
    try { return tagsStr ? JSON.parse(tagsStr) : []; } catch { return []; }
  }

  _formatBlogs(blogs) {
    return blogs.map(b => ({ ...b, tags: this._parseTags(b.tags) }));
  }

  async getPublicBlogs(page, limit, offset) {
    const { blogs, total } = await blogsModel.getPublicBlogs(limit, offset);
    return { data: this._formatBlogs(blogs), meta: buildPaginationMeta(total, page, limit) };
  }

  async getAdminBlogs(page, limit, offset) {
    const { blogs, total } = await blogsModel.getAllAdminBlogs(limit, offset);
    return { data: this._formatBlogs(blogs), meta: buildPaginationMeta(total, page, limit) };
  }

  async getBlogBySlug(slug) {
    const blog = await blogsModel.getBlogByIdOrSlug(slug);
    if (!blog) {
      const err = new Error('Blog not found'); err.statusCode = 404; throw err;
    }
    await blogsModel.incrementViews(blog.id);
    blog.tags = this._parseTags(blog.tags);
    return blog;
  }

  async createBlog(data, file) {
    const slug = data.title.toLowerCase().replace(/\\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + Date.now();
    const tagsStr = JSON.stringify(this._parseTags(data.tags));
    const thumbnail = file ? `/uploads/blogs/${file.filename}` : null;
    const isPublished = data.is_published === '1' || data.is_published === true || data.is_published === 'true';
    const status = isPublished ? 'published' : 'draft';

    const insertData = { ...data, slug, tags: tagsStr, thumbnail, is_published: isPublished ? 1 : 0, status };
    return await blogsModel.createBlog(insertData);
  }

  async updateBlog(id, data, file) {
    const tagsStr = JSON.stringify(this._parseTags(data.tags));
    const isPublished = data.is_published === '1' || data.is_published === true || data.is_published === 'true';
    const status = isPublished ? 'published' : 'draft';
    const thumbnail = file ? `/uploads/blogs/${file.filename}` : null;

    const updateData = { ...data, tags: tagsStr, is_published: isPublished ? 1 : 0, status, thumbnail };
    await blogsModel.updateBlog(id, updateData, !!file);
    return true;
  }

  async deleteBlog(id) {
    await blogsModel.deleteBlog(id);
    return true;
  }

  async toggleStatus(id, isPublished) {
    const published = isPublished === true || isPublished === 1 || isPublished === 'true' || isPublished === '1';
    await blogsModel.updatePublishStatus(id, published ? 1 : 0);
    return true;
  }
}

export default new BlogsService();
