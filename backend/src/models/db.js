import mysql from 'mysql2/promise';
import { env } from '../config/env.js';
import logger from '../global/logger.js';
import pool from '../config/db.js';

// Centralized schema definitions for all modules
export const schemas = [
  // Admin
  `CREATE TABLE IF NOT EXISTS admins (
      id BIGINT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      name VARCHAR(100) NOT NULL,
      role ENUM('superadmin', 'admin') DEFAULT 'admin',
      avatar VARCHAR(255) DEFAULT NULL,
      last_login DATETIME DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`,

  // Auth Logs
  `CREATE TABLE IF NOT EXISTS login_logs (
      id BIGINT AUTO_INCREMENT PRIMARY KEY,
      admin_id BIGINT NOT NULL,
      ip_address VARCHAR(45),
      user_agent TEXT,
      status ENUM('success', 'failed') DEFAULT 'success',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,

  // Projects
  `CREATE TABLE IF NOT EXISTS projects (
      id BIGINT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE NOT NULL,
      brief TEXT,
      description LONGTEXT,
      thumbnail VARCHAR(255),
      cover_image VARCHAR(255),
      images JSON,
      url VARCHAR(255),
      github_url VARCHAR(255),
      repo_type ENUM('public', 'private') DEFAULT 'public',
      platform ENUM('web', 'mobile', 'backend', 'desktop') DEFAULT 'web',
      tech_stack JSON,
      features JSON,
      role VARCHAR(100),
      duration VARCHAR(100),
      status ENUM('completed', 'in_progress', 'planned') DEFAULT 'completed',
      is_published BOOLEAN DEFAULT TRUE,
      featured BOOLEAN DEFAULT FALSE,
      sort_order INT DEFAULT 0,
      meta_title VARCHAR(255),
      meta_description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`,

  // Skills
  `CREATE TABLE IF NOT EXISTS skills (
      id BIGINT AUTO_INCREMENT PRIMARY KEY,
      category VARCHAR(100) NOT NULL,
      name VARCHAR(100) NOT NULL,
      icon VARCHAR(255),
      proficiency INT DEFAULT 0,
      experience_years FLOAT DEFAULT 0,
      sort_order INT DEFAULT 0,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`,

  // Experience
  `CREATE TABLE IF NOT EXISTS work_experience (
      id BIGINT AUTO_INCREMENT PRIMARY KEY,
      company VARCHAR(255) NOT NULL,
      position VARCHAR(255) NOT NULL,
      location VARCHAR(255),
      type ENUM('full-time', 'part-time', 'contract', 'freelance', 'internship') DEFAULT 'full-time',
      start_date DATE NOT NULL,
      end_date DATE,
      is_current BOOLEAN DEFAULT FALSE,
      description TEXT,
      achievements JSON,
      tech_stack JSON,
      is_published BOOLEAN DEFAULT TRUE,
      sort_order INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`,

  // Leads
  `CREATE TABLE IF NOT EXISTS leads (
      id BIGINT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(50),
      company VARCHAR(255),
      message TEXT,
      reason VARCHAR(100) DEFAULT 'other',
      source VARCHAR(100) DEFAULT 'popup',
      status ENUM('new', 'contacted', 'qualified', 'lost') DEFAULT 'new',
      visitor_id VARCHAR(255),
      ip_address VARCHAR(45),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS lead_notes (
      id BIGINT AUTO_INCREMENT PRIMARY KEY,
      lead_id BIGINT NOT NULL,
      admin_id BIGINT NOT NULL,
      note TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,

  // Contact
  `CREATE TABLE IF NOT EXISTS contact_messages (
      id BIGINT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(50),
      subject VARCHAR(255),
      message TEXT NOT NULL,
      visitor_id VARCHAR(255),
      ip_address VARCHAR(45),
      status ENUM('new', 'read', 'replied') DEFAULT 'new',
      is_read BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS message_replies (
      id BIGINT AUTO_INCREMENT PRIMARY KEY,
      message_id BIGINT NOT NULL,
      admin_id BIGINT NOT NULL,
      reply_text TEXT NOT NULL,
      sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,

  // Visitors
  `CREATE TABLE IF NOT EXISTS visitors (
      id BIGINT AUTO_INCREMENT PRIMARY KEY,
      visitor_id VARCHAR(255) UNIQUE NOT NULL,
      ip_address VARCHAR(45),
      country VARCHAR(100),
      country_code VARCHAR(10),
      state VARCHAR(100),
      city VARCHAR(100),
      device_type VARCHAR(50),
      browser VARCHAR(50),
      browser_version VARCHAR(50),
      os VARCHAR(50),
      os_version VARCHAR(50),
      is_returning BOOLEAN DEFAULT FALSE,
      visit_count INT DEFAULT 1,
      last_visit TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`,

  // Analytics
  `CREATE TABLE IF NOT EXISTS visitor_sessions (
      id BIGINT AUTO_INCREMENT PRIMARY KEY,
      visitor_id VARCHAR(255) NOT NULL,
      session_id VARCHAR(255) UNIQUE NOT NULL,
      referrer TEXT,
      utm_source VARCHAR(255),
      utm_medium VARCHAR(255),
      utm_campaign VARCHAR(255),
      traffic_source VARCHAR(100),
      entry_page VARCHAR(255),
      started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      ended_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      status ENUM('active', 'ended') DEFAULT 'active',
      pages_viewed INT DEFAULT 1,
      time_spent INT DEFAULT 0
  )`,
  `CREATE TABLE IF NOT EXISTS page_views (
      id BIGINT AUTO_INCREMENT PRIMARY KEY,
      visitor_id VARCHAR(255) NOT NULL,
      session_id VARCHAR(255) NOT NULL,
      page_path VARCHAR(255) NOT NULL,
      page_title VARCHAR(255),
      time_on_page INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS visitor_events (
      id BIGINT AUTO_INCREMENT PRIMARY KEY,
      visitor_id VARCHAR(255) NOT NULL,
      session_id VARCHAR(255) NOT NULL,
      event_type VARCHAR(100) NOT NULL,
      event_data JSON,
      page_path VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS project_clicks (
      id BIGINT AUTO_INCREMENT PRIMARY KEY,
      visitor_id VARCHAR(255) NOT NULL,
      project_id BIGINT NOT NULL,
      click_type VARCHAR(50) DEFAULT 'view',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,

  // Resume
  `CREATE TABLE IF NOT EXISTS resumes (
      id BIGINT AUTO_INCREMENT PRIMARY KEY,
      file_name VARCHAR(255) NOT NULL,
      file_path VARCHAR(255) NOT NULL,
      file_size INT,
      version VARCHAR(50) DEFAULT '1.0',
      download_count INT DEFAULT 0,
      is_active BOOLEAN DEFAULT TRUE,
      status ENUM('active', 'archived') DEFAULT 'active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS resume_downloads (
      id BIGINT AUTO_INCREMENT PRIMARY KEY,
      visitor_id VARCHAR(255),
      resume_id BIGINT NOT NULL,
      ip_address VARCHAR(45),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,

  // Blogs
  `CREATE TABLE IF NOT EXISTS blogs (
      id BIGINT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE NOT NULL,
      excerpt TEXT,
      content LONGTEXT NOT NULL,
      thumbnail VARCHAR(255),
      tags JSON,
      views INT DEFAULT 0,
      status ENUM('published', 'draft', 'archived') DEFAULT 'draft',
      is_published BOOLEAN DEFAULT FALSE,
      meta_title VARCHAR(255),
      meta_description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`,

  // Settings
  `CREATE TABLE IF NOT EXISTS settings (
      id BIGINT AUTO_INCREMENT PRIMARY KEY,
      key_name VARCHAR(100) UNIQUE NOT NULL,
      value TEXT,
      group_name VARCHAR(100) DEFAULT 'general',
      type VARCHAR(50) DEFAULT 'string',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS social_links (
      id BIGINT AUTO_INCREMENT PRIMARY KEY,
      platform VARCHAR(100) NOT NULL,
      url VARCHAR(255) NOT NULL,
      icon VARCHAR(100),
      sort_order INT DEFAULT 0,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`
];

/**
 * Single execution script to provision all identical tables sequentially.
 * This can be run using \`node src/models/db.js\`
 */
export async function setupDatabase() {
    logger.info('Connecting to database for schema migration...');

    try {
        for (let i = 0; i < schemas.length; i++) {
            logger.info(`Executing table creation ${i + 1} of ${schemas.length}...`);
            await pool.query(schemas[i]);
        }
        logger.info('All tables generated and verified successfully!');
    } catch (err) {
        logger.error(`Migration Script Failed: ${err.message}`);
    } finally {
        await pool.end();
        process.exit();
    }
}

// Automatically execute since this file operates purely as a standalone DB seed/migration CLI tool
setupDatabase();
