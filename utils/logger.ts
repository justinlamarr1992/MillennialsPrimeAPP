/**
 * Logger utility for conditional logging based on environment
 *
 * In development (__DEV__), all logs are displayed
 * In production, only errors are logged (and should be sent to error tracking service)
 */

const isDev = __DEV__;

export const logger = {
  /**
   * Log general information (only in development)
   */
  log: (...args: any[]) => {
    if (isDev) {
      console.log(...args);
    }
  },

  /**
   * Log warnings (only in development)
   */
  warn: (...args: any[]) => {
    if (isDev) {
      console.warn(...args);
    }
  },

  /**
   * Log errors (always logged, should be sent to error tracking in production)
   */
  error: (...args: any[]) => {
    if (isDev) {
      console.error(...args);
    } else {
      // In production, send to error tracking service (Sentry, Bugsnag, etc.)
      // TODO: Integrate with error tracking service
      console.error(...args);
    }
  },

  /**
   * Log debug information (only in development)
   */
  debug: (...args: any[]) => {
    if (isDev) {
      console.debug(...args);
    }
  },

  /**
   * Log information about API calls (only in development)
   */
  api: (method: string, url: string, data?: any) => {
    if (isDev) {
      console.log(`[API ${method}]`, url, data ? data : '');
    }
  },
};
