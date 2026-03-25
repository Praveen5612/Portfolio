import pool from '../../config/db.js';

class BlogsModel {
  async getPublicBlogs(limit, offset) {
    const [rows] = await pool.execute(
      'SELECT id, title, slug, excerpt, thumbnail, tags, views, created_at FROM blogs WHERE is_published=1 ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [Number(limit), Number(offset)]
    );
    const [count] = await pool.execute('SELECT COUNT(*) as total FROM blogs WHERE is_published=1');
    return { blogs: rows, total: count[0].total };
  }

  async getAllAdminBlogs(limit, offset) {
    const [rows] = await pool.execute('SELECT * FROM blogs ORDER BY created_at DESC LIMIT ? OFFSET ?', [Number(limit), Number(offset)]);
    const [count] = await pool.execute('SELECT COUNT(*) as total FROM blogs');
    return { blogs: rows, total: count[0].total };
  }

  async getBlogByIdOrSlug(idOrSlug) {
    const [rows] = await pool.execute(
      'SELECT * FROM blogs WHERE (id=? OR slug=?) AND is_published=1 LIMIT 1',
      [idOrSlug, idOrSlug]
    );
    return rows[0] || null;
  }

  async getAdminBlogById(id) {
    const [rows] = await pool.execute('SELECT * FROM blogs WHERE id=? LIMIT 1', [id]);
    return rows[0] || null;
  }

  async incrementViews(id) {
    await pool.execute('UPDATE blogs SET views=views+1 WHERE id=?', [id]);
  }

  async createBlog(data) {
    const [result] = await pool.execute(
      'INSERT INTO blogs (title, slug, excerpt, content, thumbnail, tags, is_published, meta_title, meta_description) VALUES (?,?,?,?,?,?,?,?,?)',
      [data.title, data.slug, data.excerpt, data.content, data.thumbnail, data.tags, data.is_published ?? 0, data.meta_title, data.meta_description]
    );
    return result.insertId;
  }

  async updateBlog(id, data, hasThumbnail) {
    const updates = { title: data.title, excerpt: data.excerpt, content: data.content, tags: data.tags, is_published: data.is_published, meta_title: data.meta_title, meta_description: data.meta_description };
    if (hasThumbnail) updates.thumbnail = data.thumbnail;
    const fields = Object.keys(updates).filter(k => updates[k] !== undefined).map(k => `${k}=?`).join(', ');
    const values = Object.keys(updates).filter(k => updates[k] !== undefined).map(k => updates[k]);
    await pool.execute(`UPDATE blogs SET ${fields}, updated_at=NOW() WHERE id=?`, [...values, id]);
  }

  async updatePublishStatus(id, isPublished) {
    await pool.execute('UPDATE blogs SET is_published=?, updated_at=NOW() WHERE id=?', [isPublished, id]);
  }

  async deleteBlog(id) {
    await pool.execute('DELETE FROM blogs WHERE id=?', [id]);
  }
}

export default new BlogsModel();
