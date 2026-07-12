/**
 * Formats and outputs structured JSON logs.
 * @param {string} level - Log level ('info' | 'warn' | 'error')
 * @param {string} message - Human-readable log message
 * @param {Object} [meta] - Additional contextual metadata
 */
function log(level, message, meta = {}) {
  const logPayload = {
    timestamp: new Date().toISOString(),
    level: level.toUpperCase(),
    message,
    ...meta,
  };

  if (level === 'error') {
    console.error(JSON.stringify(logPayload));
  } else if (level === 'warn') {
    console.warn(JSON.stringify(logPayload));
  } else {
    console.log(JSON.stringify(logPayload));
  }
}

export const logger = {
  /**
   * Log standard informational events
   * @param {string} message
   * @param {Object} [meta]
   */
  info(message, meta) {
    log('info', message, meta);
  },

  /**
   * Log warnings or recoverable issues
   * @param {string} message
   * @param {Object} [meta]
   */
  warn(message, meta) {
    log('warn', message, meta);
  },

  /**
   * Log severe errors with stacks if available
   * @param {string} message
   * @param {Error|Object} [error]
   * @param {Object} [meta]
   */
  error(message, error = null, meta = {}) {
    const errorMeta = { ...meta };
    
    if (error instanceof Error) {
      errorMeta.error = {
        name: error.name,
        message: error.message,
        stack: error.stack,
      };
    } else if (error) {
      errorMeta.error = error;
    }

    log('error', message, errorMeta);
  }
};
