import pool from '../src/config/db.js';

async function seed() {
  console.log('--- Starting Seed Process ---');

  try {
    // 1. Clear existing data (Optional, but good for a fresh start)
    await pool.query('DELETE FROM social_links');
    await pool.query('DELETE FROM skills');
    await pool.query('DELETE FROM projects');
    await pool.query('DELETE FROM work_experience');
    await pool.query('DELETE FROM settings');

    // 2. Profile & SEO Settings
    const settings = {
      site_name: 'Praveen Reddy',
      meta_title: 'Full Stack Developer | Node.js React MySQL | Praveen Reddy',
      meta_description: 'Full Stack Developer specializing in Node.js, React, MySQL, and AWS. Experienced in building Admin Panels, ERP Systems, Employee Management Systems, and Business Automation Software.',
      meta_keywords: 'Full Stack Developer, Node.js Developer, React Developer, MySQL Developer, Admin Panel Developer, ERP Developer, Employee Management System Developer',
      
      hero_title: 'Full Stack <span class="gradient-text">Developer</span>',
      hero_subtitle: 'I build Admin Panels, ERP Systems, and Business Applications',
      hero_description: 'Full Stack Developer specializing in building Admin Panels, ERP Systems, Employee Management Systems, and Business Automation Software.',
      
      about_text: 'Full Stack Developer specializing in building Admin Panels, ERP Systems, Employee Management Systems, and Business Automation Software. I work with Node.js, React, MySQL, and AWS to build complete production-ready applications including authentication systems, analytics dashboards, role-based access systems, and deployment pipelines. I focus on building scalable backend systems, clean database architecture, and professional admin dashboards.',
      about_long: 'I am a Full Stack Developer with hands-on experience in developing and deploying real-world business applications such as Employee Management Systems, Attendance Systems, Payroll Systems, Admin Dashboards, and Delivery Management Systems.\nI specialize in backend development using Node.js and MySQL, and frontend development using React. I also have experience in deploying applications on AWS EC2 using Nginx and PM2, configuring DNS, SSL, email services (AWS SES), and server optimization.\nI focus on building complete systems including authentication, role-based access control, analytics tracking, lead management, and admin panels.',
      
      contact_email: 'praveen.reddy@example.com', // Placeholder, user will update
      contact_phone: '+91-XXXXXXXXXX',
      contact_location: 'India',
      
      // Services & Stats (to be rendered by UI updates)
      services: JSON.stringify([
        { title: 'Admin Panel Development', description: 'Custom administrative interfaces for managing data and analytics.' },
        { title: 'ERP System Development', description: 'Enterprise Resource Planning solutions for business efficiency.' },
        { title: 'Employee Management System', description: 'Complete HR solutions with attendance, payroll, and more.' },
        { title: 'Payroll System', description: 'Automated salary calculation and payslip generation.' },
        { title: 'REST API Development', description: 'Secure and scalable backends for web and mobile apps.' },
        { title: 'Database Design', description: 'Optimized MySQL/MongoDB architectures for data integrity.' },
        { title: 'AWS Deployment', description: 'Cloud infrastructure setup with EC2, Nginx, and PM2.' },
        { title: 'Server Setup (Nginx, PM2)', description: 'Production server configuration and maintenance.' },
        { title: 'Email Integration', description: 'AWS SES and SMTP setup for reliable notifications.' },
        { title: 'Bug Fixing & Maintenance', description: 'Expert debugging and system reliability improvements.' }
      ]),
      stats: JSON.stringify([
        { label: 'Projects Completed', value: '10+' },
        { label: 'Technologies Used', value: '15+' },
        { label: 'Systems Built', value: '8+' },
        { label: 'Admin Panels Built', value: '8+' },
        { label: 'APIs Developed', value: '20+' },
        { label: 'Deployments Done', value: '5+' }
      ])
    };

    for (const [key, val] of Object.entries(settings)) {
      await pool.query('INSERT INTO settings (key_name, value, group_name) VALUES (?, ?, ?)', [key, val, 'public']);
    }
    console.log('✅ Settings Seeded');

    // 3. Social Links
    const socialLinks = [
      { platform: 'LinkedIn', url: 'https://linkedin.com/in/praveenreddy', icon: 'linkedin', sort_order: 1 },
      { platform: 'GitHub', url: 'https://github.com/praveenreddy', icon: 'github', sort_order: 2 },
      { platform: 'Email', url: 'mailto:praveen.reddy@example.com', icon: 'mail', sort_order: 3 }
    ];
    for (const link of socialLinks) {
      await pool.query('INSERT INTO social_links (platform, url, icon, sort_order, is_active) VALUES (?, ?, ?, ?, 1)', [link.platform, link.url, link.icon, link.sort_order]);
    }
    console.log('✅ Social Links Seeded');

    // 4. Skills
    const skills = [
      // Frontend
      { name: 'React.js', category: 'Frontend', proficiency: 90, sort_order: 1 },
      { name: 'Vite', category: 'Frontend', proficiency: 85, sort_order: 2 },
      { name: 'JavaScript', category: 'Frontend', proficiency: 95, sort_order: 3 },
      { name: 'HTML5', category: 'Frontend', proficiency: 95, sort_order: 4 },
      { name: 'CSS3', category: 'Frontend', proficiency: 90, sort_order: 5 },
      { name: 'Responsive Design', category: 'Frontend', proficiency: 90, sort_order: 6 },
      // Backend
      { name: 'Node.js', category: 'Backend', proficiency: 95, sort_order: 1 },
      { name: 'Express.js', category: 'Backend', proficiency: 95, sort_order: 2 },
      { name: 'REST API', category: 'Backend', proficiency: 95, sort_order: 3 },
      { name: 'JWT/Auth', category: 'Backend', proficiency: 90, sort_order: 4 },
      // Database
      { name: 'MySQL', category: 'Database', proficiency: 90, sort_order: 1 },
      { name: 'MongoDB', category: 'Database', proficiency: 80, sort_order: 2 },
      // DevOps
      { name: 'AWS EC2', category: 'DevOps', proficiency: 85, sort_order: 1 },
      { name: 'Nginx/PM2', category: 'DevOps', proficiency: 85, sort_order: 2 }
    ];
    for (const s of skills) {
      await pool.query('INSERT INTO skills (name, category, proficiency, sort_order, is_active) VALUES (?, ?, ?, ?, 1)', [s.name, s.category, s.proficiency, s.sort_order]);
    }
    console.log('✅ Skills Seeded');

    // 5. Experience
    const experience = [
      {
        company: 'Freelance / System Builder',
        position: 'Full Stack Developer',
        location: 'India',
        start_date: '2022-01-01',
        is_current: 1,
        description: 'Built Admin Panels, ERP Systems, Payroll Systems, and REST APIs. Designed MySQL databases and deployed apps on AWS with Nginx.',
        achievements: JSON.stringify([
          'Developed custom Employee Management Systems with automated attendance.',
          'Built Payroll systems with payslip generation and financial reporting.',
          'Successfully deployed 5+ production-ready systems on AWS EC2.',
          'Implemented secure JWT authentication and role-based access control.'
        ]),
        tech_stack: JSON.stringify(['Node.js', 'React', 'MySQL', 'AWS', 'Nginx']),
        sort_order: 1,
        is_published: 1
      }
    ];
    for (const exp of experience) {
      await pool.query('INSERT INTO work_experience (company, position, location, start_date, is_current, description, achievements, tech_stack, sort_order, is_published) VALUES (?,?,?,?,?,?,?,?,?,?)', 
        [exp.company, exp.position, exp.location, exp.start_date, exp.is_current, exp.description, exp.achievements, exp.tech_stack, exp.sort_order, exp.is_published]);
    }
    console.log('✅ Experience Seeded');

    // 6. Projects
    const projects = [
      {
        title: 'Employee Management System',
        slug: 'employee-management-system',
        description: 'Complete HR solution with attendance tracking, document management, and payroll.',
        tech_stack: JSON.stringify(['Node.js', 'Express', 'React', 'MySQL', 'AWS', 'Nginx']),
        features: JSON.stringify(['Employee profiles', 'Attendance tracking', 'Payroll generation', 'RBAC']),
        is_published: 1,
        featured: 1,
        sort_order: 1
      },
      {
        title: 'Attendance Management System',
        slug: 'attendance-management-system',
        description: 'System to track employee attendance, leaves, and holidays with reporting.',
        tech_stack: JSON.stringify(['Node.js', 'React', 'MySQL']),
        features: JSON.stringify(['Daily attendance', 'Leave management', 'Monthly reports']),
        is_published: 1,
        sort_order: 2
      },
      {
        title: 'Payroll Management System',
        slug: 'payroll-management-system',
        description: 'Salary calculation, payslip generation, and financial reports.',
        tech_stack: JSON.stringify(['Node.js', 'MySQL', 'React']),
        features: JSON.stringify(['Salary structure', 'Form 16', 'Payslip PDF']),
        is_published: 1,
        sort_order: 3
      },
      {
        title: 'Admin Dashboard System',
        slug: 'admin-dashboard-system',
        description: 'Role-based dashboard with analytics, charts, and management modules.',
        tech_stack: JSON.stringify(['Node.js', 'React', 'MySQL']),
        features: JSON.stringify(['Dashboard charts', 'User management', 'Permissions']),
        is_published: 1,
        sort_order: 4
      },
      {
        title: 'Delivery Management System',
        slug: 'delivery-management-system',
        description: 'Order management for stores, products, and rider tracking.',
        tech_stack: JSON.stringify(['Node.js', 'React', 'MySQL']),
        features: JSON.stringify(['Store management', 'Order tracking', 'Admin panel']),
        is_published: 1,
        sort_order: 5
      },
      {
        title: 'Portfolio CRM System',
        slug: 'portfolio-crm-system',
        description: 'Portfolio website with visitor analytics, lead management, and CMS.',
        tech_stack: JSON.stringify(['Node.js', 'React', 'MySQL']),
        features: JSON.stringify(['Visitor tracking', 'Lead management', 'Portfolio CMS']),
        is_published: 1,
        sort_order: 6
      }
    ];
    for (const p of projects) {
      await pool.query('INSERT INTO projects (title, slug, description, tech_stack, features, is_published, featured, sort_order) VALUES (?,?,?,?,?,?,?,?)', 
        [p.title, p.slug, p.description, p.tech_stack, p.features, p.is_published, p.featured || 0, p.sort_order]);
    }
    console.log('✅ Projects Seeded');

    console.log('--- Seeding Complete ---');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding Failed:', err);
    process.exit(1);
  }
}

seed();
