import { createHmac } from 'crypto';

/**
 * Verifies Telegram Web App Init Data to secure the download page and dashboard.
 * @param {string} rawInitData - The raw query string from Telegram.WebApp.initData
 * @param {string} botToken - The Telegram Bot Token
 * @returns {Object|null} The parsed user object if valid, otherwise null.
 */
export function verifyTelegramInitData(rawInitData, botToken) {
  if (!rawInitData || !botToken) return null;

  try {
    const params = new URLSearchParams(rawInitData);
    const hash = params.get('hash');
    if (!hash) return null;

    // Remove hash and sort remaining keys alphabetically
    const keys = Array.from(params.keys())
      .filter((k) => k !== 'hash')
      .sort();

    // Create the data-check-string
    const dataCheckString = keys
      .map((key) => `${key}=${params.get(key)}`)
      .join('\n');

    // Create secret key: HMAC-SHA256 of bot token using key "WebappData"
    const secretKey = createHmac('sha256', 'WebappData')
      .update(botToken)
      .digest();

    // Compute final hash
    const computedHash = createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    // Check if hashes match
    if (computedHash !== hash) {
      return null;
    }

    // Verify raw data freshness (e.g., must be within 24 hours to prevent replay attacks)
    const authDate = parseInt(params.get('auth_date') || '0', 10);
    const now = Math.floor(Date.now() / 1000);
    if (now - authDate > 86400) {
      return null;
    }

    // Parse and return user object if present
    const userJson = params.get('user');
    return userJson ? JSON.parse(userJson) : {};
  } catch {
    return null;
  }
}

/**
 * Formats bytes into human-readable strings (e.g., MB, GB).
 * @param {number|string} bytes - Bytes to format
 * @param {number} decimals - Precision decimals
 * @returns {string} Formatted size string
 */
export function formatBytes(bytes, decimals = 2) {
  const parsedBytes = Number(bytes);
  if (isNaN(parsedBytes) || parsedBytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(parsedBytes) / Math.log(k));

  return `${parseFloat((parsedBytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Escapes special characters for Telegram HTML message formatting.
 * @param {string} text - Raw text
 * @returns {string} Safe HTML string
 */
export function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
            }
