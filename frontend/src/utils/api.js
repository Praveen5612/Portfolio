// Re-export the single shared axios instance.
// Previously this file had its own instance with a different token key ('admin_token').
// All parts of the app should now use the unified instance from services/api.js.
export { default } from '../services/api.js';
