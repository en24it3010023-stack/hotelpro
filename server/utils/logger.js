const logger = {
  info: (msg, meta = '') => console.log(`[INFO] ${new Date().toISOString()} - ${msg}`, meta || ''),
  warn: (msg, meta = '') => console.warn(`[WARN] ${new Date().toISOString()} - ${msg}`, meta || ''),
  error: (msg, meta = '') => console.error(`[ERROR] ${new Date().toISOString()} - ${msg}`, meta || ''),
  audit: (action, user, details) => {
    console.log(`[AUDIT] Action: ${action} | User: ${user} | Details:`, JSON.stringify(details));
  },
};

module.exports = logger;
