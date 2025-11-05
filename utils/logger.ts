/**
 * Logger utility for conditional logging based on environment
 *
 * In development (__DEV__), all logs are displayed
 * In production, only errors are logged (and should be sent to error tracking service)
 */

const isDev = __DEV__;

/**
 * Error tracking service integration point
 * Replace this with your actual error tracking service (Sentry, Bugsnag, Firebase Crashlytics, etc.)
 */
const sendToErrorTracking = (error: Error, context?: Record<string, unknown>) => {
  // TODO: Implement error tracking service integration
  // Examples:
  // Sentry: Sentry.captureException(error, { extra: context });
  // Bugsnag: Bugsnag.notify(error, (event) => { event.addMetadata('context', context); });
  // Firebase Crashlytics: crashlytics().recordError(error);

  // For now, just log to console in production
  if (!isDev) {
    console.error('[Error Tracking]', error, context);
  }
};

export const logger = {
  /**
   * Log general information (only in development)
   */
  log: (...args: unknown[]) => {
    if (isDev) {
      console.log(...args);
    }
  },

  /**
   * Log warnings (only in development)
   */
  warn: (...args: unknown[]) => {
    if (isDev) {
      console.warn(...args);
    }
  },

  /**
   * Log errors (always logged, should be sent to error tracking in production)
   */
  error: (...args: unknown[]) => {
    if (isDev) {
      console.error(...args);
    } else {
      console.error(...args);
      // Try to send first error as Error object to tracking service
      const firstArg = args[0];
      if (firstArg instanceof Error) {
        sendToErrorTracking(firstArg, { additionalArgs: args.slice(1) });
      }
    }
  },

  /**
   * Log exceptions with context (always sent to error tracking)
   */
  exception: (error: Error, context?: Record<string, unknown>) => {
    // Always log exceptions to console (critical errors should be visible)
    console.error('[Exception]', error, context);
    // Always send exceptions to error tracking service
    sendToErrorTracking(error, context);
  },

  /**
   * Log debug information (only in development)
   */
  debug: (...args: unknown[]) => {
    if (isDev) {
      console.debug(...args);
    }
  },

  /**
   * Log information about API calls (only in development)
   */
  api: (method: string, url: string, data?: unknown) => {
    if (isDev) {
      console.log(`[API ${method}]`, url, data ?? '');
    }
  },
};
