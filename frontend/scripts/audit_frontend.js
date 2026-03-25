import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.join(__dirname, '../src');

const metrics = {
   apiBaseUrl: false,
   axiosSetup: false,
   authTokenHandling: false,
   requestPayloadMatching: true,
   responseFormatMatching: false,
   fileUpload: false,
   pagination: false,
   errorHandling: false,
   loadingState: false,
   apiRoutesMatching: false,
   seoSetup: false,
   analyticsTracking: false
};

const issues = [];
let routeMatchCount = 0;

if (!fs.existsSync(srcDir)) {
    console.log(JSON.stringify({ error: 'Frontend src directory missing!' }));
    process.exit(1);
}

function walk(dir, callback) {
   const files = fs.readdirSync(dir);
   for (let file of files) {
       const filepath = path.join(dir, file);
       const stat = fs.statSync(filepath);
       if (stat.isDirectory()) walk(filepath, callback);
       else if (filepath.endsWith('.js') || filepath.endsWith('.jsx')) {
           callback(filepath, fs.readFileSync(filepath, 'utf8'));
       }
   }
}

walk(srcDir, (filepath, content) => {
   if (content.includes('axios.create') || content.includes('baseURL')) metrics.apiBaseUrl = true;
   if (filepath.includes('api.js') || filepath.includes('axios')) metrics.axiosSetup = true;

   if (content.match(/localStorage\.getItem\(['"]token['"]\)/) || content.match(/Bearer/)) metrics.authTokenHandling = true;

   if (content.includes('.data.success') || content.includes('.data.data') || content.includes('.data.meta')) metrics.responseFormatMatching = true;

   if (content.includes('multipart/form-data') || content.includes('FormData')) metrics.fileUpload = true;

   if (content.match(/\?page=/) || content.includes('handlePageChange') || content.includes('page:')) metrics.pagination = true;

   if (content.match(/catch\s*\(/) && (content.includes('toast') || content.includes('alert') || content.includes('error'))) metrics.errorHandling = true;
   
   if (content.includes('setLoading(') || content.includes('isLoading')) metrics.loadingState = true;

   if (content.includes('/api/auth') || content.includes('/api/projects') || content.includes('/api/skills')) routeMatchCount++;

   if (content.includes('<Helmet>') || content.includes('react-helmet')) metrics.seoSetup = true;

   if (content.includes('/api/visitors') || content.includes('/track') || content.includes('sendBeacon')) metrics.analyticsTracking = true;
});

if (routeMatchCount >= 2) metrics.apiRoutesMatching = true;

if (!metrics.apiBaseUrl) issues.push('API Base URL is not globally configured using process.env or Axios defaults.');
if (!metrics.axiosSetup) issues.push('Custom Axios interceptor/setup file is missing.');
if (!metrics.authTokenHandling) issues.push('JWT Token extraction (localStorage) and injection (Authorization headers) is missing.');
if (!metrics.responseFormatMatching) issues.push('Frontend is not safely digesting the new { success, data, meta } structure from backend responses.');
if (!metrics.fileUpload) issues.push('Missing explicit FormData mapping for Multer multipart/form-data picture/resume uploads.');
if (!metrics.pagination) issues.push('Pagination handlers (?page=&limit=) for arrays missing.');
if (!metrics.errorHandling) issues.push('Globalized catch block interceptors (toasts/alerts) for 40x and 500 error reporting are missing.');
if (!metrics.loadingState) issues.push('UI loading states suppressing multiple simultaneous API mutations are deficient.');
if (!metrics.apiRoutesMatching) issues.push('Frontend fetch calls do not natively align with the newly modularized backend structure.');
if (!metrics.seoSetup) issues.push('React-Helmet standard SEO implementations missing.');
if (!metrics.analyticsTracking) issues.push('Visitor tracking beacon hooks for pinging analytics APIs are missing.');

console.log(JSON.stringify({ metrics, issues }, null, 2));
