import pool from '../../config/db.js';

class ProjectsModel {
  async getPublicProjects(limit, offset) {
    const [rows] = await pool.query(
      `SELECT * FROM projects 
       WHERE is_published = 1
       ORDER BY featured DESC, sort_order ASC, created_at DESC
       LIMIT ${parseInt(limit) || 10} OFFSET ${parseInt(offset) || 0}`
    );
    const [countRows] = await pool.query("SELECT COUNT(*) as total FROM projects WHERE is_published = 1");
    
    // Parse JSON strings if they come back as strings (depends on driver/config)
    const projects = rows.map(p => ({
      ...p,
      tech_stack: typeof p.tech_stack === 'string' ? JSON.parse(p.tech_stack) : p.tech_stack,
      images: typeof p.images === 'string' ? JSON.parse(p.images) : p.images,
      features: typeof p.features === 'string' ? JSON.parse(p.features) : p.features
    }));

    return { projects, total: countRows[0].total };
  }

  async getAllAdminProjects(limit, offset) {
    const [rows] = await pool.query(
      `SELECT * FROM projects ORDER BY sort_order ASC, created_at DESC 
       LIMIT ${parseInt(limit) || 10} OFFSET ${parseInt(offset) || 0}`
    );
    const [countRows] = await pool.query("SELECT COUNT(*) as total FROM projects");
    
    const projects = rows.map(p => ({
      ...p,
      tech_stack: typeof p.tech_stack === 'string' ? JSON.parse(p.tech_stack) : p.tech_stack,
      images: typeof p.images === 'string' ? JSON.parse(p.images) : p.images,
      features: typeof p.features === 'string' ? JSON.parse(p.features) : p.features
    }));

    return { projects, total: countRows[0].total };
  }

  async getProjectByIdOrSlug(identifier) {
    const [rows] = await pool.execute('SELECT * FROM projects WHERE id=? OR slug=?', [identifier, identifier]);
    if (!rows.length) return null;
    
    const project = rows[0];
    project.tech_stack = typeof project.tech_stack === 'string' ? JSON.parse(project.tech_stack) : project.tech_stack;
    project.images = typeof project.images === 'string' ? JSON.parse(project.images) : project.images;
    project.features = typeof project.features === 'string' ? JSON.parse(project.features) : project.features;
    
    return project;
  }

  async createProject(data) {
    const [result] = await pool.execute(
      `INSERT INTO projects (title, slug, description, long_description, thumbnail, images, github_url, url, tech_stack, featured, sort_order, meta_title, meta_description, is_published)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
       [data.title, data.slug, data.description, data.long_description, data.thumbnail, JSON.stringify(data.images || []), data.github_url, data.url, JSON.stringify(data.tech_stack || []), data.featured, data.sort_order, data.meta_title, data.meta_description, data.is_published]
    );
    return result.insertId;
  }

  async updateProject(id, data) {
    await pool.execute(
      `UPDATE projects SET title=?, slug=?, description=?, long_description=?, thumbnail=?, images=?, github_url=?, url=?, tech_stack=?,
       featured=?, sort_order=?, is_published=?, meta_title=?, meta_description=?, updated_at=NOW() WHERE id=?`,
      [data.title, data.slug, data.description, data.long_description, data.thumbnail, JSON.stringify(data.images || []), data.github_url, data.url, JSON.stringify(data.tech_stack || []), data.featured, data.sort_order, data.is_published, data.meta_title, data.meta_description, id]
    );
  }

  async updatePublishStatus(id, isPublished) {
    await pool.execute('UPDATE projects SET is_published=?, updated_at=NOW() WHERE id=?', [isPublished, id]);
  }

  async deleteProject(id) {
    await pool.execute('DELETE FROM projects WHERE id=?', [id]);
  }
}

export default new ProjectsModel();
